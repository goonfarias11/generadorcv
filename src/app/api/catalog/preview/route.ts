import { NextResponse } from "next/server";
import { createSpecFromCatalog } from "@/modules/catalog/catalog.service";
import { buildProductBlueprint } from "@/modules/product-engine/product-engine.service";
import { generateLanding } from "@/modules/generator/generator.service";
import { createProductSpec } from "@/services/productSpecService";
import { createPreviewPath } from "@/modules/preview/preview.service";
import { getPartnerBySlug } from "@/services/partnerService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { itemId?: string; industry?: string; partnerSlug?: string }
    | null;

  if (!payload?.itemId) {
    return NextResponse.json(
      { status: "rejected", reason: "Solicitud inválida" },
      { status: 400 }
    );
  }

  const partner = payload.partnerSlug
    ? await getPartnerBySlug(payload.partnerSlug)
    : null;

  if (payload.partnerSlug && (!partner || !partner.active)) {
    return NextResponse.json(
      { status: "rejected", reason: "Partner inválido" },
      { status: 400 }
    );
  }

  const result = createSpecFromCatalog(
    payload.itemId,
    payload.industry,
    partner?.id ?? null
  );

  if (result.status === "rejected" || !result.spec) {
    return NextResponse.json({
      status: "rejected",
      reason: result.errors?.[0] ?? "Este pedido no cumple criterios.",
    });
  }

  const blueprint = buildProductBlueprint(result.spec);
  const generated = generateLanding(result.spec, blueprint);
  const stored = await createProductSpec(result.spec);
  const previewPath = createPreviewPath(stored.id);

  return NextResponse.json({
    status: "accepted",
    spec: result.spec,
    id: stored.id,
    previewPath,
    generated,
  });
}
