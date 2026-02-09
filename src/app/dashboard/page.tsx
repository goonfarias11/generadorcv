import Link from "next/link";
import { listAgencies } from "@/services/agencyService";
import { listPartnersWithStats } from "@/services/partnerService";
import { listPayments } from "@/services/paymentService";
import { listProductSpecs } from "@/services/productSpecService";

export default async function DashboardHome() {
  const [specs, payments, partners, agencies] = await Promise.all([
    listProductSpecs(20),
    listPayments(20),
    listPartnersWithStats(),
    listAgencies(),
  ]);

  const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Resumen general</h1>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ventas</p>
            <p className="mt-3 text-2xl font-semibold">${(revenue / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Specs</p>
            <p className="mt-3 text-2xl font-semibold">{specs.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Partners</p>
            <p className="mt-3 text-2xl font-semibold">{partners.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Agencias</p>
            <p className="mt-3 text-2xl font-semibold">{agencies.length}</p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm">
          <h2 className="text-lg font-semibold">Atajos</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="rounded-full border border-slate-700 px-4 py-2 text-xs" href="/dashboard/specs">
              Ver specs
            </Link>
            <Link className="rounded-full border border-slate-700 px-4 py-2 text-xs" href="/dashboard/payments">
              Ver pagos
            </Link>
            <Link className="rounded-full border border-slate-700 px-4 py-2 text-xs" href="/dashboard/partners">
              Partners
            </Link>
            <Link className="rounded-full border border-slate-700 px-4 py-2 text-xs" href="/dashboard/agencies">
              Agencias
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
