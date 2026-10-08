import type { OrderStatus, RecentOrder } from "@/features/dashboard/types/dashboard.types";
import type { StatusBadgeVariant } from "@/shared/components";

const orderStatusVariants: Record<OrderStatus, StatusBadgeVariant> = {
  delivered: "success",
  shipped: "info",
  processing: "warning",
  pending: "neutral",
  cancelled: "danger",
};

export function resolveOrderStatusVariant(status: OrderStatus): StatusBadgeVariant {
  return orderStatusVariants[status];
}

export function getCustomerName(order: RecentOrder, language: "en" | "ar") {
  return language === "ar" ? order.customerAr : order.customerEn;
}
