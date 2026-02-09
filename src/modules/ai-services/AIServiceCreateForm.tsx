"use client";

import { useState } from "react";

export function AIServiceCreateForm() {
  const [payload, setPayload] = useState(`{
  "slug": "copy-starter",
  "name": "AI Copy Starter",
  "description": "Headline y CTA sugeridos para la landing.",
  "priceCents": 2900
}`);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async () => {
    setStatus("loading");
    setError("");

    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>;
      const res = await fetch("/api/ai-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = (await res.json()) as { status: string; reason?: string };

      if (!res.ok || data.status === "rejected") {
        setStatus("error");
        setError(data.reason ?? "No se pudo crear el servicio AI.");
        return;
      }

      setStatus("done");
    } catch {
      setStatus("error");
      setError("JSON invalido.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h2 className="text-lg font-semibold">Crear servicio AI</h2>
      <p className="mt-2 text-slate-400">Cargá el JSON y publicá el servicio.</p>
      <textarea
        className="mt-4 min-h-[220px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200"
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
      />
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      {status === "done" && <p className="mt-3 text-xs text-emerald-300">Servicio creado.</p>}
      <button
        className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Creando..." : "Crear servicio"}
      </button>
    </div>
  );
}
