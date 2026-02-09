import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAgency, listAgenciesForUser } from "@/services/agencyService";
import { logAgencyAction } from "@/services/agencyAuditService";

export async function GET() {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const agencies = await listAgenciesForUser(customerId);
  return NextResponse.json({ status: "accepted", agencies });
}

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    slug?: string;
    ownerId?: string;
    branding?: Record<string, unknown> | null;
    customDomain?: string | null;
  } | null;

  if (!payload?.name || !payload.slug || !payload.ownerId) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  if (payload.ownerId !== customerId) {
    return NextResponse.json(
      { status: "rejected", reason: "Owner inválido." },
      { status: 403 }
    );
  }

  try {
    const agency = await createAgency({
      name: payload.name,
      slug: payload.slug,
      ownerId: customerId,
      branding: payload.branding ?? null,
      customDomain: payload.customDomain ?? null,
    });

    await logAgencyAction({
      agencyId: agency.id,
      actorId: customerId,
      action: "agency_created",
    });

    return NextResponse.json({ status: "accepted", agency });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
