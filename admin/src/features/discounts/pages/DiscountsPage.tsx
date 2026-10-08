import { Plus } from "lucide-react";
import { useMemo } from "react";

import { useCrudPermissions } from "@/features/auth";
import { DiscountCasesGuide } from "@/features/discounts/components/DiscountCasesGuide";
import { DiscountFormDrawer } from "@/features/discounts/components/DiscountFormDrawer";
import { DiscountViewDialog } from "@/features/discounts/components/DiscountViewDialog";
import { useDiscountMutations } from "@/features/discounts/hooks/use-discount-mutations";
import { useDiscountsList } from "@/features/discounts/hooks/use-discounts-list";
import { formatDiscountValue } from "@/features/discounts/mocks/discount-catalog.seed";
import { discountsService } from "@/features/discounts/services/discounts.service";
import type { Discount } from "@/features/discounts/types/discounts.types";
import {
  discountConditionChips,
  explainDiscountCase,
} from "@/features/discounts/utils/discount-case-guide";
import { AppButton, StatusBadge, type StatusBadgeVariant } from "@/shared/components";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  CrudBulkDeleteDialog,
  CrudDeleteDialog,
  CrudEntityNameCell,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
  useCrudBulkDelete,
  useCrudDialog,
  useCrudRowActions,
  useCrudTableBulkActions,
} from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { DemoDataBanner } from "@/shared/demo";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { useCrudPageGuidance } from "@/shared/guidance";

const STATUS_VARIANTS: Record<Discount["status"], StatusBadgeVariant> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  DRAFT: "info",
  EXPIRED: "warning",
};

