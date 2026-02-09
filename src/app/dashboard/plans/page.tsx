import { listPlans } from "@/services/planService";
import { PlanCreateForm } from "@/modules/plans/PlanCreateForm";

export default async function PlansDashboard() {
  const plans = await listPlans(true);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Planes</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Intervalo</th>
                <th className="px-4 py-3">Activo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {plans.map((plan) => (
                <tr key={plan.id} className="text-slate-200">
                  <td className="px-4 py-3">{plan.name}</td>
                  <td className="px-4 py-3">{plan.slug}</td>
                  <td className="px-4 py-3">${(plan.priceCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">{plan.interval}</td>
                  <td className="px-4 py-3">{plan.isActive ? "si" : "no"}</td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay planes aun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PlanCreateForm />
      </div>
    </main>
  );
}
