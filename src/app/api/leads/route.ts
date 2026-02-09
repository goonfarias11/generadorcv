import { NextResponse } from "next/server";
import { createLead } from "@/services/leadService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    specId?: string;
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  } | null;

  if (!payload?.specId || !payload.name || !payload.email) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    await createLead({
      specId: payload.specId,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      message: payload.message,
    });

    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida.";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
