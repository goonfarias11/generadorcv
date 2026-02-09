import { NextResponse } from "next/server";
import type { InterpreterInput } from "@/modules/interpreter/interpreter.service";
import { interpretToSpec } from "@/modules/interpreter/interpreter.service";
import { buildProductBlueprint } from "@/modules/product-engine/product-engine.service";
import { generateLanding } from "@/modules/generator/generator.service";
import { createPreviewPath } from "@/modules/preview/preview.service";
import { createProductSpec } from "@/services/productSpecService";
import { getPartnerBySlug } from "@/services/partnerService";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | (InterpreterInput & { partnerSlug?: string })
    | null;

  if (!payload || !payload.mode || !payload.payload) {
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

  const result = interpretToSpec(payload);

  if (result.status === "rejected") {
    return NextResponse.json({
      status: result.status,
      reason: result.reason,
    });
  }

  const specWithPartner = {
    ...result.spec,
    partnerId: partner?.id ?? null,
  };
  const blueprint = buildProductBlueprint(specWithPartner);
  const generated = generateLanding(specWithPartner, blueprint);
  const stored = await createProductSpec(specWithPartner);
  const previewPath = createPreviewPath(stored.id);

  return NextResponse.json({
    status: result.status,
    reason: result.reason,
    spec: specWithPartner,
    id: stored.id,
    previewPath,
    generated,
  });
}
