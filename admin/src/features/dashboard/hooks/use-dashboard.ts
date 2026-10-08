import { useCallback } from "react";

import { dashboardService } from "@/features/dashboard/services/dashboard.service";
import type { DashboardSnapshot } from "@/features/dashboard/types/dashboard.types";
import { useCrudQuery } from "@/shared/crud";

export function useDashboard() {
  const queryFn = useCallback(() => Promise.resolve(dashboardService.getSnapshot()), []);

  return useCrudQuery<DashboardSnapshot>({
    queryKey: ["dashboard", "snapshot"],
    queryFn,
  });
}
