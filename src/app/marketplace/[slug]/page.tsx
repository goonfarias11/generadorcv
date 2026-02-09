import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicTemplateBySlug, type MarketplaceTemplate } from "@/services/marketplace.service";
import { TemplatePreviewActions } from "@/modules/templates/TemplatePreviewActions";

interface MarketplaceTemplateProps {
  params: Promise<{ slug: string }>;
}

export default async function MarketplaceTemplatePage({ params }: MarketplaceTemplateProps) {
  const { slug } = await params;
  const template: MarketplaceTemplate | null = await getPublicTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Template</p>
            <h1 className="mt-3 text-4xl font-semibold">{template.name}</h1>
            <p className="mt-3 text-lg text-slate-300">{template.shortTagline}</p>
            <p className="mt-3 text-sm text-slate-400">{template.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {template.useCases.map((useCase) => (
                <span key={useCase} className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300">
                  {useCase}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Precio</div>
            <div className="mt-3 text-4xl font-semibold">${template.priceUSD}</div>
            <p className="mt-3 text-xs text-slate-400">Entrega estimada en 5-8 dias.</p>
            {template.partner && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
                <p className="uppercase tracking-[0.3em] text-slate-500">Partner</p>
                <p className="mt-2 text-sm font-semibold">{template.partner.name}</p>
                <p className="text-xs text-slate-500">@{template.partner.slug}</p>
              </div>
            )}
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preview visual</p>
              <div className="mt-4 h-48 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                {template.coverImage && (
                  <img
                    src={template.coverImage}
                    alt={template.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Detalles</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>Categoria: {template.category}</li>
                <li>Tier: {template.tier}</li>
                <li>Popularidad: {template.popularity}</li>
              </ul>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/template-preview/${template.slug}`}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-center text-xs"
                >
                  Preview en vivo
                </Link>
                <Link
                  href="/marketplace"
                  className="rounded-xl border border-slate-800 px-4 py-2 text-center text-xs text-slate-400"
                >
                  Volver al marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TemplatePreviewActions slug={template.slug} />
      </div>
    </main>
  );
}
