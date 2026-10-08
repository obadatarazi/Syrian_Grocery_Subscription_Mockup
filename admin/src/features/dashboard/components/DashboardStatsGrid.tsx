import {
  DollarSign,
  type LucideIcon,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

import type { DashboardStats } from "@/features/dashboard/types/dashboard.types";
import { StatCard, StatCardGrid } from "@/shared/components";
import { useTranslation } from "@/shared/design-system/localization/contexts/LocalizationContext";

type DashboardStatsGridProps = {
  stats: DashboardStats;
};

type StatConfig = {
  key: keyof DashboardStats;
  labelKey: "activeSubscribers" | "newSubscribers" | "totalOrders" | "monthlyRevenue";
  suffix?: string;
  icon: LucideIcon;
};

const statConfigs: StatConfig[] = [
  {
    key: "activeSubscribers",
    labelKey: "activeSubscribers",
    icon: Users,
  },
  {
    key: "newSubscribers",
    labelKey: "newSubscribers",
    icon: UserPlus,
  },
  {
    key: "totalOrders",
    labelKey: "totalOrders",
    icon: ShoppingBag,
  },
  {
    key: "revenueLast7Days",
    labelKey: "monthlyRevenue",
    suffix: " ل.س",
    icon: DollarSign,
  },
];

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const t = useTranslation();

  return (
    <StatCardGrid className="grid-cols-2 xl:grid-cols-4">
      {statConfigs.map(({ key, labelKey, suffix = "", icon }) => {
        const stat = stats[key];

        return (
          <StatCard
            key={key}
            label={t[labelKey]}
            value={`${stat.value}${suffix}`}
            change={stat.change}
            trend={stat.trend}
            icon={icon}
          />
        );
      })}
    </StatCardGrid>
  );
}
