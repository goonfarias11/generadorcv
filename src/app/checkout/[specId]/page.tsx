import { notFound, redirect } from "next/navigation";
import { getProductSpecById } from "@/services/productSpecService";
import { CheckoutForm } from "@/modules/checkout/CheckoutForm";
import { getPartnerById } from "@/services/partnerService";
import { getAgencyBranding } from "@/services/agencyService";
import { AgencyBrandHeader } from "@/modules/agency/AgencyBrandHeader";

interface CheckoutPageProps {
  params: { specId: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const spec = await getProductSpecById(params.specId);

  if (!spec) {
    notFound();
  }

  const partner = spec.partnerId ? await getPartnerById(spec.partnerId) : null;
  const branding = spec.agencyId ? await getAgencyBranding(spec.agencyId) : null;

  if (spec.mode === "catalog" || spec.mode === "template") {
    redirect(`/checkout/pay/${spec.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      {branding && (
        <div className="mb-8 -mx-6">
          <AgencyBrandHeader
            name={branding.platformName}
            logoUrl={branding.logoUrl}
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </div>
      )}
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Solicitud de entrega</p>
          <h1 className="text-3xl font-semibold">Continuar con este proyecto</h1>
          <p className="text-sm text-slate-300">
            Revisá el alcance y dejá tus datos para coordinar la entrega.
          </p>
          {partner && (
            <p className="text-sm text-slate-400">Marca: {partner.name}</p>
          )}
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Producto</p>
              <p className="mt-2 font-semibold">{spec.productType}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Objetivo</p>
              <p className="mt-2 font-semibold">{spec.objective}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Entrega</p>
              <p className="mt-2 font-semibold">{spec.deliveryTime}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Estimado</span>
            <span className="text-2xl font-semibold">${spec.priceEstimate}</span>
          </div>
        </section>

        {spec.agencyId ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
            <h2 className="text-lg font-semibold">Solicitud gestionada por agencia</h2>
            <p className="mt-2 text-slate-400">
              Tu agencia maneja la facturacion y la entrega de este proyecto.
            </p>
          </section>
        ) : (
          <CheckoutForm specId={params.specId} />
        )}
      </div>
    </main>
  );
}
