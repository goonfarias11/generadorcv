"use client";

import { useState } from "react";

interface PartnerConnectCardProps {
  partnerId: string;
  stripeAccountId?: string | null;
  payoutsEnabled: boolean;
}

interface ConnectResponse {
  status: "accepted" | "rejected";
  url?: string;
  reason?: string;
}

export function PartnerConnectCard({
  partnerId,
  stripeAccountId,
  payoutsEnabled,
}: PartnerConnectCardProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const startOnboarding = async () => {
    setStatus("loading");
    setError("");

    const res = await fetch(`/api/partners/${partnerId}/connect`, { method: "POST" });
    const data = (await res.json()) as ConnectResponse;

    if (!res.ok || data.status === "rejected" || !data.url) {
      setStatus("error");
      setError(data.reason ?? "No pudimos iniciar el onboarding.");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h2 className="text-lg font-semibold">Stripe Connect</h2>
      <p className="mt-2 text-slate-400">
        {payoutsEnabled
          ? "Cuenta conectada y payouts activos."
          : "Conecta tu cuenta para recibir pagos automaticos."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
        <span>Cuenta: {stripeAccountId ?? "sin conectar"}</span>
        <span>Estado: {payoutsEnabled ? "activa" : "pendiente"}</span>
      </div>
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      <button
        className="mt-4 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-950"
        onClick={startOnboarding}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Abriendo..." : "Conectar Stripe"}
      </button>
    </section>
  );
}
