import { CheckCircle2, FileSpreadsheet, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductImportPreviewTable } from "@/features/products/components/ProductImportPreviewTable";
import { useProductImport } from "@/features/products/hooks/use-product-import";
import type {
  ProductImportProgress,
  ProductImportSummary,
} from "@/features/products/types/product-import.types";
import {
  formatImportRowRange,
  parseProductImportCsvFile,
  type ParsedProductImportCsv,
} from "@/features/products/utils/parse-product-import-csv";
import { AppButton, StatusBadge } from "@/shared/components";
import { CrudEntityDialog, CrudFileUpload } from "@/shared/crud";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";

type ProductImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void | Promise<void>;
};

type ImportStep = "upload" | "preview" | "importing" | "results";

/** Matches backend `ImportProductRequest`: mimes csv,txt — max 10240 KB. */
const PRODUCT_IMPORT_MAX_BYTES = 10 * 1024 * 1024;
const PRODUCT_IMPORT_ACCEPT = ".csv,.txt,text/csv,text/plain";

function isAcceptedImportFileName(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".csv") || lower.endsWith(".txt");
}

function getDefaultSelectedGroupIds(
  groups: ParsedProductImportCsv["groups"],
): string[] {
  return groups.filter((group) => group.validationErrors.length === 0).map((group) => group.id);
}

