interface CTASectionProps {
  title: string;
  subtitle: string;
  button: string;
}

export function CTASection({ title, subtitle, button }: CTASectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="mt-4 text-sm text-slate-300">{subtitle}</p>
          <button className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
            {button}
          </button>
        </div>
      </div>
    </section>
  );
}
