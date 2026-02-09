import { prisma } from "@/lib/prisma";

export type DomainStatus = "pending" | "verified" | "active" | "failed";

export interface CustomDomainRecord {
  id: string;
  specId: string;
  domain: string;
  status: DomainStatus;
  createdAt: Date;
}

const domainRegex = /^(?!-)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export async function createOrUpdateDomain(input: {
  specId: string;
  domain: string;
}): Promise<CustomDomainRecord> {
  if (!domainRegex.test(input.domain)) {
    throw new Error("Dominio inválido");
  }

  const record = await prisma.customDomain.upsert({
    where: { specId: input.specId },
    update: {
      domain: input.domain.toLowerCase(),
      status: "pending",
    },
    create: {
      specId: input.specId,
      domain: input.domain.toLowerCase(),
      status: "pending",
    },
  });

  return record as CustomDomainRecord;
}

export async function updateDomainStatus(input: {
  specId: string;
  status: DomainStatus;
}): Promise<void> {
  await prisma.customDomain.update({
    where: { specId: input.specId },
    data: { status: input.status },
  });
}

export async function getDomainBySpecId(specId: string): Promise<CustomDomainRecord | null> {
  const record = await prisma.customDomain.findUnique({ where: { specId } });
  return (record as CustomDomainRecord) ?? null;
}

export async function listDomains() {
  return prisma.customDomain.findMany({
    orderBy: { createdAt: "desc" },
    include: { spec: { include: { partner: true } } },
  });
}
