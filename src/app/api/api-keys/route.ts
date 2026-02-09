import { NextResponse } from "next/server";
import { createApiKey, listApiKeys } from "@/services/apiKeyService";
import { getApiKeyUsage } from "@/services/apiUsageService";

export async function GET() {
  const keys = await listApiKeys();
  const withUsage = await Promise.all(
    keys.map(async (key) => {
      const usage = await getApiKeyUsage({ apiKeyId: key.id });
      return {
        ...key,
        usage,
      };
    })
  );

  return NextResponse.json({ status: "accepted", keys: withUsage });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    name?: string;
    partnerId?: string | null;
    rateLimit?: number;
  } | null;

  if (!payload?.name) {
    return NextResponse.json(
      { status: "rejected", reason: "Nombre requerido." },
      { status: 400 }
    );
  }

  try {
    const key = await createApiKey({
      name: payload.name,
      partnerId: payload.partnerId ?? null,
      rateLimit: payload.rateLimit,
    });

    return NextResponse.json({ status: "accepted", key });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
