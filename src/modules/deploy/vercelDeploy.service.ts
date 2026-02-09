import fs from "fs";
import path from "path";
import type { ProductSpecRecord } from "@/services/productSpecService";
import { runPluginHook } from "@/services/pluginEngine.service";

interface VercelDeploymentResponse {
  url?: string;
  error?: { message?: string };
}

const vercelApiUrl = "https://api.vercel.com/v13/deployments";

const collectFiles = async (rootDir: string) => {
  const entries: { file: string; data: string }[] = [];

  const walk = async (currentDir: string) => {
    const files = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        await walk(fullPath);
      } else {
        const relative = path.relative(rootDir, fullPath).replace(/\\/g, "/");
        const content = await fs.promises.readFile(fullPath, "utf-8");
        entries.push({ file: relative, data: content });
      }
    }
  };

  await walk(rootDir);
  return entries;
};

const buildDeploymentFiles = async (baseDir: string) => {
  const srcDir = path.join(baseDir, "src");
  const stylesDir = path.join(baseDir, "styles");

  const indexPath = path.join(srcDir, "index.html");
  const indexHtml = await fs.promises.readFile(indexPath, "utf-8");
  const adjustedHtml = indexHtml.replace(/\.\.\/styles\//g, "styles/");

  const stylePath = path.join(stylesDir, "main.css");
  const styleContent = await fs.promises.readFile(stylePath, "utf-8");

  return [
    { file: "index.html", data: adjustedHtml },
    { file: "styles/main.css", data: styleContent },
  ];
};

export interface DeployResult {
  url: string;
}

export async function deployToVercel(spec: ProductSpecRecord): Promise<DeployResult> {
  const token = process.env.VERCEL_TOKEN ?? "";
  const teamId = process.env.VERCEL_TEAM_ID ?? "";

  if (!token) {
    throw new Error("Vercel no configurado");
  }

  const baseDir = path.join(process.cwd(), "deliveries", spec.id);
  if (!fs.existsSync(baseDir)) {
    throw new Error("Entrega no encontrada");
  }

  const preDeploy = await runPluginHook({ hook: "pre-deploy", spec });
  if (preDeploy.htmlAppend) {
    const indexPath = path.join(baseDir, "src", "index.html");
    if (fs.existsSync(indexPath)) {
      const current = await fs.promises.readFile(indexPath, "utf-8");
      const updated = current.replace(
        "</body>",
        `\n${preDeploy.htmlAppend}\n</body>`
      );
      await fs.promises.writeFile(indexPath, updated, "utf-8");
    }
  }

  if (preDeploy.files && preDeploy.files.length > 0) {
    for (const file of preDeploy.files) {
      const targetPath = path.join(baseDir, file.path);
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.promises.writeFile(targetPath, file.content, "utf-8");
    }
  }

  const files = await buildDeploymentFiles(baseDir);

  const body = {
    name: `dpf-${spec.id}`,
    files,
    projectSettings: {
      framework: null,
    },
    target: "production",
    ...(teamId ? { teamId } : {}),
  };

  const res = await fetch(vercelApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as VercelDeploymentResponse;

  if (!res.ok || !data.url) {
    throw new Error(data.error?.message ?? "Error de deploy");
  }

  return { url: `https://${data.url}` };
}
