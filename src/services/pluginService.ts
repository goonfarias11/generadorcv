import { prisma } from "@/lib/prisma";
import { getPartnerById } from "@/services/partnerService";

const prismaAny = prisma as any;

export interface PluginRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  entryPoint: string;
  scope: string;
  priceCents: number;
  isActive: boolean;
  authorId: string;
  createdAt: Date;
}

export interface PluginInstallRecord {
  id: string;
  pluginId: string;
  specId: string;
  pluginVersion: string;
  installedAt: Date;
  plugin?: {
    id: string;
    slug: string;
    name: string;
    version: string;
    scope: string;
    entryPoint: string;
    isActive: boolean;
  };
}

export interface CreatePluginInput {
  slug: string;
  name: string;
  description: string;
  version: string;
  entryPoint: string;
  scope: string;
  priceCents: number;
  authorId: string;
}

const slugRegex = /^[a-z0-9-]+$/;

export async function listActivePlugins(): Promise<PluginRecord[]> {
  return prismaAny.plugin.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  }) as Promise<PluginRecord[]>;
}

export async function listAllPlugins(): Promise<PluginRecord[]> {
  return prismaAny.plugin.findMany({
    orderBy: { createdAt: "desc" },
  }) as Promise<PluginRecord[]>;
}

export async function createPlugin(input: CreatePluginInput): Promise<PluginRecord> {
  if (!slugRegex.test(input.slug)) {
    throw new Error("Slug invalido");
  }

  const record = await prismaAny.plugin.create({
    data: {
      slug: input.slug.trim().toLowerCase(),
      name: input.name.trim(),
      description: input.description.trim(),
      version: input.version.trim(),
      entryPoint: input.entryPoint.trim(),
      scope: input.scope.trim(),
      priceCents: input.priceCents,
      isActive: false,
      authorId: input.authorId,
    },
  });

  return record as PluginRecord;
}

export async function updatePlugin(input: {
  id: string;
  name?: string;
  description?: string;
  version?: string;
  entryPoint?: string;
  scope?: string;
  priceCents?: number;
  isActive?: boolean;
}) {
  return prismaAny.plugin.update({
    where: { id: input.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.description ? { description: input.description.trim() } : {}),
      ...(input.version ? { version: input.version.trim() } : {}),
      ...(input.entryPoint ? { entryPoint: input.entryPoint.trim() } : {}),
      ...(input.scope ? { scope: input.scope.trim() } : {}),
      ...(typeof input.priceCents === "number" ? { priceCents: input.priceCents } : {}),
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
    },
  });
}

export async function getPluginsByIds(ids: string[]): Promise<PluginRecord[]> {
  if (ids.length === 0) return [];
  return prismaAny.plugin.findMany({
    where: { id: { in: ids }, isActive: true },
  }) as Promise<PluginRecord[]>;
}

export async function listInstalledPluginsForSpec(specId: string): Promise<PluginInstallRecord[]> {
  return prismaAny.pluginInstall.findMany({
    where: { specId },
    include: {
      plugin: {
        select: {
          id: true,
          slug: true,
          name: true,
          version: true,
          scope: true,
          entryPoint: true,
          isActive: true,
        },
      },
    },
    orderBy: { installedAt: "desc" },
  }) as Promise<PluginInstallRecord[]>;
}

export async function installPluginsForSpec(input: {
  specId: string;
  pluginIds: string[];
}) {
  if (input.pluginIds.length === 0) return [] as PluginInstallRecord[];

  const plugins = await getPluginsByIds(input.pluginIds);
  const existing = await prismaAny.pluginInstall.findMany({
    where: { specId: input.specId, pluginId: { in: input.pluginIds } },
  });
  const existingIds = new Set(existing.map((item: { pluginId: string }) => item.pluginId));

  const created: PluginInstallRecord[] = [];
  for (const plugin of plugins) {
    if (existingIds.has(plugin.id)) continue;
    const record = await prismaAny.pluginInstall.create({
      data: {
        specId: input.specId,
        pluginId: plugin.id,
        pluginVersion: plugin.version,
      },
      include: {
        plugin: {
          select: {
            id: true,
            slug: true,
            name: true,
            version: true,
            scope: true,
            entryPoint: true,
            isActive: true,
          },
        },
      },
    });
    created.push(record as PluginInstallRecord);
  }

  return created;
}

export function calculatePluginsTotal(plugins: PluginRecord[]) {
  return plugins.reduce((sum, plugin) => sum + plugin.priceCents, 0);
}

export async function applyPluginRevenueShare(input: {
  plugin: PluginRecord;
  paymentId: string;
}) {
  const author = await getPartnerById(input.plugin.authorId);
  if (!author) return;

  const share = Math.floor((input.plugin.priceCents * author.commissionPct) / 100);
  if (share <= 0) return;

  await prismaAny.partner.update({
    where: { id: author.id },
    data: { balanceCents: { increment: share } },
  });

  await prismaAny.partnerPayout.create({
    data: {
      partnerId: author.id,
      amountCents: share,
      status: "paid",
      paymentId: input.paymentId,
    },
  });
}
