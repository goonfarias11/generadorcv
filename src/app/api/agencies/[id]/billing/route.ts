import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAgencyRole } from "@/services/agencyService";
import { logAgencyAction } from "@/services/agencyAuditService";
import { getAgencyBilling, syncAgencyBillingFromStripe, upsertAgencyBilling } from "@/services/agencyBillingService";

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

  const billing = await getAgencyBilling(params.id);
  return NextResponse.json({ status: "accepted", billing });
}

export async function POST(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    actorId?: string;
    planId?: string;
    status?: string;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd?: string | null;
    cancelAtPeriodEnd?: boolean;
  } | null;

  const actorId = payload?.actorId ?? customerId;
  if (!actorId || !payload?.planId || !payload.status) {
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

    const billing = payload.stripeSubscriptionId
      ? await syncAgencyBillingFromStripe({
          agencyId: params.id,
          planId: payload.planId,
          stripeSubscriptionId: payload.stripeSubscriptionId,
        })
      : await upsertAgencyBilling({
          agencyId: params.id,
          planId: payload.planId,
          status: payload.status,
          stripeSubscriptionId: null,
          currentPeriodEnd: payload.currentPeriodEnd ? new Date(payload.currentPeriodEnd) : null,
          cancelAtPeriodEnd: payload.cancelAtPeriodEnd ?? false,
        });

    await logAgencyAction({
      agencyId: params.id,
      actorId,
      action: "billing_updated",
      metadata: { planId: payload.planId, status: payload.status },
    });

    return NextResponse.json({ status: "accepted", billing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }
}
