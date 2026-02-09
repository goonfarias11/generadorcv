import { notFound } from "next/navigation";
import { HomePage } from "@/modules/preview/home-page";
import { getPartnerBySlug } from "@/services/partnerService";

interface PartnerPageProps {
  params: { partnerSlug: string };
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const partner = await getPartnerBySlug(params.partnerSlug);

  if (!partner || !partner.active) {
    notFound();
  }

  return (
    <HomePage
      partner={{
        name: partner.name,
        logoUrl: partner.logoUrl,
        primaryColor: partner.primaryColor,
        slug: partner.slug,
      }}
    />
  );
}
