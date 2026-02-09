import { NextResponse } from "next/server";
import { listPublicTemplates } from "@/services/marketplace.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const partnerSlug = searchParams.get("partner") ?? undefined;
  const useCase = searchParams.get("useCase") ?? undefined;
  const sort = (searchParams.get("sort") ?? "popular") as
    | "popular"
    | "price-asc"
    | "price-desc"
    | "new";

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const templates = await listPublicTemplates({
    category,
    partnerSlug,
    useCase,
    sort,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const response = NextResponse.json({ templates });
  response.headers.set("Cache-Control", "public, max-age=60, s-maxage=300");
  return response;
}
