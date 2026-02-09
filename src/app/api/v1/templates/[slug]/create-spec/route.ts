import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { buildSpecFromTemplate, getTemplateBySlug, incrementTemplatePopularity } from "@/services/templateService";
import { createProductSpecForApi } from "@/services/productSpecService";
import { createPreviewPath } from "@/modules/preview/preview.service";

interface RouteParams {
  params: { slug: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const payload = (await request.json().catch(() => null)) as {
    industry?: string;
    intent?: "preview" | "purchase";
  } | null;

  const template = await getTemplateBySlug(params.slug);
  if (!template || !template.isActive) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/templates/:slug/create-spec",
      method: "POST",
      status: 404,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Template invalido" }, { status: 404 });
  }

  if (auth.partner) {
    if (template.partnerSlug !== auth.partner.slug) {
      await logApiRequest({
        apiKeyId: auth.apiKey.id,
        endpoint: "/api/v1/templates/:slug/create-spec",
        method: "POST",
        status: 403,
        costEstimate: 1,
      });
      return NextResponse.json({ status: "rejected", reason: "Sin acceso al template" }, { status: 403 });
    }
  } else if (!template.isPublic) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/templates/:slug/create-spec",
      method: "POST",
      status: 403,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Template privado" }, { status: 403 });
  }

  const spec = buildSpecFromTemplate({
    template,
    industry: payload?.industry,
    partnerId: auth.partner?.id ?? null,
  });

  const stored = await createProductSpecForApi({
    spec,
    apiKeyId: auth.apiKey.id,
    partnerId: auth.partner?.id ?? null,
  });

  if (payload?.intent) {
    await incrementTemplatePopularity(template.slug, 1);
  }

  const previewPath = createPreviewPath(stored.id);

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/templates/:slug/create-spec",
    method: "POST",
    status: 200,
    costEstimate: 5,
  });

  return NextResponse.json({
    status: "accepted",
    id: stored.id,
    previewPath,
    spec,
  });
}
