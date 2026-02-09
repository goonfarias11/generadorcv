import Link from "next/link";
import { cookies } from "next/headers";
import { listAgenciesForUser } from "@/services/agencyService";
import { AgencyCreateForm } from "@/modules/agency/AgencyCreateForm";
import { redirect } from "next/navigation";

export default async function AgenciesDashboard() {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;
  if (!customerId) {
    redirect("/client/login");
  }

  const agencies = await listAgenciesForUser(customerId);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Agencias</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Creada</th>
                <th className="px-4 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {agencies.map((agency) => (
                <tr key={agency.id} className="text-slate-200">
                  <td className="px-4 py-3">{agency.name}</td>
                  <td className="px-4 py-3">{agency.slug}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{agency.ownerId}</td>
                  <td className="px-4 py-3">{agency.createdAt.toLocaleDateString("es-AR")}</td>
                  <td className="px-4 py-3">
                    <Link className="text-slate-300 underline" href={`/dashboard/agencies/${agency.id}`}>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {agencies.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay agencias registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AgencyCreateForm />
      </div>
    </main>
  );
}
