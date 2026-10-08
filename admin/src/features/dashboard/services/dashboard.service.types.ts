import type { DashboardSnapshot } from "@/features/dashboard/types/dashboard.types";

export interface DashboardService {
  getSnapshot(): DashboardSnapshot;
}
