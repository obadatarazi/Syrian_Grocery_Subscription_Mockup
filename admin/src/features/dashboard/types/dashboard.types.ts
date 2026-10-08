export type TrendDirection = "up" | "down" | "neutral";

export type DashboardStat = {
  value: string;
  change: string;
  trend: TrendDirection;
};

export type DashboardStats = Record<
  "activeSubscribers" | "newSubscribers" | "totalOrders" | "revenueLast7Days",
  DashboardStat
>;

export type OrderStatus = "delivered" | "shipped" | "processing" | "pending" | "cancelled";

export type RecentOrder = {
  id: string;
  customerEn: string;
  customerAr: string;
  email: string;
  avatar: string;
  total: number;
  status: OrderStatus;
  date: string;
  dateAr: string;
};

export type RevenueChartPoint = {
  month: string;
  monthAr: string;
  revenue: number;
  target: number;
  orders: number;
};

export type CategoryChartPoint = {
  nameEn: string;
  nameAr: string;
  value: number;
  color: string;
};

export type LowStockItem = {
  id: number;
  nameEn: string;
  nameAr: string;
  stock: number;
  reorderPoint: number;
  imageUrl: string;
};

export type PendingPrescription = {
  id: string;
  customerEn: string;
  customerAr: string;
  productEn: string;
  productAr: string;
};

export type DashboardSnapshot = {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  revenueChart: RevenueChartPoint[];
  categoryChart: CategoryChartPoint[];
  lowStockItems: LowStockItem[];
  pendingPrescriptions: PendingPrescription[];
};

export type DataRequestStatus = "idle" | "loading" | "success" | "empty" | "error";

export type DataRequestState<T> = {
  data: T | null;
  status: DataRequestStatus;
  error: Error | null;
};
