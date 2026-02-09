import { listAllAIServices } from "@/services/aiService";
import { AIServiceCreateForm } from "@/modules/ai-services/AIServiceCreateForm";
import { AIServiceToggle } from "@/modules/ai-services/AIServiceToggle";

export default async function AIServicesDashboard() {
  const services = (await listAllAIServices()) as {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    isActive: boolean;
  }[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">AI Services</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {services.map((service) => (
                <tr key={service.id} className="text-slate-200">
                  <td className="px-4 py-3">{service.name}</td>
                  <td className="px-4 py-3">{service.slug}</td>
                  <td className="px-4 py-3">${(service.priceCents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <AIServiceToggle id={service.id} isActive={service.isActive} />
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={4}>
                    No hay servicios AI aun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AIServiceCreateForm />
      </div>
    </main>
  );
}
