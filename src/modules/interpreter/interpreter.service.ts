import type { IntelligentRequestInput } from "@/domain/intelligent-request";
import type { ProductComplexity, ProductSpec, ProductType } from "@/domain/product-spec";
import { createSpecFromCatalog } from "@/modules/catalog/catalog.service";
import { proposeSpecFromIntelligentRequest } from "@/modules/intelligent-request/intelligent-request.service";
import { PRODUCT_RULES } from "@/domain/rules/productRules";
import { scoreComplexity } from "@/domain/rules/complexityScorer";

export type InterpreterInput =
  | {
      mode: "catalog";
      payload: {
        productId: string;
        industry?: string;
      };
    }
  | {
      mode: "intelligent-request";
      payload: IntelligentRequestInput;
    };

export type InterpreterResult =
  | { status: "accepted"; spec: ProductSpec }
  | { status: "reformulated"; spec: ProductSpec; reason: string }
  | { status: "rejected"; reason: string };

const complexityRank: Record<ProductComplexity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const pricingByComplexity: Record<ProductComplexity, number> = {
  low: 900,
  medium: 1400,
  high: 2200,
};

const deliveryByComplexity: Record<ProductComplexity, string> = {
  low: "5 días",
  medium: "8 días",
  high: "12 días",
};

const normalizeSections = (sections: string[], rule: typeof PRODUCT_RULES[ProductType]): string[] => {
  const filtered = sections.filter((section) => rule.allowedSections.includes(section));
  const unique = Array.from(new Set(filtered));
  const trimmed = unique.slice(0, rule.maxSections);

  if (trimmed.length < rule.minSections) {
    return rule.defaultSections.slice(0, rule.minSections);
  }

  return trimmed;
};

const hardenSpec = (
  spec: ProductSpec,
  inputText?: string
): InterpreterResult => {
  const rule = PRODUCT_RULES[spec.productType];

  if (!rule) {
    return {
      status: "rejected",
      reason: "Este pedido excede los límites del sistema actual.",
    };
  }

  const normalizedSections = normalizeSections(spec.sections, rule);
  const complexityScore = scoreComplexity({
    sections: normalizedSections,
    text: inputText,
    maxSections: rule.maxSections,
  });

  let normalizedComplexity = spec.complexity;
  if (complexityRank[complexityScore.level] > complexityRank[rule.maxComplexity]) {
    normalizedComplexity = rule.maxComplexity;
  }

  const normalizedSpec: ProductSpec = {
    ...spec,
    sections: normalizedSections,
    complexity: normalizedComplexity,
    deliveryTime: deliveryByComplexity[normalizedComplexity],
    priceEstimate: pricingByComplexity[normalizedComplexity],
  };

  const removedSections = normalizedSections.length !== spec.sections.length;
  const complexityReduced = normalizedComplexity !== spec.complexity;
  const hasForbiddenFeatures = complexityScore.reasons.includes("Features no soportadas");

  if (hasForbiddenFeatures && complexityRank[complexityScore.level] >= 3) {
    return {
      status: "rejected",
      reason: "La complejidad solicitada no garantiza un resultado óptimo.",
    };
  }

  if (removedSections || complexityReduced) {
    return {
      status: "reformulated",
      reason: "Reducimos el alcance para garantizar entrega rápida y calidad.",
      spec: normalizedSpec,
    };
  }

  return { status: "accepted", spec: normalizedSpec };
};

export function interpretToSpec(input: InterpreterInput): InterpreterResult {
  if (input.mode === "catalog") {
    const result = createSpecFromCatalog(input.payload.productId, input.payload.industry);

    if (result.status === "rejected") {
      return {
        status: "rejected",
        reason: "Este pedido no cumple los criterios del catálogo actual.",
      };
    }

    return hardenSpec(result.spec!, undefined);
  }

  const analysis = proposeSpecFromIntelligentRequest(input.payload);

  if (analysis.status === "rejected") {
    return { status: "rejected", reason: analysis.reason ?? "Este pedido no cumple criterios." };
  }

  if (!analysis.proposedSpec) {
    return {
      status: "rejected",
      reason: "Este pedido excede los límites del sistema actual.",
    };
  }

  const hardened = hardenSpec(analysis.proposedSpec, input.payload.text);

  if (analysis.status === "reformulated" && hardened.status === "accepted") {
    return {
      status: "reformulated",
      reason: analysis.reason ?? "Reformulamos el pedido para mantener calidad.",
      spec: hardened.spec,
    };
  }

  return hardened;
}

// Tests mentales (fixtures):
// 1) Pedido simple "landing para leads" -> accepted
// 2) Pedido grande "landing con auth y pagos" -> reformulated o rejected
// 3) Pedido absurdo "app móvil con marketplace" -> rejected
