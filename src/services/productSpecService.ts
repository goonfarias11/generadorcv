import type { ProductSpec } from "@/domain/product-spec";
import { prisma } from "@/lib/prisma";
import { createSpecId } from "@/services/spec-id.service";

const prismaAny = prisma as any;

type AddOnSummary = {
  id: string;
  slug: string;
  type: string;
  name: string;
  priceCents: number;
};

type AIOutputSummary = {
  id: string;
  status: string;
  output: string | null;
  service: { id: string; slug: string; name: string };
};

export type ProductSpecRecord = Omit<ProductSpec, "addOns"> & {
  id: string;
  status: string;
  deliveryPath?: string | null;
  deployStatus?: string | null;
  deployUrl?: string | null;
  deployedAt?: Date | null;
  createdAt: Date;
  partnerId?: string | null;
  customerId?: string | null;
  agencyId?: string | null;
  createdById?: string | null;
  apiKeyId?: string | null;
  planId?: string | null;
  planStatus?: string | null;
  planExpiresAt?: Date | null;
  addOns?: AddOnSummary[];
  aiOutputs?: AIOutputSummary[];
};

const normalizeSections = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

type ProductSpecRow = {
  id: string;
  mode: string;
  productType: string;
  objective: string;
  industry: string | null;
  sections: unknown;
  designSystem: string;
  copyTone: string;
  addOns?: AddOnSummary[] | null;
  aiOutputs?: AIOutputSummary[] | null;
  complexity: string;
  deliveryTime: string;
  priceEstimate: number;
  status: string;
  deliveryPath: string | null;
  deployStatus: string | null;
  deployUrl: string | null;
  deployedAt: Date | null;
  partnerId: string | null;
  customerId: string | null;
  agencyId: string | null;
  createdById: string | null;
  apiKeyId: string | null;
  planId: string | null;
  planStatus: string | null;
  planExpiresAt: Date | null;
  createdAt: Date;
};

const toDomain = (record: ProductSpecRow): ProductSpecRecord => ({
  id: record.id,
  mode: record.mode as ProductSpec["mode"],
  productType: record.productType as ProductSpec["productType"],
  objective: record.objective as ProductSpec["objective"],
  industry: record.industry ?? "",
  sections: normalizeSections(record.sections),
  designSystem: record.designSystem,
  copyTone: record.copyTone,
  complexity: record.complexity as ProductSpec["complexity"],
  deliveryTime: record.deliveryTime,
  priceEstimate: record.priceEstimate,
  status: record.status,
  deliveryPath: record.deliveryPath,
  deployStatus: record.deployStatus,
  deployUrl: record.deployUrl,
  deployedAt: record.deployedAt,
  partnerId: record.partnerId,
  customerId: record.customerId,
  agencyId: record.agencyId,
  createdById: record.createdById,
  apiKeyId: record.apiKeyId,
  planId: record.planId,
  planStatus: record.planStatus,
  planExpiresAt: record.planExpiresAt,
  addOns: record.addOns ?? [],
  aiOutputs: record.aiOutputs ?? [],
  createdAt: record.createdAt,
});

export async function createProductSpec(spec: ProductSpec): Promise<ProductSpecRecord> {
  const id = createSpecId(spec);

  const record = (await prismaAny.productSpec.upsert({
    where: { id },
    update: { status: "generated" },
    create: {
      id,
      mode: spec.mode,
      productType: spec.productType,
      objective: spec.objective,
      industry: spec.industry,
      sections: spec.sections,
      designSystem: spec.designSystem,
      copyTone: spec.copyTone,
      complexity: spec.complexity,
      deliveryTime: spec.deliveryTime,
      priceEstimate: spec.priceEstimate,
      status: "generated",
      partnerId: spec.partnerId ?? null,
      agencyId: spec.agencyId ?? null,
      createdById: spec.createdById ?? null,
    },
    select: {
      id: true,
      mode: true,
      productType: true,
      objective: true,
      industry: true,
      sections: true,
      designSystem: true,
      copyTone: true,
      complexity: true,
      deliveryTime: true,
      priceEstimate: true,
      status: true,
      deliveryPath: true,
      deployStatus: true,
      deployUrl: true,
      deployedAt: true,
      partnerId: true,
      customerId: true,
      agencyId: true,
      createdById: true,
      apiKeyId: true,
      planId: true,
      planStatus: true,
      planExpiresAt: true,
      addOns: {
        select: { id: true, slug: true, type: true, name: true, priceCents: true },
      },
      aiOutputs: {
        select: {
          id: true,
          status: true,
          output: true,
          service: { select: { id: true, slug: true, name: true } },
        },
      },
      createdAt: true,
    } as any,
  })) as unknown as ProductSpecRow;

  return toDomain(record);
}

export async function getProductSpecById(id: string): Promise<ProductSpecRecord | null> {
  const record = (await prisma.productSpec.findUnique({
    where: { id },
    select: {
      id: true,
      mode: true,
      productType: true,
      objective: true,
      industry: true,
      sections: true,
      designSystem: true,
      copyTone: true,
      complexity: true,
      deliveryTime: true,
      priceEstimate: true,
      status: true,
      deliveryPath: true,
      deployStatus: true,
      deployUrl: true,
      deployedAt: true,
      partnerId: true,
      customerId: true,
      agencyId: true,
      createdById: true,
      apiKeyId: true,
      planId: true,
      planStatus: true,
      planExpiresAt: true,
      addOns: {
        select: { id: true, slug: true, type: true, name: true, priceCents: true },
      },
      aiOutputs: {
        select: {
          id: true,
          status: true,
          output: true,
          service: { select: { id: true, slug: true, name: true } },
        },
      },
      createdAt: true,
    } as any,
  })) as unknown as ProductSpecRow | null;

  return record ? toDomain(record) : null;
}

