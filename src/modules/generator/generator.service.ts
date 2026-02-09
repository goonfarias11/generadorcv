import type { ProductBlueprint } from "@/domain/product-blueprint";
import type { ProductSpec } from "@/domain/product-spec";

export interface GeneratedProduct {
  spec: ProductSpec;
  blueprint: ProductBlueprint;
  copy: {
    headline: string;
    subheadline: string;
    cta: string;
  };
}

const headlineByObjective: Record<ProductSpec["objective"], string> = {
  leads: "Convierte más visitantes en leads calificados",
  sales: "Acelera ventas con una landing de alto rendimiento",
  branding: "Posiciona tu marca con presencia premium",
  validation: "Valida tu idea con señales reales del mercado",
};

const subheadlineByObjective: Record<ProductSpec["objective"], string> = {
  leads: "Arquitectura optimizada, secciones clave y copy orientado a conversión.",
  sales: "Estructura clara, oferta visible y CTA sin fricción.",
  branding: "Mensajes precisos, jerarquía visual y confianza inmediata.",
  validation: "Propuesta clara, beneficios rápidos y credibilidad.",
};

const ctaByObjective: Record<ProductSpec["objective"], string> = {
  leads: "Solicitar demo",
  sales: "Quiero vender más",
  branding: "Hablar con un experto",
  validation: "Validar ahora",
};

export function generateLanding(
  spec: ProductSpec,
  blueprint: ProductBlueprint
): GeneratedProduct {
  return {
    spec,
    blueprint,
    copy: {
      headline: headlineByObjective[spec.objective],
      subheadline: subheadlineByObjective[spec.objective],
      cta: ctaByObjective[spec.objective],
    },
  };
}
