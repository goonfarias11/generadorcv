import { listAllPlugins } from "@/services/pluginService";
import { PluginCreateForm } from "@/modules/plugins/PluginCreateForm";
import { PluginToggle } from "@/modules/plugins/PluginToggle";

export default async function PluginsDashboard() {
  const plugins = (await listAllPlugins()) as {
    id: string;
    slug: string;
    name: string;
    version: string;
    scope: string;
    priceCents: number;
    isActive: boolean;
    authorId: string;
  }[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Plugins</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {plugins.map((plugin) => (
                <tr key={plugin.id} className="text-slate-200">
                  <td className="px-4 py-3">{plugin.name}</td>
                  <td className="px-4 py-3">{plugin.slug}</td>
                  <td className="px-4 py-3">{plugin.version}</td>
                  <td className="px-4 py-3">{plugin.scope}</td>
                  <td className="px-4 py-3">${(plugin.priceCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{plugin.authorId}</td>
                  <td className="px-4 py-3">
                    <PluginToggle id={plugin.id} isActive={plugin.isActive} />
                  </td>
                </tr>
              ))}
              {plugins.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={7}>
                    No hay plugins registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PluginCreateForm />
      </div>
    </main>
  );
}
