import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getProductSpecById } from "@/services/productSpecService";
import { DeployAction } from "@/modules/deploy/DeployAction";
import { getDomainBySpecId } from "@/services/customDomainService";
import { DomainSection } from "@/modules/deploy/DomainSection";
import { isPlanActiveStatus } from "@/services/subscriptionService";

interface DeliveryPageProps {
  params: Promise<{ specId: string }>;
}

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { specId } = await params;
  const store = await cookies();
  const customerId = store.get("customerId")?.value ?? null;
  const spec = await getProductSpecById(specId);

  if (!spec || spec.status !== "delivered" || !spec.deliveryPath) {
    notFound();
  }

  const hasAccess = Boolean(customerId && spec.customerId === customerId);
  const domain = hasAccess ? await getDomainBySpecId(spec.id) : null;
  const planActive = isPlanActiveStatus(spec.planStatus, spec.planExpiresAt);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entrega</p>
        <h1 className="text-3xl font-semibold">Tu proyecto está listo</h1>
        <p className="text-sm text-slate-300">
          Descargá el paquete generado y seguí las instrucciones de README para ejecutarlo.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <span>Entrega generada</span>
            {hasAccess ? (
              <Link
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
                href={`/api/delivery/${specId}`}
              >
                Descargar ZIP
              </Link>
            ) : (
              <Link
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
                href="/client/login"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>

        {!hasAccess && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 text-sm text-amber-200">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Acceso</p>
            <p className="mt-2">Iniciá sesion para descargar la entrega y gestionar el deploy.</p>
          </div>
        )}

        {!planActive && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 text-sm text-amber-200">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Plan mensual</p>
            <p className="mt-2">Activá un plan para habilitar redeploys y dominios.</p>
            <Link
              className="mt-3 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-950"
              href="/client/login"
            >
              Activar plan
            </Link>
          </div>
        )}

        {hasAccess && (
          <>
            <DeployAction
              specId={spec.id}
              deployStatus={spec.deployStatus}
              deployUrl={spec.deployUrl}
            />

            <DomainSection
              specId={spec.id}
              existingDomain={domain?.domain ?? null}
              status={domain?.status ?? "pending"}
            />
          </>
        )}
      </div>
    </main>
  );
}
