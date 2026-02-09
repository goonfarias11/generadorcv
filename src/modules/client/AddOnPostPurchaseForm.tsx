"use client";

import { useMemo, useState } from "react";

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  type: string;
}

interface AddOnPostPurchaseFormProps {
  specId: string;
  addOns: AddOnItem[];
  existingAddOnIds: string[];
}

interface CheckoutResponse {
  status: "accepted" | "rejected";
  checkoutUrl?: string;
  reason?: string;
}

export function AddOnPostPurchaseForm({
  specId,
  addOns,
  existingAddOnIds,
}: AddOnPostPurchaseFormProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const available = useMemo(
    () => addOns.filter((addOn) => !existingAddOnIds.includes(addOn.id)),
    [addOns, existingAddOnIds]
  );

  const total = useMemo(
    () =>
      available
        .filter((addOn) => selected.includes(addOn.id))
        .reduce((sum, addOn) => sum + addOn.priceCents, 0),
    [available, selected]
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    setStatus("loading");
    setError("");

    if (selected.length === 0) {
      setStatus("error");
      setError("Seleccioná al menos un add-on.");
      return;
    }

    const res = await fetch("/api/client/checkout/addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId, addOnIds: selected }),
    });

    const data = (await res.json()) as CheckoutResponse;

    if (!res.ok || data.status === "rejected" || !data.checkoutUrl) {
      setStatus("error");
      setError(data.reason ?? "No pudimos iniciar el checkout.");
      return;
    }

    window.location.href = data.checkoutUrl;
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
      <h2 className="text-lg font-semibold">Agregar mejoras</h2>
      <p className="mt-2 text-slate-400">Sumá add-ons post-venta para mejorar tu entrega.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {available.map((addOn) => (
          <label
            key={addOn.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={selected.includes(addOn.id)}
              onChange={() => toggle(addOn.id)}
            />
            <div>
              <p className="text-sm font-semibold">{addOn.name}</p>
              <p className="mt-1 text-xs text-slate-400">{addOn.description}</p>
              <p className="mt-2 text-sm">${(addOn.priceCents / 100).toFixed(2)}</p>
            </div>
          </label>
        ))}
        {available.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
            No hay add-ons nuevos disponibles para este producto.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>Total</span>
        <span>${(total / 100).toFixed(2)}</span>
      </div>
      {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      <button
        className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
        onClick={submit}
        disabled={status === "loading" || available.length === 0}
      >
        {status === "loading" ? "Iniciando..." : "Comprar add-ons"}
      </button>
    </section>
  );
}
