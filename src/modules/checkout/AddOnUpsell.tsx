"use client";

import { useEffect, useState } from "react";

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
}

export function AddOnUpsell() {
  const [addOns, setAddOns] = useState<AddOnItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/addons", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { addons: AddOnItem[] };
      setAddOns(data.addons);
    };

    load();
  }, []);

  if (addOns.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-4 px-6 py-10">
        <h3 className="text-lg font-semibold">Mejoras disponibles</h3>
        <p className="text-sm text-slate-400">
          Podés sumar add-ons en el checkout para potenciar la entrega.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-semibold">{addOn.name}</p>
              <p className="mt-2 text-xs text-slate-400">{addOn.description}</p>
              <p className="mt-3 text-sm">${(addOn.priceCents / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
