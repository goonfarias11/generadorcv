import Link from "next/link";
import { listProductSpecs, listProductSpecsByAgency } from "@/services/productSpecService";

interface SpecsDashboardProps {
  searchParams?: { agencyId?: string };
}

export default async function SpecsDashboard({ searchParams }: SpecsDashboardProps) {
  const specs = searchParams?.agencyId
    ? await listProductSpecsByAgency({ agencyId: searchParams.agencyId, limit: 50 })
    : await listProductSpecs(50);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Specs generadas</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Objetivo</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {specs.map((spec) => (
                <tr key={spec.id} className="text-slate-200">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{spec.id}</td>
                  <td className="px-4 py-3">{spec.productType}</td>
                  <td className="px-4 py-3">{spec.objective}</td>
                  <td className="px-4 py-3">
                    {spec.createdAt.toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/preview/${spec.id}`}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {specs.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay specs generadas.
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
