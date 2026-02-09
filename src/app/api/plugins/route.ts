import { NextResponse } from "next/server";
import { createPlugin, listActivePlugins, listAllPlugins } from "@/services/pluginService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("all") === "true";

  const plugins = includeAll ? await listAllPlugins() : await listActivePlugins();
  return NextResponse.json({ plugins });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    description?: string;
    version?: string;
    entryPoint?: string;
    scope?: string;
    priceCents?: number;
    authorId?: string;
  } | null;

  if (
    !payload?.slug ||
    !payload.name ||
    !payload.description ||
    !payload.version ||
    !payload.entryPoint ||
    !payload.scope ||
    !payload.priceCents ||
    !payload.authorId
  ) {
    return NextResponse.json(
      { status: "rejected", reason: "Datos incompletos." },
      { status: 400 }
    );
  }

  try {
    const plugin = await createPlugin({
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      version: payload.version,
      entryPoint: payload.entryPoint,
      scope: payload.scope,
      priceCents: payload.priceCents,
      authorId: payload.authorId,
    });

    return NextResponse.json({ status: "accepted", plugin });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Solicitud invalida";
    return NextResponse.json({ status: "rejected", reason: message }, { status: 400 });
  }
}
