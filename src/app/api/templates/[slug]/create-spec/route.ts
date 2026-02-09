import { NextResponse } from "next/server";
import { buildSpecFromTemplate, getTemplateBySlug, incrementTemplatePopularity } from "@/services/templateService";
import { createProductSpec } from "@/services/productSpecService";
import { createPreviewPath } from "@/modules/preview/preview.service";
import { buildProductBlueprint } from "@/modules/product-engine/product-engine.service";
import { generateLanding } from "@/modules/generator/generator.service";
import { getPartnerBySlug } from "@/services/partnerService";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const payload = (await request.json().catch(() => null)) as {
    industry?: string;
    partnerSlug?: string;
    intent?: "preview" | "purchase";
  } | null;

  const template = await getTemplateBySlug(slug);
  if (!template || !template.isActive) {
    return NextResponse.json({ status: "rejected", reason: "Template inválido" }, { status: 404 });
  }

  const partner = payload?.partnerSlug
    ? await getPartnerBySlug(payload.partnerSlug)
    : null;

  if (payload?.partnerSlug && (!partner || !partner.active)) {
    return NextResponse.json(
      { status: "rejected", reason: "Partner inválido" },
      { status: 400 }
    );
  }

  const spec = buildSpecFromTemplate({
    template,
    industry: payload?.industry,
    partnerId: partner?.id ?? null,
  });

  const blueprint = buildProductBlueprint(spec);
  const generated = generateLanding(spec, blueprint);
  const stored = await createProductSpec(spec);
  const previewPath = createPreviewPath(stored.id);

  if (payload?.intent === "preview") {
    await incrementTemplatePopularity(template.slug, 1);
  }
  if (payload?.intent === "purchase") {
    await incrementTemplatePopularity(template.slug, 1);
  }

  return NextResponse.json({
    status: "accepted",
    id: stored.id,
    previewPath,
    spec,
    generated,
  });
}
