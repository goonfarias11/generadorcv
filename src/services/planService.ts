import { prisma } from "@/lib/prisma";

export interface PlanRecord {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  interval: string;
  features: string[];
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface CreatePlanInput {
  slug: string;
  name: string;
  priceCents: number;
  interval: string;
  features: string[];
  isActive?: boolean;
}

const slugRegex = /^[a-z0-9-]+$/;

function toPlanRecord(plan: {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  interval: string;
  features: unknown;
  stripeProductId: string | null;
  stripePriceId: string | null;
  isActive: boolean;
  createdAt: Date;
}): PlanRecord {
  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    priceCents: plan.priceCents,
    interval: plan.interval,
    features: Array.isArray(plan.features)
      ? plan.features.filter((item): item is string => typeof item === "string")
      : [],
    stripeProductId: plan.stripeProductId,
    stripePriceId: plan.stripePriceId,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
  };
}

export async function createPlan(input: CreatePlanInput): Promise<PlanRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug invalido");
  }

  const prismaAny = prisma as any;
  const plan = (await prismaAny.plan.create({
    data: {
      slug: input.slug.trim().toLowerCase(),
      name: input.name.trim(),
      priceCents: input.priceCents,
      interval: input.interval,
      features: input.features,
      isActive: input.isActive ?? true,
    },
  })) as {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    interval: string;
    features: unknown;
    stripeProductId: string | null;
    stripePriceId: string | null;
    isActive: boolean;
    createdAt: Date;
  };

  return toPlanRecord(plan);
}

export async function updatePlan(input: {
  id: string;
  name?: string;
  priceCents?: number;
  interval?: string;
  features?: string[];
  isActive?: boolean;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
}) {
  const prismaAny = prisma as any;
  return prismaAny.plan.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(typeof input.priceCents === "number" ? { priceCents: input.priceCents } : {}),
      ...(input.interval ? { interval: input.interval } : {}),
      ...(input.features ? { features: input.features } : {}),
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
      ...(input.stripeProductId ? { stripeProductId: input.stripeProductId } : {}),
      ...(input.stripePriceId ? { stripePriceId: input.stripePriceId } : {}),
    },
  });
}

export async function listPlans(includeInactive = true): Promise<PlanRecord[]> {
  const prismaAny = prisma as any;
  const plans = (await prismaAny.plan.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { createdAt: "desc" },
  })) as {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    interval: string;
    features: unknown;
    stripeProductId: string | null;
    stripePriceId: string | null;
    isActive: boolean;
    createdAt: Date;
  }[];

  return plans.map(toPlanRecord);
}

export async function listActivePlans(): Promise<PlanRecord[]> {
  return listPlans(false);
}

export async function getPlanById(id: string): Promise<PlanRecord | null> {
  const prismaAny = prisma as any;
  const plan = (await prismaAny.plan.findUnique({ where: { id } })) as {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    interval: string;
    features: unknown;
    stripeProductId: string | null;
    stripePriceId: string | null;
    isActive: boolean;
    createdAt: Date;
  } | null;

  return plan ? toPlanRecord(plan) : null;
}

export async function getPlanBySlug(slug: string): Promise<PlanRecord | null> {
  const prismaAny = prisma as any;
  const plan = (await prismaAny.plan.findUnique({ where: { slug } })) as {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    interval: string;
    features: unknown;
    stripeProductId: string | null;
    stripePriceId: string | null;
    isActive: boolean;
    createdAt: Date;
  } | null;

  return plan ? toPlanRecord(plan) : null;
}
