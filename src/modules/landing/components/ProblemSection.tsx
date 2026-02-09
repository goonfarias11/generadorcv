interface ProblemSectionProps {
  title: string;
  description: string;
}

export function ProblemSection({ title, description }: ProblemSectionProps) {
  return (
    <section className="border-b border-slate-800">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="max-w-3xl text-sm text-slate-300">{description}</p>
      </div>
    </section>
  );
}
