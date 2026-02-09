import crypto from "crypto";
import type { ProductSpec } from "@/domain/product-spec";

export function createSpecId(spec: ProductSpec): string {
  const payload = JSON.stringify(spec);
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  return hash.slice(0, 12);
}
