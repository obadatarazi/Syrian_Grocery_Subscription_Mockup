import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useAbility, useCrudPermissions } from "@/features/auth";
import { useInvoicePdfDownload } from "@/features/invoices/hooks/use-invoice-pdf-download";
import { OrderCreatedByCell } from "@/features/orders/components/OrderCreatedByCell";
import { OrderCustomerCell } from "@/features/orders/components/OrderCustomerCell";
import { OrderDocumentActions } from "@/features/orders/components/OrderDocumentActions";
import { OrderFormDrawer } from "@/features/orders/components/OrderFormDrawer";
import { OrderItemsQuickDialog } from "@/features/orders/components/OrderItemsQuickDialog";
import { OrderRowTitleCell } from "@/features/orders/components/OrderRowTitleCell";
import { OrderStatusQuickAction } from "@/features/orders/components/OrderStatusQuickAction";
import { OrderViewDialog } from "@/features/orders/components/OrderViewDialog";
import { useOrderMutations } from "@/features/orders/hooks/use-order-mutations";
import { useOrderPackingSlipDownload } from "@/features/orders/hooks/use-order-packing-slip-download";
import { useOrdersList } from "@/features/orders/hooks/use-orders-list";
import { ordersService } from "@/features/orders/services/orders.service";
import type { Order } from "@/features/orders/types/orders.types";
import { mapOrderToPartyDisplay } from "@/features/orders/utils/order-customer-display";
import { getOrderPaymentLabel } from "@/features/orders/utils/map-order-from-api";
import { formatKwd } from "@/features/products/utils/product-display.utils";
import { AppButton } from "@/shared/components";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  CrudListPage,
  CrudListSection,
  CrudListTable,
  CrudTableActions,
  useCrudDialog,
  useCrudQuery,
  useCrudRowActions,
} from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { resolveServiceErrorMessage } from "@/shared/errors";
import { GuidanceHotspot } from "@/shared/guidance/components/GuidanceHotspot";
import { ordersGuidanceConfig } from "@/shared/guidance/configs/guidance-configs";
import { useCrudPageGuidance } from "@/shared/guidance/hooks/use-crud-page-guidance";
import { useOpenEntityFromUrl } from "@/shared/hooks/use-open-entity-from-url";
import { formatDateTime } from "@/shared/lib/datetime.utils";

function statusVariant(value?: string | null): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (value) {
    case "COMPLETED":
    case "DELIVERED":
      return "success";
    case "PENDING_PAYMENT":
    case "PROCESSING":
    case "ON_HOLD":
      return "warning";
    case "CANCELLED":
    case "REFUNDED":
      return "danger";
    default:
      return "neutral";
  }
}

