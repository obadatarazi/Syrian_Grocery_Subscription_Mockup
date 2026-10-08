export type ProductImportResultStatus = "success" | "failed";

export type ProductImportItemResult = {
  rows: number[];
  productTitle: string;
  status: ProductImportResultStatus;
  reason?: string | null;
  warnings: string[];
};

export type ProductImportSummary = {
  total: number;
  succeeded: number;
  failed: number;
  results: ProductImportItemResult[];
};

export type ProductImportProgress = {
  current: number;
  total: number;
  succeeded: number;
  failed: number;
  processed: number;
  currentProductTitle: string;
  percent: number;
  phase: "importing" | "done";
  results: ProductImportItemResult[];
};
