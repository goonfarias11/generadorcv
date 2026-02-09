import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateProductSpec } from "@/domain/product-spec";
import { createPreviewPath } from "@/modules/preview/preview.service";
import { buildAgencySpecContext, requireAgencyRole } from "@/services/agencyService";
import { logAgencyAction } from "@/services/agencyAuditService";
import { createProductSpec, updateProductSpecCustomer } from "@/services/productSpecService";
import { getOrCreateCustomerByEmail } from "@/services/customerService";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    return NextResponse.json({ status: "rejected" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  const actorId = (payload.actorId as string | undefined) ?? customerId;
  if (!actorId) {
    return NextResponse.json(
      { status: "rejected", reason: "actorId requerido" },
      { status: 400 }
    );
  }

  if (payload.actorId && payload.actorId !== customerId) {
    return NextResponse.json(
      { status: "rejected", reason: "actorId inválido" },
      { status: 403 }
    );
  }

  try {
    await requireAgencyRole({
      agencyId: params.id,
      userId: actorId,
      roles: ["owner", "admin", "editor"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Permisos insuficientes";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 403 });
  }

  const validation = validateProductSpec({
    mode: (payload.mode as string) ?? "catalog",
    productType: payload.productType as string,
    objective: payload.objective as string,
    industry: payload.industry as string,
    sections: payload.sections as string[],
    designSystem: payload.designSystem as string,
    copyTone: payload.copyTone as string,
    complexity: payload.complexity as string,
    deliveryTime: payload.deliveryTime as string,
    priceEstimate: payload.priceEstimate as number,
  } as any);

  if (!validation.ok || !validation.value) {
    return NextResponse.json(
      { status: "rejected", reason: validation.errors.join(", ") },
      { status: 400 }
    );
  }

  const specWithAgency = await buildAgencySpecContext({
    agencyId: params.id,
    createdById: actorId,
    spec: validation.value,
  });

  const stored = await createProductSpec(specWithAgency);

  if (payload.customerEmail) {
    const customer = await getOrCreateCustomerByEmail(
      payload.customerEmail as string,
      (payload.customerName as string) ?? null
    );
    await updateProductSpecCustomer({ id: stored.id, customerId: customer.id });
    await logAgencyAction({
      agencyId: params.id,
      actorId,
      action: "client_assigned",
      targetId: customer.id,
      metadata: { specId: stored.id },
    });
  }

  await logAgencyAction({
    agencyId: params.id,
    actorId,
    action: "spec_created",
    targetId: stored.id,
  });

  return NextResponse.json({
    status: "accepted",
    id: stored.id,
    previewPath: createPreviewPath(stored.id),
    spec: specWithAgency,
  });
}
