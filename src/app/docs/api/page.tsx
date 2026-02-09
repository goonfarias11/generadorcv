export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Docs</p>
          <h1 className="text-3xl font-semibold">Public API v1</h1>
          <p className="text-sm text-slate-300">
            API headless para generar specs, previews y entregas.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Autenticacion</h2>
          <p className="mt-2 text-slate-400">
            Enviar el header Authorization con formato Bearer.
          </p>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`Authorization: Bearer dpf_xxx`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Templates</h2>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`GET /api/v1/templates

POST /api/v1/templates/{slug}/create-spec
{
  "industry": "fintech",
  "intent": "preview"
}`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Specs</h2>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`POST /api/v1/specs
{
  "mode": "catalog",
  "productType": "landing",
  "objective": "leads",
  "industry": "salud",
  "sections": ["hero", "benefits", "pricing"],
  "designSystem": "neon-corporate",
  "copyTone": "directo",
  "complexity": "low",
  "deliveryTime": "5 dias",
  "priceEstimate": 300
}

GET /api/v1/specs/{id}`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Preview y entrega</h2>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`POST /api/v1/specs/{id}/preview

POST /api/v1/specs/{id}/deliver

GET /api/v1/specs/{id}/delivery`}
          </pre>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Errores</h2>
          <pre className="mt-4 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`{ "status": "rejected", "reason": "..." }`}
          </pre>
        </section>
      </div>
    </main>
  );
}
