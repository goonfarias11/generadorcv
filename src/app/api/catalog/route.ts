import { NextResponse } from "next/server";
import { CATALOG_PRODUCTS } from "@/modules/catalog/catalog.data";

export async function GET() {
  return NextResponse.json({ products: CATALOG_PRODUCTS });
}
