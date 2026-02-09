import { stripe } from "@/lib/stripe";
import { getPartnerById, updatePartnerStripeAccount, updatePartnerPayoutStatus } from "@/services/partnerService";

export async function ensureStripeAccount(partnerId: string) {
  const partner = await getPartnerById(partnerId);
  if (!partner) {
    throw new Error("Partner no encontrado");
  }

  if (partner.stripeAccountId) {
    return partner.stripeAccountId;
  }

  const account = await stripe.accounts.create({
    type: "express",
    business_type: "company",
    capabilities: {
      transfers: { requested: true },
    },
    metadata: {
      partnerId: partner.id,
      partnerSlug: partner.slug,
    },
  });

  await updatePartnerStripeAccount({
    partnerId: partner.id,
    stripeAccountId: account.id,
  });

  return account.id;
}

export async function createOnboardingLink(input: {
  partnerId: string;
  returnUrl: string;
  refreshUrl: string;
}) {
  const accountId = await ensureStripeAccount(input.partnerId);

  const link = await stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    return_url: input.returnUrl,
    refresh_url: input.refreshUrl,
  });

  return link.url;
}

export async function refreshStripeAccountStatus(partnerId: string) {
  const partner = await getPartnerById(partnerId);
  if (!partner || !partner.stripeAccountId) {
    throw new Error("Partner sin cuenta Stripe");
  }

  const account = await stripe.accounts.retrieve(partner.stripeAccountId);
  const payoutsEnabled = Boolean(account.payouts_enabled);

  await updatePartnerPayoutStatus({ partnerId, payoutsEnabled });

  return {
    payoutsEnabled,
    detailsSubmitted: Boolean(account.details_submitted),
    chargesEnabled: Boolean(account.charges_enabled),
  };
}
