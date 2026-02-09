import type { ProductComplexity, ProductObjective, ProductType } from "@/domain/product-spec";

export type CatalogTier = "basic" | "pro" | "premium";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  objective: ProductObjective;
  sections: string[];
  deliveryTime: string;
  price: number;
  tier: CatalogTier;
  complexity: ProductComplexity;
  includes: string[];
}

export const CATALOG: CatalogItem[] = [
  {
    id: "landing_basic",
    name: "Landing Express",
    description: "Landing enfocada en leads con alcance esencial.",
    productType: "landing",
    objective: "leads",
    sections: ["hero", "benefits", "cta", "footer"],
    deliveryTime: "24h",
    price: 79,
    tier: "basic",
    complexity: "low",
    includes: [
      "Copy directo para conversión",
      "Estructura compacta",
      "CTA principal optimizado",
    ],
  },
  {
    id: "landing_pro",
    name: "Landing Pro",
    description: "Landing completa con secciones clave de confianza.",
    productType: "landing",
    objective: "leads",
    sections: ["hero", "benefits", "features", "pricing", "cta", "footer"],
    deliveryTime: "48h",
    price: 149,
    tier: "pro",
    complexity: "low",
    includes: [
      "Copy orientado a resultados",
      "Secciones de valor y pricing",
      "Jerarquía visual premium",
    ],
  },
  {
    id: "landing_premium",
    name: "Landing Elite",
    description: "Landing con narrativa completa y prueba social.",
    productType: "landing",
    objective: "sales",
    sections: ["hero", "problem", "solution", "features", "social-proof", "cta"],
    deliveryTime: "72h",
    price: 249,
    tier: "premium",
    complexity: "low",
    includes: [
      "Narrativa completa de venta",
      "Prueba social integrada",
      "CTA secundaria estratégica",
    ],
  },
];
