import { dashboardMocks } from "@/features/dashboard/mocks/dashboard.mocks";
import type { DashboardService } from "@/features/dashboard/services/dashboard.service.types";

function createMockDashboardService(): DashboardService {
  return {
    getSnapshot() {
      return dashboardMocks;
    },
  };
}

// Future backend integration:
// export const dashboardService = env.useMocks ? createMockDashboardService() : createApiDashboardService();
export const dashboardService: DashboardService = createMockDashboardService();
