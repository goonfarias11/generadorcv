import { NextResponse } from "next/server";
import { createTemplate, listTemplates } from "@/services/templateService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const tier = searchParams.get("tier") ?? undefined;
  const partnerSlug = searchParams.get("partnerSlug") ?? undefined;
  const isPublic = searchParams.get("isPublic");

  const templates = await listTemplates({
    category,
    tier,
    partnerSlug,
    isPublic: isPublic ? isPublic === "true" : undefined,
  });
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    description?: string;
    category?: string;
    baseSpec?: Record<string, unknown>;
    priceUSD?: number;
    tier?: string;
    coverImage?: string | null;
    shortTagline?: string;
    useCases?: string[];
    isPublic?: boolean;
    partnerSlug?: string;
  } | null;

  if (
    !payload?.slug ||
    !payload.name ||
    !payload.description ||
    !payload.category ||
    !payload.baseSpec ||
    !payload.priceUSD ||
    !payload.tier ||
    !payload.shortTagline ||
    !Array.isArray(payload.useCases)
  ) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const template = await createTemplate({
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      baseSpec: payload.baseSpec,
      priceUSD: payload.priceUSD,
      tier: payload.tier,
      coverImage: payload.coverImage ?? null,
      shortTagline: payload.shortTagline,
      useCases: payload.useCases,
      isPublic: payload.isPublic ?? true,
      partnerSlug: payload.partnerSlug,
    });

    return NextResponse.json({ status: "accepted", template });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
