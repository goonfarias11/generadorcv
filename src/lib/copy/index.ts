import type { ProductObjective, ProductSpec, ProductType } from "@/domain/product-spec";

const objectiveHeadline: Record<ProductObjective, string> = {
  leads: "Convierte interés en oportunidades reales",
  sales: "Aumenta ventas con una propuesta clara",
  branding: "Refuerza tu posicionamiento premium",
  validation: "Valida tu idea con señales concretas",
};

const productSubheadline: Record<ProductType, string> = {
  landing: "Landing enfocada en conversión con narrativa directa.",
  "business-web": "Web corporativa con mensajes de confianza y autoridad.",
  "micro-saas": "Producto digital con propuesta clara y activación inmediata.",
  dashboard: "Panel con datos críticos listos para decisión.",
};

const objectiveCta: Record<ProductObjective, string> = {
  leads: "Quiero más leads",
  sales: "Quiero vender ahora",
  branding: "Quiero una marca premium",
  validation: "Quiero validar mi idea",
};

export const getHeroCopy = (spec: ProductSpec) => ({
  headline: objectiveHeadline[spec.objective],
  subheadline: `${productSubheadline[spec.productType]} Industria: ${spec.industry}.`,
  cta: objectiveCta[spec.objective],
});

export const getBenefitsCopy = (spec: ProductSpec) => ({
  title: "Beneficios que aceleran resultados",
  items: [
    `Claridad inmediata para ${spec.objective}.`,
    "Jerarquía visual que guía a la acción.",
    "Mensaje coherente con tu audiencia objetivo.",
  ],
});

export const getFeaturesCopy = (spec: ProductSpec) => ({
  title: "Características clave de la landing",
  items: [
    "Secciones enfocadas en conversión.",
    "Copy alineado al objetivo principal.",
    "Estructura preparada para escalar contenido.",
  ],
  highlight: `Sistema visual ${spec.designSystem} aplicado de forma consistente.`,
});

export const getPricingCopy = () => ({
  title: "Entrega premium, sin fricción",
  priceLabel: "Estimado",
  items: ["Kickoff inmediato", "Iteración rápida", "Entrega lista para publicar"],
});

export const getCtaCopy = (spec: ProductSpec) => ({
  title: "Listo para activar tu producto",
  subtitle: "Coordinamos en minutos y entregamos con calidad internacional.",
  button: objectiveCta[spec.objective],
});

export const getFooterCopy = () => ({
  note: "Digital Product Factory · MVP operativo",
});

export const getProblemCopy = () => ({
  title: "El problema que resolvemos",
  description: "La mayoría de las landings fallan por mensajes difusos y diseño inconsistente.",
});

export const getSolutionCopy = () => ({
  title: "La solución",
  description: "Una landing modular con narrativa clara y CTA directo.",
});

export const getTestimonialsCopy = () => ({
  title: "Prueba social",
  items: [
    { name: "Equipo Growth", role: "Fintech", quote: "Duplicamos leads en 3 semanas." },
    { name: "CEO", role: "B2B SaaS", quote: "El mensaje quedó alineado con ventas." },
  ],
});

export const getFaqCopy = () => ({
  title: "Preguntas frecuentes",
  items: [
    { question: "¿Cuánto tarda la entrega?", answer: "Entre 5 y 12 días según complejidad." },
    { question: "¿Incluye copywriting?", answer: "Sí, copy orientado a conversión." },
  ],
});
