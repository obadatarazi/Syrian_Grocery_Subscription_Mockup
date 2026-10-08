import type { ProductListParams, ProductListResult } from "@/features/products/types/products.types";

export type InventoryListParams = ProductListParams;

export type UpdateInventoryPayload = {
  eanCode?: string | null;
  skuCode?: string | null;
  price?: number | null;
  stock?: number | null;
};

export type InventoryService = {
  list: (params?: InventoryListParams, signal?: AbortSignal) => Promise<ProductListResult>;
  update: (data: UpdateInventoryPayload) => Promise<void>;
};
