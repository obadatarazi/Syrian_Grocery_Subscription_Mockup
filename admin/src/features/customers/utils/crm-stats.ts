import {
  customerMatchesSegment,
  hasActiveCarePlan,
  isInactiveCustomer,
} from "@/features/customers/utils/crm-segments";
import type {
  CrmCustomer,
  CrmGrowthPoint,
  CrmKpi,
  CrmNamedSlice,
  CrmReport,
  CrmSegment,
  CrmStats,
} from "@/features/customers/types/customers.types";

const SEGMENT_COLORS: Record<CrmSegment, string> = {
  new_buyers: "#0b7a6e",
  repeat_buyers: "#0e8f81",
  care_plan: "#2563eb",
  inactive: "#717182",
  big_spenders: "#d97706",
};

function kpi(count: number, change: string, trend: CrmKpi["trend"], asPercent = false): CrmKpi {
  return {
    value: asPercent ? `${count}%` : count.toLocaleString(),
    change,
    trend,
    count,
  };
}

export function buildCrmStats(customers: CrmCustomer[]): CrmStats {
  const total = customers.length;
  const newBuyers = customers.filter((c) => customerMatchesSegment(c, "new_buyers")).length;
  const carePlan = customers.filter(hasActiveCarePlan).length;
  const inactive = customers.filter(isInactiveCustomer).length;
  const bigSpenders = customers.filter((c) => customerMatchesSegment(c, "big_spenders")).length;
  const withOrders = customers.filter((c) => c.ordersCount > 0).length;
  const repeat = customers.filter((c) => customerMatchesSegment(c, "repeat_buyers")).length;
  const retention = withOrders === 0 ? 0 : Math.round((repeat / withOrders) * 100);

  return {
    totalCustomers: kpi(total, "+12%", "up"),
    newCustomers: kpi(newBuyers, "+22%", "up"),
    carePlanSubscribers: kpi(carePlan, "+8%", "up"),
    inactiveCustomers: kpi(inactive, "-4%", "up"),
    bigSpenders: kpi(bigSpenders, "+3%", "up"),
    retentionRate: kpi(retention, "+1.4%", "up", true),
  };
}

export function segmentCounts(customers: CrmCustomer[]): CrmNamedSlice[] {
  const labels: { id: CrmSegment; nameEn: string; nameAr: string }[] = [
    { id: "new_buyers", nameEn: "New buyers", nameAr: "مشترون جدد" },
    { id: "repeat_buyers", nameEn: "Repeat buyers", nameAr: "مشترون متكررون" },
    { id: "care_plan", nameEn: "Care Plan", nameAr: "خطة العناية" },
    { id: "inactive", nameEn: "Inactive", nameAr: "غير نشطين" },
    { id: "big_spenders", nameEn: "Big spenders", nameAr: "كبار المنفقين" },
  ];

  return labels.map((label) => ({
    ...label,
    value: customers.filter((c) => customerMatchesSegment(c, label.id)).length,
    color: SEGMENT_COLORS[label.id],
  }));
}

export function carePlanMix(customers: CrmCustomer[]): CrmNamedSlice[] {
  const active = customers.filter((c) => c.carePlan?.status === "ACTIVE").length;
  const paused = customers.filter((c) => c.carePlan?.status === "PAUSED").length;
  const cancelled = customers.filter((c) => c.carePlan?.status === "CANCELLED").length;
  const none = customers.filter((c) => !c.carePlan).length;

  return [
    { id: "active", nameEn: "Active plans", nameAr: "خطط نشطة", value: active, color: "#0b7a6e" },
    { id: "paused", nameEn: "Paused", nameAr: "متوقفة", value: paused, color: "#d97706" },
    {
      id: "cancelled",
      nameEn: "Cancelled",
      nameAr: "ملغاة",
      value: cancelled,
      color: "#dc2626",
    },
    { id: "none", nameEn: "No plan", nameAr: "بدون خطة", value: none, color: "#717182" },
  ];
}

export function retentionSlices(customers: CrmCustomer[]): CrmNamedSlice[] {
  const repeat = customers.filter((c) => customerMatchesSegment(c, "repeat_buyers")).length;
  const oneTime = customers.filter((c) => c.ordersCount === 1).length;
  const none = customers.filter((c) => c.ordersCount === 0).length;

  return [
    { id: "repeat", nameEn: "Repeat", nameAr: "متكررون", value: repeat, color: "#0b7a6e" },
    { id: "one-time", nameEn: "One-time", nameAr: "مرة واحدة", value: oneTime, color: "#2563eb" },
    { id: "none", nameEn: "No orders", nameAr: "بدون طلبات", value: none, color: "#717182" },
  ];
}

export const CRM_GROWTH_SEED: CrmGrowthPoint[] = [
  { month: "Jan", monthAr: "يناير", newCustomers: 18, returning: 42 },
  { month: "Feb", monthAr: "فبراير", newCustomers: 22, returning: 48 },
  { month: "Mar", monthAr: "مارس", newCustomers: 19, returning: 51 },
  { month: "Apr", monthAr: "أبريل", newCustomers: 27, returning: 55 },
  { month: "May", monthAr: "مايو", newCustomers: 31, returning: 58 },
  { month: "Jun", monthAr: "يونيو", newCustomers: 24, returning: 63 },
];

export function buildCrmReport(customers: CrmCustomer[]): CrmReport {
  return {
    stats: buildCrmStats(customers),
    growth: CRM_GROWTH_SEED,
    retention: retentionSlices(customers),
    segments: segmentCounts(customers),
    carePlanMix: carePlanMix(customers),
  };
}
