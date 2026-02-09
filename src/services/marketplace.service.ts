import { prisma } from "@/lib/prisma";

export type MarketplaceSort = "popular" | "price-asc" | "price-desc" | "new";

export interface MarketplaceFilters {
  category?: string;
  partnerSlug?: string;
  useCase?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: MarketplaceSort;
}

const sortBy: Record<MarketplaceSort, { [key: string]: "asc" | "desc" }> = {
  popular: { popularity: "desc" },
  "price-asc": { priceUSD: "asc" },
  "price-desc": { priceUSD: "desc" },
  new: { createdAt: "desc" },
};

export interface MarketplaceTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  baseSpec: unknown;
  priceUSD: number;
  tier: string;
  coverImage: string | null;
  shortTagline: string;
  useCases: string[];
  popularity: number;
  isPublic: boolean;
  isActive: boolean;
  partnerSlug: string | null;
  createdAt: Date;
  partner: { name: string; slug: string; logoUrl: string | null; primaryColor: string | null } | null;
}

export async function listPublicTemplates(filters: MarketplaceFilters = {}) {
  const orderBy = sortBy[filters.sort ?? "popular"];

  const templates = (await prisma.template.findMany({
    where: {
      isActive: true,
      isPublic: true,
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.partnerSlug ? { partnerSlug: filters.partnerSlug } : {}),
      ...(typeof filters.minPrice === "number" ? { priceUSD: { gte: filters.minPrice } } : {}),
      ...(typeof filters.maxPrice === "number" ? { priceUSD: { lte: filters.maxPrice } } : {}),
    },
    orderBy,
    include: {
      partner: { select: { name: true, slug: true, logoUrl: true, primaryColor: true } },
    },
  })) as MarketplaceTemplate[];

  const filtered = filters.useCase
    ? templates.filter((template) =>
        Array.isArray(template.useCases) && template.useCases.includes(filters.useCase as string)
      )
    : templates;

  return filtered.map((template) => ({
    ...template,
    useCases: Array.isArray(template.useCases)
      ? template.useCases.filter((item): item is string => typeof item === "string")
      : [],
  }));
}

export async function getPublicTemplateBySlug(slug: string) {
  const template = (await prisma.template.findFirst({
    where: { slug, isActive: true, isPublic: true },
    include: {
      partner: { select: { name: true, slug: true, logoUrl: true, primaryColor: true } },
    },
  })) as MarketplaceTemplate | null;

  if (!template) return null;

  return {
    ...template,
    useCases: Array.isArray(template.useCases)
      ? template.useCases.filter((item): item is string => typeof item === "string")
      : [],
  };
}