export function OrdersPage() {
  const t = useTranslation();
  const { language } = useLocalization();
  const ability = useAbility();
  const guidance = useCrudPageGuidance("orders", ordersGuidanceConfig);
  const { canCreate, canUpdate } = useCrudPermissions(PERMISSIONS.MANAGE_ORDER);
  const canDownloadPackingSlip = ability.can(PERMISSIONS.PERMISSION_DOWNLOAD_ORDER, "all");
  const canDownloadInvoice = ability.can(PERMISSIONS.PERMISSION_DOWNLOAD_INVOICE, "all");
  const dialog = useCrudDialog<Order>();
  useOpenEntityFromUrl(dialog.openView);
  const { downloadPackingSlip, isDownloading: isPackingSlipDownloading } =
    useOrderPackingSlipDownload();
  const { downloadPdf, isDownloading: isInvoiceDownloading } = useInvoicePdfDownload();
  const [pendingDocumentOrderId, setPendingDocumentOrderId] = useState<number | null>(null);
  const [itemsOrder, setItemsOrder] = useState<Order | null>(null);
  const {
    items: orders,
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
    statusOptions,
    orderRefNumber,
    clearOrderRefNumber,
  } = useOrdersList();

  const { quickUpdateStatus, isStatusUpdating } = useOrderMutations();

  const handleChangeStatus = useCallback(
    async (order: Order, status: string) => {
      await quickUpdateStatus(order, status);
      const label = statusOptions.find((option) => option.value === status)?.label ?? status;
      patchItems((items) =>
        items.map((item) =>
          item.id === order.id
            ? {
                ...item,
                status: {
                  value: status,
                  label,
                },
              }
            : item,
        ),
      );
      guidance.completeChecklistItem("change-status");
      guidance.dismissHotspot("status");
    },
    [guidance, patchItems, quickUpdateStatus, statusOptions],
  );

  const formMode = dialog.mode === "edit" ? "edit" : "create";
  const isFormOpen = dialog.mode === "create" || dialog.mode === "edit";
  const firstOrderId = orders[0]?.id;

  // List is slim (no items/address). View loads Details via getById — same pattern as Products.
  const { data: orderDetail } = useCrudQuery({
    queryKey: ["orders", "detail", String(dialog.entity?.id ?? "")],
    queryFn: () => ordersService.getById(dialog.entity!.id),
    enabled: dialog.mode === "view" && Boolean(dialog.entity?.id),
  });

  const viewingOrder = useMemo(() => {
    if (!dialog.entity || dialog.mode !== "view") return null;
    return (
      orderDetail ??
      orders.find((order) => order.id === dialog.entity?.id) ??
      dialog.entity
    );
  }, [dialog.entity, dialog.mode, orderDetail, orders]);

  const rowActions = useCrudRowActions<Order>({
    dialog,
    canUpdate,
    canDelete: false,
    t,
  });

  const columns = useMemo(
    () => [
      {
        id: "orderNum",
        hideable: false,
        header: t.orderNum,
        className: "min-w-[11rem]",
        cell: (order: Order) => (
          <OrderRowTitleCell
            order={order}
            canUpdate={canUpdate}
            statusOptions={statusOptions}
            isStatusUpdating={isStatusUpdating}
            onView={dialog.openView}
            onEdit={dialog.openEdit}
            onChangeStatus={(entity, status) => void handleChangeStatus(entity, status)}
          />
        ),
      },
      {
        id: "customer",
        header: t.customer,
        cell: (order: Order) => (
          <OrderCustomerCell party={mapOrderToPartyDisplay(order)} />
        ),
      },
      {
        id: "createdBy",
        header: t.orderCreatedBy,
        cell: (order: Order) => (
          <OrderCreatedByCell party={mapOrderToPartyDisplay(order)} />
        ),
      },
      {
        id: "status",
        header: t.status,
        cell: (order: Order) => {
          const isGuidanceAnchor = order.id === firstOrderId;
          const statusControl = (
            <OrderStatusQuickAction
              order={order}
              canUpdate={canUpdate}
              statusOptions={statusOptions}
              isStatusUpdating={isStatusUpdating}
              variant={statusVariant(order.status?.value)}
              onChangeStatus={(entity, status) => void handleChangeStatus(entity, status)}
              dataGuidance={
                isGuidanceAnchor ? guidance.statusDataGuidance : undefined
              }
            />
          );

          if (!(isGuidanceAnchor && guidance.isHotspotActive("status"))) {
            return statusControl;
          }

          return (
            <GuidanceHotspot
              active
              label={t.guidanceHotspotStatus}
              onDismiss={() => guidance.dismissHotspot("status")}
              side="top-end"
            >
              {statusControl}
            </GuidanceHotspot>
          );
        },
      },
      {
        id: "items",
        header: t.items,
        className: "w-20 text-center",
        headerClassName: "text-center",
        cell: (order: Order) => {
          const count = order.itemsCount ?? order.items?.length ?? 0;
          return (
            <button
              type="button"
              className="text-xs font-semibold text-brand hover:underline"
              title={t.viewOrderItems}
              onClick={(event) => {
                event.stopPropagation();
                setItemsOrder(order);
              }}
            >
              {count}
            </button>
          );
        },
      },
      {
        id: "total",
        header: t.total,
        cell: (order: Order) => (
          <span className="text-xs font-bold whitespace-nowrap text-foreground">
            {formatKwd(order.totalPrice)}
          </span>
        ),
      },
      {
        id: "payment",
        header: t.payment,
        cell: (order: Order) => (
          <span className="text-xs text-muted-foreground">
            {getOrderPaymentLabel(order) || "—"}
          </span>
        ),
      },
      {
        id: "date",
        header: t.date,
        cell: (order: Order) => (
          <span className="text-xs whitespace-nowrap text-muted-foreground">
            {formatDateTime(order.createdAt, language)}
          </span>
        ),
      },
    ],
    [
      canUpdate,
      dialog.openEdit,
      dialog.openView,
      firstOrderId,
      guidance,
      handleChangeStatus,
      isStatusUpdating,
      language,
      statusOptions,
      t,
    ],
  );

  return (
    <CrudListPage
      title={t.orders}
      {...guidance.pageProps}
      actions={
        canCreate ? (
          <GuidanceHotspot
            active={guidance.isHotspotActive("add-order")}
            label={t.guidanceHotspotAddOrder}
            onDismiss={() => guidance.dismissHotspot("add-order")}
          >
            <AppButton onClick={dialog.openCreate}>
              <Plus className="size-4" aria-hidden="true" />
              {t.addOrder}
            </AppButton>
          </GuidanceHotspot>
        ) : undefined
      }
    >
      <CrudListSection>
        {orderRefNumber ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t.orderNum}:</span>
            <span className="font-mono font-semibold text-foreground">{orderRefNumber}</span>
            <button
              type="button"
              className="ms-auto text-xs font-medium text-brand hover:underline"
              onClick={clearOrderRefNumber}
            >
              {t.clearFilters}
            </button>
          </div>
        ) : null}
        <CrudListTable
          tableId="orders"
          guidanceAnchors={{
            search: guidance.searchDataGuidance,
            filters: guidance.filtersDataGuidance,
            rowActions: guidance.rowActionsDataGuidance,
          }}
          search={{ value: search, onChange: setSearch, onReset: resetSearch }}
          filters={{
            definitions: filterDefinitions,
            values: filters.values,
            onChange: filters.setFilter,
            onReset: filters.resetFilters,
            hasActiveFilters: filters.hasActiveFilters,
            endAdornment: guidance.isHotspotActive("filters") ? (
              <GuidanceHotspot
                active
                label={t.guidanceHotspotFilters}
                onDismiss={() => guidance.dismissHotspot("filters")}
                side="top-end"
              >
                <span className="inline-block size-2" aria-hidden="true" />
              </GuidanceHotspot>
            ) : undefined,
          }}
          sort={{ definitions: sortDefinitions, value: sort, onChange: setSort }}
          columns={columns}
          data={orders}
          isLoading={isLoading}
          isError={isError}
          errorTitle={t.errorStateDefaultTitle}
          errorDescription={resolveServiceErrorMessage(error, t)}
          retryLabel={t.tryAgain}
          onRetry={() => void refetch()}
          emptyTitle={t.noData}
          emptyDescription={t.emptyStateDefaultDescription}
          rowActions={(order) => {
            const isRowPending = pendingDocumentOrderId === order.id;
            const isAnyDocumentBusy = isInvoiceDownloading || isPackingSlipDownloading;

            return (
              <div className="flex items-center justify-end gap-0.5">
                <OrderDocumentActions
                  canDownloadInvoice={canDownloadInvoice}
                  canDownloadPackingSlip={canDownloadPackingSlip}
                  hasInvoiceNumber={Boolean(order.invoice?.invoiceNumber)}
                  hasOrderRefNumber={Boolean(order.orderRefNumber)}
                  isBusy={isAnyDocumentBusy && !isRowPending}
                  isInvoiceDownloading={isRowPending && isInvoiceDownloading}
                  isPackingSlipDownloading={isRowPending && isPackingSlipDownloading}
                  invoiceLabel={t.downloadInvoice}
                  packingSlipLabel={t.downloadPackingSlip}
                  onDownloadInvoice={() => {
                    if (!order.invoice?.invoiceNumber) return;
                    setPendingDocumentOrderId(order.id);
                    void downloadPdf(order.invoice.invoiceNumber).finally(() => {
                      setPendingDocumentOrderId(null);
                    });
                  }}
                  onDownloadPackingSlip={() => {
                    if (!order.orderRefNumber) return;
                    setPendingDocumentOrderId(order.id);
                    void downloadPackingSlip(order.orderRefNumber).finally(() => {
                      setPendingDocumentOrderId(null);
                    });
                  }}
                />
                <CrudTableActions entity={order} actions={rowActions} ariaLabel={t.actions} />
              </div>
            );
          }}
          actionsHeader={t.actions}
          caption={t.orders}
          showingLabel={`${t.showing} ${orders.length} ${t.of} ${total} ${t.results}`}
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

      <OrderViewDialog
        open={dialog.mode === "view"}
        order={viewingOrder}
        canUpdate={canUpdate}
        canDownloadPackingSlip={canDownloadPackingSlip}
        canDownloadInvoice={canDownloadInvoice}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onEdit={(order) => dialog.openEdit(order)}
      />

      <OrderItemsQuickDialog
        open={Boolean(itemsOrder)}
        order={itemsOrder}
        onOpenChange={(open) => {
          if (!open) setItemsOrder(null);
        }}
      />

      <OrderFormDrawer
        open={isFormOpen}
        mode={formMode}
        order={dialog.entity}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        onSuccess={refetch}
      />
    </CrudListPage>
  );
}
