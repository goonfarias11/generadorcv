import { NextResponse } from "next/server";
import { updateApiKey } from "@/services/apiKeyService";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    rateLimit?: number;
    isActive?: boolean;
  } | null;

  try {
    await updateApiKey({ id: params.id, ...payload });
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
