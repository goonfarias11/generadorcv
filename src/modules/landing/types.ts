export type SectionType =
  | "hero"
  | "benefits"
  | "features"
  | "pricing"
  | "cta"
  | "footer"
  | "problem"
  | "solution"
  | "social-proof"
  | "faq";

export interface HeroSectionData {
  headline: string;
  subheadline: string;
  cta: string;
}

export interface BenefitsSectionData {
  title: string;
  items: string[];
}

export interface FeaturesSectionData {
  title: string;
  items: string[];
  highlight: string;
}

export interface PricingSectionData {
  title: string;
  priceLabel: string;
  items: string[];
  price: number;
  deliveryTime: string;
}

export interface CtaSectionData {
  title: string;
  subtitle: string;
  button: string;
}

export interface FooterSectionData {
  note: string;
}

export interface ProblemSectionData {
  title: string;
  description: string;
}

export interface SolutionSectionData {
  title: string;
  description: string;
}

export interface TestimonialsSectionData {
  title: string;
  items: { name: string; role: string; quote: string }[];
}

export interface FaqSectionData {
  title: string;
  items: { question: string; answer: string }[];
}

export type LandingSection =
  | { type: "hero"; data: HeroSectionData }
  | { type: "benefits"; data: BenefitsSectionData }
  | { type: "features"; data: FeaturesSectionData }
  | { type: "pricing"; data: PricingSectionData }
  | { type: "cta"; data: CtaSectionData }
  | { type: "footer"; data: FooterSectionData }
  | { type: "problem"; data: ProblemSectionData }
  | { type: "solution"; data: SolutionSectionData }
  | { type: "social-proof"; data: TestimonialsSectionData }
  | { type: "faq"; data: FaqSectionData };
