import { prisma } from "@/lib/prisma";
import { getProductSpecById, updateProductSpecCustomer, updateProductSpecStatus } from "@/services/productSpecService";
import { getPartnerById } from "@/services/partnerService";
import { getOrCreateCustomerByEmail } from "@/services/customerService";

const prismaAny = prisma as any;

export interface PaymentRecord {
  id: string;
  specId: string;
  stripeSession: string;
  amount: number;
  baseAmount: number;
  addOnAmount: number;
  addOnIds?: string[] | null;
  aiServiceIds?: string[] | null;
  pluginIds?: string[] | null;
  currency: string;
  status: string;
  email?: string | null;
  partnerId?: string | null;
  partnerShare?: number | null;
  customerId?: string | null;
  createdAt: Date;
  productType: string;
}

export async function createPaymentRecord(input: {
  specId: string;
  stripeSession: string;
  amount: number;
  baseAmount: number;
  addOnAmount: number;
  addOnIds?: string[] | null;
  aiServiceIds?: string[] | null;
  pluginIds?: string[] | null;
  currency: string;
  email?: string | null;
  customerId?: string | null;
}): Promise<PaymentRecord> {
  const spec = await getProductSpecById(input.specId);
  if (!spec) {
    throw new Error("Spec no encontrada");
  }

  const partner = spec.partnerId ? await getPartnerById(spec.partnerId) : null;
  const partnerShare = partner
    ? Math.floor((input.baseAmount * partner.commissionPct) / 100)
    : null;

  const payment = await prismaAny.payment.create({
    data: {
      specId: input.specId,
      stripeSession: input.stripeSession,
      amount: input.amount,
      baseAmount: input.baseAmount,
      addOnAmount: input.addOnAmount,
      addOnIds: input.addOnIds ?? undefined,
      aiServiceIds: input.aiServiceIds ?? undefined,
      pluginIds: input.pluginIds ?? undefined,
      currency: input.currency,
      status: "pending",
      email: input.email ?? null,
      customerId: input.customerId ?? null,
      partnerId: partner?.id ?? null,
      partnerShare: partnerShare,
    },
    include: { spec: true },
  });

  return {
    id: payment.id,
    specId: payment.specId,
    stripeSession: payment.stripeSession,
    amount: payment.amount,
    baseAmount: payment.baseAmount,
    addOnAmount: payment.addOnAmount,
    addOnIds: (payment.addOnIds as string[] | null) ?? null,
    aiServiceIds: (payment.aiServiceIds as string[] | null) ?? null,
    pluginIds: (payment.pluginIds as string[] | null) ?? null,
    currency: payment.currency,
    status: payment.status,
    email: payment.email,
    partnerId: payment.partnerId,
    partnerShare: payment.partnerShare,
    customerId: payment.customerId,
    createdAt: payment.createdAt,
    productType: payment.spec.productType,
  };
}

export async function markPaymentPaid(input: {
  stripeSession: string;
  email?: string | null;
}): Promise<{ payment: PaymentRecord; updated: boolean }> {
  const existing = await prismaAny.payment.findFirst({
    where: { stripeSession: input.stripeSession },
    include: { spec: true },
  });

  if (!existing) {
    throw new Error("Pago no encontrado");
  }

  if (existing.status === "paid") {
    return {
      payment: {
        id: existing.id,
        specId: existing.specId,
        stripeSession: existing.stripeSession,
        amount: existing.amount,
        baseAmount: existing.baseAmount,
        addOnAmount: existing.addOnAmount,
        addOnIds: (existing.addOnIds as string[] | null) ?? null,
        aiServiceIds: (existing.aiServiceIds as string[] | null) ?? null,
        pluginIds: (existing.pluginIds as string[] | null) ?? null,
        currency: existing.currency,
        status: existing.status,
        email: existing.email,
        partnerId: existing.partnerId,
        partnerShare: existing.partnerShare,
        customerId: existing.customerId,
        createdAt: existing.createdAt,
        productType: existing.spec.productType,
      },
      updated: false,
    };
  }

  const payment = await prismaAny.payment.update({
    where: { id: existing.id },
    data: {
      status: "paid",
      email: input.email ?? undefined,
    },
    include: { spec: true },
  });

    if (input.email) {
      const customer = await getOrCreateCustomerByEmail(input.email);
      await prismaAny.payment.update({
        where: { id: payment.id },
        data: { customerId: customer.id },
      });

      if (!payment.spec.customerId) {
        await updateProductSpecCustomer({ id: payment.specId, customerId: customer.id });
      }
    }

  await updateProductSpecStatus(payment.specId, "paid");

  return {
    payment: {
      id: payment.id,
      specId: payment.specId,
      stripeSession: payment.stripeSession,
      amount: payment.amount,
      baseAmount: payment.baseAmount,
      addOnAmount: payment.addOnAmount,
      addOnIds: (payment.addOnIds as string[] | null) ?? null,
      aiServiceIds: (payment.aiServiceIds as string[] | null) ?? null,
      pluginIds: (payment.pluginIds as string[] | null) ?? null,
      currency: payment.currency,
      status: payment.status,
      email: payment.email,
      partnerId: payment.partnerId,
      partnerShare: payment.partnerShare,
      customerId: payment.customerId,
      createdAt: payment.createdAt,
      productType: payment.spec.productType,
    },
    updated: true,
  };
}

