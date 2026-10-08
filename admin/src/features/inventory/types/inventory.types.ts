import type { Product, ProductVariant } from "@/features/products/types/products.types";

export type StockStatus = "in" | "low" | "out";

export type InventoryVariantRow = {
  id: string;
  key: string;
  product: Product;
  variant: ProductVariant;
  stockStatus: StockStatus;
};
