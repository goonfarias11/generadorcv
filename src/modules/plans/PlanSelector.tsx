"use client";

import { useState } from "react";

interface PlanItem {
  id: string;
  name: string;
  priceCents: number;
  interval: string;
  features: string[];
}

interface PlanSelectorProps {
  specId: string;
  currentPlanId?: string | null;
  planStatus?: string | null;
  planExpiresAt?: string | null;
  plans: PlanItem[];
}

interface SubscribeResponse {
  status: "accepted" | "rejected";
  checkoutUrl?: string;
  reason?: string;
}

interface CancelResponse {
  status: "accepted" | "rejected";
  reason?: string;
}

export function PlanSelector({
  specId,
  currentPlanId,
  planStatus,
  planExpiresAt,
  plans,
}: PlanSelectorProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const subscribe = async (planId: string) => {
    setStatus("loading");
    setError("");

    const res = await fetch("/api/client/plans/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId, planId }),
    });

    const data = (await res.json()) as SubscribeResponse;

    if (!res.ok || data.status === "rejected" || !data.checkoutUrl) {
      setStatus("error");
      setError(data.reason ?? "No pudimos iniciar la suscripcion.");
      return;
    }

    window.location.href = data.checkoutUrl;
  };

  const cancel = async () => {
    setStatus("loading");
    setError("");

    const res = await fetch("/api/client/plans/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId }),
    });

    const data = (await res.json()) as CancelResponse;

    if (!res.ok || data.status === "rejected") {
      setStatus("error");
      setError(data.reason ?? "No pudimos cancelar la suscripcion.");
      return;
    }

    setStatus("idle");
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h2 className="text-lg font-semibold">Plan mensual</h2>
      <p className="mt-2 text-slate-400">Activá hosting y soporte continuo.</p>
      {planStatus && (
        <p className="mt-3 text-xs text-slate-400">
          Estado: {planStatus}
          {planExpiresAt ? ` · Vence ${new Date(planExpiresAt).toLocaleDateString("es-AR")}` : ""}
        </p>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{plan.name}</p>
              <span className="text-xs text-slate-400">${(plan.priceCents / 100).toFixed(2)}/{plan.interval}</span>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button
              className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-950"
              onClick={() => subscribe(plan.id)}
              disabled={status === "loading" || currentPlanId === plan.id}
            >
              {currentPlanId === plan.id ? "Plan actual" : "Activar plan"}
            </button>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
            No hay planes activos disponibles.
          </div>
        )}
      </div>

      {planStatus === "active" && currentPlanId && (
        <button
          className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-200"
          onClick={cancel}
          disabled={status === "loading"}
        >
          Cancelar plan
        </button>
      )}

      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
    </section>
  );
}
