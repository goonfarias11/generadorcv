import { listAllAddOns } from "@/services/addOnService";
import { AddOnCreateForm } from "@/modules/addons/AddOnCreateForm";
import { AddOnToggle } from "@/modules/addons/AddOnToggle";

export default async function AddOnsDashboard() {
  const addons = (await listAllAddOns()) as {
    id: string;
    slug: string;
    name: string;
    type: string;
    priceCents: number;
    isActive: boolean;
  }[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Add-ons</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {addons.map((addon) => (
                <tr key={addon.id} className="text-slate-200">
                  <td className="px-4 py-3">{addon.name}</td>
                  <td className="px-4 py-3">{addon.slug}</td>
                  <td className="px-4 py-3">{addon.type}</td>
                  <td className="px-4 py-3">${(addon.priceCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <AddOnToggle id={addon.id} isActive={addon.isActive} />
                  </td>
                </tr>
              ))}
              {addons.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={5}>
                    No hay add-ons aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddOnCreateForm />
      </div>
    </main>
  );
}
