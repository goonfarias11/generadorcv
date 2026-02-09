import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MINUTES = 15;
const MAX_ACTIVE_TOKENS = 5;

export async function purgeExpiredLoginTokens() {
  const now = new Date();
  await prisma.loginToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }],
    },
  });
}

export async function createLoginTokenForCustomer(customerId: string) {
  const now = new Date();
  await purgeExpiredLoginTokens();

  const activeTokens = await prisma.loginToken.findMany({
    where: { customerId, usedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "asc" },
    select: { token: true },
  });

  if (activeTokens.length >= MAX_ACTIVE_TOKENS) {
    const excess = activeTokens.length - MAX_ACTIVE_TOKENS + 1;
    const tokensToDelete = activeTokens.slice(0, excess).map((item) => item.token);
    await prisma.loginToken.deleteMany({ where: { token: { in: tokensToDelete } } });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(now.getTime() + TOKEN_TTL_MINUTES * 60 * 1000);

  await prisma.loginToken.create({
    data: {
      token,
      customerId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function verifyLoginToken(token: string) {
  const now = new Date();
  await purgeExpiredLoginTokens();

  const record = await prisma.loginToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < now) {
    return null;
  }

  await prisma.loginToken.update({
    where: { token },
    data: { usedAt: now },
  });

  return record.customerId;
}
