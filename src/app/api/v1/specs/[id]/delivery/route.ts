import fs from "fs";
import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { getProductSpecById } from "@/services/productSpecService";

export const runtime = "nodejs";

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
      endpoint: "/api/v1/specs/:id/delivery",
      method: "GET",
      status: 403,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Sin acceso" }, { status: 403 });
  }

  if (!spec.deliveryPath || !fs.existsSync(spec.deliveryPath)) {
    await logApiRequest({
      apiKeyId: auth.apiKey.id,
      endpoint: "/api/v1/specs/:id/delivery",
      method: "GET",
      status: 404,
      costEstimate: 1,
    });
    return NextResponse.json({ status: "rejected", reason: "Entrega no disponible" }, { status: 404 });
  }

  const file = await fs.promises.readFile(spec.deliveryPath);

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/specs/:id/delivery",
    method: "GET",
    status: 200,
    costEstimate: 1,
  });

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${params.id}.zip`,
    },
  });
}
