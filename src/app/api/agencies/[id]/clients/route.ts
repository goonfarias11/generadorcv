import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrCreateCustomerByEmail } from "@/services/customerService";
import { listAgencyClients, requireAgencyRole } from "@/services/agencyService";
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

  const clients = await listAgencyClients(params.id);
  return NextResponse.json({ status: "accepted", clients });
}

export async function POST(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    actorId?: string;
    email?: string;
    name?: string | null;
  } | null;

  if (!payload) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const actorId = payload.actorId ?? customerId;
  if (!actorId || !payload.email) {
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
      roles: ["owner", "admin", "editor"],
    });

    const customer = await getOrCreateCustomerByEmail(payload.email, payload.name ?? null);

    await logAgencyAction({
      agencyId: params.id,
      actorId,
      action: "client_created",
      targetId: customer.id,
    });

    return NextResponse.json({ status: "accepted", client: customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }
}
