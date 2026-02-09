import { prisma } from "@/lib/prisma";

export interface CustomerRecord {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

export interface CustomerSpecSummary {
  id: string;
  productType: string;
  objective: string;
  status: string;
  deployStatus: string | null;
  deployUrl: string | null;
  deliveryPath: string | null;
  planStatus: string | null;
  planExpiresAt: Date | null;
  createdAt: Date;
  addOns: { id: string; name: string; type: string; priceCents: number }[];
  customDomain: { domain: string; status: string } | null;
}

export interface CustomerSpecDetail {
  id: string;
  productType: string;
  objective: string;
  status: string;
  deployStatus: string | null;
  deployUrl: string | null;
  deliveryPath: string | null;
  planStatus: string | null;
  planExpiresAt: Date | null;
  plan: { id: string; name: string; priceCents: number; interval: string } | null;
  createdAt: Date;
  addOns: { id: string; name: string; type: string; priceCents: number }[];
  customDomain: { domain: string; status: string } | null;
  payments: {
    id: string;
    amount: number;
    baseAmount: number;
    addOnAmount: number;
    status: string;
    createdAt: Date;
    currency: string;
  }[];
}

export async function getCustomerById(id: string): Promise<CustomerRecord | null> {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return null;
  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    createdAt: customer.createdAt,
  };
}

export async function getCustomerByEmail(email: string): Promise<CustomerRecord | null> {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return null;
  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    createdAt: customer.createdAt,
  };
}

export async function getOrCreateCustomerByEmail(
  email: string,
  name?: string | null
): Promise<CustomerRecord> {
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      createdAt: existing.createdAt,
    };
  }

  const created = await prisma.customer.create({
    data: { email, name: name ?? null },
  });

  return {
    id: created.id,
    email: created.email,
    name: created.name,
    createdAt: created.createdAt,
  };
}

export async function listCustomerSpecs(customerId: string): Promise<CustomerSpecSummary[]> {
  return (await prisma.productSpec.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productType: true,
      objective: true,
      status: true,
      deployStatus: true,
      deployUrl: true,
      deliveryPath: true,
      planStatus: true,
      planExpiresAt: true,
      createdAt: true,
      addOns: { select: { id: true, name: true, type: true, priceCents: true } },
      customDomain: { select: { domain: true, status: true } },
    } as any,
  })) as unknown as CustomerSpecSummary[];
}

export async function getCustomerSpecDetail(input: {
  customerId: string;
  specId: string;
}): Promise<CustomerSpecDetail | null> {
  return (await prisma.productSpec.findFirst({
    where: { id: input.specId, customerId: input.customerId },
    select: {
      id: true,
      productType: true,
      objective: true,
      status: true,
      deployStatus: true,
      deployUrl: true,
      deliveryPath: true,
      planStatus: true,
      planExpiresAt: true,
      plan: { select: { id: true, name: true, priceCents: true, interval: true } },
      createdAt: true,
      addOns: { select: { id: true, name: true, type: true, priceCents: true } },
      customDomain: { select: { domain: true, status: true } },
      payments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          baseAmount: true,
          addOnAmount: true,
          status: true,
          createdAt: true,
          currency: true,
        },
      },
    } as any,
  })) as unknown as CustomerSpecDetail | null;
}
