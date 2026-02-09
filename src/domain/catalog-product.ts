import type { ProductObjective, ProductType } from "./product-spec";

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  objective: ProductObjective;
  basePrice: number;
  deliveryTimeDays: number;
  defaultSections: string[];
}
