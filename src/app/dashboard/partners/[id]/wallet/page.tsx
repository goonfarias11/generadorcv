import { notFound } from "next/navigation";
import { listPartnerWallet, type PartnerWalletData } from "@/services/partnerRevenue.service";
import { PartnerConnectCard } from "@/modules/partners/PartnerConnectCard";

interface WalletPageProps {
  params: Promise<{ id: string }>;
}

export default async function PartnerWalletPage({ params }: WalletPageProps) {
  const { id } = await params;
  try {
    const { partner, payments, payouts } = (await listPartnerWallet({ partnerId: id })) as PartnerWalletData;

    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Wallet</p>
            <h1 className="text-2xl font-semibold">{partner.name}</h1>
            <p className="text-sm text-slate-400">Balance: ${(partner.balanceCents / 100).toFixed(2)} USD</p>
          </header>

          <PartnerConnectCard
            partnerId={id}
            stripeAccountId={partner.stripeAccountId}
            payoutsEnabled={partner.payoutsEnabled}
          />

          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
            <h2 className="text-lg font-semibold">Ventas</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  <tr>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Comisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-2">
                        {payment.createdAt.toLocaleDateString("es-AR")}
                      </td>
                      <td className="py-2">${(payment.amount / 100).toFixed(2)}</td>
                      <td className="py-2">
                        ${(payment.partnerShare ? payment.partnerShare / 100 : 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td className="py-4 text-sm text-slate-400" colSpan={3}>
                        No hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
            <h2 className="text-lg font-semibold">Payouts</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  <tr>
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Monto</th>
                    <th className="py-2">Estado</th>
                    <th className="py-2">Transfer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="py-2">{payout.createdAt.toLocaleDateString("es-AR")}</td>
                      <td className="py-2">${(payout.amountCents / 100).toFixed(2)}</td>
                      <td className="py-2">{payout.status}</td>
                      <td className="py-2">
                        {payout.transferId ? "ok" : payout.errorMessage ?? "-"}
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td className="py-4 text-sm text-slate-400" colSpan={4}>
                        No hay payouts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
