import { productsService } from "@/features/products/services/products.service";
import type {
  ProductImportItemResult,
  ProductImportProgress,
  ProductImportSummary,
} from "@/features/products/types/product-import.types";
import {
  buildProductImportCsvFile,
  type ProductImportPreviewGroup,
} from "@/features/products/utils/parse-product-import-csv";
import type { Translation } from "@/shared/design-system/localization/locales/en";
import { resolveServiceErrorMessage } from "@/shared/errors";

type RunProductImportOptions = {
  header: string[];
  groups: ProductImportPreviewGroup[];
  fileName?: string;
  onProgress?: (progress: ProductImportProgress) => void;
  errorMessages: Translation;
};

function buildProgress(
  current: number,
  total: number,
  succeeded: number,
  failed: number,
  currentProductTitle: string,
  results: ProductImportItemResult[],
  phase: ProductImportProgress["phase"],
): ProductImportProgress {
  const processed = succeeded + failed;
  return {
    current,
    total,
    succeeded,
    failed,
    processed,
    currentProductTitle,
    percent: total === 0 ? 100 : Math.min(100, Math.round((processed / total) * 100)),
    phase,
    results: [...results],
  };
}

/**
 * Imports selected CSV product groups one-by-one (WordPress-style).
 * SKU/EAN are optional and passed through to the backend as-is.
 */
export async function runProductImport({
  header,
  groups,
  fileName = "product-import.csv",
  onProgress,
  errorMessages,
}: RunProductImportOptions): Promise<ProductImportSummary> {
  const results: ProductImportItemResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (let index = 0; index < groups.length; index += 1) {
    const group = groups[index];
    const current = index + 1;

    onProgress?.(
      buildProgress(current, groups.length, succeeded, failed, group.titleEn, results, "importing"),
    );

    try {
      const file = buildProductImportCsvFile(header, [group], `item-${current}-${fileName}`);
      const summary = await productsService.importFromCsv(file);
      const primaryResult = summary.results[0];
      const didSucceed =
        primaryResult?.status === "success" ||
        (summary.results.length === 0 && summary.succeeded > 0);

      if (didSucceed) {
        succeeded += 1;
        results.push({
          rows: primaryResult?.rows.length ? primaryResult.rows : group.rowNumbers,
          productTitle: primaryResult?.productTitle || group.titleEn,
          status: "success",
          reason: primaryResult?.reason ?? null,
          warnings: primaryResult?.warnings ?? [],
        });
      } else {
        failed += 1;
        results.push({
          rows: primaryResult?.rows.length ? primaryResult.rows : group.rowNumbers,
          productTitle: primaryResult?.productTitle || group.titleEn,
          status: "failed",
          reason:
            primaryResult?.reason ||
            summary.results.find((item) => item.reason)?.reason ||
            "Import failed without a detailed reason.",
          warnings: primaryResult?.warnings ?? [],
        });
      }
    } catch (error) {
      failed += 1;
      results.push({
        rows: group.rowNumbers,
        productTitle: group.titleEn,
        status: "failed",
        reason: resolveServiceErrorMessage(error, errorMessages),
        warnings: [],
      });
    }

    onProgress?.(
      buildProgress(current, groups.length, succeeded, failed, group.titleEn, results, "importing"),
    );
  }

  const summary: ProductImportSummary = {
    total: groups.length,
    succeeded,
    failed,
    results,
  };

  onProgress?.(
    buildProgress(groups.length, groups.length, succeeded, failed, "", results, "done"),
  );

  return summary;
}
