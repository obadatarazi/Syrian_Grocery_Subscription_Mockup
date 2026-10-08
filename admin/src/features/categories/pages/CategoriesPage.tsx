import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Plus } from "lucide-react";
import { useMemo } from "react";

import { useCrudPermissions } from "@/features/auth";
import { CategoryFormDrawer } from "@/features/categories/components/CategoryFormDrawer";
import { CategoryViewDialog } from "@/features/categories/components/CategoryViewDialog";
import { useCategoriesList } from "@/features/categories/hooks/use-categories-list";
import {
  type CategoryQuickToggleField,
  useCategoryMutations,
} from "@/features/categories/hooks/use-category-mutations";
import { useCategoryTreeExpansion } from "@/features/categories/hooks/use-category-tree-expansion";
import { categoriesService } from "@/features/categories/services/categories.service";
import type { Category } from "@/features/categories/types/categories.types";
import { getCategoryDepthLabel } from "@/features/categories/utils/category-display.utils";
import {
  buildVisibleCategoryTreeRows,
  CATEGORY_TREE_INDENT_REM,
  getCategoryTreeRowClassName,
  type CategoryTreeRow,
} from "@/features/categories/utils/category-tree.utils";
import { AppButton, BilingualText, CategoryImagePlaceholder } from "@/shared/components";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  CrudBulkDeleteDialog,
  CrudDeleteDialog,
  CrudEntityNameCell,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
  CrudTableBooleanToggle,
  useCrudBulkDelete,
  useCrudDialog,
  useCrudQuickToggle,
  useCrudRowActions,
  useCrudTableBulkActions,
} from "@/shared/crud";
import { Button } from "@/shared/design-system/components/ui/button";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import {
  formatBilingualLabel,
  getBilingualDescription,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";
import { useCrudPageGuidance } from "@/shared/guidance";

function getCategoryLabel(category: Category) {
  return formatBilingualLabel(getBilingualTitle(category.translations, category.title));
}

function categoriesToFlatRows(categories: Category[]): CategoryTreeRow[] {
  return categories.map((category) => ({
    id: category.id,
    category,
    treeDepth: 0,
    hasChildren: false,
  }));
}

export function CategoriesPage() {
  const t = useTranslation();
  const guidance = useCrudPageGuidance("categories");
  const { canCreate, canUpdate, canDelete } = useCrudPermissions(PERMISSIONS.MANAGE_CATEGORY);
  const dialog = useCrudDialog<Category>();
  const {
    items: categories,
    search,
    setSearch,
    resetSearch,
    page,
    setPage,
    setPageSize,
    total,
    pageSize,
    isLoading,
    isFetching,
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
    scopeDepth,
  } = useCategoriesList();

  const isDepthScope = scopeDepth != null;

  const treeResetKey = useMemo(
    () =>
      [
        search,
        sort,
        filters.values.categoryScope,
        filters.values.publish,
        filters.values.showMenu,
        filters.values.showInHomePage,
        filters.values.feature,
      ].join("|"),
    [filters.values, search, sort],
  );

  const treeExpansion = useCategoryTreeExpansion(treeResetKey, {
    autoExpandEmbedded: search.trim().length > 0 && !isDepthScope,
    categories,
  });

  const tableRows = useMemo(() => {
    if (isDepthScope) {
      return categoriesToFlatRows(categories);
    }

    return buildVisibleCategoryTreeRows(
      categories,
      treeExpansion.expandedIds,
      treeExpansion.resolveChildren,
      treeExpansion.resolveCategory,
    );
  }, [
    categories,
    isDepthScope,
    treeExpansion.expandedIds,
    treeExpansion.resolveChildren,
  ]);

  const { bulkDelete, isBulkDeleting } = useCrudBulkDelete<Category>({
    deleteFn: (category) => categoriesService.delete(category.id),
    onSuccess: refetch,
  });

  const { tableSelectionProps, bulkDeleteDialogProps } = useCrudTableBulkActions({
    selection,
    canDelete,
    isDeleting: isBulkDeleting,
    onBulkDelete: async (ids) => {
      const entities = tableRows
        .map((row) => row.category)
        .filter((category) => ids.includes(category.id));
      return bulkDelete(entities);
    },
  });

  const { deleteMutation, quickToggle, isDeleting } = useCategoryMutations({
    onSuccess: refetch,
  });
  const { handleToggle, isToggleLoading } = useCrudQuickToggle<Category>({
    patchItems,
    patchEntity: (entity, field, value) => {
      treeExpansion.patchCategory(entity.id, { [field]: value } as Partial<Category>);
    },
    toggle: (entity, field, value) =>
      quickToggle(entity, field as CategoryQuickToggleField, value),
  });

  const formMode = dialog.mode === "edit" ? "edit" : "create";
  const isFormOpen = dialog.mode === "create" || dialog.mode === "edit";

  const rowActions = useCrudRowActions<Category>({ dialog, canUpdate, canDelete, t });

  const columns = useMemo(
    () => [
      {
        id: "name",
        hideable: false,
        header: t.name,
        className: "min-w-[240px]",
        cell: (row: CategoryTreeRow) => {
          const { category, treeDepth, hasChildren } = row;
          const isExpanded = treeExpansion.isExpanded(category.id);
          const isLoadingChildren = treeExpansion.isLoadingChildren(category.id);

          return (
            <div
              className="flex min-w-0 items-center gap-1"
              style={{ paddingInlineStart: `${treeDepth * CATEGORY_TREE_INDENT_REM}rem` }}
            >
              {hasChildren ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground"
                  aria-label={
                    isExpanded ? t.collapseCategoryChildren : t.expandCategoryChildren
                  }
                  aria-expanded={isExpanded}
                  disabled={isLoadingChildren}
                  onClick={() => void treeExpansion.toggleExpanded(category)}
                >
                  {isExpanded ? (
                    <ChevronDown className="size-4" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="size-4" aria-hidden="true" />
                  )}
                </Button>
              ) : (
                <span className="inline-flex size-7 shrink-0" aria-hidden="true" />
              )}

              <CrudEntityNameCell
                imageUrl={category.featureImageFileUrl}
                placeholder={<CategoryImagePlaceholder />}
                onClick={() => dialog.openView(category)}
              >
                <BilingualText values={getBilingualTitle(category.translations, category.title)} />
              </CrudEntityNameCell>
            </div>
          );
        },
      },
      {
        id: "description",
        header: t.description,
        className: "max-w-xs",
        cell: (row: CategoryTreeRow) => (
          <div className="line-clamp-2">
            <BilingualText
              values={getBilingualDescription(
                row.category.translations,
                row.category.description,
              )}
              titleClassName="font-normal text-muted-foreground"
            />
          </div>
        ),
      },
      {
        id: "depth",
        header: t.depth,
        cell: (row: CategoryTreeRow) => (
          <span className="text-sm text-muted-foreground">
            {getCategoryDepthLabel(row.category.depth, t)}
          </span>
        ),
      },
      {
        id: "showMenu",
        header: t.showMenu,
        className: "w-28 text-center",
        headerClassName: "text-center",
        cell: (row: CategoryTreeRow) => (
          <CrudTableBooleanToggle
            entity={row.category}
            field="showMenu"
            checked={row.category.showMenu ?? false}
            canUpdate={canUpdate}
            isLoading={isToggleLoading(row.category.id, "showMenu")}
            ariaLabel={`${t.showMenu}: ${getCategoryLabel(row.category)}`}
            onToggle={(entity, field, value) => void handleToggle(entity, field, value)}
          />
        ),
      },
      {
        id: "showInHomePage",
        header: t.showInHomePage,
        className: "hidden w-32 text-center lg:table-cell",
        headerClassName: "hidden text-center lg:table-cell",
        cell: (row: CategoryTreeRow) => (
          <CrudTableBooleanToggle
            entity={row.category}
            field="showInHomePage"
            checked={row.category.showInHomePage ?? false}
            canUpdate={canUpdate}
            isLoading={isToggleLoading(row.category.id, "showInHomePage")}
            ariaLabel={`${t.showInHomePage}: ${getCategoryLabel(row.category)}`}
            onToggle={(entity, field, value) => void handleToggle(entity, field, value)}
          />
        ),
      },
      {
        id: "feature",
        header: t.featured,
        className: "hidden w-28 text-center xl:table-cell",
        headerClassName: "hidden text-center xl:table-cell",
        cell: (row: CategoryTreeRow) => (
          <CrudTableBooleanToggle
            entity={row.category}
            field="feature"
            checked={row.category.feature ?? false}
            canUpdate={canUpdate}
            isLoading={isToggleLoading(row.category.id, "feature")}
            ariaLabel={`${t.featured}: ${getCategoryLabel(row.category)}`}
            onToggle={(entity, field, value) => void handleToggle(entity, field, value)}
          />
        ),
      },
      {
        id: "status",
        header: t.status,
        className: "w-28 text-center",
        headerClassName: "text-center",
        cell: (row: CategoryTreeRow) => (
          <CrudTableBooleanToggle
            entity={row.category}
            field="publish"
            checked={row.category.publish ?? false}
            canUpdate={canUpdate}
            isLoading={isToggleLoading(row.category.id, "publish")}
            ariaLabel={`${t.status}: ${getCategoryLabel(row.category)}`}
            onToggle={(entity, field, value) => void handleToggle(entity, field, value)}
          />
        ),
      },
    ],
    [canUpdate, dialog, handleToggle, isToggleLoading, t, treeExpansion],
  );

  return (
    <CrudListPage
      {...guidance.pageProps}
      title={t.categories}
      actions={
        canCreate ? (
          <AppButton onClick={dialog.openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            {t.addCategory}
          </AppButton>
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
          tableId="categories"
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
            isDepthScope ? undefined : (
              <div className="flex flex-wrap items-center gap-2">
                <AppButton
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl text-xs"
                  onClick={() => treeExpansion.expandAll(categories)}
                >
                  <ChevronsUpDown className="size-3.5" aria-hidden="true" />
                  {t.expandAllCategories}
                </AppButton>
                <AppButton
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl text-xs"
                  onClick={treeExpansion.collapseAll}
                >
                  <ChevronsDownUp className="size-3.5" aria-hidden="true" />
                  {t.collapseAllCategories}
                </AppButton>
              </div>
            )
          }
          {...tableSelectionProps}
          columns={columns}
          data={tableRows}
          getRowClassName={(row) => getCategoryTreeRowClassName(row.treeDepth)}
          isLoading={isLoading || isFetching}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={(row) => (
            <CrudTableActions entity={row.category} actions={rowActions} ariaLabel={t.actions} />
          )}
          actionsHeader={t.actions}
          caption={t.categories}
          showingLabel={`${t.showing} ${tableRows.length} ${t.of} ${total} ${t.results}`}
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

      <CategoryViewDialog
        open={dialog.mode === "view"}
        category={dialog.entity}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onEdit={(category) => dialog.openEdit(category)}
        onDelete={(category) => dialog.openDelete(category)}
      />

      <CategoryFormDrawer
        open={isFormOpen}
        mode={formMode}
        category={dialog.entity}
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
        entityLabel={dialog.entity ? getCategoryLabel(dialog.entity) : undefined}
        isLoading={isDeleting}
        onConfirm={async () => {
          if (dialog.entity) {
            const deletedId = dialog.entity.id;
            const result = await deleteMutation.mutate(dialog.entity);
            if (result.ok) {
              treeExpansion.pruneDeletedCategory(deletedId);
              dialog.close();
            }
          }
        }}
      />
    </CrudListPage>
  );
}
