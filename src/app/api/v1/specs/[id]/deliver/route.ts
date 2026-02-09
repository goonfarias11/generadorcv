import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { generateDelivery } from "@/modules/delivery/delivery.service";
import { getProductSpecById, updateProductSpecDelivery, updateProductSpecStatus } from "@/services/productSpecService";

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
      endpoint: "/api/v1/specs/:id/deliver",
      method: "POST",
      status: 403,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Sin acceso" }, { status: 403 });
  }

  if (spec.status !== "delivered") {
    await updateProductSpecStatus(spec.id, "producing");
    const delivery = await generateDelivery(spec);
    await updateProductSpecDelivery({
      id: spec.id,
      status: "delivered",
      deliveryPath: delivery.zipPath,
    });
  }

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/specs/:id/deliver",
    method: "POST",
    status: 200,
    costEstimate: 10,
  });

  return NextResponse.json({
    status: "accepted",
    downloadUrl: `/api/v1/specs/${spec.id}/delivery`,
  });
}
