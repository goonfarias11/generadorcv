import { NextResponse } from "next/server";
import { updatePlan } from "@/services/planService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    priceCents?: number;
    interval?: string;
    features?: string[];
    isActive?: boolean;
  } | null;

  if (!payload) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const plan = await updatePlan({
      id,
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
