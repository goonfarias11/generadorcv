import { prisma } from "@/lib/prisma";

const prismaAny = prisma as any;

export async function logApiRequest(input: {
  apiKeyId: string;
  endpoint: string;
  method: string;
  status: number;
  costEstimate: number;
}) {
  await prismaAny.apiRequestLog.create({
    data: {
      apiKeyId: input.apiKeyId,
      endpoint: input.endpoint,
      method: input.method,
      status: input.status,
      costEstimate: input.costEstimate,
    },
  });
}

export async function countRequestsSince(input: { apiKeyId: string; since: Date }) {
  return prismaAny.apiRequestLog.count({
    where: {
      apiKeyId: input.apiKeyId,
      createdAt: { gte: input.since },
    },
  }) as Promise<number>;
}

export async function getApiKeyUsage(input: { apiKeyId: string }) {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [total, today] = await Promise.all([
    prismaAny.apiRequestLog.count({ where: { apiKeyId: input.apiKeyId } }),
    prismaAny.apiRequestLog.count({
      where: { apiKeyId: input.apiKeyId, createdAt: { gte: startOfDay } },
    }),
  ]);

  return { total, today };
}
