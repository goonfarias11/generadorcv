import { NextResponse } from "next/server";
import { authenticateApiRequest } from "@/middleware/apiAuth.middleware";
import { logApiRequest } from "@/services/apiUsageService";
import { listTemplates } from "@/services/templateService";

export async function GET(request: Request) {
  const auth = await authenticateApiRequest(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const tier = searchParams.get("tier") ?? undefined;

  const templates = await listTemplates({
    category,
    tier,
    partnerSlug: auth.partner?.slug ?? undefined,
    isPublic: auth.partner ? undefined : true,
  });

  await logApiRequest({
    apiKeyId: auth.apiKey.id,
    endpoint: "/api/v1/templates",
    method: "GET",
    status: 200,
    costEstimate: 1,
  });

  return NextResponse.json({ status: "accepted", templates });
}
