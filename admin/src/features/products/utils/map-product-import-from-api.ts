import type {
  ProductImportItemResult,
  ProductImportSummary,
} from "@/features/products/types/product-import.types";

type ProductImportItemApi = {
  rows?: number[];
  product_title?: string;
  status?: ProductImportItemResult["status"];
  reason?: string | null;
  warnings?: string[];
};

type ProductImportSummaryApi = {
  total?: number;
  succeeded?: number;
  failed?: number;
  results?: ProductImportItemApi[];
};

export function mapProductImportFromApi(data: ProductImportSummaryApi): ProductImportSummary {
  return {
    total: data.total ?? 0,
    succeeded: data.succeeded ?? 0,
    failed: data.failed ?? 0,
    results: (data.results ?? []).map((item) => ({
      rows: item.rows ?? [],
      productTitle: item.product_title ?? "",
      status: item.status ?? "failed",
      reason: item.reason ?? null,
      warnings: item.warnings ?? [],
    })),
  };
}
