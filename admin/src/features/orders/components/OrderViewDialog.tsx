import { Download } from "lucide-react";

import { useInvoicePdfDownload } from "@/features/invoices/hooks/use-invoice-pdf-download";
import { useOrderPackingSlipDownload } from "@/features/orders/hooks/use-order-packing-slip-download";
import type { Order } from "@/features/orders/types/orders.types";
import {
  mapOrderToPartyDisplay,
  orderCreatedByBadge,
  orderCustomerHref,
  orderPartyDisplayName,
} from "@/features/orders/utils/order-customer-display";
import { formatKwd } from "@/features/products/utils/product-display.utils";
import { AppButton, StatusBadge, UserAvatar } from "@/shared/components";
import { CrudDetailField, CrudViewDialog, type CrudViewDialogSection } from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { formatDateTime } from "@/shared/lib/datetime.utils";
import { Link } from "react-router";

type OrderViewDialogProps = {
  open: boolean;
  order: Order | null;
  canUpdate?: boolean;
  canDownloadPackingSlip?: boolean;
  canDownloadInvoice?: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (order: Order) => void;
};

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

export function OrderViewDialog({
  open,
  order,
  canUpdate = false,
  canDownloadPackingSlip = false,
  canDownloadInvoice = false,
  onOpenChange,
  onEdit,
}: OrderViewDialogProps) {
  const t = useTranslation();
  const { language } = useLocalization();
  const { downloadPackingSlip, isDownloading: isPackingSlipDownloading } =
    useOrderPackingSlipDownload();
  const { downloadPdf, isDownloading: isInvoiceDownloading } = useInvoicePdfDownload();

  if (!order) return null;

  const party = mapOrderToPartyDisplay(order);
  const customerName = orderPartyDisplayName(party, t.guest);
  const customerHref = orderCustomerHref(party);
  const createdByBadge = orderCreatedByBadge(party, {
    admin: t.adminUserType,
    customer: t.customerUserType,
    guest: t.guest,
  });
  const placedByAdmin = party.createdByAdmin?.fullName?.trim();
  const statusLabel = order.status?.label || order.status?.value || t.notSet;
  const invoiceNumber = order.invoice?.invoiceNumber;

  const sections: CrudViewDialogSection[] = [
    {
      id: "details",
      title: t.orderDetails,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.orderNum}>{order.orderRefNumber}</CrudDetailField>
          <CrudDetailField label={t.date}>
            {formatDateTime(order.createdAt, language)}
          </CrudDetailField>
          <CrudDetailField label={t.fullName}>
            {customerHref ? (
              <Link to={customerHref} className="font-medium text-brand hover:underline">
                {customerName}
              </Link>
            ) : (
              customerName
            )}
          </CrudDetailField>
          <CrudDetailField label={t.email}>{party.email || t.notSet}</CrudDetailField>
          <CrudDetailField label={t.phone}>{party.phoneNumber || t.notSet}</CrudDetailField>
          <CrudDetailField label={t.orderCreatedBy}>
            <div className="space-y-1">
              <StatusBadge label={createdByBadge.label} variant={createdByBadge.variant} />
              {placedByAdmin ? (
                <p className="text-xs text-muted-foreground">{placedByAdmin}</p>
              ) : null}
            </div>
          </CrudDetailField>
          <CrudDetailField label={t.deliveryFee}>
            {order.deliveryFeePrice != null ? formatKwd(order.deliveryFeePrice) : t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.total}>{formatKwd(order.totalPrice)}</CrudDetailField>
          <CrudDetailField label={t.totalWithTax}>
            {order.totalPriceWithTax != null ? formatKwd(order.totalPriceWithTax) : t.notSet}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "address",
      title: t.orderDelivery,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.deliveryZonesPrices}>
            {order.deliveryZonePrice?.state?.title ||
              (order.deliveryZonePrice ? `#${order.deliveryZonePrice.id}` : t.notSet)}
          </CrudDetailField>
          <CrudDetailField label={t.addressTitle}>
            {order.address?.title || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.street}>
            {order.address?.streetTitle || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.building}>
            {order.address?.building || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.floor}>
            {order.address?.floorNumber || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.apartment}>
            {order.address?.apartment || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.landmark}>
            {order.address?.landmark || t.notSet}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "items",
      title: t.orderItems,
      content: (
        <div className="space-y-3">
          {(order.items ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noData}</p>
          ) : (
            (order.items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.productTitle || t.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.quantity}: {item.quantity} · {formatKwd(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatKwd(item.subTotalPrice)}
                </p>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      id: "invoice",
      title: t.invoice,
      content: order.invoice ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label="ID">{order.invoice.id}</CrudDetailField>
          <CrudDetailField label={t.invoiceNumber}>
            {invoiceNumber || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.invoiceStatus}>
            {order.invoice.status?.label || order.invoice.status?.value || t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.payment}>
            {order.invoice.paymentProvider?.title ||
              order.invoice.paymentProviderType?.label ||
              order.invoice.paymentProviderType?.value ||
              t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.total}>
            {order.invoice.totalPrice != null ? formatKwd(order.invoice.totalPrice) : t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.currency}>
            {order.invoice.currencyCode ||
              order.invoice.currency?.symbol ||
              t.notSet}
          </CrudDetailField>
          <CrudDetailField label={t.paidAt}>
            {order.invoice.paidAt
              ? formatDateTime(order.invoice.paidAt, language)
              : t.notSet}
          </CrudDetailField>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t.notSet}</p>
      ),
    },
  ];

  return (
    <CrudViewDialog
      open={open}
      entity={order}
      onOpenChange={onOpenChange}
      title={t.viewOrder}
      cancelLabel={t.cancel}
      canUpdate={canUpdate}
      canDelete={false}
      editLabel={t.editAction}
      onEdit={onEdit}
      sections={sections}
      size="xl"
      footerActions={
        canDownloadPackingSlip || (canDownloadInvoice && invoiceNumber) ? (
          <>
            {canDownloadPackingSlip ? (
              <AppButton
                variant="secondary"
                disabled={isPackingSlipDownloading || !order.orderRefNumber}
                onClick={() => void downloadPackingSlip(order.orderRefNumber)}
              >
                <Download className="size-4" aria-hidden="true" />
                {t.downloadPackingSlip}
              </AppButton>
            ) : null}
            {canDownloadInvoice && invoiceNumber ? (
              <AppButton
                variant="secondary"
                disabled={isInvoiceDownloading}
                onClick={() => void downloadPdf(invoiceNumber)}
              >
                <Download className="size-4" aria-hidden="true" />
                {t.downloadInvoice}
              </AppButton>
            ) : null}
          </>
        ) : null
      }
      hero={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <UserAvatar name={customerName} size="lg" />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="font-mono text-lg font-semibold text-brand">{order.orderRefNumber}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{customerName}</p>
              {party.email ? (
                <p className="mt-1 text-sm text-muted-foreground">{party.email}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                label={statusLabel}
                variant={statusVariant(order.status?.value)}
              />
              <StatusBadge label={createdByBadge.label} variant={createdByBadge.variant} />
              {order.hasDiscount ? (
                <StatusBadge label={t.withDiscount} variant="info" />
              ) : null}
            </div>
          </div>
        </div>
      }
    />
  );
}
