import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { listActiveAddOns } from "@/services/addOnService";
import { getCustomerSpecDetail, type CustomerSpecDetail } from "@/services/customerService";
import { AddOnPostPurchaseForm } from "@/modules/client/AddOnPostPurchaseForm";
import { listActivePlans } from "@/services/planService";
import { PlanSelector } from "@/modules/plans/PlanSelector";
import { isPlanActiveStatus } from "@/services/subscriptionService";

interface ClientProductPageProps {
  params: Promise<{ specId: string }>;
}

export default async function ClientProductPage({ params }: ClientProductPageProps) {
  const { specId } = await params;
  const store = await cookies();
  const customerId = store.get("customerId")?.value;

  if (!customerId) {
    redirect("/client/login");
  }

  const spec: CustomerSpecDetail | null = await getCustomerSpecDetail({
    customerId,
    specId,
  });
  if (!spec) {
    notFound();
  }

  const addOns = await listActiveAddOns();
  const plans = await listActivePlans();
  const planActive = isPlanActiveStatus(spec.planStatus, spec.planExpiresAt);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Producto</p>
          <h1 className="text-3xl font-semibold">{spec.productType}</h1>
          <p className="text-sm text-slate-300">Objetivo: {spec.objective}</p>
        </header>

        {!planActive && (
          <section className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 text-sm text-amber-200">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Plan mensual</p>
            <p className="mt-2 text-sm">
              Tu plan está inactivo. Activá un plan para habilitar redeploys y dominios.
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Estado</p>
              <p className="text-lg font-semibold">{spec.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Deploy</p>
              <p className="text-lg font-semibold">{spec.deployStatus ?? "sin deploy"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Dominio</p>
              <p className="text-lg font-semibold">{spec.customDomain?.domain ?? "sin dominio"}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs"
              href={`/api/client/delivery/${spec.id}`}
            >
              Descargar ZIP
            </a>
            <form action={`/api/client/deploy/${spec.id}`} method="post">
              <button className="rounded-xl border border-slate-700 px-4 py-2 text-xs" type="submit">
                Reintentar deploy
              </button>
            </form>
            {spec.deployUrl && (
              <a
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs"
                href={spec.deployUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver deploy
              </a>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Add-ons activos</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {spec.addOns.map((addOn) => (
              <div key={addOn.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-semibold">{addOn.name}</p>
                <p className="mt-1 text-xs text-slate-400">{addOn.type}</p>
              </div>
            ))}
            {spec.addOns.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                No hay add-ons activos todavía.
              </div>
            )}
          </div>
        </section>

        <AddOnPostPurchaseForm
          specId={spec.id}
          addOns={addOns}
          existingAddOnIds={spec.addOns.map((addOn) => addOn.id)}
        />

        <PlanSelector
          specId={spec.id}
          currentPlanId={spec.plan?.id ?? null}
          planStatus={spec.planStatus}
          planExpiresAt={spec.planExpiresAt ? spec.planExpiresAt.toISOString() : null}
          plans={plans}
        />

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <h2 className="text-lg font-semibold">Pagos</h2>
          <div className="mt-4 space-y-3">
            {spec.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div>
                  <p className="text-sm font-semibold">${(payment.amount / 100).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{payment.status}</p>
                </div>
                <p className="text-xs text-slate-400">
                  {new Date(payment.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
            {spec.payments.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                No hay pagos registrados todavía.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
