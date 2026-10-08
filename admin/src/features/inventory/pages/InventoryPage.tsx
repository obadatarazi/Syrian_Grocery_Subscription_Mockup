import { Eye } from "lucide-react";
import { useMemo, useState } from "react";

import { useCrudPermissions } from "@/features/auth";
import { InventoryInlineNumberCell } from "@/features/inventory/components/InventoryInlineNumberCell";
import { InventoryItemViewDialog } from "@/features/inventory/components/InventoryItemViewDialog";
import { useInventoryInlineUpdate } from "@/features/inventory/hooks/use-inventory-inline-update";
import { useInventoryList } from "@/features/inventory/hooks/use-inventory-list";
import type { InventoryVariantRow } from "@/features/inventory/types/inventory.types";
import { getInventoryRowImage } from "@/features/inventory/utils/flatten-product-variants";
import { formatKwd, productStockBarColor } from "@/features/products/utils/product-display.utils";
import { getVariantDisplayLabel } from "@/features/products/utils/variant-attribute.utils";
import {
  CrudEntityNameCell,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
} from "@/shared/crud";
import type { CrudRowAction } from "@/shared/crud/types/crud.types";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Card } from "@/shared/design-system/components/ui/card";
import { cn } from "@/shared/design-system/components/ui/utils";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { useCrudPageGuidance } from "@/shared/guidance";

type InventorySummaryCard = {
  labelKey: "totalSkus" | "lowStockCount" | "outOfStock";
  value: number;
  colorClass: string;
  bgClass: string;
};

export function InventoryPage() {
  const t = useTranslation();
  const guidance = useCrudPageGuidance("inventory");
  const { canUpdate } = useCrudPermissions(PERMISSIONS.MANAGE_PRODUCT_INVENTORY);
  const {
    rows,
    summary,
    search,
    setSearch,
    resetSearch,
    page,
    setPage,
    setPageSize,
    total,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
    filters,
    filterDefinitions,
  } = useInventoryList();

  const { getRowValues, updateField, isSaving } = useInventoryInlineUpdate({
    onSuccess: refetch,
  });

  const [viewingRow, setViewingRow] = useState<InventoryVariantRow | null>(null);

  const summaryCards = useMemo<InventorySummaryCard[]>(
    () => [
      {
        labelKey: "totalSkus",
        value: summary.totalSkus,
        colorClass: "text-blue-600",
        bgClass: "bg-blue-50",
      },
      {
        labelKey: "lowStockCount",
        value: summary.lowStockCount,
        colorClass: "text-amber-600",
        bgClass: "bg-amber-50",
      },
      {
        labelKey: "outOfStock",
        value: summary.outOfStock,
        colorClass: "text-rose-600",
        bgClass: "bg-rose-50",
      },
    ],
    [summary],
  );

  const rowActions = useMemo<CrudRowAction<InventoryVariantRow>[]>(
    () => [
      {
        id: "view",
        label: t.viewAction,
        icon: Eye,
        onSelect: (row) => setViewingRow(row),
      },
    ],
    [t],
  );

  const columns = useMemo(
    () => [
      {
        id: "product",
        header: t.product,
        cell: (row: InventoryVariantRow) => (
          <CrudEntityNameCell
            imageUrl={getInventoryRowImage(row)}
            placeholder="📦"
            onClick={() => setViewingRow(row)}
          >
            <div>
              <p className="font-medium text-foreground">{row.product.title}</p>
              <p className="text-xs text-muted-foreground">{getVariantDisplayLabel(row.variant)}</p>
            </div>
          </CrudEntityNameCell>
        ),
      },
      {
        id: "brand",
        header: t.brand,
        cell: (row: InventoryVariantRow) => row.product.brand.title,
      },
      {
        id: "sku",
        header: t.skuCode,
        cell: (row: InventoryVariantRow) => (
          <span className="font-mono text-[11px] text-muted-foreground">
            {row.variant.skuCode || row.product.skuCode || "—"}
          </span>
        ),
      },
      {
        id: "price",
        header: t.price,
        cell: (row: InventoryVariantRow) => {
          const { price } = getRowValues(row);

          return (
            <InventoryInlineNumberCell
              value={price}
              displayValue={formatKwd(price)}
              canEdit={canUpdate}
              disabled={isSaving(row.id)}
              min={0}
              step={0.1}
              ariaLabel={t.price}
              editHint={t.inventoryClickToEdit}
              cancelLabel={t.cancel}
              onSave={(nextValue) => updateField(row, "price", nextValue)}
            />
          );
        },
      },
      {
        id: "stock",
        header: t.stock,
        cell: (row: InventoryVariantRow) => {
          const { stock, stockStatus } = getRowValues(row);
          const maxStock = 100;
          const width = Math.min(100, (stock / maxStock) * 100);

          return (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", productStockBarColor(stock))}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <InventoryInlineNumberCell
                  value={stock}
                  displayValue={String(stock)}
                  canEdit={canUpdate}
                  disabled={isSaving(row.id)}
                  min={0}
                  step={1}
                  integer
                  showSteppers
                  ariaLabel={t.stock}
                  editHint={t.inventoryClickToEdit}
                  cancelLabel={t.cancel}
                  onSave={(nextValue) => updateField(row, "stock", nextValue)}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  stockStatus === "out" && "text-rose-600",
                  stockStatus === "low" && "text-amber-600",
                  stockStatus === "in" && "text-emerald-600",
                )}
              >
                {stockStatus === "out"
                  ? t.outOfStock
                  : stockStatus === "low"
                    ? t.lowStockCount
                    : t.inStock}
              </span>
            </div>
          );
        },
      },
    ],
    [canUpdate, getRowValues, isSaving, t, updateField],
  );

  return (
    <CrudListPage {...guidance.pageProps} title={t.inventory}>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.labelKey} className={cn("border-0 p-5 shadow-sm", card.bgClass)}>
            <p className="text-sm font-medium text-muted-foreground">{t[card.labelKey]}</p>
            <p className={cn("mt-2 text-3xl font-bold", card.colorClass)}>{card.value}</p>
          </Card>
        ))}
      </div>

      {canUpdate ? (
        <p className="mb-3 text-sm text-muted-foreground">{t.inventoryInlineEditHint}</p>
      ) : null}

      <CrudListSection>
        <CrudListTable
          guidanceAnchors={{
            search: guidance.searchDataGuidance,
            filters: guidance.filtersDataGuidance,
            rowActions: guidance.rowActionsDataGuidance,
          }}
          tableId="inventory"
          search={{ value: search, onChange: setSearch, onReset: resetSearch }}
          filters={{
            definitions: filterDefinitions,
            values: filters.values,
            onChange: filters.setFilter,
            onReset: filters.resetFilters,
            hasActiveFilters: filters.hasActiveFilters,
          }}
          columns={columns}
          data={rows}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={(row) => (
            <CrudTableActions entity={row} actions={rowActions} ariaLabel={t.actions} />
          )}
          actionsHeader={t.actions}
          caption={t.inventory}
          showingLabel={`${t.showing} ${rows.length} ${t.of} ${total} ${t.results}`}
          pagination={{
            page,
            pageSize,
            totalItems: total,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
            pageSizeLabel: t.perPage,
            previousLabel: t.previous,
            nextLabel: t.nextPage,
          }}
        />
      </CrudListSection>

      <InventoryItemViewDialog
        open={viewingRow != null}
        row={viewingRow}
        onOpenChange={(open) => {
          if (!open) setViewingRow(null);
        }}
      />
    </CrudListPage>
  );
}
