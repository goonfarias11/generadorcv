interface FeaturesSectionProps {
  title: string;
  items: string[];
  highlight: string;
}

export function FeaturesSection({ title, items, highlight }: FeaturesSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="text-sm text-slate-400">{highlight}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-sm text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
