import type { ProductComplexity } from "@/domain/product-spec";
import { normalizeText } from "@/lib/text";

export interface ComplexityScoreInput {
  sections: string[];
  text?: string;
  maxSections: number;
}

export interface ComplexityScoreResult {
  score: number;
  level: ProductComplexity;
  reasons: string[];
}

const forbiddenKeywords = [
  "auth",
  "login",
  "registro",
  "pagos",
  "payment",
  "checkout",
  "multitenant",
  "multi-tenant",
  "crm",
  "integracion",
  "api",
  "chat",
  "ia",
  "ml",
  "machine learning",
];

export function scoreComplexity(input: ComplexityScoreInput): ComplexityScoreResult {
  let score = 0;
  const reasons: string[] = [];

  if (input.sections.length > input.maxSections) {
    score += input.sections.length - input.maxSections;
    reasons.push("Secciones excedidas");
  }

  if (input.text) {
    const normalized = normalizeText(input.text);
    const hits = forbiddenKeywords.filter((keyword) => normalized.includes(keyword));
    if (hits.length > 0) {
      score += hits.length * 2;
      reasons.push("Features no soportadas");
    }
  }

  const level: ProductComplexity = score >= 5 ? "high" : score >= 3 ? "medium" : "low";

  return { score, level, reasons };
}
