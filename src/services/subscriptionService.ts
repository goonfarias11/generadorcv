import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getPlanById, updatePlan } from "@/services/planService";
import { getPartnerById } from "@/services/partnerService";
import { applySubscriptionRevenueShare } from "@/services/partnerRevenue.service";
import { getProductSpecById, updateProductSpecPlan } from "@/services/productSpecService";

const DEFAULT_GRACE_DAYS = 7;
const prismaAny = prisma as any;

const intervalMap: Record<string, "month"> = {
  monthly: "month",
};

export function getGracePeriodDays() {
  const raw = process.env.PLAN_GRACE_DAYS;
  const parsed = raw ? Number(raw) : DEFAULT_GRACE_DAYS;
  return Number.isFinite(parsed) ? parsed : DEFAULT_GRACE_DAYS;
}

export function isPlanActiveStatus(planStatus?: string | null, planExpiresAt?: Date | null) {
  if (planStatus !== "active") return false;
  if (!planExpiresAt) return true;

  const grace = getGracePeriodDays();
  const graceMs = grace * 24 * 60 * 60 * 1000;
  return planExpiresAt.getTime() + graceMs > Date.now();
}

export function isSpecPlanActive(spec: { planStatus?: string | null; planExpiresAt?: Date | null }) {
  return isPlanActiveStatus(spec.planStatus ?? null, spec.planExpiresAt ?? null);
}

export async function ensureStripePlanPrice(planId: string) {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new Error("Plan no encontrado");
  }

  if (plan.stripePriceId) {
    return { plan, priceId: plan.stripePriceId };
  }

  const product = await stripe.products.create({
    name: plan.name,
    metadata: { planId: plan.id, planSlug: plan.slug },
  });

  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: plan.priceCents,
    recurring: { interval: intervalMap[plan.interval] ?? "month" },
  });

  await updatePlan({
    id: plan.id,
    stripeProductId: product.id,
    stripePriceId: price.id,
  });

  return { plan, priceId: price.id };
}

export async function createSubscriptionCheckout(input: {
  specId: string;
  planId: string;
  customerEmail: string;
}) {
  const existing = await prismaAny.subscription.findFirst({
    where: { specId: input.specId },
  });

  if (existing && existing.status !== "canceled") {
    throw new Error("La suscripcion ya existe para este producto");
  }

  const spec = await getProductSpecById(input.specId);
  if (!spec) {
    throw new Error("Spec no encontrada");
  }

  const { plan, priceId } = await ensureStripePlanPrice(input.planId);

  const partner = spec.partnerId ? await getPartnerById(spec.partnerId) : null;
  const partnerShareCents = partner
    ? Math.floor((plan.priceCents * partner.commissionPct) / 100)
    : 0;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  if (!appUrl) {
    throw new Error("URL de la app no configurada");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: input.customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/client/products/${spec.id}`,
    cancel_url: `${appUrl}/client/products/${spec.id}`,
    metadata: {
      specId: spec.id,
      planId: plan.id,
    },
  });

  if (existing) {
    await prismaAny.subscription.update({
      where: { id: existing.id },
      data: {
        planId: plan.id,
        stripeCheckoutSessionId: session.id,
        stripeSubscriptionId: null,
        status: "pending",
        partnerShareCents,
      },
    });
  } else {
    await prismaAny.subscription.create({
      data: {
        specId: spec.id,
        planId: plan.id,
        stripeCheckoutSessionId: session.id,
        status: "pending",
        partnerShareCents,
      },
    });
  }

  await updateProductSpecPlan({
    id: spec.id,
    planId: plan.id,
    planStatus: "pending",
    planExpiresAt: null,
  });

  return session;
}

export async function finalizeSubscriptionFromCheckout(session: {
  id: string;
  subscription?: string | Stripe.Subscription | null;
  metadata?: { specId?: string; planId?: string } | null;
}) {
  if (!session.subscription || !session.metadata?.specId || !session.metadata?.planId) {
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription.id;

  const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

  await prismaAny.subscription.update({
    where: { stripeCheckoutSessionId: session.id },
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
  });

  await updateProductSpecPlan({
    id: session.metadata.specId,
    planId: session.metadata.planId,
    planStatus: subscription.status === "active" ? "active" : "pending",
    planExpiresAt: new Date(subscription.current_period_end * 1000),
  });
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = ((invoice as any).subscription as string | null) ?? null;
  if (!subscriptionId) return;

  const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

  const record = await prismaAny.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!record) return;

  const spec = await getProductSpecById(record.specId);
  if (spec?.partnerId && record.partnerShareCents && record.partnerShareCents > 0) {
    await applySubscriptionRevenueShare({
      partnerId: spec.partnerId,
      amountCents: record.partnerShareCents,
      referenceId: invoice.id,
    });
  }

  await prismaAny.subscription.update({
    where: { id: record.id },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
  });

  await updateProductSpecPlan({
    id: record.specId,
    planId: record.planId,
    planStatus: "active",
    planExpiresAt: new Date(subscription.current_period_end * 1000),
  });
}

export async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = ((invoice as any).subscription as string | null) ?? null;
  if (!subscriptionId) return;

  const record = await prismaAny.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!record) return;

  await prismaAny.subscription.update({
    where: { id: record.id },
    data: { status: "past_due" },
  });

  await updateProductSpecPlan({
    id: record.specId,
    planId: record.planId,
    planStatus: "past_due",
    planExpiresAt: record.currentPeriodEnd ?? null,
  });
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const record = await prismaAny.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!record) return;

  await prismaAny.subscription.update({
    where: { id: record.id },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
  });

  await updateProductSpecPlan({
    id: record.specId,
    planId: record.planId,
    planStatus: "canceled",
    planExpiresAt: record.currentPeriodEnd ?? null,
  });
}

export async function cancelSubscriptionForSpec(specId: string) {
  const record = await prismaAny.subscription.findFirst({ where: { specId } });
  if (!record || !record.stripeSubscriptionId) {
    throw new Error("Suscripcion no encontrada");
  }

  const updated = (await stripe.subscriptions.update(record.stripeSubscriptionId, {
    cancel_at_period_end: true,
  })) as any;

  await prismaAny.subscription.update({
    where: { id: record.id },
    data: {
      status: updated.status,
      cancelAtPeriodEnd: Boolean(updated.cancel_at_period_end),
      currentPeriodEnd: new Date(updated.current_period_end * 1000),
    },
  });

  await updateProductSpecPlan({
    id: record.specId,
    planId: record.planId,
    planStatus: "active",
    planExpiresAt: new Date(updated.current_period_end * 1000),
  });
}
