import { notFound, redirect } from "next/navigation";
import { isPayableMode } from "@/domain/product-spec";
import { getProductSpecById } from "@/services/productSpecService";
import { listActiveAddOns } from "@/services/addOnService";
import { PayCheckoutForm } from "@/modules/checkout/PayCheckoutForm";
import { listActiveAIServices } from "@/services/aiService";
import { getAgencyBranding } from "@/services/agencyService";
import { AgencyBrandHeader } from "@/modules/agency/AgencyBrandHeader";

interface PayCheckoutPageProps {
  params: { specId: string };
}

export default async function PayCheckoutPage({ params }: PayCheckoutPageProps) {
  const spec = await getProductSpecById(params.specId);

  if (!spec) {
    notFound();
  }

  if (!isPayableMode(spec.mode)) {
    redirect(`/checkout/${spec.id}`);
  }

  const addOns = await listActiveAddOns();
  const aiServices = await listActiveAIServices();
  const baseAmount = Math.round(spec.priceEstimate * 100);
  const branding = spec.agencyId ? await getAgencyBranding(spec.agencyId) : null;

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
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Checkout</p>
          <h1 className="text-3xl font-semibold">Finalizá tu compra</h1>
          <p className="text-sm text-slate-300">
            Revisá el precio base y sumá add-ons opcionales antes de pagar.
          </p>
        </header>

        {spec.agencyId ? (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-200">
            <h2 className="text-lg font-semibold">Checkout gestionado por agencia</h2>
            <p className="mt-2 text-slate-400">
              Este proyecto es white-label. Contactá a tu agencia para continuar.
            </p>
          </section>
        ) : (
          <PayCheckoutForm
            specId={spec.id}
            baseAmount={baseAmount}
            addOns={addOns}
            aiServices={aiServices}
          />
        )}
      </div>
    </main>
  );
}
