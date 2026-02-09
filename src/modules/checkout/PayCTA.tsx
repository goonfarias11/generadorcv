interface PayCTAProps {
  specId: string;
}
import Link from "next/link";

export function PayCTA({ specId }: PayCTAProps) {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">¿Querés este producto?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Comprá ahora y dejamos tu proyecto en producción.
          </p>
        </div>
        <Link
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
          href={`/checkout/pay/${specId}`}
        >
          Comprar ahora
        </Link>
      </div>
    </section>
  );
}
