import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductSpec, ProductObjective, ProductType } from "@/domain/product-spec";
import { PRODUCT_RULES } from "@/domain/rules/productRules";
import { selectDesignSystem } from "@/modules/design-system/design-system";

export interface TemplateRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  baseSpec: Record<string, unknown>;
  priceUSD: number;
  tier: string;
  coverImage?: string | null;
  shortTagline: string;
  useCases: string[];
  popularity: number;
  isPublic: boolean;
  isActive: boolean;
  partnerSlug?: string | null;
  createdAt: Date;
}

export interface CreateTemplateInput {
  slug: string;
  name: string;
  description: string;
  category: string;
  baseSpec: Record<string, unknown>;
  priceUSD: number;
  tier: string;
  coverImage?: string | null;
  shortTagline: string;
  useCases: string[];
  isPublic?: boolean;
  partnerSlug?: string | null;
}

const slugRegex = /^[a-z0-9-]+$/;

export async function createTemplate(input: CreateTemplateInput): Promise<TemplateRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug inválido");
  }

  const data = {
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category.trim(),
    baseSpec: input.baseSpec as Prisma.InputJsonValue,
    priceUSD: input.priceUSD,
    tier: input.tier,
    coverImage: input.coverImage ?? null,
    shortTagline: input.shortTagline.trim(),
    useCases: input.useCases as Prisma.InputJsonValue,
    isPublic: input.isPublic ?? true,
    partnerSlug: input.partnerSlug ?? null,
    isActive: true,
  } as Prisma.TemplateUncheckedCreateInput;

  const template = (await prisma.template.create({ data })) as TemplateRow;

  return toTemplateRecord(template);
}

export async function listTemplates(filters?: {
  category?: string;
  partnerSlug?: string | null;
  tier?: string;
  isPublic?: boolean;
  includeInactive?: boolean;
}) {
  const templates = (await prisma.template.findMany({
    where: {
      ...(filters?.includeInactive ? {} : { isActive: true }),
      ...(typeof filters?.isPublic === "boolean" ? { isPublic: filters.isPublic } : {}),
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.tier ? { tier: filters.tier } : {}),
      ...(filters?.partnerSlug ? { partnerSlug: filters.partnerSlug } : {}),
    },
    orderBy: { createdAt: "desc" },
  })) as TemplateRow[];

  return templates.map(toTemplateRecord);
}

export async function getTemplateBySlug(slug: string): Promise<TemplateRecord | null> {
  const template = (await prisma.template.findUnique({ where: { slug } })) as TemplateRow | null;
  return template ? toTemplateRecord(template) : null;
}

export async function incrementTemplatePopularity(slug: string, by = 1) {
  await prisma.template.update({
    where: { slug },
    data: { popularity: { increment: by } } as Prisma.TemplateUncheckedUpdateInput,
  });
}

type TemplateRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  baseSpec: Prisma.JsonValue;
  priceUSD: number;
  tier: string;
  coverImage: string | null;
  shortTagline: string;
  useCases: Prisma.JsonValue | null;
  popularity: number;
  isPublic: boolean;
  isActive: boolean;
  partnerSlug: string | null;
  createdAt: Date;
};

function toTemplateRecord(template: TemplateRow): TemplateRecord {
  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    description: template.description,
    category: template.category,
    baseSpec: template.baseSpec as Record<string, unknown>,
    priceUSD: template.priceUSD,
    tier: template.tier,
    coverImage: template.coverImage,
    shortTagline: template.shortTagline,
    useCases: Array.isArray(template.useCases)
      ? template.useCases.filter((item): item is string => typeof item === "string")
      : [],
    popularity: template.popularity,
    isPublic: template.isPublic,
    isActive: template.isActive,
    partnerSlug: template.partnerSlug,
    createdAt: template.createdAt,
  };
}

const deliveryByComplexity = {
  low: "5 días",
  medium: "8 días",
  high: "12 días",
};

const copyToneByObjective: Record<ProductObjective, string> = {
  leads: "directo y orientado a acción",
  sales: "persuasivo y orientado a conversión",
  branding: "premium y confiable",
  validation: "claro y basado en evidencia",
};

export function buildSpecFromTemplate(input: {
  template: TemplateRecord;
  industry?: string;
  partnerId?: string | null;
}): ProductSpec {
  const baseSpec = input.template.baseSpec as Partial<ProductSpec>;
  const productType = (baseSpec.productType ?? "landing") as ProductType;
  const rule = PRODUCT_RULES[productType];

  const sections = Array.isArray(baseSpec.sections)
    ? (baseSpec.sections as string[])
    : rule.defaultSections;

  const filteredSections = sections.filter((section) => rule.allowedSections.includes(section));
  const trimmedSections = filteredSections.slice(0, rule.maxSections);

  const objective = (baseSpec.objective ?? "leads") as ProductObjective;
  const complexity = baseSpec.complexity ?? rule.maxComplexity;
  const designSystem = selectDesignSystem({ objective, industry: input.industry });

  return {
    mode: "template",
    productType,
    objective,
    industry: input.industry ?? "general",
    sections: trimmedSections,
    designSystem: designSystem.id,
    copyTone: copyToneByObjective[objective],
    complexity,
    deliveryTime: deliveryByComplexity[complexity],
    priceEstimate: input.template.priceUSD,
    partnerId: input.partnerId ?? null,
  };
}
