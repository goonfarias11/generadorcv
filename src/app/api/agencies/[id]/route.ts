import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAgencyById, requireAgencyRole, updateAgency } from "@/services/agencyService";
import { logAgencyAction } from "@/services/agencyAuditService";

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    actorId?: string;
    name?: string;
    branding?: Record<string, unknown> | null;
    customDomain?: string | null;
  } | null;

  if (!payload) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const actorId = payload.actorId ?? customerId;
  if (!actorId) {
    return NextResponse.json(
      { status: "rejected", reason: "actorId requerido." },
      { status: 400 }
    );
  }

  if (payload.actorId && payload.actorId !== customerId) {
    return NextResponse.json(
      { status: "rejected", reason: "actorId inválido." },
      { status: 403 }
    );
  }

  const agency = await getAgencyById(params.id);
  if (!agency) {
    return NextResponse.json({ status: "rejected", reason: "Agencia no encontrada" }, { status: 404 });
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: actorId,
      roles: ["owner", "admin"],
    });

    await updateAgency({
      id: params.id,
      name: payload.name,
      branding: payload.branding ?? null,
      customDomain: payload.customDomain ?? null,
    });

    await logAgencyAction({
      agencyId: params.id,
      actorId,
      action: "agency_updated",
    });

    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }
}
