import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductSpecById } from "@/services/productSpecService";
import { createOrUpdateDomain } from "@/services/customDomainService";
import { addDomainToProject } from "@/modules/deploy/vercelDomain.service";
import { isSpecPlanActive } from "@/services/subscriptionService";

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    specId?: string;
    domain?: string;
  } | null;

  if (!payload?.specId || !payload.domain) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || spec.customerId !== customerId || spec.status !== "delivered") {
    return NextResponse.json(
      { status: "rejected", reason: "Entrega no disponible." },
      { status: 400 }
    );
  }

  if (!isSpecPlanActive(spec)) {
    return NextResponse.json(
      { status: "rejected", reason: "Plan mensual inactivo." },
      { status: 403 }
    );
  }

  try {
    const record = await createOrUpdateDomain({
      specId: payload.specId,
      domain: payload.domain,
    });

    await addDomainToProject({
      projectName: `dpf-${spec.id}`,
      domain: record.domain,
    });

    return NextResponse.json({
      status: "accepted",
      domain: record.domain,
      domainStatus: record.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
