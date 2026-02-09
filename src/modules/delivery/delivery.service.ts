import fs from "fs";
import path from "path";
import archiver from "archiver";
import type { ProductSpec } from "@/domain/product-spec";
import type { ProductSpecRecord } from "@/services/productSpecService";
import { buildLandingView } from "@/modules/landing/landing-builder";
import { runPluginHook } from "@/services/pluginEngine.service";

const ensureDir = async (dirPath: string) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

const buildHtml = (spec: ProductSpec, addOnTypes: string[], htmlAppend?: string) => {
  const model = buildLandingView(spec);

  const sections = model.sections
    .map((section) => {
      switch (section.type) {
        case "hero":
          return `
            <section class="section hero">
              <h1>${section.data.headline}</h1>
              <p class="lead">${section.data.subheadline}</p>
              ${addOnTypes.includes("copy") ? `<p class="lead">Mensajes extendidos y CTA secundario incluido.</p>` : ""}
              <button class="btn">${section.data.cta}</button>
            </section>
          `;
        case "benefits":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <ul class="grid">
                ${section.data.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </section>
          `;
        case "features":
          return `
            <section class="section">
              <div class="section-head">
                <h2>${section.data.title}</h2>
                <p class="muted">${section.data.highlight}</p>
              </div>
              <ul class="grid">
                ${section.data.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </section>
          `;
        case "pricing":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <div class="pricing">
                <div>
                  <p class="eyebrow">${section.data.priceLabel}</p>
                  <p class="price">$${section.data.price}</p>
                  <p class="muted">Entrega estimada: ${section.data.deliveryTime}</p>
                </div>
                <ul>
                  ${section.data.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
            </section>
          `;
        case "cta":
          return `
            <section class="section cta">
              <h2>${section.data.title}</h2>
              <p>${section.data.subtitle}</p>
              <button class="btn">${section.data.button}</button>
              ${addOnTypes.includes("copy") ? `<p class="muted">CTA mejorado con copy premium.</p>` : ""}
            </section>
          `;
        case "problem":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <p>${section.data.description}</p>
            </section>
          `;
        case "solution":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <p>${section.data.description}</p>
            </section>
          `;
        case "social-proof":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <div class="grid">
                ${section.data.items
                  .map(
                    (item) => `
                  <div class="card">
                    <p>“${item.quote}”</p>
                    <span>${item.name} · ${item.role}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
          `;
        case "faq":
          return `
            <section class="section">
              <h2>${section.data.title}</h2>
              <div class="stack">
                ${section.data.items
                  .map(
                    (item) => `
                  <div class="card">
                    <h3>${item.question}</h3>
                    <p>${item.answer}</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
          `;
        case "footer":
          return `
            <footer class="footer">
              <span>Entrega premium · Proyecto listo para publicar</span>
            </footer>
          `;
        default:
          return "";
      }
    })
    .join("");

  const analyticsSnippet = addOnTypes.includes("analytics")
    ? `<!-- Analytics -->\n<script>window.__analytics = true;</script>`
    : "";

  const seoMeta = addOnTypes.includes("seo")
    ? `\n    <meta name="description" content="Landing optimizada para conversiones" />\n    <meta name="robots" content="index,follow" />`
    : "";

  const insertAppend = htmlAppend?.trim()
    ? `\n    ${htmlAppend.trim().replace(/\n/g, "\n    ")}`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${spec.productType} · ${spec.objective}</title>
    ${seoMeta}
    <link rel="stylesheet" href="../styles/main.css" />
  </head>
  <body>
    <main class="container">
      ${sections}
    </main>
    ${analyticsSnippet}${insertAppend}
  </body>
</html>`;
};

const buildStyles = () => `*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:#020617;color:#f8fafc}h1,h2,h3{margin:0 0 12px}p{margin:0 0 12px}ul{margin:0;padding:0;list-style:none}button{cursor:pointer}.container{max-width:1100px;margin:0 auto;padding:48px 24px}.section{padding:48px 0;border-bottom:1px solid #1e293b}.section:last-child{border-bottom:none}.hero h1{font-size:40px}.lead{max-width:640px;color:#94a3b8}.eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#94a3b8}.btn{background:#f8fafc;color:#0f172a;border:none;padding:12px 24px;border-radius:999px;font-weight:600}.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.card{padding:16px;border:1px solid #1e293b;border-radius:16px;background:#0f172a}.pricing{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));align-items:start}.price{font-size:32px;font-weight:600}.cta{text-align:center;background:#0f172a;border-radius:24px;padding:32px}.cta p{color:#94a3b8}.stack{display:grid;gap:12px}.footer{display:flex;justify-content:space-between;gap:12px;color:#94a3b8;font-size:14px;padding:24px 0}`;

const buildReadme = (
  spec: ProductSpec,
  aiOutputsCount: number,
  pluginNotes: string[]
) => `# Entrega del proyecto\n\nProyecto generado automáticamente desde ProductSpec.\n\n## Qué incluye\n- Landing premium basada en objetivo: ${spec.objective}\n- Tipo de producto: ${spec.productType}\n- Diseño consistente y secciones definidas${
  aiOutputsCount > 0 ? `\n- Entregables AI: ${aiOutputsCount} archivo(s)` : ""
}${pluginNotes.length > 0 ? `\n- Plugins activos: ${pluginNotes.length}` : ""}\n\n## Cómo correrlo\n1. Abrí la carpeta \`src\`\n2. Ejecutá un servidor estático (por ejemplo, \`npx serve\` o \`python -m http.server\`)\n3. Abrí \`src/index.html\`\n\n## Próximos pasos\n- Revisión de copy\n- Ajustes de marca\n- Deploy final${
  pluginNotes.length > 0 ? `\n\n## Notas de plugins\n${pluginNotes.map((note) => `- ${note}`).join("\n")}` : ""
}\n`;

export interface DeliveryResult {
  zipPath: string;
}

export async function generateDelivery(
  spec: ProductSpecRecord
): Promise<DeliveryResult> {
  const addOnTypes = spec.addOns?.map((addOn) => addOn.type) ?? [];
  const baseSpec: ProductSpec = {
    ...spec,
    addOns: spec.addOns?.map((addOn) => addOn.id),
  };
  const baseDir = path.join(process.cwd(), "deliveries", spec.id);
  const srcDir = path.join(baseDir, "src");
  const stylesDir = path.join(baseDir, "styles");
  const componentsDir = path.join(baseDir, "components");
  const blogDir = path.join(baseDir, "blog");
  const aiDir = path.join(baseDir, "ai");
  const pluginsDir = path.join(baseDir, "plugins");
  const aiOutputs = spec.aiOutputs ?? [];

  const preBuild = await runPluginHook({ hook: "pre-build", spec });
  const postBuild = await runPluginHook({ hook: "post-build", spec });
  const pluginNotes = [
    ...(preBuild.readmeNotes ?? []),
    ...(postBuild.readmeNotes ?? []),
  ];
  const htmlAppend = [preBuild.htmlAppend, postBuild.htmlAppend]
    .filter(Boolean)
    .join("\n");

  await ensureDir(srcDir);
  await ensureDir(stylesDir);
  await ensureDir(componentsDir);
  if (addOnTypes.includes("blog")) {
    await ensureDir(blogDir);
  }
  if (aiOutputs.length > 0) {
    await ensureDir(aiDir);
  }
  if ((preBuild.files?.length ?? 0) > 0 || (postBuild.files?.length ?? 0) > 0) {
    await ensureDir(pluginsDir);
  }

  await fs.promises.writeFile(
    path.join(srcDir, "index.html"),
    buildHtml(baseSpec, addOnTypes, htmlAppend),
    "utf-8"
  );
  await fs.promises.writeFile(path.join(stylesDir, "main.css"), buildStyles(), "utf-8");
  await fs.promises.writeFile(
    path.join(componentsDir, "sections.md"),
    "Secciones generadas según ProductSpec.\n",
    "utf-8"
  );
  await fs.promises.writeFile(
    path.join(baseDir, "README.md"),
    buildReadme(baseSpec, aiOutputs.length, pluginNotes),
    "utf-8"
  );

  const pluginFiles = [...(preBuild.files ?? []), ...(postBuild.files ?? [])];
  if (pluginFiles.length > 0) {
    for (const file of pluginFiles) {
      const targetPath = path.join(baseDir, file.path);
      await ensureDir(path.dirname(targetPath));
      await fs.promises.writeFile(targetPath, file.content, "utf-8");
    }
  }

  if (aiOutputs.length > 0) {
    for (const output of aiOutputs) {
      const slug = output.service?.slug ?? output.id;
      const content = output.output ?? "Salida AI pendiente.";
      await fs.promises.writeFile(
        path.join(aiDir, `${slug}.md`),
        content,
        "utf-8"
      );
    }
  }

  if (addOnTypes.includes("seo")) {
    await fs.promises.writeFile(
      path.join(baseDir, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc></url>\n</urlset>`,
      "utf-8"
    );
    await fs.promises.writeFile(
      path.join(baseDir, "robots.txt"),
      "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml",
      "utf-8"
    );
  }

  if (addOnTypes.includes("blog")) {
    await fs.promises.writeFile(
      path.join(blogDir, "index.html"),
      "<h1>Blog</h1><p>Contenido inicial del blog.</p>",
      "utf-8"
    );
    await fs.promises.writeFile(
      path.join(blogDir, "post-1.html"),
      "<h1>Post 1</h1><p>Artículo inicial.</p>",
      "utf-8"
    );
  }

  if (addOnTypes.includes("integration")) {
    await fs.promises.writeFile(
      path.join(baseDir, "integrations.md"),
      "Integraciones disponibles: CRM, Webhooks, Analytics.\n",
      "utf-8"
    );
  }

  const zipDir = path.join(process.cwd(), "deliveries");
  await ensureDir(zipDir);
  const zipPath = path.join(zipDir, `${spec.id}.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err: Error) => reject(err));

    archive.pipe(output);
    archive.directory(baseDir, false);
    archive.finalize();
  });

  return { zipPath };
}
