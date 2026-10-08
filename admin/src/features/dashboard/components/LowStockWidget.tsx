import { AlertTriangle } from "lucide-react";

import type { LowStockItem } from "@/features/dashboard/types/dashboard.types";
import { AppCard } from "@/shared/components";
import { cn } from "@/shared/design-system/components/ui/utils";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

type LowStockWidgetProps = {
  items: LowStockItem[];
};

function stockBarColor(stock: number, reorder: number) {
  if (stock === 0) return "bg-destructive";
  if (stock <= reorder) return "bg-warning";
  return "bg-success";
}

export function LowStockWidget({ items }: LowStockWidgetProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const isRTL = direction === "rtl";

  return (
    <AppCard padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
          {t.lowStockAlert}
        </h3>
        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-border/40">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
            <div className="size-9 flex-none overflow-hidden rounded-xl bg-muted">
              <img
                src={item.imageUrl}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {isRTL ? item.nameAr : item.nameEn}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      stockBarColor(item.stock, item.reorderPoint),
                    )}
                    style={{
                      width: `${Math.min((item.stock / item.reorderPoint) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-destructive">{item.stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
