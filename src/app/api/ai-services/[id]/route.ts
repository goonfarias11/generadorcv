import { NextResponse } from "next/server";
import { updateAIService } from "@/services/aiService";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    description?: string;
    priceCents?: number;
    isActive?: boolean;
  } | null;

  try {
    await updateAIService({ id: params.id, ...payload });
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
