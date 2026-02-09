"use client";

import { useEffect, useState } from "react";
import type { CatalogItem } from "@/domain/catalog/catalog";
import type { ProductSpec } from "@/domain/product-spec";

interface InterpretResponse {
  status: "accepted" | "reformulated" | "rejected";
  reason?: string;
  spec?: ProductSpec;
  previewPath?: string;
}

interface PartnerBrand {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  slug: string;
}

interface HomePageProps {
  partner?: PartnerBrand | null;
}

interface TemplateItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceUSD: number;
  tier: string;
}

export function HomePage({ partner }: HomePageProps) {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [industry, setIndustry] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [intelligentText, setIntelligentText] = useState<string>("");
  const [intelligentIndustry, setIntelligentIndustry] = useState<string>("");
  const [response, setResponse] = useState<InterpretResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadCatalog = async () => {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { products: CatalogItem[] };
      setCatalog(data.products);
    };

    const loadTemplates = async () => {
      const query = partner?.slug ? `?partnerSlug=${partner.slug}` : "";
      const res = await fetch(`/api/templates${query}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { templates: TemplateItem[] };
      setTemplates(data.templates);
    };

    loadCatalog();
    loadTemplates();
  }, [partner]);

  const submitCatalog = async (itemId: string) => {
    if (!itemId) return;
    setLoading(true);
    setResponse(null);

    const res = await fetch("/api/catalog/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        industry: industry || undefined,
        partnerSlug: partner?.slug,
      }),
    });

    const data = (await res.json()) as InterpretResponse;
    setResponse(data);
    setLoading(false);
  };

  const submitIntelligent = async () => {
    if (!intelligentText.trim()) return;
    setLoading(true);
    setResponse(null);

    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "intelligent-request",
        payload: {
          text: intelligentText,
          industry: intelligentIndustry || undefined,
        },
        partnerSlug: partner?.slug,
      }),
    });

    const data = (await res.json()) as InterpretResponse;
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="space-y-4">
          {partner ? (
            <div className="flex items-center gap-3">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="h-8" />
              ) : (
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {partner.name}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Digital Product Factory
            </p>
          )}
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            MVP operativo: catálogo premium + pedido inteligente
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            Genera una ProductSpec normalizada y un preview determinístico en minutos.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
              href="/catalog"
            >
              Ver catalogo
            </a>
            <a
              className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200"
              href="/marketplace"
            >
              Ver templates
            </a>
          </div>
        </header>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold">Catálogo premium</h2>
            <p className="mt-2 text-sm text-slate-400">
              Elegí un producto cerrado con alcance, precio y entrega definidos.
            </p>
            <div className="mt-6">
              <label className="block text-sm text-slate-300">Industria</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
                placeholder="fintech, health, education"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {catalog.map((item) => (
              <div
                key={item.id}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.tier}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {item.deliveryTime}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                <div className="mt-6 space-y-2 text-sm text-slate-200">
                  {item.includes.map((value) => (
                    <p key={value}>• {value}</p>
                  ))}
                </div>
                <div
                  className="mt-6 text-3xl font-semibold"
                  style={{ color: partner?.primaryColor ?? "#ffffff" }}
                >
                  ${item.price}
                </div>
                <button
                  className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  onClick={() => submitCatalog(item.id)}
                  disabled={loading}
                >
                  {loading ? "Generando..." : "Generar preview"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <header className="space-y-2">
            <h2 className="text-lg font-semibold">Elegí un modelo probado</h2>
            <p className="text-sm text-slate-400">
              Seleccioná un template listo para vender y avanzá sin escribir nada.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {template.category}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {template.tier}
                  </span>
                </div>
                <div className="mt-4 h-28 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950" />
                <h3 className="mt-4 text-lg font-semibold">{template.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{template.description}</p>
                <div className="mt-4 text-2xl font-semibold">${template.priceUSD}</div>
                <a
                  className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                  href={`/template-preview/${template.slug}`}
                >
                  Usar este modelo
                </a>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
                No hay templates activos por ahora.
              </div>
            )}
          </div>
        </section>

        <section id="intelligent-request" className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pedido inteligente (premium)</h2>
              <p className="mt-2 text-sm text-slate-400">
                ¿Necesitás algo más específico? El sistema ajusta el alcance y decide.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
              Upgrade
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">Pedido</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
              placeholder="Necesito una landing para captar leads en fintech..."
              value={intelligentText}
              onChange={(event) => setIntelligentText(event.target.value)}
            />
            <label className="block text-sm text-slate-300">Industria (opcional)</label>
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
              placeholder="fintech, health, education"
              value={intelligentIndustry}
              onChange={(event) => setIntelligentIndustry(event.target.value)}
            />
            <button
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              onClick={submitIntelligent}
              disabled={loading}
            >
              {loading ? "Interpretando..." : "Pedido inteligente"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold">Resultado</h3>
          {!response && (
            <p className="mt-2 text-sm text-slate-400">
              Ejecuta un flujo para ver la ProductSpec y el preview.
            </p>
          )}
          {response && (
            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-wide">
                  {response.status}
                </span>
                {response.reason && <span className="text-slate-400">{response.reason}</span>}
              </div>
              {response.previewPath && (
                <p className="text-slate-300">Preview: {response.previewPath}</p>
              )}
              {response.spec && (
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
                  {JSON.stringify(response.spec, null, 2)}
                </pre>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
