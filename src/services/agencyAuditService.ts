import { prisma } from "@/lib/prisma";

const prismaAny = prisma as any;

export interface AgencyAuditRecord {
  id: string;
  agencyId: string;
  actorId?: string | null;
  action: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export async function logAgencyAction(input: {
  agencyId: string;
  actorId?: string | null;
  action: string;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  await prismaAny.agencyAuditLog.create({
    data: {
      agencyId: input.agencyId,
      actorId: input.actorId ?? null,
      action: input.action,
      targetId: input.targetId ?? null,
      metadata: input.metadata ?? null,
    },
  });
}

export async function listAgencyLogs(agencyId: string, limit = 100): Promise<AgencyAuditRecord[]> {
  return prismaAny.agencyAuditLog.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as AgencyAuditRecord[];
}

export async function exportAgencyLogsCsv(agencyId: string) {
  const logs = await listAgencyLogs(agencyId, 500);
  const header = "id,agencyId,actorId,action,targetId,createdAt";
  const rows = logs.map((log) =>
    [log.id, log.agencyId, log.actorId ?? "", log.action, log.targetId ?? "", log.createdAt.toISOString()]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [header, ...rows].join("\n");
}
