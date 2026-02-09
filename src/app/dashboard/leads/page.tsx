import Link from "next/link";
import { listLeads, listLeadsByAgency } from "@/services/leadService";

interface LeadsDashboardProps {
  searchParams?: { agencyId?: string };
}

export default async function LeadsDashboard({ searchParams }: LeadsDashboardProps) {
  const leads = searchParams?.agencyId
    ? await listLeadsByAgency({ agencyId: searchParams.agencyId, limit: 50 })
    : await listLeads(50);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Leads recibidos</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    {lead.createdAt.toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.productType}</td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/preview/${lead.specId}`}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay leads aún.
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
