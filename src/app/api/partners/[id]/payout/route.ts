import { NextResponse } from "next/server";
import { createPartnerPayout } from "@/services/partnerRevenue.service";
import { getPartnerById } from "@/services/partnerService";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  const payload = (await request.json().catch(() => null)) as { amountCents?: number } | null;

  if (!payload?.amountCents) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const partner = await getPartnerById(params.id);
  if (!partner) {
    return NextResponse.json({ status: "rejected", reason: "Partner no encontrado." }, { status: 404 });
  }

  if (partner.payoutsEnabled && partner.stripeAccountId) {
    return NextResponse.json(
      { status: "rejected", reason: "Payouts automaticos activos." },
      { status: 400 }
    );
  }

  try {
    await createPartnerPayout({ partnerId: params.id, amountCents: payload.amountCents });
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
