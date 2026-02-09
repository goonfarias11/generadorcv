import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/services/templateService";
import { TemplatePreviewActions } from "@/modules/templates/TemplatePreviewActions";
import { getPartnerBySlug } from "@/services/partnerService";

interface TemplatePreviewProps {
  params: Promise<{ slug: string }>;
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template || !template.isActive || !template.isPublic) {
    notFound();
  }

  const partner = template.partnerSlug ? await getPartnerBySlug(template.partnerSlug) : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-4">
          {partner && (
            <div className="flex items-center gap-3">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="h-8" />
              ) : (
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {partner.name}
                </p>
              )}
            </div>
          )}
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Template</p>
          <h1 className="text-3xl font-semibold">{template.name}</h1>
          <p className="text-lg text-slate-300">{template.shortTagline}</p>
          <p className="text-sm text-slate-400">{template.description}</p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ideal para</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {template.useCases.map((useCase) => (
                  <span key={useCase} className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Qué incluye</p>
              <ul className="mt-3 space-y-2">
                <li>Copy orientado a conversion</li>
                <li>Secciones enfocadas en ventas</li>
                <li>Diseno consistente premium</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entrega</p>
              <p className="mt-2">5 a 8 días según alcance</p>
            </div>
            <div className="text-3xl font-semibold">${template.priceUSD}</div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Dominio propio disponible como upgrade premium.
          </p>
        </section>

        <TemplatePreviewActions slug={template.slug} />
      </div>
    </main>
  );
}
