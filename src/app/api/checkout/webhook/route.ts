import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markPaymentPaid } from "@/services/paymentService";
import { applyPartnerRevenueShare, recordPartnerPayout } from "@/services/partnerRevenue.service";
import { getProductSpecById, updateProductSpecStatus, updateProductSpecDelivery } from "@/services/productSpecService";
import { generateDelivery } from "@/modules/delivery/delivery.service";
import { deployToVercel } from "@/modules/deploy/vercelDeploy.service";
import { updateProductSpecDeploy } from "@/services/productSpecService";
import { applyAddOnsToSpec } from "@/services/addOnService";
import { getPartnerById } from "@/services/partnerService";
import { finalizeSubscriptionFromCheckout, handleInvoiceFailed, handleInvoicePaid, handleSubscriptionDeleted } from "@/services/subscriptionService";
import { ensureAIOutputsForSpec } from "@/services/aiService";
import { applyPluginRevenueShare, getPluginsByIds, installPluginsForSpec } from "@/services/pluginService";
import { logAgencyAction } from "@/services/agencyAuditService";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ status: "rejected" }, { status: 400 });
  }

  const body = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  if (!webhookSecret) {
    return NextResponse.json(
      { status: "rejected", reason: "Webhook no configurado" },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        mode?: string | null;
        subscription?: string | Stripe.Subscription | null;
        customer_details?: { email?: string | null } | null;
        metadata?: { specId?: string } | null;
      };

      if (session.mode === "subscription") {
        await finalizeSubscriptionFromCheckout(session);
        return NextResponse.json({ received: true });
      }

      const { payment, updated } = await markPaymentPaid({
        stripeSession: session.id,
        email: session.customer_details?.email ?? null,
      });

      if (updated && payment.partnerId && payment.partnerShare && payment.partnerShare > 0) {
        const partner = await getPartnerById(payment.partnerId);
        const eligible = Boolean(partner?.stripeAccountId && partner.payoutsEnabled);

        if (eligible && partner?.stripeAccountId) {
          try {
            const sessionDetails = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["payment_intent"],
            });
            const paymentIntent = sessionDetails.payment_intent as {
              id: string;
              charges?: { data?: { id: string }[] };
            } | null;

            const chargeId = paymentIntent?.charges?.data?.[0]?.id;

            const transfer = await stripe.transfers.create(
              {
                amount: payment.partnerShare,
                currency: payment.currency,
                destination: partner.stripeAccountId,
                ...(chargeId ? { source_transaction: chargeId } : {}),
                metadata: {
                  partnerId: partner.id,
                  paymentId: payment.id,
                },
              },
              {
                idempotencyKey: `partner_transfer_${payment.id}`,
              }
            );

            await recordPartnerPayout({
              partnerId: partner.id,
              amountCents: payment.partnerShare,
              status: "paid",
              transferId: transfer.id,
              transferStatus: null,
              paymentId: payment.id,
              decrementBalance: false,
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : "transfer_failed";
            await applyPartnerRevenueShare(payment);
            await recordPartnerPayout({
              partnerId: payment.partnerId,
              amountCents: payment.partnerShare,
              status: "failed",
              paymentId: payment.id,
              errorMessage: message,
              decrementBalance: false,
            });
          }
        } else {
          await applyPartnerRevenueShare(payment);
        }
      }

      const specId = session.metadata?.specId;
      if (specId) {
        const spec = await getProductSpecById(specId);
        if (spec) {
          const shouldFulfill =
            updated || spec.status !== "delivered" || !spec.deliveryPath;

          if (shouldFulfill) {
            let specForDelivery = spec;
            const paymentAddOns = (payment.addOnIds ?? []).filter(Boolean);
            if (paymentAddOns.length > 0) {
              const existingAddOns = spec.addOns?.map((addOn) => addOn.id) ?? [];
              const missingAddOns = paymentAddOns.filter((id) => !existingAddOns.includes(id));
              if (missingAddOns.length > 0) {
                await applyAddOnsToSpec({ specId, addOnIds: missingAddOns });
                const refreshed = await getProductSpecById(specId);
                if (refreshed) {
                  specForDelivery = refreshed;
                }
              }
            }

            const aiServiceIds = (payment.aiServiceIds ?? []).filter(Boolean);
            if (aiServiceIds.length > 0) {
              await ensureAIOutputsForSpec({
                spec: {
                  id: specForDelivery.id,
                  productType: specForDelivery.productType,
                  objective: specForDelivery.objective,
                  industry: specForDelivery.industry,
                  sections: specForDelivery.sections,
                  copyTone: specForDelivery.copyTone,
                },
                serviceIds: aiServiceIds,
              });
              const refreshed = await getProductSpecById(specId);
              if (refreshed) {
                specForDelivery = refreshed;
              }
            }

            const pluginIds = (payment.pluginIds ?? []).filter(Boolean);
            if (pluginIds.length > 0) {
              await installPluginsForSpec({ specId, pluginIds });
              const plugins = await getPluginsByIds(pluginIds);
              for (const plugin of plugins) {
                await applyPluginRevenueShare({ plugin, paymentId: payment.id });
              }
              const refreshed = await getProductSpecById(specId);
              if (refreshed) {
                specForDelivery = refreshed;
              }
            }

            await updateProductSpecStatus(specId, "producing");
            const delivery = await generateDelivery(specForDelivery);
            await updateProductSpecDelivery({
              id: specId,
              status: "delivered",
              deliveryPath: delivery.zipPath,
            });

            if (specForDelivery.agencyId) {
              await logAgencyAction({
                agencyId: specForDelivery.agencyId,
                actorId: payment.customerId ?? null,
                action: "payment_received",
                targetId: payment.id,
              });
            }
          }

          const shouldDeploy =
            spec.mode === "catalog" &&
            (!spec.deployUrl || spec.deployStatus !== "deployed");

          if (shouldDeploy) {
            try {
              await updateProductSpecDeploy({
                id: specId,
                deployStatus: "pending",
                deployUrl: null,
                deployedAt: null,
              });
              const deployment = await deployToVercel(spec);
              await updateProductSpecDeploy({
                id: specId,
                deployStatus: "deployed",
                deployUrl: deployment.url,
                deployedAt: new Date(),
              });
            } catch {
              await updateProductSpecDeploy({
                id: specId,
                deployStatus: "failed",
                deployUrl: null,
                deployedAt: null,
              });
            }
          }
        }
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoiceFailed(invoice);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { status: "rejected", reason: "Webhook inválido" },
      { status: 400 }
    );
  }
}
