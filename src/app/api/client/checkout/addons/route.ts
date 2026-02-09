import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getProductSpecById } from "@/services/productSpecService";
import { createPaymentRecord } from "@/services/paymentService";
import {
  calculateAddOnsTotal,
  getAddOnsByIds,
  validateAddOnsCompatibility,
} from "@/services/addOnService";
import { getCustomerById } from "@/services/customerService";
import type { ProductSpec } from "@/domain/product-spec";

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected", reason: "No autenticado." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { specId?: string; addOnIds?: string[] }
    | null;

  if (!payload?.specId) {
    return NextResponse.json(
      { status: "rejected", reason: "Solicitud inválida" },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || spec.customerId !== customerId) {
    return NextResponse.json({ status: "rejected", reason: "Spec inválida." }, { status: 404 });
  }

  if (spec.agencyId) {
    return NextResponse.json(
      { status: "rejected", reason: "Compra gestionada por agencia." },
      { status: 403 }
    );
  }

  const selectedAddOnIds = payload.addOnIds?.filter(Boolean) ?? [];
  if (selectedAddOnIds.length === 0) {
    return NextResponse.json(
      { status: "rejected", reason: "Seleccioná al menos un add-on." },
      { status: 400 }
    );
  }
  const existingAddOns = spec.addOns?.map((addOn) => addOn.id) ?? [];
  const newAddOnIds = selectedAddOnIds.filter((id) => !existingAddOns.includes(id));

  if (newAddOnIds.length === 0) {
    return NextResponse.json(
      { status: "rejected", reason: "Seleccioná add-ons nuevos." },
      { status: 400 }
    );
  }

  const addOns = await getAddOnsByIds(newAddOnIds);
  const specForValidation: ProductSpec = {
    ...spec,
    addOns: spec.addOns?.map((addOn) => addOn.id),
  };
  validateAddOnsCompatibility(specForValidation, addOns);

  const addOnAmount = calculateAddOnsTotal(addOns);
  const amount = addOnAmount;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!stripeKey || !appUrl) {
    return NextResponse.json(
      { status: "rejected", reason: "Stripe no configurado." },
      { status: 500 }
    );
  }

  const customer = await getCustomerById(customerId);
  if (!customer) {
    return NextResponse.json(
      { status: "rejected", reason: "Cliente no encontrado." },
      { status: 404 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customer?.email,
    line_items: addOns.map((addOn) => ({
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
    success_url: `${appUrl}/client/products/${spec.id}`,
    cancel_url: `${appUrl}/client/products/${spec.id}`,
    metadata: {
      specId: spec.id,
    },
  });

  await createPaymentRecord({
    specId: spec.id,
    stripeSession: session.id,
    amount,
    baseAmount: 0,
    addOnAmount,
    addOnIds: addOns.map((addOn) => addOn.id),
    email: customer.email,
    customerId: customer.id,
    currency: "usd",
  });

  return NextResponse.json({
    status: "accepted",
    checkoutUrl: session.url,
  });
}
