interface FaqSectionProps {
  title: string;
  items: { question: string; answer: string }[];
}

export function FaqSection({ title, items }: FaqSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.question} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-sm font-semibold text-slate-200">{item.question}</p>
              <p className="mt-2 text-sm text-slate-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
