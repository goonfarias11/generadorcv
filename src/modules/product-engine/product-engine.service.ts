import type { ProductSpec } from "@/domain/product-spec";
import type { ProductBlueprint } from "@/domain/product-blueprint";
import { ALLOWED_SECTIONS, PRODUCT_SPEC_RULES } from "@/domain/product-spec";

const sectionPriority = [
  "hero",
  "problem",
  "solution",
  "features",
  "benefits",
  "social-proof",
  "pricing",
  "faq",
  "cta",
];

const buildSections = (requested: string[]): string[] => {
  const filtered = requested.filter((section) =>
    ALLOWED_SECTIONS.includes(section as (typeof ALLOWED_SECTIONS)[number])
  );

  const unique = Array.from(new Set(filtered));

  const ordered = sectionPriority.filter((section) => unique.includes(section));

  const capped = ordered.slice(0, PRODUCT_SPEC_RULES.maxSections);

  if (capped.length < PRODUCT_SPEC_RULES.minSections) {
    return sectionPriority.slice(0, PRODUCT_SPEC_RULES.minSections);
  }

  return capped;
};

export function buildProductBlueprint(spec: ProductSpec): ProductBlueprint {
  const sections = buildSections(spec.sections);

  return {
    template: "landing-basic",
    sections,
    components: ["navbar", ...sections, "footer"],
  };
}
