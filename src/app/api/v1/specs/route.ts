import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { isKnownMode, validateProductSpec } from "@/domain/product-spec";
import { createProductSpecForApi } from "@/services/productSpecService";
import { createPreviewPath } from "@/modules/preview/preview.service";

export async function POST(request: Request) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs",
      method: "POST",
      status: 400,
      costEstimate: 1,
    });
    return NextResponse.json(
      { status: "rejected", reason: "Solicitud invalida" },
      { status: 400 }
    );
  }

  const incomingMode = (payload.mode as string) ?? "catalog";
  if (!isKnownMode(incomingMode)) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs",
      method: "POST",
      status: 400,
      costEstimate: 1,
    });
    return NextResponse.json(
      { status: "rejected", reason: "Modo de producto invalido" },
      { status: 400 }
    );
  }

  const validation = validateProductSpec({
    mode: incomingMode,
    productType: payload.productType as string,
    objective: payload.objective as string,
    industry: payload.industry as string,
    sections: payload.sections as string[],
    designSystem: payload.designSystem as string,
    copyTone: payload.copyTone as string,
    complexity: payload.complexity as string,
    deliveryTime: payload.deliveryTime as string,
    priceEstimate: payload.priceEstimate as number,
    partnerId: auth.partner?.id ?? null,
  } as any);

  if (!validation.ok || !validation.value) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs",
      method: "POST",
      status: 400,
      costEstimate: 1,
    });
    return NextResponse.json(
      { status: "rejected", reason: validation.errors.join(", ") },
      { status: 400 }
    );
  }

  const stored = await createProductSpecForApi({
    spec: validation.value,
    apiKeyId: auth.apiKey.id,
    partnerId: auth.partner?.id ?? null,
  });

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/specs",
    method: "POST",
    status: 200,
    costEstimate: 5,
  });

  return NextResponse.json({
    status: "accepted",
    id: stored.id,
    previewPath: createPreviewPath(stored.id),
    spec: validation.value,
  });
}
