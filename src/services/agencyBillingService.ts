import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getAgencyPlanById } from "@/services/agencyPlanService";

const prismaAny = prisma as any;

export interface AgencyBillingRecord {
  id: string;
  agencyId: string;
  planId: string;
  status: string;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function upsertAgencyBilling(input: {
  agencyId: string;
  planId: string;
  status: string;
  stripeSubscriptionId?: string | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
}) {
  const plan = await getAgencyPlanById(input.planId);
  if (!plan) {
    throw new Error("Plan no encontrado");
  }

  return prismaAny.agencyBilling.upsert({
    where: { agencyId: input.agencyId },
    update: {
      planId: input.planId,
      status: input.status,
      stripeSubscriptionId: input.stripeSubscriptionId ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
    },
    create: {
      agencyId: input.agencyId,
      planId: input.planId,
      status: input.status,
      stripeSubscriptionId: input.stripeSubscriptionId ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
    },
  });
}

export async function getAgencyBilling(agencyId: string): Promise<AgencyBillingRecord | null> {
  const record = await prismaAny.agencyBilling.findUnique({ where: { agencyId } });
  return record ? (record as AgencyBillingRecord) : null;
}

export async function syncAgencyBillingFromStripe(input: {
  agencyId: string;
  planId: string;
  stripeSubscriptionId: string;
}) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe no configurado");
  }

  const subscription = (await stripe.subscriptions.retrieve(
    input.stripeSubscriptionId
  )) as Stripe.Subscription;
  const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number })
    .current_period_end;

  return upsertAgencyBilling({
    agencyId: input.agencyId,
    planId: input.planId,
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
  });
}
