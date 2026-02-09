import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listCustomerSpecs, getCustomerById, type CustomerSpecSummary } from "@/services/customerService";

export default async function ClientDashboard() {
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    redirect("/client/login");
  }

  const customer = await getCustomerById(customerId);
  if (!customer) {
    redirect("/client/login");
  }

  const specs: CustomerSpecSummary[] = await listCustomerSpecs(customerId);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Panel de cliente</p>
          <h1 className="text-2xl font-semibold">Hola {customer.name ?? customer.email}</h1>
          <p className="text-sm text-slate-400">Tus productos y entregas disponibles.</p>
        </header>

        <div className="grid gap-4">
          {specs.map((spec) => (
            <a
              key={spec.id}
              href={`/client/products/${spec.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{spec.productType}</p>
                  <p className="text-xs text-slate-400">Objetivo: {spec.objective}</p>
                </div>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs">
                  {spec.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                <span>Deploy: {spec.deployStatus ?? "sin deploy"}</span>
                <span>Dominio: {spec.customDomain?.domain ?? "sin dominio"}</span>
                <span>Add-ons: {spec.addOns.length}</span>
                <span>Plan: {spec.planStatus ?? "sin plan"}</span>
              </div>
            </a>
          ))}
          {specs.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
              No encontramos productos asociados a tu email todavía.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
