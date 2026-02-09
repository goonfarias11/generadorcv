import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerById } from "@/services/customerService";
import { getProductSpecById } from "@/services/productSpecService";
import { createSubscriptionCheckout } from "@/services/subscriptionService";
import { getPlanById } from "@/services/planService";

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    specId?: string;
    planId?: string;
  } | null;

  if (!payload?.specId || !payload.planId) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || spec.customerId !== customerId) {
    return NextResponse.json({ status: "rejected", reason: "Spec invalida." }, { status: 404 });
  }

  const plan = await getPlanById(payload.planId);
  if (!plan || !plan.isActive) {
    return NextResponse.json({ status: "rejected", reason: "Plan invalido." }, { status: 400 });
  }

  const customer = await getCustomerById(customerId);
  if (!customer) {
    return NextResponse.json({ status: "rejected", reason: "Cliente invalido." }, { status: 400 });
  }

  try {
    const session = await createSubscriptionCheckout({
      specId: spec.id,
      planId: plan.id,
      customerEmail: customer.email,
    });

    return NextResponse.json({ status: "accepted", checkoutUrl: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