export function DiscountsPage() {
  const t = useTranslation();
  const { language } = useLocalization();
  const guidance = useCrudPageGuidance("discounts");
  const { canCreate, canUpdate, canDelete } = useCrudPermissions(PERMISSIONS.MANAGE_DISCOUNT);
  const dialog = useCrudDialog<Discount>();
  const {
    items: discounts,
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
    sort,
    setSort,
    sortDefinitions,
    selection,
  } = useDiscountsList(25);

  const { bulkDelete, isBulkDeleting } = useCrudBulkDelete<Discount>({
    deleteFn: (discount) => discountsService.delete(discount.id),
    onSuccess: refetch,
  });

  const { tableSelectionProps, bulkDeleteDialogProps } = useCrudTableBulkActions({
    selection,
    canDelete,
    isDeleting: isBulkDeleting,
    onBulkDelete: async (ids) => {
      const entities = discounts.filter((discount) => ids.includes(discount.id));
      return bulkDelete(entities);
    },
  });

  const { deleteMutation, isDeleting } = useDiscountMutations({
    onSuccess: async () => {
      dialog.close();
      await refetch();
    },
  });

  const formMode = dialog.mode === "edit" ? "edit" : "create";
  const isFormOpen = dialog.mode === "create" || dialog.mode === "edit";

  const rowActions = useCrudRowActions<Discount>({ dialog, canUpdate, canDelete, t });

  const columns = useMemo(
    () => [
      {
        id: "code",
        hideable: false,
        header: t.discountCode,
        cell: (discount: Discount) => {
          const explained = explainDiscountCase(discount, language === "ar" ? "ar" : "en");
          return (
            <CrudEntityNameCell
              placeholder="%"
              size="sm"
              onClick={() => dialog.openView(discount)}
            >
              <div className="min-w-0 space-y-1">
                <p className="font-mono text-sm font-semibold text-foreground">{discount.code}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {discount.titleEn || discount.titleAr}
                </p>
                <p className="text-[11px] font-medium text-brand">{explained.caseLabel}</p>
              </div>
            </CrudEntityNameCell>
          );
        },
      },
      {
        id: "value",
        header: t.discountValue,
        className: "w-28",
        cell: (discount: Discount) => (
          <span className="font-semibold tabular-nums text-foreground">
            {formatDiscountValue(discount)}
          </span>
        ),
      },
      {
        id: "type",
        header: t.discountType,
        className: "w-36",
        cell: (discount: Discount) => (
          <span className="text-sm text-muted-foreground">
            {discount.type.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        id: "scope",
        header: t.discountScope,
        className: "w-28",
        cell: (discount: Discount) => (
          <span className="rounded-lg bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            {discount.scope}
          </span>
        ),
      },
      {
        id: "conditions",
        header: t.discountConditions,
        cell: (discount: Discount) => {
          const chips = discountConditionChips(discount);
          const explained = explainDiscountCase(discount, language === "ar" ? "ar" : "en");
          return (
            <div className="max-w-[280px] space-y-1.5">
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {explained.explanation}
              </p>
              {chips.length ? (
                <div className="flex flex-wrap gap-1">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-brand/20 bg-brand-muted px-1.5 py-0.5 text-[10px] font-semibold text-brand"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        },
      },
      {
        id: "status",
        header: t.status,
        className: "w-28 text-center",
        headerClassName: "text-center",
        cell: (discount: Discount) => {
          const label =
            discount.status === "ACTIVE"
              ? t.active
              : discount.status === "INACTIVE"
                ? t.inactive
                : discount.status === "DRAFT"
                  ? t.draft
                  : t.expired;
          return <StatusBadge label={label} variant={STATUS_VARIANTS[discount.status]} />;
        },
      },
      {
        id: "usage",
        header: t.discountUsage,
        className: "w-28",
        cell: (discount: Discount) => (
          <span className="tabular-nums text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{discount.usageCount}</span>
            {discount.usageLimit != null ? ` / ${discount.usageLimit}` : ""}
          </span>
        ),
      },
      {
        id: "priority",
        header: t.discountPriority,
        className: "w-24",
        cell: (discount: Discount) => (
          <span className="tabular-nums font-medium">{discount.priority}</span>
        ),
      },
    ],
    [dialog, language, t],
  );

  return (
    <CrudListPage
      {...guidance.pageProps}
      title={t.discounts}
      description={t.discountsPageDescription}
      actions={
        canCreate ? (
          <AppButton onClick={dialog.openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            {t.addDiscount}
          </AppButton>
        ) : undefined
      }
    >
      <DemoDataBanner className="mb-4" />
      <p className="-mt-2 mb-4 text-xs text-muted-foreground">{t.discountsDemoNote}</p>

      <div className="mb-5">
        <DiscountCasesGuide />
      </div>

      <CrudListSection>
        <CrudListTable
          guidanceAnchors={{
            search: guidance.searchDataGuidance,
            filters: guidance.filtersDataGuidance,
            rowActions: guidance.rowActionsDataGuidance,
          }}
          tableId="discounts"
          search={{ value: search, onChange: setSearch, onReset: resetSearch }}
          filters={{
            definitions: filterDefinitions,
            values: filters.values,
            onChange: filters.setFilter,
            onReset: filters.resetFilters,
            hasActiveFilters: filters.hasActiveFilters,
          }}
          sort={{ definitions: sortDefinitions, value: sort, onChange: setSort }}
          {...tableSelectionProps}
          columns={columns}
          data={discounts}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={(discount) => (
            <CrudTableActions
              entity={discount}
              actions={rowActions}
              ariaLabel={t.actions}
            />
          )}
          actionsHeader={t.actions}
          caption={t.discounts}
          showingLabel={`${t.showing} ${discounts.length} ${t.of} ${total} ${t.results}`}
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

      <DiscountViewDialog
        open={dialog.mode === "view"}
        discount={dialog.entity}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onEdit={(entity) => dialog.openEdit(entity)}
        onDelete={(entity) => dialog.openDelete(entity)}
      />

      <DiscountFormDrawer
        open={isFormOpen}
        mode={formMode}
        discount={dialog.entity}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onSuccess={refetch}
      />

      <CrudBulkDeleteDialog {...bulkDeleteDialogProps} />

      <CrudDeleteDialog
        open={dialog.mode === "delete"}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        entityLabel={dialog.entity?.code}
        isLoading={isDeleting}
        onConfirm={() => {
          if (dialog.entity) {
            void deleteMutation.mutate(dialog.entity);
          }
        }}
      />
    </CrudListPage>
  );
}
