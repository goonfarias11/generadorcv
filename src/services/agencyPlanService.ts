import { prisma } from "@/lib/prisma";

const prismaAny = prisma as any;

export interface AgencyPlanRecord {
  id: string;
  name: string;
  limits: Record<string, unknown>;
  features: Record<string, unknown>;
  createdAt: Date;
}

export async function createAgencyPlan(input: {
  name: string;
  limits: Record<string, unknown>;
  features: Record<string, unknown>;
}): Promise<AgencyPlanRecord> {
  const record = await prismaAny.agencyPlan.create({
    data: {
      name: input.name.trim(),
      limits: input.limits,
      features: input.features,
    },
  });

  return record as AgencyPlanRecord;
}

export async function listAgencyPlans(): Promise<AgencyPlanRecord[]> {
  return prismaAny.agencyPlan.findMany({ orderBy: { createdAt: "desc" } }) as AgencyPlanRecord[];
}

export async function getAgencyPlanById(id: string): Promise<AgencyPlanRecord | null> {
  const record = await prismaAny.agencyPlan.findUnique({ where: { id } });
  return record ? (record as AgencyPlanRecord) : null;
}
