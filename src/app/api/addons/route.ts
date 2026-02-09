import { NextResponse } from "next/server";
import { createAddOn, listActiveAddOns, listAllAddOns } from "@/services/addOnService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true";

  const addons = includeAll ? await listAllAddOns() : await listActiveAddOns();
  return NextResponse.json({ addons });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    description?: string;
    priceCents?: number;
    type?: string;
  } | null;

  if (!payload?.slug || !payload.name || !payload.description || !payload.priceCents || !payload.type) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const addon = await createAddOn({
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      priceCents: payload.priceCents,
      type: payload.type,
    });

    return NextResponse.json({ status: "accepted", addon });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud inválida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
