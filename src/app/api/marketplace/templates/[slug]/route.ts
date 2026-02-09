import { NextResponse } from "next/server";
import { getPublicTemplateBySlug } from "@/services/marketplace.service";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { slug } = await params;
  const template = await getPublicTemplateBySlug(slug);

  if (!template) {
    return NextResponse.json({ status: "rejected" }, { status: 404 });
  }

  const response = NextResponse.json({ template });
  response.headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
  return response;
}
