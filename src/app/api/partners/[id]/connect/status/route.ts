import { NextResponse } from "next/server";
import { refreshStripeAccountStatus } from "@/services/stripeConnect.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const status = await refreshStripeAccountStatus(id);
    return NextResponse.json({ status: "accepted", account: status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
