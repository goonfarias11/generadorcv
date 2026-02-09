"use client";

import { useMemo, useState } from "react";

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  type: string;
}

interface AIServiceItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
}

interface PayCheckoutFormProps {
  specId: string;
  baseAmount: number;
  addOns: AddOnItem[];
  aiServices: AIServiceItem[];
}

interface CheckoutResponse {
  status: "accepted" | "rejected";
  checkoutUrl?: string;
  reason?: string;
}

export function PayCheckoutForm({
  specId,
  baseAmount,
  addOns,
  aiServices,
}: PayCheckoutFormProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedAI, setSelectedAI] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const addOnTotal = useMemo(
    () =>
      addOns
        .filter((addOn) => selected.includes(addOn.id))
        .reduce((sum, addOn) => sum + addOn.priceCents, 0),
    [addOns, selected]
  );

  const aiTotal = useMemo(
    () =>
      aiServices
        .filter((service) => selectedAI.includes(service.id))
        .reduce((sum, service) => sum + service.priceCents, 0),
    [aiServices, selectedAI]
  );

  const total = baseAmount + addOnTotal + aiTotal;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAI = (id: string) => {
    setSelectedAI((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const submit = async () => {
    setStatus("loading");
    setError("");

    if (!email.trim()) {
      setStatus("error");
      setError("Ingresá un email válido para continuar.");
      return;
    }

    const res = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specId, addOnIds: selected, aiServiceIds: selectedAI, email }),
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
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
        <h2 className="text-lg font-semibold">Add-ons disponibles</h2>
        <p className="mt-2 text-slate-400">
          Seleccioná mejoras opcionales para potenciar tu entrega.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {addOns.map((addOn) => (
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
          {addOns.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
              No hay add-ons activos en este momento.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
        <h2 className="text-lg font-semibold">Servicios AI</h2>
        <p className="mt-2 text-slate-400">
          Agregá entregables generados por AI para mejorar tu lanzamiento.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {aiServices.map((service) => (
            <label
              key={service.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedAI.includes(service.id)}
                onChange={() => toggleAI(service.id)}
              />
              <div>
                <p className="text-sm font-semibold">{service.name}</p>
                <p className="mt-1 text-xs text-slate-400">{service.description}</p>
                <p className="mt-2 text-sm">${(service.priceCents / 100).toFixed(2)}</p>
              </div>
            </label>
          ))}
          {aiServices.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
              No hay servicios AI activos en este momento.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
        <h2 className="text-lg font-semibold">Datos de contacto</h2>
        <p className="mt-2 text-slate-400">Usaremos este email para tu acceso al panel.</p>
        <input
          className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200"
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <span>Base</span>
          <span>${(baseAmount / 100).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-slate-400">
          <span>Add-ons</span>
          <span>${(addOnTotal / 100).toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-slate-400">
          <span>Servicios AI</span>
          <span>${(aiTotal / 100).toFixed(2)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${(total / 100).toFixed(2)}</span>
        </div>
        {status === "error" && <p className="mt-3 text-xs text-rose-300">{error}</p>}
        <button
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950"
          onClick={submit}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Iniciando..." : "Ir a pago"}
        </button>
      </section>
    </div>
  );
}
