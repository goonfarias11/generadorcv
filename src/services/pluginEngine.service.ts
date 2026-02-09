import type { ProductSpecRecord } from "@/services/productSpecService";
import { listInstalledPluginsForSpec } from "@/services/pluginService";

export type PluginHook = "pre-build" | "post-build" | "pre-deploy";

export type PluginRunResult = {
  htmlAppend?: string;
  readmeNotes?: string[];
  files?: { path: string; content: string }[];
};

export type PluginContext = {
  spec: ProductSpecRecord;
  hook: PluginHook;
};

type PluginRunner = (context: PluginContext) => Promise<PluginRunResult> | PluginRunResult;

const hookScopes: Record<PluginHook, string[]> = {
  "pre-build": ["build", "content"],
  "post-build": ["build", "seo", "analytics", "content"],
  "pre-deploy": ["build", "seo", "analytics"],
};

const executionTimeoutMs = 800;

const pluginRegistry: Record<string, PluginRunner> = {
  "seo-keywords": ({ spec }) => ({
    readmeNotes: ["Plugin SEO keywords aplicado."],
    files: [
      {
        path: "plugins/seo-keywords.md",
        content: `# SEO Keywords\n\nProducto: ${spec.productType}\nObjetivo: ${spec.objective}\n`,
      },
    ],
  }),
  "analytics-script": () => ({
    htmlAppend: "<!-- Plugin Analytics -->\n<script>window.__pluginAnalytics = true;</script>",
    readmeNotes: ["Plugin de analytics insertado."],
  }),
};

async function runWithTimeout<T>(fn: () => Promise<T> | T): Promise<T> {
  const result = await Promise.race([
    Promise.resolve().then(fn),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Plugin timeout")), executionTimeoutMs)
    ),
  ]);

  return result;
}

export async function runPluginHook(input: {
  hook: PluginHook;
  spec: ProductSpecRecord;
}) {
  const installs = await listInstalledPluginsForSpec(input.spec.id);
  const allowedScopes = hookScopes[input.hook];

  const aggregated: PluginRunResult = {
    readmeNotes: [],
    files: [],
    htmlAppend: "",
  };

  for (const install of installs) {
    const plugin = install.plugin;
    if (!plugin) continue;
    if (!plugin.isActive) continue;
    if (!allowedScopes.includes(plugin.scope)) continue;

    const runner = pluginRegistry[plugin.entryPoint];
    if (!runner) continue;

    try {
      const result = await runWithTimeout(() => runner({ spec: input.spec, hook: input.hook }));
      if (result.readmeNotes) {
        aggregated.readmeNotes?.push(...result.readmeNotes);
      }
      if (result.files) {
        aggregated.files?.push(...result.files);
      }
      if (result.htmlAppend) {
        aggregated.htmlAppend = `${aggregated.htmlAppend}\n${result.htmlAppend}`.trim();
      }
    } catch {
      continue;
    }
  }

  return aggregated;
}
