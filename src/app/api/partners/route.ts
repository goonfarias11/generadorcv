import { NextResponse } from "next/server";
import { createPartner } from "@/services/partnerService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    slug?: string;
    logoUrl?: string;
    primaryColor?: string;
  } | null;

  if (!payload?.name || !payload.slug) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const partner = await createPartner({
      name: payload.name,
      slug: payload.slug,
      logoUrl: payload.logoUrl,
      primaryColor: payload.primaryColor,
    });

    return NextResponse.json({ status: "accepted", partner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
