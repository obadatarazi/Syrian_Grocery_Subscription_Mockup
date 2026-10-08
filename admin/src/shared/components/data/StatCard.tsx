import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { type ReactNode } from "react";

import { ResponsiveGrid } from "@/shared/components/layout/ResponsiveGrid";
import { CardTitleText } from "@/shared/components/typography/Typography";
import { Card, CardContent, CardHeader } from "@/shared/design-system/components/ui/card";
import { cn } from "@/shared/design-system/components/ui/utils";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
};

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;

  return (
    <Card className={cn("gap-0 py-0 shadow-sm transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-0 px-6 pt-6 pb-4">
        {Icon ? (
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-muted text-brand">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        ) : (
          <span />
        )}
        {change ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
              trend === "up" && "bg-success-muted text-success",
              trend === "down" && "bg-destructive/10 text-destructive",
              trend === "neutral" && "bg-muted text-muted-foreground",
            )}
          >
            {trend !== "neutral" ? <TrendIcon className="size-3" aria-hidden="true" /> : null}
            {change}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <CardTitleText as="p" className="mt-1 text-sm font-medium text-muted-foreground">
          {label}
        </CardTitleText>
      </CardContent>
    </Card>
  );
}

type StatCardGridProps = {
  children: ReactNode;
  className?: string;
};

export function StatCardGrid({ children, className }: StatCardGridProps) {
  return (
    <ResponsiveGrid columns={4} className={className}>
      {children}
    </ResponsiveGrid>
  );
}
