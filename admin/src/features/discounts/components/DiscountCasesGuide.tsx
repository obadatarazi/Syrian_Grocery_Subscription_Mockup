import { useMemo, useState } from "react";

import {
  DISCOUNT_CASE_GUIDE,
  DISCOUNT_OUT_OF_SCOPE_NOTES,
  type DiscountCaseCategory,
} from "@/features/discounts/utils/discount-case-guide";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { cn } from "@/shared/design-system/components/ui/utils";

const CATEGORY_ORDER: DiscountCaseCategory[] = [
  "type",
  "scope",
  "eligibility",
  "limits",
  "status",
  "behavior",
  "out_of_scope",
];

export function DiscountCasesGuide() {
  const t = useTranslation();
  const { language } = useLocalization();
  const isAr = language === "ar";
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<"all" | DiscountCaseCategory>("all");

  const categoryLabels: Record<DiscountCaseCategory, string> = {
    type: t.discountCaseCatType,
    scope: t.discountCaseCatScope,
    eligibility: t.discountCaseCatEligibility,
    limits: t.discountCaseCatLimits,
    status: t.discountCaseCatStatus,
    behavior: t.discountCaseCatBehavior,
    out_of_scope: t.discountCaseCatOutOfScope,
  };

  const rows = useMemo(() => {
    if (filter === "all") return DISCOUNT_CASE_GUIDE;
    return DISCOUNT_CASE_GUIDE.filter((row) => row.category === filter);
  }, [filter]);

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/20 bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-start hover:bg-brand-muted/40"
      >
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">{t.discountCasesTitle}</h2>
          <p className="text-xs text-muted-foreground">{t.discountCasesIntro}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-brand">
          {open ? t.discountCasesHide : t.discountCasesShow}
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={filter === "all"}
              label={t.discountCasesAll}
              onClick={() => setFilter("all")}
            />
            {CATEGORY_ORDER.filter((id) => id !== "out_of_scope").map((id) => (
              <FilterChip
                key={id}
                active={filter === id}
                label={categoryLabels[id]}
                onClick={() => setFilter(id)}
              />
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-start">
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.discountCode}
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.discountCaseLabel}
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.discountCaseExplain}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.code} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-2.5 align-top">
                      <span className="font-mono text-sm font-bold text-brand">{row.code}</span>
                      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {categoryLabels[row.category]}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 align-top font-medium text-foreground">
                      {isAr ? row.caseAr : row.caseEn}
                    </td>
                    <td className="px-3 py-2.5 align-top text-xs leading-relaxed text-muted-foreground">
                      {isAr ? row.explainAr : row.explainEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {DISCOUNT_OUT_OF_SCOPE_NOTES.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5"
              >
                <p className="text-xs font-semibold text-amber-900">
                  {isAr ? note.titleAr : note.titleEn}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                  {isAr ? note.explainAr : note.explainEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        active
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-muted-foreground hover:border-brand/40 hover:text-brand",
      )}
    >
      {label}
    </button>
  );
}
