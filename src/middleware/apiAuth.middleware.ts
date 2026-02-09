import { NextResponse } from "next/server";
import { getApiKeyByKey } from "@/services/apiKeyService";
import { countRequestsSince } from "@/services/apiUsageService";
import { getPartnerById } from "@/services/partnerService";

export type ApiAuthContext = {
  apiKey: {
    id: string;
    key: string;
    name: string;
    partnerId?: string | null;
    rateLimit: number;
  };
  partner: { id: string; slug: string } | null;
};

const authHeaderPrefix = "Bearer ";

export async function authenticateApiRequest(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith(authHeaderPrefix)) {
    return NextResponse.json(
      { status: "rejected", reason: "API key requerida." },
      { status: 401 }
    );
  }

  const token = header.slice(authHeaderPrefix.length).trim();
  if (!token) {
    return NextResponse.json(
      { status: "rejected", reason: "API key requerida." },
      { status: 401 }
    );
  }

  const apiKey = await getApiKeyByKey(token);
  if (!apiKey) {
    return NextResponse.json(
      { status: "rejected", reason: "API key invalida." },
      { status: 401 }
    );
  }

  if (!apiKey.isActive) {
    return NextResponse.json(
      { status: "rejected", reason: "API key inactiva." },
      { status: 403 }
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const usedToday = await countRequestsSince({ apiKeyId: apiKey.id, since: startOfDay });
  if (usedToday >= apiKey.rateLimit) {
    return NextResponse.json(
      { status: "rejected", reason: "Rate limit excedido." },
      { status: 403 }
    );
  }

  const partner = apiKey.partnerId ? await getPartnerById(apiKey.partnerId) : null;
  if (apiKey.partnerId && !partner) {
    return NextResponse.json(
      { status: "rejected", reason: "Partner invalido." },
      { status: 403 }
    );
  }

  return {
    apiKey: {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      partnerId: apiKey.partnerId ?? null,
      rateLimit: apiKey.rateLimit,
    },
    partner: partner ? { id: partner.id, slug: partner.slug } : null,
  } satisfies ApiAuthContext;
}
