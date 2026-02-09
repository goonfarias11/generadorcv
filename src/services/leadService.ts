import { prisma } from "@/lib/prisma";
import { getProductSpecById } from "@/services/productSpecService";

const prismaAny = prisma as any;

export interface CreateLeadInput {
  specId: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
}

export interface LeadRecord {
  id: string;
  specId: string;
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  createdAt: Date;
  productType: string;
  objective: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export async function createLead(input: CreateLeadInput): Promise<LeadRecord> {
  if (!emailRegex.test(input.email)) {
    throw new Error("Email inválido");
  }

  const spec = await getProductSpecById(input.specId);
  if (!spec) {
    throw new Error("Spec no encontrada");
  }

  const lead = await prisma.lead.create({
    data: {
      specId: input.specId,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      company: input.company?.trim() || null,
      message: input.message?.trim() || null,
    },
  });

  return {
    id: lead.id,
    specId: lead.specId,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    message: lead.message,
    createdAt: lead.createdAt,
    productType: spec.productType,
    objective: spec.objective,
  };
}

export async function listLeads(limit = 50): Promise<LeadRecord[]> {
  type LeadRow = {
    id: string;
    specId: string;
    name: string;
    email: string;
    company: string | null;
    message: string | null;
    createdAt: Date;
    spec: { productType: string; objective: string };
  };

  const leads = (await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { spec: true },
  })) as LeadRow[];

  return leads.map((lead) => ({
    id: lead.id,
    specId: lead.specId,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    message: lead.message,
    createdAt: lead.createdAt,
    productType: lead.spec.productType,
    objective: lead.spec.objective,
  }));
}

export async function listLeadsByAgency(input: {
  agencyId: string;
  limit?: number;
}): Promise<LeadRecord[]> {
  const leads = (await prismaAny.lead.findMany({
    where: { spec: { agencyId: input.agencyId } },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 50,
    include: { spec: true },
  })) as {
    id: string;
    specId: string;
    name: string;
    email: string;
    company: string | null;
    message: string | null;
    createdAt: Date;
    spec: { productType: string; objective: string };
  }[];

  return leads.map((lead) => ({
    id: lead.id,
    specId: lead.specId,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    message: lead.message,
    createdAt: lead.createdAt,
    productType: lead.spec.productType,
    objective: lead.spec.objective,
  }));
}
