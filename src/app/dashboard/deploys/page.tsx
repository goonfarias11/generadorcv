import Link from "next/link";
import { listProductSpecs } from "@/services/productSpecService";

export default async function DeploysDashboard() {
  const specs = await listProductSpecs(50);
  const deployed = specs.filter((spec) => spec.deployStatus);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Deploys</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {deployed.map((spec) => (
                <tr key={spec.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    {spec.deployedAt ? spec.deployedAt.toLocaleDateString("es-AR") : "-"}
                  </td>
                  <td className="px-4 py-3">{spec.productType}</td>
                  <td className="px-4 py-3">{spec.deployStatus}</td>
                  <td className="px-4 py-3">
                    {spec.deployUrl ? (
                      <a className="text-slate-300 underline" href={spec.deployUrl} target="_blank" rel="noreferrer">
                        Ver
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/preview/${spec.id}`}>
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
              {deployed.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay deploys aún.
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
