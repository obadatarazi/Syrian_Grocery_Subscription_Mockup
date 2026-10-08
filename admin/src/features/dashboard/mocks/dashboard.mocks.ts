import type { DashboardSnapshot } from "@/features/dashboard/types/dashboard.types";
import {
  CATEGORY_PIE,
  INVENTORY,
  ORDERS,
  PRESCRIPTIONS,
  REVENUE_DATA,
} from "@/shared/demo/mocks/admin-demo.mocks";

const EMPTY_STAT = { value: "٠", change: "—", trend: "neutral" as const };

export function createEmptyDashboardMocks(): DashboardSnapshot {
  return {
    stats: {
      activeSubscribers: { ...EMPTY_STAT },
      newSubscribers: { ...EMPTY_STAT },
      totalOrders: { ...EMPTY_STAT },
      revenueLast7Days: { ...EMPTY_STAT },
    },
    revenueChart: REVENUE_DATA.map((point) => ({
      ...point,
      revenue: 0,
      orders: 0,
    })),
    categoryChart: CATEGORY_PIE.map((point) => ({ ...point, value: 0 })),
    lowStockItems: [],
    pendingPrescriptions: [],
    recentOrders: [],
  };
}

export function createDashboardMocks(): DashboardSnapshot {
  return {
    stats: {
      activeSubscribers: { value: "٢٤٨", change: "+١٨", trend: "up" },
      newSubscribers: { value: "٣١", change: "+١٢٪", trend: "up" },
      totalOrders: { value: "٩٦", change: "+٩.٤٪", trend: "up" },
      // SYP integers — last 7 days
      revenueLast7Days: { value: "١٬٨٥٠٬٠٠٠", change: "+١٢٪", trend: "up" },
    },
    revenueChart: REVENUE_DATA,
    categoryChart: CATEGORY_PIE,
    lowStockItems: INVENTORY.filter((item) => item.stock <= item.reorder).map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      nameAr: item.nameAr,
      stock: item.stock,
      reorderPoint: item.reorder,
      imageUrl: item.img,
    })),
    pendingPrescriptions: PRESCRIPTIONS.filter((rx) => rx.status === "pending").map((rx) => ({
      id: rx.id,
      customerEn: rx.customerEn,
      customerAr: rx.customerAr,
      productEn: rx.productEn,
      productAr: rx.productAr,
    })),
    recentOrders: ORDERS.map((order) => ({
      id: order.id,
      customerEn: order.customerEn,
      customerAr: order.customerAr,
      email: order.email,
      avatar: order.avatar,
      total: order.total,
      status: order.status,
      date: order.date,
      dateAr: order.dateAr,
    })),
  };
}

export const dashboardMocks = createDashboardMocks();
