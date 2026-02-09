import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addAgencyMember,
  listAgencyMembers,
  requireAgencyRole,
} from "@/services/agencyService";
import { logAgencyAction } from "@/services/agencyAuditService";

interface RouteParams {
  params: { id: string };
}

export async function GET(_: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: customerId,
      roles: ["owner", "admin", "editor", "viewer"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Permisos insuficientes";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }

  const members = await listAgencyMembers(params.id);
  return NextResponse.json({ status: "accepted", members });
}

export async function POST(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    actorId?: string;
    userId?: string;
    role?: "owner" | "admin" | "editor" | "viewer";
  } | null;

  const actorId = payload?.actorId ?? customerId;
  if (!actorId || !payload?.userId || !payload.role) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  if (payload.actorId && payload.actorId !== customerId) {
    return NextResponse.json(
      { status: "rejected", reason: "actorId inválido." },
      { status: 403 }
    );
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: actorId,
      roles: ["owner", "admin"],
    });

    const member = await addAgencyMember({
      agencyId: params.id,
      userId: payload.userId,
      role: payload.role,
    });

    await logAgencyAction({
      agencyId: params.id,
      actorId,
      action: "member_added",
      targetId: payload.userId,
      metadata: { role: payload.role },
    });

    return NextResponse.json({ status: "accepted", member });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }
}
