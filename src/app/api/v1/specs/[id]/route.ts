import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { isKnownMode } from "@/domain/product-spec";
import { getProductSpecById } from "@/services/productSpecService";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const spec = await getProductSpecById(params.id);
  if (!spec || spec.apiKeyId !== auth.apiKey.id) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs/:id",
      method: "GET",
      status: 403,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Sin acceso" }, { status: 403 });
  }

  if (!isKnownMode(spec.mode)) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs/:id",
      method: "GET",
      status: 500,
      costEstimate: 1,
    });
    return NextResponse.json(
      { status: "rejected", reason: "Spec inconsistente" },
      { status: 500 }
    );
  }

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/specs/:id",
    method: "GET",
    status: 200,
    costEstimate: 1,
  });

  return NextResponse.json({ status: "accepted", spec });
}
