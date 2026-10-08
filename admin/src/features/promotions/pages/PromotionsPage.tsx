import { Check, Copy, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import {
  AppButton,
  PageContainer,
  PageHeader,
  StatusBadge,
  type StatusBadgeVariant,
} from "@/shared/components";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { DemoDataBanner, PROMOTIONS } from "@/shared/demo";
import type { PromotionStatus } from "@/shared/demo/types/admin-demo.types";

const PROMO_STATUS_VARIANTS: Record<PromotionStatus, StatusBadgeVariant> = {
  active: "success",
  paused: "warning",
  expired: "neutral",
};

export function PromotionsPage() {
  const t = useTranslation();
  const { language } = useLocalization();
  const isRTL = language === "ar";
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = useCallback((code: string) => {
    void navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader
        title={t.promotions}
        titleDataGuidance="promotions-title"
        actions={
          <AppButton type="button">
            <Plus className="size-4" aria-hidden="true" />
            {t.addPromotion}
          </AppButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${promo.color} p-5 text-white shadow-md`}
          >
            <div className="absolute -end-6 -top-6 size-20 rounded-full bg-white/10" aria-hidden="true" />
            <div className="relative">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-base leading-snug font-bold">
                    {isRTL ? promo.nameAr : promo.nameEn}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                      {promo.type.replace("_", " ")}
                    </span>
                    <StatusBadge
                      label={t[promo.status] ?? promo.status}
                      variant={PROMO_STATUS_VARIANTS[promo.status] ?? "neutral"}
                      className="border-white/30 bg-white/20 text-white"
                    />
                  </div>
                </div>
                <span className="text-3xl font-bold">{promo.discount}%</span>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-white/20 px-3 py-1.5 font-mono text-sm font-bold">
                  {promo.code}
                </div>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(promo.code)}
                  className="h-auto gap-1 rounded-lg bg-white/20 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/30 hover:text-white"
                >
                  {copied === promo.code ? (
                    <>
                      <Check className="size-3" aria-hidden="true" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" aria-hidden="true" />
                      {t.copyCode}
                    </>
                  )}
                </AppButton>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-white/80">
                <div>
                  <p className="text-white/60">{t.usage}</p>
                  <p className="font-bold text-white">
                    {promo.usage}
                    {promo.limit ? `/${promo.limit}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-white/60">{t.minOrder}</p>
                  <p className="font-bold text-white">KWD {promo.minOrder}</p>
                </div>
                <div>
                  <p className="text-white/60">{t.expires}</p>
                  <p className="text-xs font-bold text-white">
                    {isRTL ? promo.expiresAr : promo.expires}
                  </p>
                </div>
              </div>

              {promo.limit ? (
                <div className="mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${(promo.usage / promo.limit) * 100}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
