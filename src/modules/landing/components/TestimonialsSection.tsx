interface TestimonialsSectionProps {
  title: string;
  items: { name: string; role: string; quote: string }[];
}

export function TestimonialsSection({ title, items }: TestimonialsSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-sm text-slate-200">“{item.quote}”</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.name} · {item.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
