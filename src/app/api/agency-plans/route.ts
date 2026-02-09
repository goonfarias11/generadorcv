import { NextResponse } from "next/server";
import { createAgencyPlan, listAgencyPlans } from "@/services/agencyPlanService";

export async function GET() {
  const plans = await listAgencyPlans();
  return NextResponse.json({ status: "accepted", plans });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    limits?: Record<string, unknown>;
    features?: Record<string, unknown>;
  } | null;

  if (!payload?.name || !payload.limits || !payload.features) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const plan = await createAgencyPlan({
      name: payload.name,
      limits: payload.limits,
      features: payload.features,
    });

    return NextResponse.json({ status: "accepted", plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
