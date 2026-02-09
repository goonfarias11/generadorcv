import type { LandingSection } from "./types";
import { HeroSection } from "@/modules/landing/components/HeroSection";
import { BenefitsSection } from "@/modules/landing/components/BenefitsSection";
import { FeaturesSection } from "@/modules/landing/components/FeaturesSection";
import { PricingSection } from "@/modules/landing/components/PricingSection";
import { CTASection } from "@/modules/landing/components/CTASection";
import { FooterSection } from "@/modules/landing/components/FooterSection";
import { ProblemSection } from "@/modules/landing/components/ProblemSection";
import { SolutionSection } from "@/modules/landing/components/SolutionSection";
import { TestimonialsSection } from "@/modules/landing/components/TestimonialsSection";
import { FaqSection } from "@/modules/landing/components/FaqSection";

interface SectionRendererProps {
  section: LandingSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection {...section.data} />;
    case "benefits":
      return <BenefitsSection {...section.data} />;
    case "features":
      return <FeaturesSection {...section.data} />;
    case "pricing":
      return <PricingSection {...section.data} />;
    case "cta":
      return <CTASection {...section.data} />;
    case "footer":
      return <FooterSection {...section.data} />;
    case "problem":
      return <ProblemSection {...section.data} />;
    case "solution":
      return <SolutionSection {...section.data} />;
    case "social-proof":
      return <TestimonialsSection {...section.data} />;
    case "faq":
      return <FaqSection {...section.data} />;
    default:
      return null;
  }
}
