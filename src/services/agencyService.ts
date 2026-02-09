import { prisma } from "@/lib/prisma";
import type { ProductSpec } from "@/domain/product-spec";

const prismaAny = prisma as any;

export type AgencyRole = "owner" | "admin" | "editor" | "viewer";

export interface AgencyRecord {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  branding?: Record<string, unknown> | null;
  customDomain?: string | null;
  createdAt: Date;
}

export interface AgencyMemberRecord {
  id: string;
  agencyId: string;
  userId: string;
  role: AgencyRole;
  user?: { id: string; email: string; name?: string | null };
}

const slugRegex = /^[a-z0-9-]+$/;

export async function createAgency(input: {
  name: string;
  slug: string;
  ownerId: string;
  branding?: Record<string, unknown> | null;
  customDomain?: string | null;
}): Promise<AgencyRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug invalido");
  }

  const agency = await prismaAny.agency.create({
    data: {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      ownerId: input.ownerId,
      branding: input.branding ?? null,
      customDomain: input.customDomain ?? null,
    },
  });

  await prismaAny.agencyMember.create({
    data: {
      agencyId: agency.id,
      userId: input.ownerId,
      role: "owner",
    },
  });

  return agency as AgencyRecord;
}

export async function listAgencies(): Promise<AgencyRecord[]> {
  return prismaAny.agency.findMany({ orderBy: { createdAt: "desc" } }) as AgencyRecord[];
}

export async function listAgenciesForUser(userId: string): Promise<AgencyRecord[]> {
  return prismaAny.agency.findMany({
    where: { members: { some: { userId } } },
    orderBy: { createdAt: "desc" },
  }) as AgencyRecord[];
}

export async function getAgencyById(id: string): Promise<AgencyRecord | null> {
  const record = await prismaAny.agency.findUnique({ where: { id } });
  return record ? (record as AgencyRecord) : null;
}

export async function getAgencyBranding(agencyId: string) {
  const agency = await getAgencyById(agencyId);
  if (!agency) return null;

  const branding = (agency.branding ?? {}) as Record<string, unknown>;
  const normalizeText = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
  const agencyName = normalizeText(agency.name) ?? "Agencia";
  const name = normalizeText(branding.name) ?? agencyName;
  const platformName = normalizeText(branding.platformName) ?? name;
  const logoUrl = normalizeText(branding.logoUrl);
  const primaryColor = normalizeText(branding.primaryColor) ?? "#0f172a";
  const accentColor = normalizeText(branding.accentColor) ?? "#ffffff";
  return {
    name,
    logoUrl,
    primaryColor,
    accentColor,
    platformName,
  };
}

export async function getAgencyBySlug(slug: string): Promise<AgencyRecord | null> {
  const record = await prismaAny.agency.findUnique({ where: { slug } });
  return record ? (record as AgencyRecord) : null;
}

export async function updateAgency(input: {
  id: string;
  name?: string;
  branding?: Record<string, unknown> | null;
  customDomain?: string | null;
}) {
  return prismaAny.agency.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.branding ? { branding: input.branding } : {}),
      ...(input.customDomain ? { customDomain: input.customDomain } : {}),
    },
  });
}

export async function listAgencyMembers(agencyId: string): Promise<AgencyMemberRecord[]> {
  return prismaAny.agencyMember.findMany({
    where: { agencyId },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { id: "desc" },
  }) as AgencyMemberRecord[];
}

export async function addAgencyMember(input: {
  agencyId: string;
  userId: string;
  role: AgencyRole;
}) {
  return prismaAny.agencyMember.create({
    data: {
      agencyId: input.agencyId,
      userId: input.userId,
      role: input.role,
    },
  });
}

export async function getAgencyMemberRole(input: {
  agencyId: string;
  userId: string;
}): Promise<AgencyRole | null> {
  const record = await prismaAny.agencyMember.findFirst({
    where: { agencyId: input.agencyId, userId: input.userId },
  });

  return record ? (record.role as AgencyRole) : null;
}

export async function requireAgencyRole(input: {
  agencyId: string;
  userId: string;
  roles: AgencyRole[];
}) {
  const role = await getAgencyMemberRole({ agencyId: input.agencyId, userId: input.userId });
  if (!role || !input.roles.includes(role)) {
    throw new Error("Permisos insuficientes");
  }
}

export async function listAgencyClients(agencyId: string) {
  const specs = await prismaAny.productSpec.findMany({
    where: { agencyId, customerId: { not: null } },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const seen = new Map<string, { id: string; email: string; name?: string | null }>();
  for (const spec of specs as { customer: { id: string; email: string; name?: string | null } }[]) {
    const customer = spec.customer;
    if (customer && !seen.has(customer.id)) {
      seen.set(customer.id, { id: customer.id, email: customer.email, name: customer.name });
    }
  }

  return Array.from(seen.values());
}

export async function buildAgencySpecContext(input: {
  agencyId: string;
  createdById: string;
  spec: ProductSpec;
}) {
  return {
    ...input.spec,
    agencyId: input.agencyId,
    createdById: input.createdById,
  } satisfies ProductSpec;
}