export async function listProductSpecs(limit = 20): Promise<ProductSpecRecord[]> {
  const records = (await prismaAny.productSpec.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      mode: true,
      productType: true,
      objective: true,
      industry: true,
      sections: true,
      designSystem: true,
      copyTone: true,
      complexity: true,
      deliveryTime: true,
      priceEstimate: true,
      status: true,
      deliveryPath: true,
      deployStatus: true,
      deployUrl: true,
      deployedAt: true,
      partnerId: true,
      addOns: {
        select: { id: true, slug: true, type: true, name: true, priceCents: true },
      },
      aiOutputs: {
        select: {
          id: true,
          status: true,
          output: true,
          service: { select: { id: true, slug: true, name: true } },
        },
      },
      customerId: true,
      agencyId: true,
      createdById: true,
      apiKeyId: true,
      planId: true,
      planStatus: true,
      planExpiresAt: true,
      createdAt: true,
    } as any,
  })) as unknown as ProductSpecRow[];

  return records.map(toDomain);
}

export async function listProductSpecsByAgency(input: {
  agencyId: string;
  limit?: number;
}): Promise<ProductSpecRecord[]> {
  const records = (await prismaAny.productSpec.findMany({
    where: { agencyId: input.agencyId },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 50,
    select: {
      id: true,
      mode: true,
      productType: true,
      objective: true,
      industry: true,
      sections: true,
      designSystem: true,
      copyTone: true,
      complexity: true,
      deliveryTime: true,
      priceEstimate: true,
      status: true,
      deliveryPath: true,
      deployStatus: true,
      deployUrl: true,
      deployedAt: true,
      partnerId: true,
      agencyId: true,
      createdById: true,
      addOns: {
        select: { id: true, slug: true, type: true, name: true, priceCents: true },
      },
      aiOutputs: {
        select: {
          id: true,
          status: true,
          output: true,
          service: { select: { id: true, slug: true, name: true } },
        },
      },
      customerId: true,
      apiKeyId: true,
      planId: true,
      planStatus: true,
      planExpiresAt: true,
      createdAt: true,
    } as any,
  })) as unknown as ProductSpecRow[];

  return records.map(toDomain);
}

export async function updateProductSpecStatus(id: string, status: string) {
  await prisma.productSpec.update({
    where: { id },
    data: { status },
  });
}

export async function updateProductSpecDelivery(input: {
  id: string;
  status: string;
  deliveryPath: string;
}) {
  await prisma.productSpec.update({
    where: { id: input.id },
    data: {
      status: input.status,
      deliveryPath: input.deliveryPath,
    },
  });
}

export async function updateProductSpecDeploy(input: {
  id: string;
  deployStatus: string | null;
  deployUrl: string | null;
  deployedAt: Date | null;
}) {
  await prisma.productSpec.update({
    where: { id: input.id },
    data: {
      deployStatus: input.deployStatus,
      deployUrl: input.deployUrl,
      deployedAt: input.deployedAt,
    },
  });
}

export async function updateProductSpecCustomer(input: {
  id: string;
  customerId: string;
}) {
  await prisma.productSpec.update({
    where: { id: input.id },
    data: { customerId: input.customerId },
  });
}

export async function createProductSpecForApi(input: {
  spec: ProductSpec;
  apiKeyId: string;
  partnerId?: string | null;
}): Promise<ProductSpecRecord> {
  const id = createSpecId(input.spec);

  const record = (await prismaAny.productSpec.upsert({
    where: { id },
    update: { status: "generated", apiKeyId: input.apiKeyId },
    create: {
      id,
      mode: input.spec.mode,
      productType: input.spec.productType,
      objective: input.spec.objective,
      industry: input.spec.industry,
      sections: input.spec.sections,
      designSystem: input.spec.designSystem,
      copyTone: input.spec.copyTone,
      complexity: input.spec.complexity,
      deliveryTime: input.spec.deliveryTime,
      priceEstimate: input.spec.priceEstimate,
      status: "generated",
      partnerId: input.partnerId ?? null,
      apiKeyId: input.apiKeyId,
      agencyId: input.spec.agencyId ?? null,
      createdById: input.spec.createdById ?? null,
    },
    select: {
      id: true,
      mode: true,
      productType: true,
      objective: true,
      industry: true,
      sections: true,
      designSystem: true,
      copyTone: true,
      complexity: true,
      deliveryTime: true,
      priceEstimate: true,
      status: true,
      deliveryPath: true,
      deployStatus: true,
      deployUrl: true,
      deployedAt: true,
      partnerId: true,
      customerId: true,
      apiKeyId: true,
      planId: true,
      planStatus: true,
      planExpiresAt: true,
      addOns: {
        select: { id: true, slug: true, type: true, name: true, priceCents: true },
      },
      aiOutputs: {
        select: {
          id: true,
          status: true,
          output: true,
          service: { select: { id: true, slug: true, name: true } },
        },
      },
      createdAt: true,
    } as any,
  })) as unknown as ProductSpecRow;

  return toDomain(record);
}

export async function updateProductSpecPlan(input: {
  id: string;
  planId: string | null;
  planStatus: string | null;
  planExpiresAt: Date | null;
}) {
  await prisma.productSpec.update({
    where: { id: input.id },
    data: {
      planId: input.planId,
      planStatus: input.planStatus,
      planExpiresAt: input.planExpiresAt,
    } as any,
  });
}
