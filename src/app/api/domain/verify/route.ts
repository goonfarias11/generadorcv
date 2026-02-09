import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProductSpecById } from "@/services/productSpecService";
import { getDomainBySpecId, updateDomainStatus } from "@/services/customDomainService";
import { getDomainStatus } from "@/modules/deploy/vercelDomain.service";

export async function POST(request: Request) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { specId?: string } | null;

  if (!payload?.specId) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const spec = await getProductSpecById(payload.specId);
  if (!spec || spec.customerId !== customerId) {
    return NextResponse.json(
      { status: "rejected", reason: "Spec no encontrada." },
      { status: 404 }
    );
  }

  const domainRecord = await getDomainBySpecId(payload.specId);
  if (!domainRecord) {
    return NextResponse.json(
      { status: "rejected", reason: "Dominio no registrado." },
      { status: 404 }
    );
  }

  try {
    const status = await getDomainStatus({
      projectName: `dpf-${spec.id}`,
      domain: domainRecord.domain,
    });

    const nextStatus = status.verified ? "active" : "pending";
    await updateDomainStatus({
      specId: payload.specId,
      status: nextStatus,
    });

    return NextResponse.json({
      status: "accepted",
      domain: domainRecord.domain,
      domainStatus: nextStatus,
    });
  } catch (error) {
    await updateDomainStatus({ specId: payload.specId, status: "failed" });
    const message = error instanceof Error ? error.message : "Verificación inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