export function ProductImportDialog({ open, onOpenChange, onSuccess }: ProductImportDialogProps) {
  const t = useTranslation();
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [parseError, setParseError] = useState<string | undefined>();
  const [parsedCsv, setParsedCsv] = useState<ParsedProductImportCsv | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [summary, setSummary] = useState<ProductImportSummary | null>(null);
  const [progress, setProgress] = useState<ProductImportProgress | null>(null);

  const { mutate, reset, isPending } = useProductImport({
    onProgress: setProgress,
    onSuccess: async (result) => {
      setSummary(result);
      setStep("results");
      await onSuccess?.();
    },
  });

  const selectedGroups = useMemo(
    () => parsedCsv?.groups.filter((group) => selectedGroupIds.includes(group.id)) ?? [],
    [parsedCsv?.groups, selectedGroupIds],
  );

  useEffect(() => {
    if (!open) {
      setStep("upload");
      setFile(null);
      setFileError(undefined);
      setParseError(undefined);
      setParsedCsv(null);
      setSelectedGroupIds([]);
      setSummary(null);
      setProgress(null);
      reset();
    }
  }, [open, reset]);

  const handleReviewFile = async () => {
    if (!file) {
      setFileError(t.productImportFileRequired);
      return;
    }

    if (!isAcceptedImportFileName(file.name)) {
      setFileError(t.productImportCsvOnly);
      return;
    }

    if (file.size > PRODUCT_IMPORT_MAX_BYTES) {
      setFileError(t.productImportFileTooLarge);
      return;
    }

    setFileError(undefined);
    setParseError(undefined);

    try {
      const parsed = await parseProductImportCsvFile(file);
      setParsedCsv(parsed);
      setSelectedGroupIds(getDefaultSelectedGroupIds(parsed.groups));
      setStep("preview");
    } catch (error) {
      setParseError(resolveServiceErrorMessage(error, t));
    }
  };

  const handleImportSelected = async () => {
    if (!file || !parsedCsv || selectedGroups.length === 0) {
      return;
    }

    setProgress({
      current: 0,
      total: selectedGroups.length,
      succeeded: 0,
      failed: 0,
      processed: 0,
      currentProductTitle: "",
      percent: 0,
      phase: "importing",
      results: [],
    });
    setStep("importing");

    await mutate({
      header: parsedCsv.header,
      groups: selectedGroups,
      fileName: file.name,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleBackToUpload = () => {
    setStep("upload");
    setParsedCsv(null);
    setSelectedGroupIds([]);
    setParseError(undefined);
  };

  const dialogDescription =
    step === "upload"
      ? t.productImportDescription
      : step === "preview"
        ? t.productImportPreviewDescription
        : step === "importing"
          ? t.productImportProgressDescription
          : t.productImportResultsDescription;

  return (
    <CrudEntityDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.productImportTitle}
      description={dialogDescription}
      size="xl"
      isLoading={isPending}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {step === "preview" ? (
            <AppButton type="button" variant="outline" onClick={handleBackToUpload} disabled={isPending}>
              {t.productImportBack}
            </AppButton>
          ) : null}

          {step === "upload" ? (
            <AppButton type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              {t.cancel}
            </AppButton>
          ) : null}

          {step === "upload" ? (
            <AppButton type="button" onClick={() => void handleReviewFile()} disabled={!file || isPending}>
              {t.productImportReviewFile}
            </AppButton>
          ) : null}

          {step === "preview" ? (
            <AppButton
              type="button"
              onClick={() => void handleImportSelected()}
              isLoading={isPending}
              disabled={selectedGroups.length === 0}
            >
              {t.productImportImportSelected.replace("{count}", String(selectedGroups.length))}
            </AppButton>
          ) : null}

          {step === "importing" ? (
            <AppButton type="button" disabled isLoading>
              {t.productImportProgressTitle}
            </AppButton>
          ) : null}

          {step === "results" ? (
            <AppButton type="button" onClick={handleClose}>
              {t.productImportDone}
            </AppButton>
          ) : null}
        </div>
      }
    >
      {step === "upload" ? (
        <div className="space-y-4">
          <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-950">
            <FileSpreadsheet className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="space-y-2">
              <p className="font-medium">{t.productImportFormatTitle}</p>
              <p className="text-[13px] leading-relaxed opacity-90">{t.productImportFormatDescription}</p>
              <ul className="list-disc space-y-1 ps-4 text-[13px] leading-relaxed opacity-90">
                <li>{t.productImportFormatSimple}</li>
                <li>{t.productImportFormatVariable}</li>
                <li>{t.productImportFormatAutoCreate}</li>
              </ul>
            </div>
          </div>

          <CrudFileUpload
            label={t.productImportFileLabel}
            accept={PRODUCT_IMPORT_ACCEPT}
            helperText={t.productImportFileHint}
            error={fileError ?? parseError}
            value={file}
            disabled={isPending}
            onFileSelect={(nextFile) => {
              setFile(nextFile);
              setFileError(undefined);
              setParseError(undefined);
              setParsedCsv(null);
              setSelectedGroupIds([]);
              setStep("upload");
            }}
          />
        </div>
      ) : null}

      {step === "preview" && parsedCsv ? (
        <ProductImportPreviewTable
          groups={parsedCsv.groups}
          selectedGroupIds={selectedGroupIds}
          onSelectionChange={setSelectedGroupIds}
        />
      ) : null}

      {step === "importing" && progress ? (
        <div className="space-y-5 py-2">
          <div className="flex items-start gap-3">
            <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-primary" aria-hidden="true" />
            <div className="min-w-0 space-y-1">
              <p className="font-medium text-foreground">{t.productImportProgressTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.productImportProgressCount
                  .replace("{current}", String(progress.current || 1))
                  .replace("{total}", String(progress.total))}
              </p>
              {progress.currentProductTitle ? (
                <p className="truncate text-sm text-foreground">
                  {t.productImportProgressCurrent.replace("{title}", progress.currentProductTitle)}
                </p>
              ) : null}
              {progress.phase !== "done" ? (
                <p className="text-sm text-muted-foreground">{t.productImportProgressImportingItem}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
              aria-label={t.productImportProgressTitle}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {t.productImportProgressPercent.replace("{percent}", String(progress.percent))}
              </span>
              <span>
                {t.productImportProgressLiveCounts
                  .replace("{succeeded}", String(progress.succeeded))
                  .replace("{failed}", String(progress.failed))}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-xs text-emerald-800">{t.productImportSucceeded}</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900">{progress.succeeded}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <p className="text-xs text-red-800">{t.productImportFailed}</p>
              <p className="mt-1 text-2xl font-semibold text-red-900">{progress.failed}</p>
            </div>
          </div>
        </div>
      ) : null}

      {step === "results" && summary ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-medium text-emerald-950">{t.productImportFinishTitle}</p>
              <p className="text-sm text-emerald-900/80">
                {t.productImportFinishDescription
                  .replace("{total}", String(summary.total))
                  .replace("{succeeded}", String(summary.succeeded))
                  .replace("{failed}", String(summary.failed))}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{t.productImportTotal}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{summary.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="text-xs text-emerald-800">{t.productImportSucceeded}</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900">{summary.succeeded}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <p className="text-xs text-red-800">{t.productImportFailed}</p>
              <p className="mt-1 text-2xl font-semibold text-red-900">{summary.failed}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t.productImportRowsCol}</th>
                    <th className="px-4 py-3 font-medium">{t.product}</th>
                    <th className="px-4 py-3 font-medium">{t.status}</th>
                    <th className="px-4 py-3 font-medium">{t.productImportDetailsCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.results.map((result, index) => (
                    <tr key={`${result.productTitle}-${index}`} className="border-t border-border/70">
                      <td className="px-4 py-3 align-top text-muted-foreground">
                        {formatImportRowRange(result.rows)}
                      </td>
                      <td className="px-4 py-3 align-top font-medium text-foreground">
                        {result.productTitle || t.notSet}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge
                          label={
                            result.status === "success"
                              ? t.productImportStatusSuccess
                              : t.productImportStatusFailed
                          }
                          variant={result.status === "success" ? "success" : "danger"}
                        />
                      </td>
                      <td className="px-4 py-3 align-top text-muted-foreground">
                        {result.reason ? (
                          <p className="text-destructive">{result.reason}</p>
                        ) : null}
                        {result.warnings.length ? (
                          <ul className="mt-1 list-disc space-y-1 ps-4">
                            {result.warnings.map((warning) => (
                              <li key={warning}>{warning}</li>
                            ))}
                          </ul>
                        ) : null}
                        {!result.reason && result.warnings.length === 0 ? "—" : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </CrudEntityDialog>
  );
}
