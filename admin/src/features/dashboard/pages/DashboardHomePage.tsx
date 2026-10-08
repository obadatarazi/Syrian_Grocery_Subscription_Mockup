import { useState } from "react";

import { DashboardCrmSection } from "@/features/dashboard/components/DashboardCrmSection";
import { CategoryPieChartSection } from "@/features/dashboard/components/CategoryPieChartSection";
import { DashboardRecentOrdersCard } from "@/features/dashboard/components/DashboardRecentOrdersCard";
import { DashboardStatsGrid } from "@/features/dashboard/components/DashboardStatsGrid";
import { LowStockWidget } from "@/features/dashboard/components/LowStockWidget";
import { UnpaidOrdersWidget } from "@/features/dashboard/components/UnpaidOrdersWidget";
import { RevenueChartSection } from "@/features/dashboard/components/RevenueChartSection";
import {
  createDashboardMocks,
  createEmptyDashboardMocks,
} from "@/features/dashboard/mocks/dashboard.mocks";
import {
  AppButton,
  PageContainer,
  PageHeader,
} from "@/shared/components";
import { DemoDataBanner } from "@/shared/demo";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";
import { GuidancePageNotices } from "@/shared/guidance/components/GuidancePageNotices";

const DEMO_DATA = createDashboardMocks();
const EMPTY_DATA = createEmptyDashboardMocks();

export function DashboardHomePage() {
  const t = useTranslation();
  const [showEmpty, setShowEmpty] = useState(false);
  const data = showEmpty ? EMPTY_DATA : DEMO_DATA;

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader
        title={t.dashboard}
        titleDataGuidance="dashboard-title"
        actions={
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => setShowEmpty((v) => !v)}
          >
            {showEmpty ? t.showDemoDashboard : t.showEmptyDashboard}
          </AppButton>
        }
      />
      <GuidancePageNotices />
      <div data-guidance="dashboard-stats">
        <DashboardStatsGrid stats={data.stats} />
      </div>

      <DashboardCrmSection />

      <div className="grid gap-5 xl:grid-cols-5" data-guidance="dashboard-charts">
        <RevenueChartSection data={data.revenueChart} />
        <CategoryPieChartSection data={data.categoryChart} />
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        <div data-guidance="dashboard-recent-orders" className="xl:col-span-3">
          <DashboardRecentOrdersCard orders={data.recentOrders} />
        </div>
        <div className="space-y-4 xl:col-span-2" data-guidance="dashboard-attention">
          <LowStockWidget items={data.lowStockItems} />
          <UnpaidOrdersWidget />
        </div>
      </div>
    </PageContainer>
  );
}
