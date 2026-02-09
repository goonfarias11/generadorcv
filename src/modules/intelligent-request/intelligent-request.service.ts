import type { IntelligentRequestInput, IntelligentRequestResult } from "@/domain/intelligent-request";
import type { ProductComplexity, ProductObjective, ProductSpec, ProductType } from "@/domain/product-spec";
import { selectDesignSystem } from "@/modules/design-system/design-system";
import { normalizeText } from "@/lib/text";
import { validateProductSpec } from "@/domain/product-spec";

const objectiveKeywords: Record<ProductObjective, string[]> = {
  leads: ["lead", "captacion", "registro", "newsletter", "formulario"],
  sales: ["venta", "comprar", "checkout", "pago", "precio"],
  branding: ["marca", "confianza", "reputacion", "institucional"],
  validation: ["validar", "test", "piloto", "mvp"],
};

const typeKeywords: Record<ProductType, string[]> = {
  landing: ["landing", "one page", "una pagina"],
  "business-web": ["corporativa", "empresa", "institucional"],
  "micro-saas": ["saas", "plataforma"],
  dashboard: ["dashboard", "panel", "analitica"],
};

const complexityKeywords: Record<ProductComplexity, string[]> = {
  low: ["simple", "rapido", "basico"],
  medium: ["modular", "secciones", "intermedio"],
  high: ["complejo", "integracion", "avanzado"],
};

const defaultSectionsByObjective: Record<ProductObjective, string[]> = {
  leads: ["hero", "problem", "solution", "features", "social-proof", "cta"],
  sales: ["hero", "solution", "pricing", "faq", "cta"],
  branding: ["hero", "benefits", "features", "social-proof", "cta"],
  validation: ["hero", "problem", "solution", "pricing", "cta"],
};

const deliveryTimeByComplexity: Record<ProductComplexity, string> = {
  low: "5 días",
  medium: "8 días",
  high: "12 días",
};

const priceByComplexity: Record<ProductComplexity, number> = {
  low: 900,
  medium: 1400,
  high: 2200,
};

const copyToneByObjective: Record<ProductObjective, string> = {
  leads: "directo y orientado a acción",
  sales: "persuasivo y orientado a conversión",
  branding: "premium y confiable",
  validation: "claro y basado en evidencia",
};

const pickByKeywords = <T extends string>(
  text: string,
  keywordMap: Record<T, string[]>,
  fallback: T
): T => {
  const normalized = normalizeText(text);

  for (const [key, keywords] of Object.entries(keywordMap) as [T, string[]][]) {
    if (keywords.some((word) => normalized.includes(word))) {
      return key;
    }
  }

  return fallback;
};

const detectIndustry = (text: string, explicit?: string): string => {
  if (explicit && explicit.trim().length > 1) return explicit.trim();
  const normalized = normalizeText(text);

  if (normalized.includes("fintech")) return "fintech";
  if (normalized.includes("health") || normalized.includes("salud")) return "health";
  if (normalized.includes("education") || normalized.includes("educacion")) return "education";
  if (normalized.includes("real estate") || normalized.includes("inmobiliaria")) return "real-estate";
  if (normalized.includes("ecommerce") || normalized.includes("tienda")) return "ecommerce";

  return "general";
};

export function proposeSpecFromIntelligentRequest(
  input: IntelligentRequestInput
): IntelligentRequestResult {
  if (!input.text || input.text.trim().length < 12) {
    return {
      status: "rejected",
      reason: "El pedido es demasiado corto para interpretar.",
    };
  }

  const objective = pickByKeywords<ProductObjective>(
    input.text,
    objectiveKeywords,
    "leads"
  );
  const productType = pickByKeywords<ProductType>(
    input.text,
    typeKeywords,
    "landing"
  );
  const complexity = pickByKeywords<ProductComplexity>(
    input.text,
    complexityKeywords,
    "low"
  );
  const industry = detectIndustry(input.text, input.industry);

  const normalizedProductType =
    productType === "micro-saas" || productType === "dashboard"
      ? "landing"
      : productType;

  const designSystem = selectDesignSystem({ objective, industry });

  const spec: ProductSpec = {
    mode: "intelligent-request",
    productType: normalizedProductType,
    objective,
    industry,
    sections: defaultSectionsByObjective[objective],
    designSystem: designSystem.id,
    copyTone: copyToneByObjective[objective],
    complexity,
    deliveryTime: deliveryTimeByComplexity[complexity],
    priceEstimate: priceByComplexity[complexity],
  };

  const validation = validateProductSpec(spec);

  if (!validation.ok) {
    return {
      status: "reformulated",
      reason: "Se normalizó el pedido para cumplir estándares.",
      proposedSpec: spec,
    };
  }

  const status = normalizedProductType !== productType ? "reformulated" : "accepted";
  const reason =
    status === "reformulated"
      ? "El MVP actual se limita a landings premium."
      : undefined;

  return {
    status,
    reason,
    proposedSpec: validation.value,
  };
}
