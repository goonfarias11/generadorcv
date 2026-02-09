interface FooterSectionProps {
  note: string;
}

export function FooterSection({ note }: FooterSectionProps) {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>{note}</span>
        <span>Entrega determinística · Calidad premium</span>
      </div>
    </footer>
  );
}
