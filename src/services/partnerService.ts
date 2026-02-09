import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface PartnerRecord {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  commissionPct: number;
  balanceCents: number;
  stripeAccountId?: string | null;
  payoutsEnabled: boolean;
  active: boolean;
  createdAt: Date;
}

export interface PartnerStats extends PartnerRecord {
  specsCount: number;
  revenueCents: number;
}

const slugRegex = /^[a-z0-9-]+$/;

export async function createPartner(input: {
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
}): Promise<PartnerRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug inválido");
  }

  const partner = await prisma.partner.create({
    data: {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      logoUrl: input.logoUrl?.trim() || null,
      primaryColor: input.primaryColor?.trim() || null,
      active: true,
    },
  });

  return partner as PartnerRecord;
}

export async function getPartnerBySlug(slug: string): Promise<PartnerRecord | null> {
  const partner = await prisma.partner.findUnique({ where: { slug } });
  return partner ? (partner as PartnerRecord) : null;
}

export async function getPartnerById(id: string): Promise<PartnerRecord | null> {
  const partner = await prisma.partner.findUnique({ where: { id } });
  return partner ? (partner as PartnerRecord) : null;
}

export async function updatePartnerStripeAccount(input: {
  partnerId: string;
  stripeAccountId: string;
}) {
  return prisma.partner.update({
    where: { id: input.partnerId },
    data: { stripeAccountId: input.stripeAccountId } as Prisma.PartnerUncheckedUpdateInput,
  });
}

export async function updatePartnerPayoutStatus(input: {
  partnerId: string;
  payoutsEnabled: boolean;
}) {
  return prisma.partner.update({
    where: { id: input.partnerId },
    data: { payoutsEnabled: input.payoutsEnabled } as Prisma.PartnerUncheckedUpdateInput,
  });
}

export async function listPartnersWithStats(): Promise<PartnerStats[]> {
  type PartnerRow = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string | null;
    commissionPct: number;
    balanceCents: number;
    stripeAccountId: string | null;
    payoutsEnabled: boolean;
    active: boolean;
    createdAt: Date;
  };

  const partners = (await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
  })) as PartnerRow[];

  const stats = await Promise.all(
    partners.map(async (partner) => {
      const specsCount = await prisma.productSpec.count({
        where: { partnerId: partner.id },
      });
      const revenue = await prisma.payment.aggregate({
        where: { spec: { partnerId: partner.id }, status: "paid" },
        _sum: { amount: true },
      });

      return {
        ...partner,
        specsCount,
        revenueCents: revenue._sum.amount ?? 0,
      };
    })
  );

  return stats;
}
