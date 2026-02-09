"use client";

import { useState } from "react";

export function ApiKeyCreateForm() {
  const [payload, setPayload] = useState(`{
  "name": "Integracion CRM",
  "partnerId": null,
  "rateLimit": 1000
}`);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const submit = async () => {
    setStatus("loading");
    setError("");
    setCreatedKey(null);

    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>;
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = (await res.json()) as { status: string; reason?: string; key?: { key: string } };

      if (!res.ok || data.status === "rejected") {
        setStatus("error");
        setError(data.reason ?? "No se pudo crear la API key.");
        return;
      }

      setStatus("done");
      setCreatedKey(data.key?.key ?? null);
    } catch {
      setStatus("error");
      setError("JSON invalido.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h2 className="text-lg font-semibold">Crear API key</h2>
      <p className="mt-2 text-slate-400">Guardá la key apenas se crea.</p>
      <textarea
        className="mt-4 min-h-[200px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200"
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
      />
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      {status === "done" && (
        <p className="mt-3 text-xs text-emerald-300">
          API key creada: {createdKey ?? "(no disponible)"}
        </p>
      )}
      <button
        className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Creando..." : "Crear API key"}
      </button>
    </div>
  );
}
