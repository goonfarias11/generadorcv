import { NextResponse } from "next/server";
import { updateAddOn } from "@/services/addOnService";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    description?: string;
    priceCents?: number;
    type?: string;
    isActive?: boolean;
  } | null;

  try {
    await updateAddOn({ id: params.id, ...payload });
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
