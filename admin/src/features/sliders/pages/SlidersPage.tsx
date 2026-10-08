import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { useCrudPermissions } from "@/features/auth";
import { SliderFormDrawer } from "@/features/sliders/components/SliderFormDrawer";
import {
  type SliderQuickToggleField,
  useSliderMutations,
} from "@/features/sliders/hooks/use-slider-mutations";
import { useSlidersList } from "@/features/sliders/hooks/use-sliders-list";
import { slidersService } from "@/features/sliders/services/sliders.service";
import type { Slider } from "@/features/sliders/types/sliders.types";
import { AppButton, BilingualText, MediaImage } from "@/shared/components";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  CrudBulkDeleteDialog,
  CrudDeleteDialog,
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
  CrudTableBooleanToggle,
  useCrudBulkDelete,
  useCrudDialog,
  useCrudQuickToggle,
  useCrudTableBulkActions,
} from "@/shared/crud";
import type { CrudRowAction } from "@/shared/crud/types/crud.types";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import {
  formatBilingualLabel,
  getBilingualDescription,
  getBilingualTitle,
} from "@/shared/lib/translation-display.utils";
import { useCrudPageGuidance } from "@/shared/guidance";

export function SlidersPage() {
  const t = useTranslation();
  const guidance = useCrudPageGuidance("sliders");
  const { canCreate, canUpdate, canDelete } = useCrudPermissions(PERMISSIONS.MANAGE_SLIDER);
  const dialog = useCrudDialog<Slider>();
  const {
    items: sliders,
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
  } = useSlidersList();

  const { bulkDelete, isBulkDeleting } = useCrudBulkDelete<Slider>({
    deleteFn: (slider) => slidersService.delete(slider.id),
    onSuccess: refetch,
  });

  const { tableSelectionProps, bulkDeleteDialogProps } = useCrudTableBulkActions({
    selection,
    canDelete,
    isDeleting: isBulkDeleting,
    onBulkDelete: async (ids) => {
      const entities = sliders.filter((slider) => ids.includes(slider.id));
      return bulkDelete(entities);
    },
  });

  const { deleteMutation, quickToggle, isDeleting } = useSliderMutations({
    onSuccess: async () => {
      dialog.close();
      await refetch();
    },
  });
  const { handleToggle, isToggleLoading } = useCrudQuickToggle<Slider>({
    patchItems,
    toggle: (entity, field, value) =>
      quickToggle(entity, field as SliderQuickToggleField, value),
  });

  const formMode = dialog.mode === "edit" ? "edit" : "create";
  const isFormOpen = dialog.mode === "create" || dialog.mode === "edit";

  const rowActions = useMemo<CrudRowAction<Slider>[]>(() => {
    const actions: CrudRowAction<Slider>[] = [];

    if (canUpdate) {
      actions.push({
        id: "edit",
        label: t.editAction,
        icon: Pencil,
        onSelect: (slider) => dialog.openEdit(slider),
      });
    }

    if (canDelete) {
      actions.push({
        id: "delete",
        label: t.deleteAction,
        icon: Trash2,
        variant: "destructive",
        onSelect: (slider) => dialog.openDelete(slider),
      });
    }

    return actions;
  }, [canDelete, canUpdate, dialog, t]);

  const columns = useMemo(
    () => [
      {
        id: "media",
        header: t.sliderMedia,
        cell: (slider: Slider) =>
          slider.imageFileUrl ? (
            <MediaImage src={slider.imageFileUrl} alt="" className="size-12 rounded-lg object-cover" />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "title",
        header: t.name,
        cell: (slider: Slider) => (
          <BilingualText values={getBilingualTitle(slider.translations, slider.title)} />
        ),
      },
      {
        id: "description",
        header: t.description,
        className: "max-w-xs",
        cell: (slider: Slider) => (
          <BilingualText
            values={getBilingualDescription(slider.translations, slider.description)}
            titleClassName="font-normal"
          />
        ),
      },
      {
        id: "status",
        header: t.status,
        className: "w-28 text-center",
        headerClassName: "text-center",
        cell: (slider: Slider) => (
          <CrudTableBooleanToggle
            entity={slider}
            field="publish"
            checked={slider.publish ?? false}
            canUpdate={canUpdate}
            isLoading={isToggleLoading(slider.id, "publish")}
            ariaLabel={`${t.status}: ${formatBilingualLabel(getBilingualTitle(slider.translations, slider.title))}`}
            onToggle={(entity, field, value) => void handleToggle(entity, field, value)}
          />
        ),
      },
    ],
    [canUpdate, handleToggle, isToggleLoading, t],
  );

  return (
    <CrudListPage
      {...guidance.pageProps}
      title={t.sliders}
      actions={
        canCreate ? (
          <AppButton onClick={dialog.openCreate}>
            <Plus className="size-4" aria-hidden="true" />
            {t.addSlider}
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
          tableId="sliders"
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
          data={sliders}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={
            rowActions.length > 0
              ? (slider) => (
                  <CrudTableActions entity={slider} actions={rowActions} ariaLabel={t.actions} />
                )
              : undefined
          }
          actionsHeader={rowActions.length > 0 ? t.actions : undefined}
          caption={t.sliders}
          showingLabel={`${t.showing} ${sliders.length} ${t.of} ${total} ${t.results}`}
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

      <SliderFormDrawer
        open={isFormOpen}
        mode={formMode}
        slider={dialog.entity}
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
        entityLabel={dialog.entity?.title}
        isLoading={isDeleting}
        onConfirm={() => {
          if (dialog.entity) void deleteMutation.mutate(dialog.entity);
        }}
      />
    </CrudListPage>
  );
}
