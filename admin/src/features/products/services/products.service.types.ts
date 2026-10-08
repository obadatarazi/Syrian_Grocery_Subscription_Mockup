import type {
  Product,
  ProductFormData,
  ProductListParams,
  ProductListResult,
} from "@/features/products/types/products.types";
import type { ProductImportSummary } from "@/features/products/types/product-import.types";

export type ProductsService = {
  list: (params?: ProductListParams, signal?: AbortSignal) => Promise<ProductListResult>;
  getById: (id: number, signal?: AbortSignal) => Promise<Product>;
  getBySlug: (slug: string) => Promise<Product>;
  create: (data: ProductFormData) => Promise<Product>;
  update: (id: number, data: Partial<ProductFormData>) => Promise<Product>;
  delete: (id: number) => Promise<void>;
  importFromCsv: (file: File) => Promise<ProductImportSummary>;
};
