import { NextResponse } from "next/server";
import { createPlan, listPlans } from "@/services/planService";

export async function GET() {
  const plans = await listPlans(true);
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    priceCents?: number;
    interval?: string;
    features?: string[];
    isActive?: boolean;
  } | null;

  if (!payload?.slug || !payload.name || !payload.priceCents || !payload.interval || !payload.features) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const plan = await createPlan({
      slug: payload.slug,
      name: payload.name,
      priceCents: payload.priceCents,
      interval: payload.interval,
      features: payload.features,
      isActive: payload.isActive,
    });

    return NextResponse.json({ status: "accepted", plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
