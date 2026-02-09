import { listTemplates } from "@/services/templateService";
import { TemplateCreateForm } from "@/modules/templates/TemplateCreateForm";

interface TemplatesDashboardProps {
  searchParams?: { partnerSlug?: string };
}

export default async function TemplatesDashboard({ searchParams }: TemplatesDashboardProps) {
  const templates = (await listTemplates({ partnerSlug: searchParams?.partnerSlug })) as {
    id: string;
    name: string;
    slug: string;
    tier: string;
    priceUSD: number;
    isPublic: boolean;
    popularity: number;
    partnerSlug?: string | null;
  }[];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">Templates</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Publico</th>
                <th className="px-4 py-3">Popularidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {templates.map((template) => (
                <tr key={template.id} className="text-slate-200">
                  <td className="px-4 py-3">{template.name}</td>
                  <td className="px-4 py-3">{template.slug}</td>
                  <td className="px-4 py-3">{template.tier}</td>
                  <td className="px-4 py-3">${template.priceUSD}</td>
                  <td className="px-4 py-3">{template.partnerSlug ?? "-"}</td>
                  <td className="px-4 py-3">{template.isPublic ? "si" : "no"}</td>
                  <td className="px-4 py-3">{template.popularity}</td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={7}>
                    No hay templates aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TemplateCreateForm />
      </div>
    </main>
  );
}
