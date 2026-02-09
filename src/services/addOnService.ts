import { prisma } from "@/lib/prisma";
import type { ProductSpec } from "@/domain/product-spec";

export interface AddOnRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  type: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateAddOnInput {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  type: string;
}

const slugRegex = /^[a-z0-9-]+$/;

const allowedByType: Record<ProductSpec["productType"], string[]> = {
  landing: ["seo", "copy", "analytics", "blog"],
  "business-web": ["seo", "copy", "analytics", "blog", "integration"],
  "micro-saas": ["seo", "copy", "analytics", "integration"],
  dashboard: ["analytics", "integration", "copy"],
};

export async function listActiveAddOns(): Promise<AddOnRecord[]> {
  return prisma.addOn.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<AddOnRecord[]>;
}

export async function listAllAddOns(): Promise<AddOnRecord[]> {
  return prisma.addOn.findMany({ orderBy: { createdAt: "desc" } }) as Promise<AddOnRecord[]>;
}

export async function createAddOn(input: CreateAddOnInput): Promise<AddOnRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug inválido");
  }

  const record = await prisma.addOn.create({
    data: {
      slug: input.slug.trim().toLowerCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      priceCents: input.priceCents,
      type: input.type.trim(),
      isActive: true,
    },
  });

  return record as AddOnRecord;
}

export async function updateAddOn(input: {
  id: string;
  name?: string;
  description?: string;
  priceCents?: number;
  type?: string;
  isActive?: boolean;
}) {
  return prisma.addOn.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.description ? { description: input.description.trim() } : {}),
      ...(typeof input.priceCents === "number" ? { priceCents: input.priceCents } : {}),
      ...(input.type ? { type: input.type.trim() } : {}),
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
    },
  });
}

export async function getAddOnsByIds(ids: string[]): Promise<AddOnRecord[]> {
  if (ids.length === 0) return [];
  return prisma.addOn.findMany({
    where: { id: { in: ids }, isActive: true },
  }) as Promise<AddOnRecord[]>;
}

export function validateAddOnsCompatibility(spec: ProductSpec, addOns: AddOnRecord[]) {
  const allowed = allowedByType[spec.productType];
  const invalid = addOns.filter((addOn) => !allowed.includes(addOn.type));
  if (invalid.length > 0) {
    throw new Error("Add-ons incompatibles con este producto.");
  }
}

export function calculateAddOnsTotal(addOns: AddOnRecord[]) {
  return addOns.reduce((sum, addOn) => sum + addOn.priceCents, 0);
}

export async function applyAddOnsToSpec(input: {
  specId: string;
  addOnIds: string[];
}) {
  if (input.addOnIds.length === 0) return;

  await prisma.productSpec.update({
    where: { id: input.specId },
    data: {
      addOns: {
        connect: input.addOnIds.map((id) => ({ id })),
      },
    },
  });
}
