import type { RevenueChartPoint } from "@/features/dashboard/types/dashboard.types";
import { AppCard } from "@/shared/components";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  chartTooltipStyle,
  getChartTheme,
} from "@/shared/design-system/utils/chart-theme";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueChartSectionProps = {
  data: RevenueChartPoint[];
};

export function RevenueChartSection({ data }: RevenueChartSectionProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const isRTL = direction === "rtl";
  const chartTheme = useMemo(() => getChartTheme(), []);
  const tooltipStyle = useMemo(() => chartTooltipStyle(chartTheme), [chartTheme]);

  return (
    <AppCard
      title={t.revenueOverview}
      description={t.revenueChartSubtitle}
      className="xl:col-span-3"
      contentClassName="px-3 pt-0"
    >
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.brand} stopOpacity={0.15} />
              <stop offset="95%" stopColor={chartTheme.brand} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.accentBrand} stopOpacity={0.1} />
              <stop offset="95%" stopColor={chartTheme.accentBrand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} />
          <XAxis
            dataKey={isRTL ? "monthAr" : "month"}
            tick={{ fontSize: 11, fill: chartTheme.mutedForeground }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: chartTheme.mutedForeground }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="revenue"
            name={t.revenue}
            stroke={chartTheme.brand}
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="target"
            name={t.target}
            stroke={chartTheme.accentBrand}
            strokeWidth={2}
            strokeDasharray="5 4"
            fill="url(#targetGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AppCard>
  );
}
