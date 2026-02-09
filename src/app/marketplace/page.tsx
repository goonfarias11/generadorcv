import Link from "next/link";
import { listPublicTemplates, type MarketplaceTemplate } from "@/services/marketplace.service";

interface MarketplacePageProps {
  searchParams?: {
    category?: string;
    partner?: string;
    useCase?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "popular" | "price-asc" | "price-desc" | "new";
  };
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const templates: MarketplaceTemplate[] = await listPublicTemplates({
    category: searchParams?.category,
    partnerSlug: searchParams?.partner,
    useCase: searchParams?.useCase,
    minPrice: searchParams?.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: searchParams?.sort,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Marketplace</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Templates listos para vender</h1>
            <p className="mt-4 text-sm text-slate-400">
              Elegi un modelo, ajustalo y lanzalo en minutos. Curado para
              conversiones y listo para escalar.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-xs text-slate-300">
            <p className="uppercase tracking-[0.4em] text-slate-500">Explora</p>
            <p className="mt-3 text-lg font-semibold">{templates.length} templates publicos</p>
            <p className="mt-2 text-slate-400">Filtra por industria, precio o partner.</p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-xs text-slate-200" method="get">
            <div>
              <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Categoria</label>
              <input
                name="category"
                defaultValue={searchParams?.category}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                placeholder="b2b, retail"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Use case</label>
              <input
                name="useCase"
                defaultValue={searchParams?.useCase}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                placeholder="saas, coaching"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Partner</label>
              <input
                name="partner"
                defaultValue={searchParams?.partner}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                placeholder="studio-alpha"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Min</label>
                <input
                  name="minPrice"
                  defaultValue={searchParams?.minPrice}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                  placeholder="99"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Max</label>
                <input
                  name="maxPrice"
                  defaultValue={searchParams?.maxPrice}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
                  placeholder="399"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Orden</label>
              <select
                name="sort"
                defaultValue={searchParams?.sort ?? "popular"}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2"
              >
                <option value="popular">Popularidad</option>
                <option value="price-asc">Precio ascendente</option>
                <option value="price-desc">Precio descendente</option>
                <option value="new">Mas nuevos</option>
              </select>
            </div>
            <button className="w-full rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-950">
              Aplicar filtros
            </button>
          </form>

          <div className="grid gap-6 md:grid-cols-2">
            {templates.map((template) => (
              <div key={template.id} className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="h-36 rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                  {template.coverImage && (
                    <img
                      src={template.coverImage}
                      alt={template.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{template.category}</span>
                  <span>${template.priceUSD}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">{template.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{template.shortTagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.useCases.map((useCase) => (
                    <span key={useCase} className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300">
                      {useCase}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/marketplace/${template.slug}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-950"
                >
                  Ver modelo
                </Link>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                No hay templates publicos con esos filtros.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
