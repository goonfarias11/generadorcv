import { NextResponse } from "next/server";
import { createAIService, listActiveAIServices, listAllAIServices } from "@/services/aiService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true";

  const services = includeAll ? await listAllAIServices() : await listActiveAIServices();
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    description?: string;
    priceCents?: number;
  } | null;

  if (!payload?.slug || !payload.name || !payload.description || !payload.priceCents) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const service = await createAIService({
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      priceCents: payload.priceCents,
    });

    return NextResponse.json({ status: "accepted", service });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
