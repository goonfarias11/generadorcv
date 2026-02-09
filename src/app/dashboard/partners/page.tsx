import { listPartnersWithStats } from "@/services/partnerService";

export default async function PartnersDashboard() {
  const partners = await listPartnersWithStats();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Partners</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Comisión</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Ventas</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Wallet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {partners.map((partner) => (
                <tr key={partner.id} className="text-slate-200">
                  <td className="px-4 py-3">{partner.name}</td>
                  <td className="px-4 py-3">/p/{partner.slug}</td>
                  <td className="px-4 py-3">{partner.commissionPct}%</td>
                  <td className="px-4 py-3">
                    ${(partner.balanceCents / 100).toFixed(2)} USD
                  </td>
                  <td className="px-4 py-3">{partner.specsCount}</td>
                  <td className="px-4 py-3">
                    ${(partner.revenueCents / 100).toFixed(2)} USD
                  </td>
                  <td className="px-4 py-3">
                    <a className="text-slate-300 underline" href={`/dashboard/partners/${partner.id}/wallet`}>
                      Ver
                    </a>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={7}>
                    No hay partners aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Crear partner</h2>
          <p className="mt-2 text-slate-400">
            Usá el endpoint interno para crear un partner activo.
          </p>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
            {`POST /api/partners
{
  "name": "Agencia Norte",
  "slug": "agencia-norte",
  "logoUrl": "",
  "primaryColor": "#ffffff"
}`}
          </pre>
        </section>
      </div>
    </main>
  );
}
