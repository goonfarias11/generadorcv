import type { ProductSpec } from "@/domain/product-spec";
import { validateProductSpec } from "@/domain/product-spec";
import { CATALOG_PRODUCTS } from "./catalog.data";
import { selectDesignSystem } from "@/modules/design-system/design-system";
import type { CatalogItem } from "@/domain/catalog/catalog";
import { PRODUCT_RULES } from "@/domain/rules/productRules";

export interface CatalogSpecResult {
  status: "accepted" | "rejected";
  errors?: string[];
  spec?: ProductSpec;
  product?: CatalogItem;
}

const defaultCopyToneByObjective: Record<CatalogItem["objective"], string> = {
  leads: "directo y orientado a acción",
  sales: "persuasivo y orientado a conversión",
  branding: "premium y confiable",
  validation: "claro y basado en evidencia",
};

export function createSpecFromCatalog(
  productId: string,
  industry = "general",
  partnerId?: string | null
): CatalogSpecResult {
  const product = CATALOG_PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    return { status: "rejected", errors: ["Producto no encontrado"] };
  }

  const designSystem = selectDesignSystem({
    objective: product.objective,
    industry,
  });

  const rule = PRODUCT_RULES[product.productType];

  if (!rule) {
    return { status: "rejected", errors: ["Producto fuera de catálogo"] };
  }

  const sections = product.sections.filter((section) => rule.allowedSections.includes(section));
  const trimmedSections = sections.slice(0, rule.maxSections);

  const spec: ProductSpec = {
    mode: "catalog",
    productType: product.productType,
    objective: product.objective,
    industry,
    sections: trimmedSections,
    designSystem: designSystem.id,
    copyTone: defaultCopyToneByObjective[product.objective],
    complexity: product.complexity,
    deliveryTime: product.deliveryTime,
    priceEstimate: product.price,
    partnerId: partnerId ?? null,
  };

  const validation = validateProductSpec(spec);

  if (!validation.ok) {
    return { status: "rejected", errors: validation.errors, product };
  }

  return { status: "accepted", spec: validation.value, product };
}
