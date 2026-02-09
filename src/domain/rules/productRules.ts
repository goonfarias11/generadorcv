import type { ProductComplexity, ProductType } from "@/domain/product-spec";

export interface ProductRuleSet {
  minSections: number;
  maxSections: number;
  allowedSections: string[];
  maxComplexity: ProductComplexity;
  defaultSections: string[];
}

export const PRODUCT_RULES: Record<ProductType, ProductRuleSet> = {
  landing: {
    minSections: 3,
    maxSections: 6,
    allowedSections: [
      "hero",
      "problem",
      "solution",
      "benefits",
      "features",
      "social-proof",
      "pricing",
      "faq",
      "cta",
      "footer",
    ],
    maxComplexity: "low",
    defaultSections: ["hero", "problem", "solution", "features", "cta", "footer"],
  },
  "business-web": {
    minSections: 4,
    maxSections: 6,
    allowedSections: ["hero", "benefits", "features", "social-proof", "faq", "cta", "footer"],
    maxComplexity: "medium",
    defaultSections: ["hero", "benefits", "features", "social-proof", "cta", "footer"],
  },
  "micro-saas": {
    minSections: 4,
    maxSections: 6,
    allowedSections: ["hero", "features", "pricing", "faq", "cta", "footer"],
    maxComplexity: "medium",
    defaultSections: ["hero", "features", "pricing", "cta", "footer"],
  },
  dashboard: {
    minSections: 4,
    maxSections: 6,
    allowedSections: ["hero", "features", "benefits", "cta", "footer"],
    maxComplexity: "medium",
    defaultSections: ["hero", "features", "benefits", "cta", "footer"],
  },
};
