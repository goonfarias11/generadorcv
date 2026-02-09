import { notFound } from "next/navigation";
import type { ProductSpec } from "@/domain/product-spec";
import { isPayableMode } from "@/domain/product-spec";
import { buildLandingView } from "@/modules/landing/landing-builder";
import { LandingRenderer } from "@/modules/landing/LandingRenderer";
import { getProductSpecById } from "@/services/productSpecService";
import { CheckoutCTA } from "@/modules/checkout/CheckoutCTA";
import { PayCTA } from "@/modules/checkout/PayCTA";
import { AddOnUpsell } from "@/modules/checkout/AddOnUpsell";
import { getAgencyBranding } from "@/services/agencyService";
import { AgencyBrandHeader } from "@/modules/agency/AgencyBrandHeader";

interface PreviewPageProps {
  params: { id: string };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const spec = await getProductSpecById(params.id);

  if (!spec) {
    notFound();
  }

  const specForView: ProductSpec = {
    ...spec,
    addOns: spec.addOns?.map((addOn) => addOn.id),
  };
  const model = buildLandingView(specForView);
  const branding = spec.agencyId ? await getAgencyBranding(spec.agencyId) : null;
  const isPayable = isPayableMode(spec.mode);

  return (
    <div className="bg-slate-950 text-white">
      {branding && (
        <AgencyBrandHeader
          name={branding.platformName}
          logoUrl={branding.logoUrl}
          primaryColor={branding.primaryColor}
          accentColor={branding.accentColor}
        />
      )}
      <LandingRenderer model={model} />
      {spec.agencyId ? (
        <section className="border-t border-slate-800 bg-slate-950">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-12">
            <h2 className="text-2xl font-semibold">Proyecto gestionado por agencia</h2>
            <p className="text-sm text-slate-400">
              Este proyecto es white-label. Contactá a tu agencia para continuar.
            </p>
          </div>
        </section>
      ) : isPayable ? (
        <>
          <AddOnUpsell />
          <PayCTA specId={spec.id} />
        </>
      ) : (
        <CheckoutCTA specId={spec.id} />
      )}
    </div>
  );
}
