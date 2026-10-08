import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

import { ROUTES } from "@/app/router/routes";
import type { RecentOrder } from "@/features/dashboard/types/dashboard.types";
import { resolveOrderStatusVariant } from "@/features/dashboard/utils/dashboard.utils";
import { AppButton, AppCard, StatusBadge, UserAvatar } from "@/shared/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/design-system/components/ui/table";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

type DashboardRecentOrdersCardProps = {
  orders: RecentOrder[];
};

function ChevronForward({ isRTL, className }: { isRTL: boolean; className?: string }) {
  const Icon = isRTL ? ChevronLeft : ChevronRight;
  return <Icon className={className} aria-hidden="true" />;
}

export function DashboardRecentOrdersCard({ orders }: DashboardRecentOrdersCardProps) {
  const t = useTranslation();
  const { direction, language } = useLocalization();
  const isRTL = direction === "rtl";

  return (
    <AppCard padding="none" className="overflow-hidden xl:col-span-3">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <h3 className="font-bold text-foreground">{t.recentOrdersTitle}</h3>
        <AppButton
          variant="link"
          className="h-auto p-0 text-xs font-semibold text-brand"
          asChild
        >
          <Link to={ROUTES.admin.orders} className="inline-flex items-center gap-1">
            {t.viewAll}
            <ChevronForward isRTL={isRTL} className="size-3.5" />
          </Link>
        </AppButton>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {[t.orderNum, t.customer, t.status, t.total, t.date].map((header) => (
              <TableHead
                key={header}
                className="px-4 py-3 text-xs font-bold tracking-wider text-muted-foreground uppercase"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.slice(0, 6).map((order) => (
            <TableRow key={order.id}>
              <TableCell className="px-4 py-3 font-mono text-xs font-bold text-brand">
                {order.id}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <UserAvatar name={order.avatar} />
                  <p className="text-xs font-medium whitespace-nowrap text-foreground">
                    {language === "ar" ? order.customerAr : order.customerEn}
                  </p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <StatusBadge
                  label={t[order.status]}
                  variant={resolveOrderStatusVariant(order.status)}
                />
              </TableCell>
              <TableCell className="px-4 py-3 text-xs font-bold whitespace-nowrap text-foreground">
                {t.kwd} {order.total.toFixed(3)}
              </TableCell>
              <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                {language === "ar" ? order.dateAr : order.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppCard>
  );
}
