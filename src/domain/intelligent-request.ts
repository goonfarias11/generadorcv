import type { ProductSpec } from "./product-spec";

export interface IntelligentRequestInput {
  text: string;
  references?: string[];
  industry?: string;
}

export interface IntelligentRequestResult {
  status: "accepted" | "reformulated" | "rejected";
  reason?: string;
  proposedSpec?: ProductSpec;
}
