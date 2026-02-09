import { prisma } from "@/lib/prisma";

const prismaAny = prisma as any;

export interface AIServiceRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AIServiceOutputRecord {
  id: string;
  specId: string;
  serviceId: string;
  status: string;
  output: string | null;
  createdAt: Date;
  updatedAt: Date;
  service?: { id: string; slug: string; name: string };
}

export interface CreateAIServiceInput {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
}

const slugRegex = /^[a-z0-9-]+$/;

type SpecContext = {
  id: string;
  productType: string;
  objective: string;
  industry: string | null;
  sections: string[];
  copyTone: string;
};

function buildAIOutput(spec: SpecContext, service: AIServiceRecord) {
  const sections = spec.sections.length > 0 ? spec.sections.join(", ") : "no definidas";
  const industry = spec.industry?.trim() || "general";

  return [
    `# ${service.name}`,
    "",
    service.description,
    "",
    "## Contexto del producto",
    `- Tipo: ${spec.productType}`,
    `- Objetivo: ${spec.objective}`,
    `- Industria: ${industry}`,
    `- Secciones: ${sections}`,
    `- Tono de copy: ${spec.copyTone}`,
    "",
    "## Sugerencias iniciales",
    "- Mensaje principal claro y directo.",
    "- CTA enfocado en el objetivo principal.",
    "- Beneficios expresados en una sola frase por bloque.",
  ].join("\n");
}

export async function listActiveAIServices(): Promise<AIServiceRecord[]> {
  return prismaAny.aIService.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<AIServiceRecord[]>;
}

export async function listAllAIServices(): Promise<AIServiceRecord[]> {
  return prismaAny.aIService.findMany({
    orderBy: { createdAt: "desc" },
  }) as Promise<AIServiceRecord[]>;
}

export async function createAIService(input: CreateAIServiceInput): Promise<AIServiceRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug invalido");
  }

  const record = await prismaAny.aIService.create({
    data: {
      slug: input.slug.trim().toLowerCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      priceCents: input.priceCents,
      isActive: true,
    },
  });

  return record as AIServiceRecord;
}

export async function updateAIService(input: {
  id: string;
  name?: string;
  description?: string;
  priceCents?: number;
  isActive?: boolean;
}) {
  return prismaAny.aIService.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.description ? { description: input.description.trim() } : {}),
      ...(typeof input.priceCents === "number" ? { priceCents: input.priceCents } : {}),
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
    },
  });
}

export async function getAIServicesByIds(ids: string[]): Promise<AIServiceRecord[]> {
  if (ids.length === 0) return [];
  return prismaAny.aIService.findMany({
    where: { id: { in: ids }, isActive: true },
  }) as Promise<AIServiceRecord[]>;
}

export async function listAIOutputsForSpec(specId: string): Promise<AIServiceOutputRecord[]> {
  return prismaAny.aIServiceOutput.findMany({
    where: { specId },
    orderBy: { createdAt: "desc" },
    include: { service: { select: { id: true, slug: true, name: true } } },
  }) as Promise<AIServiceOutputRecord[]>;
}

export async function ensureAIOutputsForSpec(input: {
  spec: SpecContext;
  serviceIds: string[];
}): Promise<AIServiceOutputRecord[]> {
  const uniqueIds = Array.from(new Set(input.serviceIds));
  if (uniqueIds.length === 0) return [];

  const services = await getAIServicesByIds(uniqueIds);
  const serviceMap = new Map(services.map((service) => [service.id, service]));
  const existing = (await prismaAny.aIServiceOutput.findMany({
    where: { specId: input.spec.id, serviceId: { in: uniqueIds } },
  })) as { serviceId: string }[];
  const existingIds = new Set(existing.map((item) => item.serviceId));

  const created: AIServiceOutputRecord[] = [];
  for (const serviceId of uniqueIds) {
    if (existingIds.has(serviceId)) continue;
    const service = serviceMap.get(serviceId);
    if (!service) continue;

    const output = buildAIOutput(input.spec, service);
    const record = await prismaAny.aIServiceOutput.create({
      data: {
        specId: input.spec.id,
        serviceId: service.id,
        status: "completed",
        output,
      },
      include: { service: { select: { id: true, slug: true, name: true } } },
    });

    created.push(record as AIServiceOutputRecord);
  }

  return created;
}
