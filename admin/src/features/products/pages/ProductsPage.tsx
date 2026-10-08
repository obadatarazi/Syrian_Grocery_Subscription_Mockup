import { Plus, Star, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useCrudPermissions } from "@/features/auth";
import { ProductFormDrawer } from "@/features/products/components/ProductFormDrawer";
import { ProductImportDialog } from "@/features/products/components/ProductImportDialog";
import { ProductQuickEditDrawer } from "@/features/products/components/ProductQuickEditDrawer";
import { ProductRowTitleCell } from "@/features/products/components/ProductRowTitleCell";
import { ProductViewDialog } from "@/features/products/components/ProductViewDialog";
import { ProductVisibilityBadges } from "@/features/products/components/ProductVisibilityBadges";
import {
  type ProductQuickToggleField,
  useProductMutations,
} from "@/features/products/hooks/use-product-mutations";
import { useProductsList } from "@/features/products/hooks/use-products-list";
import { productsService } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/products.types";
import {
  formatProductPriceLabel,
  formatProductStockLabel,
} from "@/features/products/utils/product-display.utils";
import { normalizeProductType } from "@/features/products/utils/variant-attribute.utils";
import { AppButton, ConfirmDialog, StatusBadge } from "@/shared/components";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  CRUD_FILTER_ALL_VALUE,
  type CrudBulkBooleanField,
  CrudBulkBooleanMenu,
  CrudBulkDeleteDialog,
  CrudDeleteDialog,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  useCrudBulkBooleanMutation,
  useCrudBulkDelete,
  useCrudDialog,
  useCrudQuery,
  useCrudQuickToggle,
  useCrudTableBulkActions,
} from "@/shared/crud";
import { cn } from "@/shared/design-system/components/ui/utils";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import {
  formatBilingualLabel,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";
import { useCrudPageGuidance } from "@/shared/guidance";
import { useOpenEntityFromUrl } from "@/shared/hooks/use-open-entity-from-url";

export function ProductsPage() {
  const t = useTranslation();
  const guidance = useCrudPageGuidance("products");
  const { canCreate, canUpdate, canDelete, canManage } = useCrudPermissions(PERMISSIONS.MANAGE_PRODUCT);
  const dialog = useCrudDialog<Product>();
  useOpenEntityFromUrl(dialog.openView);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [duplicateProduct, setDuplicateProduct] = useState<Product | null>(null);
  const {
    items: products,
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
    patchItems,
    filters,
    filterDefinitions,
    sort,
    setSort,
    sortDefinitions,
    selection,
  } = useProductsList();

  const { bulkDelete, isBulkDeleting } = useCrudBulkDelete<Product>({
    deleteFn: (product) => productsService.delete(product.id),
    onSuccess: refetch,
  });

  const { bulkUpdate, isBulkUpdating } = useCrudBulkBooleanMutation({
    updateFn: (id, data) => productsService.update(Number(id), data),
    onSuccess: refetch,
  });

  const productBulkBooleanFields = useMemo<CrudBulkBooleanField[]>(
    () => [
      { field: "featured", label: t.featured },
      { field: "bestSeller", label: t.bestSeller },
      { field: "newlyArrived", label: t.newlyArrived },
      { field: "isProductYouWillLove", label: t.isProductYouWillLove },
      {
        field: "publish",
        label: t.status,
        enableLabel: t.bulkPublish,
        disableLabel: t.bulkUnpublish,
      },
    ],
    [t],
  );

  const handleBulkBooleanUpdate = useCallback(
    async (field: string, value: boolean) => {
      const result = await bulkUpdate(selection.selectedIds, field, value);
      if (result.failedIds.length === 0) {
        selection.clearSelection();
        return;
      }

      const failedIdSet = new Set(result.failedIds.map(String));
      selection.setSelectedIds(
        selection.selectedIds.filter((id) => failedIdSet.has(String(id))),
      );
    },
    [bulkUpdate, selection],
  );

  const { tableSelectionProps, bulkDeleteDialogProps } = useCrudTableBulkActions({
    selection,
    canDelete,
    isDeleting: isBulkDeleting || isBulkUpdating,
    renderExtraActions: () => (
      <CrudBulkBooleanMenu
        fields={productBulkBooleanFields}
        disabled={!canUpdate || isBulkUpdating || isBulkDeleting}
        onUpdate={handleBulkBooleanUpdate}
      />
    ),
    onBulkDelete: async (ids) => {
      const entities = products.filter((product) => ids.includes(product.id));
      return bulkDelete(entities);
    },
  });

  const { deleteMutation, duplicateMutation, quickToggle, isDeleting, isDuplicating } =
    useProductMutations({
      onSuccess: async () => {
        await refetch();
      },
    });
  const { handleToggle: toggleProductVisibility, isToggleLoading } = useCrudQuickToggle<Product>({
    patchItems,
    toggle: (entity, field, value) =>
      quickToggle(entity, field as ProductQuickToggleField, value),
  });

  const handleToggle = useCallback(
    async (product: Product, field: ProductQuickToggleField, value: boolean) => {
      await toggleProductVisibility(product, field, value);
      guidance.completeChecklistItem("try-visibility");
    },
    [guidance, toggleProductVisibility],
  );

  const formMode = dialog.mode === "edit" ? "edit" : "create";
  const isFormOpen = dialog.mode === "create" || dialog.mode === "edit";

  const { data: productDetail } = useCrudQuery({
    queryKey: ["products", "detail", String(dialog.entity?.id ?? "")],
    queryFn: () => productsService.getById(dialog.entity!.id),
    enabled: dialog.mode === "view" && Boolean(dialog.entity?.id),
  });

  const viewingProduct = useMemo(() => {
    if (!dialog.entity || dialog.mode !== "view") return null;
    // Prefer details / list row. Never render a URL stub `{ id }` — it crashes the view dialog.
    return (
      productDetail ??
      products.find((product) => product.id === dialog.entity?.id) ??
      null
    );
  }, [dialog.entity, dialog.mode, productDetail, products]);

  const openQuickEdit = useCallback(
    (product: Product) => {
      setQuickEditProduct(product);
      setIsQuickEditOpen(true);
      guidance.completeChecklistItem("try-quick-edit");
    },
    [guidance],
  );

  const applyFilterFromTable = useCallback(
    (filterId: "brandId" | "categoryId" | "tagId", value: string) => {
      filters.setFilter(filterId, value);
      setPage(1);
    },
    [filters, setPage],
  );
  const activeBrandId =
    filters.values.brandId && filters.values.brandId !== CRUD_FILTER_ALL_VALUE
      ? filters.values.brandId
      : undefined;
  const activeCategoryId =
    filters.values.categoryId && filters.values.categoryId !== CRUD_FILTER_ALL_VALUE
      ? filters.values.categoryId
      : undefined;
  const activeTagId =
    filters.values.tagId && filters.values.tagId !== CRUD_FILTER_ALL_VALUE
      ? filters.values.tagId
      : undefined;
  const activeBadgeValue =
    filters.values.badge && filters.values.badge !== CRUD_FILTER_ALL_VALUE
      ? filters.values.badge
      : undefined;
  const activeBadgeLabel = useMemo(() => {
    if (!activeBadgeValue) return null;

    const badgeLabels: Record<string, string> = {
      featured: t.featured,
      bestSeller: t.bestSeller,
      newlyArrived: t.newlyArrived,
      isProductYouWillLove: t.isProductYouWillLove,
    };

    return badgeLabels[activeBadgeValue] ?? null;
  }, [activeBadgeValue, t]);
  const activeBrandLabel = useMemo(() => {
    if (!activeBrandId) return null;
    const brand = products.find((product) => String(product.brand.id) === activeBrandId)?.brand;
    return brand?.title ?? `#${activeBrandId}`;
  }, [activeBrandId, products]);
  const activeCategoryLabel = useMemo(() => {
    if (!activeCategoryId) return null;
    const category = products
      .flatMap((product) => product.categories)
      .find((item) => String(item.id) === activeCategoryId);
    return category?.title ?? `#${activeCategoryId}`;
  }, [activeCategoryId, products]);
  const activeTagLabel = useMemo(() => {
    if (!activeTagId) return null;
    const tag = products
      .flatMap((product) => product.tags)
      .find((item) => String(item.id) === activeTagId);
    return tag?.title ?? `#${activeTagId}`;
  }, [activeTagId, products]);

  const firstProductId = products[0]?.id;

  const columns = useMemo(
    () => [
      {
        id: "name",
        hideable: false,
        header: t.product,
        className: "min-w-[280px] text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <ProductRowTitleCell
            product={product}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canCreate={canCreate}
            isDuplicating={isDuplicating}
            onEdit={dialog.openEdit}
            onQuickEdit={openQuickEdit}
            onDelete={dialog.openDelete}
            onDuplicate={setDuplicateProduct}
            onOpenTitle={dialog.openView}
            dataGuidance={
              product.id === firstProductId ? guidance.rowActionsDataGuidance : undefined
            }
          />
        ),
      },
      {
        id: "brand",
        header: t.brand,
        className: "text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) =>
          product.brand?.id ? (
          <button
            type="button"
            className="text-sm font-medium text-brand transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
            onClick={() => applyFilterFromTable("brandId", String(product.brand.id))}
          >
            {product.brand.title || "—"}
          </button>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          ),
      },
      {
        id: "categories",
        header: t.categoriesCol,
        className: "max-w-xs text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {product.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground transition hover:bg-brand-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
                onClick={() => applyFilterFromTable("categoryId", String(category.id))}
              >
                {category.title}
              </button>
            ))}
          </div>
        ),
      },
      {
        id: "tags",
        header: t.tags,
        defaultHidden: true,
        className: "max-w-xs text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {product.tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground transition hover:bg-brand-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
                onClick={() => applyFilterFromTable("tagId", String(tag.id))}
              >
                {tag.title}
              </button>
            ))}
          </div>
        ),
      },
      {
        id: "type",
        header: t.productType,
        className: "text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <StatusBadge
            label={normalizeProductType(product.type) === "SIMPLE" ? t.productTypeSimple : t.productTypeVariant}
            variant="neutral"
          />
        ),
      },
      {
        id: "price",
        header: t.price,
        className: "text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <span className="text-xs font-bold text-foreground">
            {formatProductPriceLabel(product, t.priceFrom)}
          </span>
        ),
      },
      {
        id: "stock",
        header: t.stock,
        className: "text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => {
          const stockLabel = formatProductStockLabel(product, {
            inStock: t.inStockWithCount,
            lowStock: t.lowStockWithCount,
            outOfStock: t.stockOutOfStock,
          });

          return (
            <span
              className={cn(
                "text-xs font-semibold",
                stockLabel.status === "OUT_OF_STOCK" && "text-rose-600",
                stockLabel.status === "LOW_STOCK" && "text-amber-600",
                stockLabel.status === "IN_STOCK" && "text-emerald-700",
              )}
            >
              {stockLabel.text}
            </span>
          );
        },
      },
      {
        id: "rating",
        header: t.rating,
        className: "text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-600">
            {product.averageRating != null ? (
              <>
                <Star className="size-3 fill-current" aria-hidden="true" />
                {product.averageRating}
              </>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </span>
        ),
      },
      {
        id: "visibility",
        header: t.productVisibility,
        className: "whitespace-nowrap text-center align-middle",
        headerClassName: "text-center align-middle",
        cell: (product: Product) => (
          <ProductVisibilityBadges
            product={product}
            compact
            canUpdate={canUpdate}
            onToggle={(field, value) => void handleToggle(product, field, value)}
            isToggleLoading={(field) => isToggleLoading(product.id, field)}
            dataGuidance={
              product.id === firstProductId ? guidance.statusDataGuidance : undefined
            }
          />
        ),
      },
    ],
    [
      applyFilterFromTable,
      canCreate,
      canDelete,
      canUpdate,
      dialog.openDelete,
      dialog.openEdit,
      dialog.openView,
      firstProductId,
      guidance.rowActionsDataGuidance,
      guidance.statusDataGuidance,
      handleToggle,
      isDuplicating,
      isToggleLoading,
      openQuickEdit,
      t,
    ],
  );

  return (
    <CrudListPage
      {...guidance.pageProps}
      title={t.products2}
      actions={
        canCreate || canManage ? (
          <div className="flex flex-wrap items-center gap-2">
            {canManage ? (
              <AppButton variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                <Upload className="size-4" aria-hidden="true" />
                {t.importData}
              </AppButton>
            ) : null}
            {canCreate ? (
              <AppButton onClick={dialog.openCreate}>
                <Plus className="size-4" aria-hidden="true" />
                {t.addProduct}
              </AppButton>
            ) : null}
          </div>
        ) : undefined
      }
    >
      <CrudListSection>
        <CrudListTable
          guidanceAnchors={{
            search: guidance.searchDataGuidance,
            filters: guidance.filtersDataGuidance,
            rowActions: guidance.rowActionsDataGuidance,
          }}
          tableId="products"
          search={{ value: search, onChange: setSearch, onReset: resetSearch }}
          filters={{
            definitions: filterDefinitions,
            values: filters.values,
            onChange: filters.setFilter,
            onReset: filters.resetFilters,
            hasActiveFilters: filters.hasActiveFilters,
          }}
          sort={{ definitions: sortDefinitions, value: sort, onChange: setSort }}
          toolbarActions={
            activeBrandLabel || activeCategoryLabel || activeTagLabel || activeBadgeLabel ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeBadgeLabel ? (
                  <AppButton
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                    onClick={() => {
                      filters.setFilter("badge", CRUD_FILTER_ALL_VALUE);
                      setPage(1);
                    }}
                  >
                    {t.productBadge}: {activeBadgeLabel} ×
                  </AppButton>
                ) : null}
                {activeBrandLabel ? (
                  <AppButton
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                    onClick={() => applyFilterFromTable("brandId", CRUD_FILTER_ALL_VALUE)}
                  >
                    {t.brand}: {activeBrandLabel} ×
                  </AppButton>
                ) : null}
                {activeCategoryLabel ? (
                  <AppButton
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                    onClick={() => applyFilterFromTable("categoryId", CRUD_FILTER_ALL_VALUE)}
                  >
                    {t.categoriesCol}: {activeCategoryLabel} ×
                  </AppButton>
                ) : null}
                {activeTagLabel ? (
                  <AppButton
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-lg text-xs"
                    onClick={() => applyFilterFromTable("tagId", CRUD_FILTER_ALL_VALUE)}
                  >
                    {t.tags}: {activeTagLabel} ×
                  </AppButton>
                ) : null}
              </div>
            ) : undefined
          }
          {...tableSelectionProps}
          columns={columns}
          data={products}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          showingLabel={`${t.showing} ${products.length} ${t.of} ${total} ${t.results}`}
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
          caption={t.products2}
        />
      </CrudListSection>

      <ProductViewDialog
        open={dialog.mode === "view"}
        product={viewingProduct}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onEdit={(product) => dialog.openEdit(product)}
        onDelete={(product) => dialog.openDelete(product)}
        onToggle={(product, field, value) => void handleToggle(product, field, value)}
        isToggleLoading={isToggleLoading}
      />

      <ProductFormDrawer
        open={isFormOpen}
        mode={formMode}
        product={dialog.entity}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onSuccess={refetch}
      />

      <ProductQuickEditDrawer
        open={isQuickEditOpen}
        product={quickEditProduct}
        onOpenChange={(open) => {
          setIsQuickEditOpen(open);
          if (!open) setQuickEditProduct(null);
        }}
        onSuccess={refetch}
      />

      <ProductImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onSuccess={refetch}
      />

      <CrudBulkDeleteDialog {...bulkDeleteDialogProps} />

      <ConfirmDialog
        open={duplicateProduct != null}
        onOpenChange={(open) => {
          if (!open && !isDuplicating) setDuplicateProduct(null);
        }}
        title={t.productDuplicateConfirmTitle}
        description={
          duplicateProduct
            ? `${formatBilingualLabel(
                getBilingualTitle(duplicateProduct.translations, duplicateProduct.title),
              )}. ${t.productDuplicateConfirmDescription}`
            : t.productDuplicateConfirmDescription
        }
        confirmLabel={t.productDuplicateConfirm}
        cancelLabel={t.cancel}
        isLoading={isDuplicating}
        onConfirm={async () => {
          if (!duplicateProduct) return;
          const result = await duplicateMutation.mutate(duplicateProduct);
          if (result.ok) setDuplicateProduct(null);
        }}
      />

      <CrudDeleteDialog
        open={dialog.mode === "delete"}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        entityLabel={
          dialog.entity
            ? formatBilingualLabel(
                getBilingualTitle(dialog.entity.translations, dialog.entity.title),
              )
            : undefined
        }
        isLoading={isDeleting}
        onConfirm={async () => {
          if (dialog.entity) {
            const result = await deleteMutation.mutate(dialog.entity);
            if (result.ok) dialog.close();
          }
        }}
      />
    </CrudListPage>
  );
}
