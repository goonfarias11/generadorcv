"use client";

import { useState } from "react";

interface TemplatePreviewActionsProps {
  slug: string;
}

interface CreateSpecResponse {
  status: "accepted" | "rejected";
  previewPath?: string;
  id?: string;
  reason?: string;
}

interface CheckoutResponse {
  status: "accepted" | "rejected";
  checkoutUrl?: string;
  reason?: string;
}

export function TemplatePreviewActions({ slug }: TemplatePreviewActionsProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const createSpec = async () => {
    setStatus("loading");
    setError("");

    const res = await fetch(`/api/templates/${slug}/create-spec`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "preview" }),
    });

    const data = (await res.json()) as CreateSpecResponse;

    if (!res.ok || data.status === "rejected" || !data.previewPath) {
      setStatus("error");
      setError(data.reason ?? "No pudimos crear el preview.");
      return;
    }

    window.location.href = data.previewPath;
  };

  const buyNow = async () => {
    setStatus("loading");
    setError("");

    if (!email.trim()) {
      setStatus("error");
      setError("Ingresá un email válido para continuar.");
      return;
    }

    const res = await fetch(`/api/templates/${slug}/create-spec`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "purchase" }),
    });

    const data = (await res.json()) as CreateSpecResponse;

    if (!res.ok || data.status === "rejected" || !data.id) {
      setStatus("error");
      setError(data.reason ?? "No pudimos iniciar el checkout.");
      return;
    }

    const checkoutRes = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId: data.id, email }),
    });

    const checkoutData = (await checkoutRes.json()) as CheckoutResponse;

    if (!checkoutRes.ok || checkoutData.status === "rejected" || !checkoutData.checkoutUrl) {
      setStatus("error");
      setError(checkoutData.reason ?? "No pudimos iniciar el checkout.");
      return;
    }

    window.location.href = checkoutData.checkoutUrl;
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
        placeholder="tu@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        required
      />
      <div className="flex flex-col gap-3 md:flex-row">
      <button
        className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
        onClick={createSpec}
        disabled={status === "loading"}
      >
        Ver preview
      </button>
      <button
        className="rounded-xl border border-slate-700 px-4 py-3 text-center text-sm text-slate-200"
        onClick={buyNow}
        disabled={status === "loading"}
      >
        Comprar ahora
      </button>
      </div>
      {status === "error" && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}
