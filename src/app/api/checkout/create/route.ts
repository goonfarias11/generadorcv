import { NextResponse } from "next/server";
import type { ProductSpec } from "@/domain/product-spec";
import { isPayableMode } from "@/domain/product-spec";
import { stripe } from "@/lib/stripe";
import { getProductSpecById } from "@/services/productSpecService";
import { createPaymentRecord } from "@/services/paymentService";
import {
  applyAddOnsToSpec,
  calculateAddOnsTotal,
  getAddOnsByIds,
  validateAddOnsCompatibility,
} from "@/services/addOnService";
import { getAIServicesByIds } from "@/services/aiService";
import { calculatePluginsTotal, getPluginsByIds } from "@/services/pluginService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        specId?: string;
        addOnIds?: string[];
        aiServiceIds?: string[];
        pluginIds?: string[];
        email?: string;
      }
    | null;

  if (!payload?.specId || !payload?.email) {
    return NextResponse.json(
      { status: "rejected", reason: "Email y specId son requeridos." },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || !spec.priceEstimate) {
    return NextResponse.json(
      { status: "rejected", reason: "Spec inválida o sin precio." },
      { status: 400 }
    );
  }

  if (spec.agencyId) {
    return NextResponse.json(
      { status: "rejected", reason: "Checkout gestionado por agencia." },
      { status: 403 }
    );
  }

  if (!isPayableMode(spec.mode)) {
    return NextResponse.json(
      { status: "rejected", reason: "El checkout directo solo aplica al catálogo." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!stripeKey) {
    return NextResponse.json(
      { status: "rejected", reason: "Stripe no configurado." },
      { status: 500 }
    );
  }
  if (!appUrl) {
    return NextResponse.json(
      { status: "rejected", reason: "URL de la app no configurada." },
      { status: 500 }
    );
  }

  const baseAmount = Math.round(spec.priceEstimate * 100);
  const selectedAddOnIds = payload.addOnIds?.filter(Boolean) ?? [];
  const existingAddOns = spec.addOns?.map((addOn) => addOn.id) ?? [];
  const selectedAIServiceIds = payload.aiServiceIds?.filter(Boolean) ?? [];
  const selectedPluginIds = payload.pluginIds?.filter(Boolean) ?? [];

  if (existingAddOns.length > 0) {
    const sameSelection =
      existingAddOns.length === selectedAddOnIds.length &&
      existingAddOns.every((id) => selectedAddOnIds.includes(id));
    if (!sameSelection) {
      return NextResponse.json(
        { status: "rejected", reason: "Los add-ons ya están definidos para este pedido." },
        { status: 400 }
      );
    }
  }

  const addOns = await getAddOnsByIds(selectedAddOnIds);
  const specForValidation: ProductSpec = {
    ...spec,
    addOns: spec.addOns?.map((addOn) => addOn.id),
  };
  validateAddOnsCompatibility(specForValidation, addOns);
  const addOnAmount = calculateAddOnsTotal(addOns);
  const aiServices = await getAIServicesByIds(selectedAIServiceIds);
  if (selectedAIServiceIds.length > 0 && aiServices.length !== selectedAIServiceIds.length) {
    return NextResponse.json(
      { status: "rejected", reason: "Servicios AI invalidos." },
      { status: 400 }
    );
  }

  const plugins = await getPluginsByIds(selectedPluginIds);
  if (selectedPluginIds.length > 0 && plugins.length !== selectedPluginIds.length) {
    return NextResponse.json(
      { status: "rejected", reason: "Plugins invalidos." },
      { status: 400 }
    );
  }

  const aiAmount = aiServices.reduce((sum, service) => sum + service.priceCents, 0);
  const pluginAmount = calculatePluginsTotal(plugins);
  const amount = baseAmount + addOnAmount + aiAmount + pluginAmount;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: payload.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `Digital Product Factory · ${spec.productType}`,
            description: `Objetivo: ${spec.objective}`,
          },
          unit_amount: baseAmount,
        },
      },
      ...addOns.map((addOn) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: addOn.name,
            description: addOn.description,
          },
          unit_amount: addOn.priceCents,
        },
      })),
      ...aiServices.map((service) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: service.name,
            description: service.description,
          },
          unit_amount: service.priceCents,
        },
      })),
      ...plugins.map((plugin) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: plugin.name,
            description: plugin.description,
          },
          unit_amount: plugin.priceCents,
        },
      })),
    ],
    success_url: `${appUrl}/checkout/success?specId=${spec.id}`,
    cancel_url: `${appUrl}/preview/${spec.id}`,
    metadata: {
      specId: spec.id,
    },
  });

  if (addOns.length > 0 && existingAddOns.length === 0) {
    await applyAddOnsToSpec({
      specId: spec.id,
      addOnIds: addOns.map((addOn) => addOn.id),
    });
  }

  await createPaymentRecord({
    specId: spec.id,
    stripeSession: session.id,
    amount,
    baseAmount,
    addOnAmount,
    addOnIds: addOns.map((addOn) => addOn.id),
    aiServiceIds: aiServices.map((service) => service.id),
    pluginIds: plugins.map((plugin) => plugin.id),
    email: payload.email,
    currency: "usd",
  });

  return NextResponse.json({
    status: "accepted",
    checkoutUrl: session.url,
  });
}
