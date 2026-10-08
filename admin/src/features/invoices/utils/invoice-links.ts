import { ROUTES } from "@/app/router/routes";
import type { Invoice, InvoiceOrderItem } from "@/features/invoices/types/invoices.types";

/** Deep-link to Orders via `orderRefNumber` API filter (not free-text `search`). */
export function invoiceOrderSearchHref(
  invoice: Pick<Invoice, "orderRefNumber" | "orderId">,
): string | null {
  const ref = invoice.orderRefNumber?.trim();
  if (ref) {
    return `${ROUTES.admin.orders}?orderRefNumber=${encodeURIComponent(ref)}`;
  }
  if (invoice.orderId) {
    return `${ROUTES.admin.orders}?id=${invoice.orderId}`;
  }
  return null;
}

export function invoiceProductSearchHref(
  item: Pick<InvoiceOrderItem, "productTitle" | "productId">,
): string | null {
  const id = item.productId;
  if (id) {
    return `${ROUTES.admin.products}?id=${id}`;
  }
  const query = item.productTitle?.trim();
  if (!query) return null;
  return `${ROUTES.admin.products}?search=${encodeURIComponent(query)}`;
}
