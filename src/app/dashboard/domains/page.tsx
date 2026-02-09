import Link from "next/link";
import { listDomains } from "@/services/customDomainService";

export default async function DomainsDashboard() {
  const domains = (await listDomains()) as {
    id: string;
    specId: string;
    domain: string;
    status: string;
    createdAt: Date;
    spec: { partner?: { name: string } | null };
  }[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Dominios</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Dominio</th>
                <th className="px-4 py-3">Spec</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {domains.map((domain) => (
                <tr key={domain.id} className="text-slate-200">
                  <td className="px-4 py-3">{domain.domain}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {domain.specId}
                  </td>
                  <td className="px-4 py-3">{domain.status}</td>
                  <td className="px-4 py-3">
                    {new Date(domain.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">{domain.spec.partner?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/preview/${domain.specId}`}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {domains.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={6}>
                    No hay dominios aún.
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
