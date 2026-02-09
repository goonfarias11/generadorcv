import type { ProductSpec } from "@/domain/product-spec";
import {
  getBenefitsCopy,
  getCtaCopy,
  getFaqCopy,
  getFeaturesCopy,
  getFooterCopy,
  getHeroCopy,
  getPricingCopy,
  getProblemCopy,
  getSolutionCopy,
  getTestimonialsCopy,
} from "@/lib/copy";
import type { LandingSection, SectionType } from "./types";

const mapSectionType = (section: string): SectionType | null => {
  switch (section) {
    case "hero":
    case "benefits":
    case "features":
    case "pricing":
    case "cta":
    case "footer":
    case "problem":
    case "solution":
    case "social-proof":
    case "faq":
      return section;
    default:
      return null;
  }
};

export interface LandingViewModel {
  designSystem: string;
  sections: LandingSection[];
}

export function buildLandingView(spec: ProductSpec): LandingViewModel {
  const mappedSections = spec.sections
    .map(mapSectionType)
    .filter((section): section is SectionType => Boolean(section));

  const withFooter = mappedSections.includes("footer")
    ? mappedSections
    : [...mappedSections, "footer"];

  const sections = withFooter.map((section) => {
    switch (section) {
      case "hero":
        return { type: "hero", data: getHeroCopy(spec) };
      case "benefits":
        return { type: "benefits", data: getBenefitsCopy(spec) };
      case "features":
        return { type: "features", data: getFeaturesCopy(spec) };
      case "pricing":
        return {
          type: "pricing",
          data: {
            ...getPricingCopy(),
            price: spec.priceEstimate,
            deliveryTime: spec.deliveryTime,
          },
        };
      case "cta":
        return { type: "cta", data: getCtaCopy(spec) };
      case "footer":
        return { type: "footer", data: getFooterCopy() };
      case "problem":
        return { type: "problem", data: getProblemCopy() };
      case "solution":
        return { type: "solution", data: getSolutionCopy() };
      case "social-proof":
        return { type: "social-proof", data: getTestimonialsCopy() };
      case "faq":
        return { type: "faq", data: getFaqCopy() };
      default:
        return null;
    }
  });

  return {
    designSystem: spec.designSystem,
    sections: sections.filter((section): section is LandingSection => Boolean(section)),
  };
}
