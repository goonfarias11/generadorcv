import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const prismaAny = prisma as any;

export interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  partnerId?: string | null;
  isActive: boolean;
  rateLimit: number;
  createdAt: Date;
}

export function generateApiKey() {
  const token = crypto.randomBytes(24).toString("hex");
  return `dpf_${token}`;
}

export async function createApiKey(input: {
  name: string;
  partnerId?: string | null;
  rateLimit?: number;
}): Promise<ApiKeyRecord> {
  const key = generateApiKey();

  const record = await prismaAny.apiKey.create({
    data: {
      key,
      name: input.name.trim(),
      partnerId: input.partnerId ?? null,
      rateLimit: input.rateLimit ?? 1000,
      isActive: true,
    },
  });

  return record as ApiKeyRecord;
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  return prismaAny.apiKey.findMany({ orderBy: { createdAt: "desc" } }) as ApiKeyRecord[];
}

export async function getApiKeyByKey(key: string): Promise<ApiKeyRecord | null> {
  const record = await prismaAny.apiKey.findUnique({ where: { key } });
  return record ? (record as ApiKeyRecord) : null;
}

export async function updateApiKey(input: {
  id: string;
  name?: string;
  rateLimit?: number;
  isActive?: boolean;
}) {
  return prismaAny.apiKey.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(typeof input.rateLimit === "number" ? { rateLimit: input.rateLimit } : {}),
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
    },
  });
}
