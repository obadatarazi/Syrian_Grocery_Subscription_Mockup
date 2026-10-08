import { customerCrmPath, ROUTES } from "@/app/router/routes";
import type { Notification } from "@/features/notifications/types/notifications.types";

function metaNumber(
  meta: Record<string, unknown> | null | undefined,
  key: string,
): number | null {
  if (!meta) return null;
  const raw = meta[key];
  const value = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Resolves an Admin deep-link from notification `metaData` written by the backend listener.
 * Keys match SendNotificationListener: orderId, userId, productReviewId, productId.
 */
export function getNotificationTargetHref(notification: Notification): string | null {
  const meta = notification.metaData ?? undefined;
  const orderId = metaNumber(meta, "orderId");
  if (orderId != null) {
    return `${ROUTES.admin.orders}?id=${orderId}`;
  }

  const productReviewId = metaNumber(meta, "productReviewId");
  const productIdForReview = metaNumber(meta, "productId");
  if (productReviewId != null && productIdForReview != null) {
    return `${ROUTES.admin.productReviews}?id=${productReviewId}&productId=${productIdForReview}`;
  }

  const userId = metaNumber(meta, "userId");
  if (userId != null) {
    return customerCrmPath(userId);
  }

  const productId = metaNumber(meta, "productId");
  if (productId != null) {
    return `${ROUTES.admin.products}?id=${productId}`;
  }

  return null;
}

export function hasNotificationTarget(notification: Notification): boolean {
  return getNotificationTargetHref(notification) != null;
}
