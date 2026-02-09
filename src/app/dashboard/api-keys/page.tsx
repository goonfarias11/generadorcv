import { listApiKeys } from "@/services/apiKeyService";
import { getApiKeyUsage } from "@/services/apiUsageService";
import { ApiKeyCreateForm } from "@/modules/api-keys/ApiKeyCreateForm";
import { ApiKeyToggle } from "@/modules/api-keys/ApiKeyToggle";

export default async function ApiKeysDashboard() {
  const keys = await listApiKeys();
  const withUsage = await Promise.all(
    keys.map(async (key) => {
      const usage = await getApiKeyUsage({ apiKeyId: key.id });
      return { ...key, usage };
    })
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold">API Keys</h1>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Rate limit</th>
                <th className="px-4 py-3">Uso hoy</th>
                <th className="px-4 py-3">Uso total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {withUsage.map((key) => (
                <tr key={key.id} className="text-slate-200">
                  <td className="px-4 py-3">{key.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{key.key}</td>
                  <td className="px-4 py-3">{key.rateLimit}/dia</td>
                  <td className="px-4 py-3">{key.usage.today}</td>
                  <td className="px-4 py-3">{key.usage.total}</td>
                  <td className="px-4 py-3">
                    <ApiKeyToggle id={key.id} isActive={key.isActive} />
                  </td>
                </tr>
              ))}
              {withUsage.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-slate-400" colSpan={6}>
                    No hay API keys aun.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ApiKeyCreateForm />
      </div>
    </main>
  );
}
