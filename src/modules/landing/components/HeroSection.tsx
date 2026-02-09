interface HeroSectionProps {
  headline: string;
  subheadline: string;
  cta: string;
}

export function HeroSection({ headline, subheadline, cta }: HeroSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {headline}
          </h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">
            {subheadline}
          </p>
        </div>
        <div>
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950">
            {cta}
          </button>
        </div>
      </div>
    </section>
  );
}
