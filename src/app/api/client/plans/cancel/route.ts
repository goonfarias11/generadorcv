import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductSpecById } from "@/services/productSpecService";
import { cancelSubscriptionForSpec } from "@/services/subscriptionService";

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { specId?: string } | null;

  if (!payload?.specId) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || spec.customerId !== customerId) {
    return NextResponse.json({ status: "rejected", reason: "Spec invalida." }, { status: 404 });
  }

  try {
    await cancelSubscriptionForSpec(spec.id);
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