export async function listPayments(limit = 50): Promise<PaymentRecord[]> {
  type PaymentRow = {
    id: string;
    specId: string;
    stripeSession: string;
    amount: number;
    baseAmount: number;
    addOnAmount: number;
    addOnIds: unknown;
    aiServiceIds: unknown;
    pluginIds: unknown;
    currency: string;
    status: string;
    email: string | null;
    partnerId: string | null;
    partnerShare: number | null;
    customerId: string | null;
    createdAt: Date;
    spec: { productType: string };
  };

  const payments = (await prismaAny.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { spec: true },
  })) as PaymentRow[];

  return payments.map((payment) => ({
    id: payment.id,
    specId: payment.specId,
    stripeSession: payment.stripeSession,
    amount: payment.amount,
    baseAmount: payment.baseAmount,
    addOnAmount: payment.addOnAmount,
    addOnIds: Array.isArray(payment.addOnIds) ? (payment.addOnIds as string[]) : null,
    aiServiceIds: Array.isArray(payment.aiServiceIds)
      ? (payment.aiServiceIds as string[])
      : null,
    pluginIds: Array.isArray(payment.pluginIds)
      ? (payment.pluginIds as string[])
      : null,
    currency: payment.currency,
    status: payment.status,
    email: payment.email,
    partnerId: payment.partnerId,
    partnerShare: payment.partnerShare,
    customerId: payment.customerId,
    createdAt: payment.createdAt,
    productType: payment.spec.productType,
  }));
}

export async function listPaymentsByAgency(input: {
  agencyId: string;
  limit?: number;
}): Promise<PaymentRecord[]> {
  const payments = (await prismaAny.payment.findMany({
    where: { spec: { agencyId: input.agencyId } },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 50,
    include: { spec: true },
  })) as {
    id: string;
    specId: string;
    stripeSession: string;
    amount: number;
    baseAmount: number;
    addOnAmount: number;
    addOnIds: unknown;
    aiServiceIds: unknown;
    pluginIds: unknown;
    currency: string;
    status: string;
    email: string | null;
    partnerId: string | null;
    partnerShare: number | null;
    customerId: string | null;
    createdAt: Date;
    spec: { productType: string };
  }[];

  return payments.map((payment) => ({
    id: payment.id,
    specId: payment.specId,
    stripeSession: payment.stripeSession,
    amount: payment.amount,
    baseAmount: payment.baseAmount,
    addOnAmount: payment.addOnAmount,
    addOnIds: Array.isArray(payment.addOnIds) ? (payment.addOnIds as string[]) : null,
    aiServiceIds: Array.isArray(payment.aiServiceIds)
      ? (payment.aiServiceIds as string[])
      : null,
    pluginIds: Array.isArray(payment.pluginIds)
      ? (payment.pluginIds as string[])
      : null,
    currency: payment.currency,
    status: payment.status,
    email: payment.email,
    partnerId: payment.partnerId,
    partnerShare: payment.partnerShare,
    customerId: payment.customerId,
    createdAt: payment.createdAt,
    productType: payment.spec.productType,
  }));
}
