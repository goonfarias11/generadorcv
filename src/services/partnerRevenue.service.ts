import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaymentRecord } from "@/services/paymentService";

export interface PartnerWalletData {
  partner: {
    id: string;
    name: string;
    balanceCents: number;
    stripeAccountId?: string | null;
    payoutsEnabled: boolean;
  };
  payments: {
    id: string;
    amount: number;
    partnerShare: number | null;
    createdAt: Date;
  }[];
  payouts: {
    id: string;
    amountCents: number;
    status: string;
    transferId?: string | null;
    transferStatus?: string | null;
    errorMessage?: string | null;
    paymentId?: string | null;
    createdAt: Date;
  }[];
}

export async function applyPartnerRevenueShare(payment: PaymentRecord) {
  if (!payment.partnerId || !payment.partnerShare || payment.partnerShare <= 0) {
    return;
  }

  await prisma.partner.update({
    where: { id: payment.partnerId },
    data: {
      balanceCents: { increment: payment.partnerShare },
    },
  });
}

export async function applySubscriptionRevenueShare(input: {
  partnerId: string;
  amountCents: number;
  referenceId: string;
}) {
  if (input.amountCents <= 0) {
    return;
  }

  const existing = await prisma.partnerPayout.findFirst({
    where: { partnerId: input.partnerId, transferId: input.referenceId },
  });

  if (existing) {
    return;
  }

  await prisma.$transaction([
    prisma.partner.update({
      where: { id: input.partnerId },
      data: { balanceCents: { increment: input.amountCents } },
    }),
    prisma.partnerPayout.create({
      data: {
        partnerId: input.partnerId,
        amountCents: input.amountCents,
        status: "accrued",
        transferId: input.referenceId,
        transferStatus: "invoice",
      } as Prisma.PartnerPayoutUncheckedCreateInput,
    }),
  ]);
}

export async function recordPartnerPayout(input: {
  partnerId: string;
  amountCents: number;
  status: string;
  transferId?: string | null;
  transferStatus?: string | null;
  paymentId?: string | null;
  errorMessage?: string | null;
  decrementBalance?: boolean;
}) {
  if (input.amountCents <= 0) {
    throw new Error("Monto invalido");
  }

  await prisma.$transaction([
    ...(input.decrementBalance
      ? [
          prisma.partner.update({
            where: { id: input.partnerId },
            data: { balanceCents: { decrement: input.amountCents } },
          }),
        ]
      : []),
    prisma.partnerPayout.create({
      data: {
        partnerId: input.partnerId,
        amountCents: input.amountCents,
        status: input.status,
        transferId: input.transferId ?? null,
        transferStatus: input.transferStatus ?? null,
        paymentId: input.paymentId ?? null,
        errorMessage: input.errorMessage ?? null,
      } as Prisma.PartnerPayoutUncheckedCreateInput,
    }),
  ]);
}

export async function createPartnerPayout(input: {
  partnerId: string;
  amountCents: number;
}) {
  if (input.amountCents <= 0) {
    throw new Error("Monto inválido");
  }

  const partner = await prisma.partner.findUnique({ where: { id: input.partnerId } });
  if (!partner) {
    throw new Error("Partner no encontrado");
  }

  if (partner.balanceCents < input.amountCents) {
    throw new Error("Saldo insuficiente");
  }

  await prisma.$transaction([
    prisma.partner.update({
      where: { id: input.partnerId },
      data: { balanceCents: { decrement: input.amountCents } },
    }),
    prisma.partnerPayout.create({
      data: {
        partnerId: input.partnerId,
        amountCents: input.amountCents,
        status: "pending",
      },
    }),
  ]);
}

export async function listPartnerWallet(input: { partnerId: string }): Promise<PartnerWalletData> {
  const partner = await prisma.partner.findUnique({ where: { id: input.partnerId } });
  if (!partner) {
    throw new Error("Partner no encontrado");
  }

  const payments = await prisma.payment.findMany({
    where: { partnerId: input.partnerId, status: "paid" },
    orderBy: { createdAt: "desc" },
  });

  const payouts = await prisma.partnerPayout.findMany({
    where: { partnerId: input.partnerId },
    orderBy: { createdAt: "desc" },
  });

  return {
    partner: {
      ...partner,
      stripeAccountId: (partner as { stripeAccountId?: string | null }).stripeAccountId ?? null,
      payoutsEnabled: (partner as { payoutsEnabled?: boolean }).payoutsEnabled ?? false,
    },
    payments,
    payouts: payouts.map((payout) => ({
      ...payout,
      transferId: (payout as { transferId?: string | null }).transferId ?? null,
      transferStatus: (payout as { transferStatus?: string | null }).transferStatus ?? null,
      errorMessage: (payout as { errorMessage?: string | null }).errorMessage ?? null,
      paymentId: (payout as { paymentId?: string | null }).paymentId ?? null,
    })),
  };
}
