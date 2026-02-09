"use client";

import { useState } from "react";

interface AgencyBillingFormProps {
  agencyId: string;
}

export function AgencyBillingForm({ agencyId }: AgencyBillingFormProps) {
  const [payload, setPayload] = useState(`{
  "actorId": "",
  "planId": "",
  "status": "active",
  "currentPeriodEnd": null,
  "cancelAtPeriodEnd": false
}`);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async () => {
    setStatus("loading");
    setError("");

    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>;
      const res = await fetch(`/api/agencies/${agencyId}/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = (await res.json()) as { status: string; reason?: string };
      if (!res.ok || data.status === "rejected") {
        setStatus("error");
        setError(data.reason ?? "No se pudo actualizar el billing.");
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
      <h2 className="text-lg font-semibold">Billing agencia</h2>
      <p className="mt-2 text-slate-400">Configurá plan enterprise y status.</p>
      <textarea
        className="mt-4 min-h-[200px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200"
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
      />
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      {status === "done" && <p className="mt-3 text-xs text-emerald-300">Billing actualizado.</p>}
      <button
        className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Guardando..." : "Guardar billing"}
      </button>
    </div>
  );
}
