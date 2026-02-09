export type ProductMode = "catalog" | "intelligent-request" | "template";
export type ProductType = "landing" | "business-web" | "micro-saas" | "dashboard";
export type ProductObjective = "leads" | "sales" | "branding" | "validation";
export type ProductComplexity = "low" | "medium" | "high";

export interface ProductSpec {
  mode: ProductMode;
  productType: ProductType;
  objective: ProductObjective;
  industry: string;
  sections: string[];
  designSystem: string;
  copyTone: string;
  complexity: ProductComplexity;
  deliveryTime: string;
  priceEstimate: number;
  partnerId?: string | null;
  agencyId?: string | null;
  createdById?: string | null;
  addOns?: string[];
}

export interface ProductSpecValidationResult {
  ok: boolean;
  errors: string[];
  value?: ProductSpec;
}

export const PRODUCT_SPEC_RULES = {
  minSections: 3,
  maxSections: 6,
  minIndustryLength: 2,
  minPrice: 100,
};

export const ALLOWED_SECTIONS = [
  "hero",
  "problem",
  "solution",
  "features",
  "benefits",
  "social-proof",
  "pricing",
  "faq",
  "cta",
] as const;

export const PAYABLE_MODES = ["catalog", "template"] as const;
export const ALL_PRODUCT_MODES = ["catalog", "intelligent-request", "template"] as const;

const isString = (value: unknown): value is string => typeof value === "string";

export function isPayableMode(mode: unknown): mode is (typeof PAYABLE_MODES)[number] {
  return PAYABLE_MODES.includes(mode as (typeof PAYABLE_MODES)[number]);
}

export function isKnownMode(mode: unknown): mode is ProductMode {
  return ALL_PRODUCT_MODES.includes(mode as ProductMode);
}

export function validateProductSpec(
  input: Partial<ProductSpec>
): ProductSpecValidationResult {
  const errors: string[] = [];

  if (!input.mode) errors.push("mode es requerido");
  if (!input.productType) errors.push("productType es requerido");
  if (!input.objective) errors.push("objective es requerido");

  if (!isString(input.industry) || input.industry.trim().length < PRODUCT_SPEC_RULES.minIndustryLength) {
    errors.push("industry inválido");
  }

  if (!Array.isArray(input.sections)) {
    errors.push("sections debe ser un array");
  } else {
    const normalizedSections = input.sections.filter((section) =>
      ALLOWED_SECTIONS.includes(section as (typeof ALLOWED_SECTIONS)[number])
    );

    if (normalizedSections.length < PRODUCT_SPEC_RULES.minSections) {
      errors.push("sections insuficientes");
    }

    if (normalizedSections.length > PRODUCT_SPEC_RULES.maxSections) {
      errors.push("sections excede el máximo permitido");
    }
  }

  if (!isString(input.designSystem) || !input.designSystem.trim()) {
    errors.push("designSystem es requerido");
  }

  if (!isString(input.copyTone) || !input.copyTone.trim()) {
    errors.push("copyTone es requerido");
  }

  if (!input.complexity) errors.push("complexity es requerido");
  if (!isString(input.deliveryTime) || !input.deliveryTime.trim()) {
    errors.push("deliveryTime es requerido");
  }

  if (typeof input.priceEstimate !== "number" || input.priceEstimate < PRODUCT_SPEC_RULES.minPrice) {
    errors.push("priceEstimate inválido");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: errors.length === 0 ? (input as ProductSpec) : undefined,
  };
}
