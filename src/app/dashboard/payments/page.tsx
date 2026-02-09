import Link from "next/link";
import { listPayments, listPaymentsByAgency } from "@/services/paymentService";

interface PaymentsDashboardProps {
  searchParams?: { agencyId?: string };
}

export default async function PaymentsDashboard({ searchParams }: PaymentsDashboardProps) {
  const payments = searchParams?.agencyId
    ? await listPaymentsByAgency({ agencyId: searchParams.agencyId, limit: 50 })
    : await listPayments(50);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Pagos</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.map((payment) => (
                <tr key={payment.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    {payment.createdAt.toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">{payment.productType}</td>
                  <td className="px-4 py-3">{payment.email ?? "-"}</td>
                  <td className="px-4 py-3">
                    ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{payment.status}</td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/preview/${payment.specId}`}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={6}>
                    No hay pagos aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
