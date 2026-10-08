import { Check, FileText, X } from "lucide-react";

import type { PendingPrescription } from "@/features/dashboard/types/dashboard.types";
import { AppButton, AppCard } from "@/shared/components";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

type PendingPrescriptionsWidgetProps = {
  items: PendingPrescription[];
};

export function PendingPrescriptionsWidget({ items }: PendingPrescriptionsWidgetProps) {
  const t = useTranslation();
  const { direction } = useLocalization();
  const isRTL = direction === "rtl";

  return (
    <AppCard padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <FileText className="size-4 text-info" aria-hidden="true" />
          {t.pendingReview}
        </h3>
        <span className="rounded-full bg-info-muted px-2 py-0.5 text-xs font-bold text-info">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-border/40">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground">{item.id}</p>
              <p className="text-xs text-muted-foreground">
                {isRTL ? item.customerAr : item.customerEn} ·{" "}
                {isRTL ? item.productAr : item.productEn}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <AppButton
                variant="ghost"
                size="icon"
                className="size-6 bg-success-muted text-success hover:bg-success-muted/80"
                aria-label={t.approved}
              >
                <Check className="size-3.5" aria-hidden="true" />
              </AppButton>
              <AppButton
                variant="ghost"
                size="icon"
                className="size-6 bg-destructive/10 text-destructive hover:bg-destructive/15"
                aria-label={t.rejected}
              >
                <X className="size-3.5" aria-hidden="true" />
              </AppButton>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
