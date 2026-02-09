"use client";

import { useEffect, useState } from "react";
import type { CatalogItem } from "@/domain/catalog/catalog";

interface PreviewResponse {
  status: "accepted" | "rejected";
  previewPath?: string;
  reason?: string;
}

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { products: CatalogItem[] };
      setCatalog(data.products);
    };

    load();
  }, []);

  const createPreview = async (itemId: string) => {
    setStatus("loading");
    setError("");

    const res = await fetch("/api/catalog/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, industry: industry || undefined }),
    });

    const data = (await res.json()) as PreviewResponse;

    if (!res.ok || data.status === "rejected" || !data.previewPath) {
      setStatus("error");
      setError(data.reason ?? "No pudimos generar el preview.");
      return;
    }

    window.location.href = data.previewPath;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Catalogo premium</p>
          <h1 className="text-3xl font-semibold">Elegi un modelo listo para vender</h1>
          <p className="text-sm text-slate-300">
            Productos cerrados con alcance, precio y entrega definidos.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <label className="block text-sm text-slate-300">Industria</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            placeholder="fintech, health, education"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
          />
          {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
        </section>

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
              <div className="mt-6 text-3xl font-semibold">${item.price}</div>
              <button
                className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
                onClick={() => createPreview(item.id)}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Generando..." : "Generar preview"}
              </button>
            </div>
          ))}
          {catalog.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
              No hay productos activos.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
