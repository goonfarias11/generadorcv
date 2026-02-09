interface PricingSectionProps {
  title: string;
  priceLabel: string;
  items: string[];
  price: number;
  deliveryTime: string;
}

export function PricingSection({ title, priceLabel, items, price, deliveryTime }: PricingSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="text-sm text-slate-400">Entrega estimada: {deliveryTime}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{priceLabel}</p>
            <p className="mt-4 text-4xl font-semibold">${price}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              {items.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
            <p className="text-sm text-slate-300">
              Incluye estrategia de secciones, copy orientado a conversión y diseño consistente.
            </p>
            <button className="mt-6 w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
              Agendar kickoff
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
