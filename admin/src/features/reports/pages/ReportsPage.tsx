import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AppCard,
  PageContainer,
  PageHeader,
  StatCard,
  StatCardGrid,
  UserAvatar,
} from "@/shared/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/design-system/components/ui/table";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import {
  chartTooltipStyle,
  getChartTheme,
} from "@/shared/design-system/utils/chart-theme";
import { CrmReportsSection } from "@/features/customers/components/CrmReportsSection";
import {
  CATEGORY_PIE,
  CUSTOMERS,
  DemoDataBanner,
  formatKwd,
  ORDERS_WEEK,
  REVENUE_DATA,
  TierBadge,
  topProducts,
} from "@/shared/demo";

type KpiCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export function ReportsPage() {
  const t = useTranslation();
  const { language } = useLocalization();
  const isRTL = language === "ar";
  const chartTheme = useMemo(() => getChartTheme(), []);
  const tooltipStyle = useMemo(() => chartTooltipStyle(chartTheme), [chartTheme]);

  const topCustomers = useMemo(
    () => [...CUSTOMERS].sort((a, b) => b.spent - a.spent).slice(0, 5),
    [],
  );

  const kpis: KpiCard[] = [
    {
      label: t.conversionRate,
      value: "3.8%",
      change: "+0.4%",
      trend: "up",
    },
    { label: t.avgOrderValue, value: "KWD 15.420", change: "+7.2%", trend: "up" },
    { label: t.newCustomers, value: "127", change: "+22%", trend: "up" },
    { label: t.returnRate, value: "2.1%", change: "-0.3%", trend: "up" },
  ];

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader title={t.reports} titleDataGuidance="reports-title" />

      <StatCardGrid>
        {kpis.map(({ label, value, change, trend }) => (
          <StatCard key={label} label={label} value={value} change={change} trend={trend} />
        ))}
      </StatCardGrid>

      <CrmReportsSection />

      <div className="grid gap-5 xl:grid-cols-3">
        <AppCard
          title={t.revenueOverview}
          description={t.revenueChartSubtitle}
          className="xl:col-span-2"
          contentClassName="pt-0"
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
              <Line
                type="monotone"
                dataKey="revenue"
                name={t.revenue}
                stroke={chartTheme.brand}
                strokeWidth={2.5}
                dot={{ r: 4, fill: chartTheme.brand }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name={t.ordersChart}
                stroke={chartTheme.accentBrand}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </AppCard>

        <AppCard title={t.categoryPerformance} description={t.categoryChartSubtitle}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={CATEGORY_PIE}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
              >
                {CATEGORY_PIE.map((entry) => (
                  <Cell key={entry.nameEn} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ ...tooltipStyle, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {CATEGORY_PIE.map((category) => (
              <div key={category.nameEn} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: category.color }}
                  aria-hidden="true"
                />
                <span className="flex-1 text-muted-foreground">
                  {isRTL ? category.nameAr : category.nameEn}
                </span>
                <span className="font-bold text-foreground">{category.value}%</span>
              </div>
            ))}
          </div>
        </AppCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AppCard padding="none" title={t.topProducts} className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {["#", t.product, t.sold, t.revenue].map((header, index) => (
                  <TableHead
                    key={`${header}-${index}`}
                    className="px-4 py-3 text-xs font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                        index === 0 && "bg-warning-muted text-warning",
                        index === 1 && "bg-muted text-muted-foreground",
                        index > 1 && "bg-brand-muted text-brand",
                      )}
                    >
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 flex-none overflow-hidden rounded-lg bg-muted">
                        <img
                          src={product.img}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="max-w-[140px] truncate text-xs font-semibold text-foreground">
                        {isRTL ? product.nameAr : product.nameEn}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                    {product.sold.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-brand">
                    {formatKwd(product.sold * product.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppCard>

        <AppCard padding="none" title={t.topCustomers} className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {["#", t.customer, t.orders, t.spent].map((header, index) => (
                  <TableHead
                    key={`${header}-${index}`}
                    className="px-4 py-3 text-xs font-bold tracking-wider text-muted-foreground uppercase"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                        index === 0
                          ? "bg-warning-muted text-warning"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar name={customer.avatar} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {isRTL ? customer.nameAr : customer.nameEn}
                        </p>
                        <TierBadge tier={customer.tier} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                    {customer.orders}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-bold text-brand">
                    {formatKwd(customer.spent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppCard>
      </div>

      <AppCard title={t.ordersThisWeek} description={t.ordersWeekSubtitle}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ORDERS_WEEK} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.border} vertical={false} />
            <XAxis
              dataKey={isRTL ? "dayAr" : "day"}
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
            <Bar
              dataKey="orders"
              name={t.ordersChart}
              fill={chartTheme.brand}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="returns"
              name={t.returnsChart}
              fill={chartTheme.warning}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </AppCard>
    </PageContainer>
  );
}
