import { NextResponse } from "next/server";
import { updatePlugin } from "@/services/pluginService";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    description?: string;
    version?: string;
    entryPoint?: string;
    scope?: string;
    priceCents?: number;
    isActive?: boolean;
  } | null;

  try {
    await updatePlugin({ id: params.id, ...payload });
    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
