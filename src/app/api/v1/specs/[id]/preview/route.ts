import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { getProductSpecById } from "@/services/productSpecService";
import { createPreviewPath } from "@/modules/preview/preview.service";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const spec = await getProductSpecById(params.id);
  if (!spec || spec.apiKeyId !== auth.apiKey.id) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs/:id/preview",
      method: "POST",
      status: 403,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Sin acceso" }, { status: 403 });
  }

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/specs/:id/preview",
    method: "POST",
    status: 200,
    costEstimate: 1,
  });

  return NextResponse.json({
    status: "accepted",
    previewPath: createPreviewPath(spec.id),
  });
}
