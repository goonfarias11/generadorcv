import { NextResponse } from "next/server";
import { getTemplateBySlug } from "@/services/templateService";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template || !template.isActive) {
    return NextResponse.json({ status: "rejected" }, { status: 404 });
  }

  return NextResponse.json({ template });
}
