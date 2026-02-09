import { NextResponse } from "next/server";
import { createOnboardingLink } from "@/services/stripeConnect.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "";

  if (!appUrl) {
    return NextResponse.json(
      { status: "rejected", reason: "URL de la app no configurada" },
      { status: 500 }
    );
  }

  try {
    const url = await createOnboardingLink({
      partnerId: id,
      returnUrl: `${appUrl}/dashboard/partners/${id}/wallet`,
      refreshUrl: `${appUrl}/dashboard/partners/${id}/wallet?refresh=true`,
    });

    return NextResponse.json({ status: "accepted", url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
