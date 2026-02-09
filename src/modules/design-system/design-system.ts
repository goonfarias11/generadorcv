import type { ProductObjective } from "@/domain/product-spec";

export interface DesignSystemTokens {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  fontFamily: string;
  radius: string;
}

export const DESIGN_SYSTEMS: DesignSystemTokens[] = [
  {
    id: "aurora",
    name: "Aurora",
    primary: "slate-900",
    secondary: "emerald-500",
    fontFamily: "font-sans",
    radius: "rounded-2xl",
  },
  {
    id: "mono",
    name: "Mono",
    primary: "zinc-950",
    secondary: "zinc-400",
    fontFamily: "font-sans",
    radius: "rounded-xl",
  },
  {
    id: "velocity",
    name: "Velocity",
    primary: "blue-900",
    secondary: "cyan-400",
    fontFamily: "font-sans",
    radius: "rounded-3xl",
  },
  {
    id: "studio",
    name: "Studio",
    primary: "stone-900",
    secondary: "amber-400",
    fontFamily: "font-sans",
    radius: "rounded-2xl",
  },
  {
    id: "atlas",
    name: "Atlas",
    primary: "neutral-900",
    secondary: "violet-400",
    fontFamily: "font-sans",
    radius: "rounded-2xl",
  },
  {
    id: "pulse",
    name: "Pulse",
    primary: "gray-900",
    secondary: "rose-500",
    fontFamily: "font-sans",
    radius: "rounded-2xl",
  },
];

const objectiveMap: Record<ProductObjective, string> = {
  leads: "velocity",
  sales: "pulse",
  branding: "studio",
  validation: "atlas",
};

export function selectDesignSystem(input: {
  objective: ProductObjective;
  industry?: string;
}): DesignSystemTokens {
  if (input.industry?.includes("fintech")) {
    return DESIGN_SYSTEMS.find((system) => system.id === "aurora") ?? DESIGN_SYSTEMS[0];
  }

  const fallback = objectiveMap[input.objective];
  return DESIGN_SYSTEMS.find((system) => system.id === fallback) ?? DESIGN_SYSTEMS[0];
}
