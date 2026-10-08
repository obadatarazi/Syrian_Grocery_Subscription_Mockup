import { formatDiscountValue } from "@/features/discounts/mocks/discount-catalog.seed";
import type { Discount } from "@/features/discounts/types/discounts.types";
import {
  discountConditionChips,
  explainDiscountCase,
} from "@/features/discounts/utils/discount-case-guide";
import { StatusBadge, type StatusBadgeVariant } from "@/shared/components";
import { CrudDetailField, CrudViewDialog, type CrudViewDialogSection } from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";

type DiscountViewDialogProps = {
  open: boolean;
  discount: Discount | null;
  canUpdate?: boolean;
  canDelete?: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (discount: Discount) => void;
  onDelete?: (discount: Discount) => void;
};

const STATUS_VARIANTS: Record<Discount["status"], StatusBadgeVariant> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
  DRAFT: "info",
  EXPIRED: "warning",
};

export function DiscountViewDialog({
  open,
  discount,
  canUpdate = false,
  canDelete = false,
  onOpenChange,
  onEdit,
  onDelete,
}: DiscountViewDialogProps) {
  const t = useTranslation();
  const { language } = useLocalization();

  if (!discount) return null;

  const explained = explainDiscountCase(discount, language === "ar" ? "ar" : "en");
  const chips = discountConditionChips(discount);

  const statusLabel =
    discount.status === "ACTIVE"
      ? t.active
      : discount.status === "INACTIVE"
        ? t.inactive
        : discount.status === "DRAFT"
          ? t.draft
          : t.expired;

  const flags = [
    discount.requireLogin ? t.discountRequireLogin : null,
    discount.firstOrderOnly ? t.discountFirstOrderOnly : null,
    discount.isAutoApply ? t.discountIsAutoApply : null,
    discount.isCombinable ? t.discountIsCombinable : t.discountNotCombinable,
    discount.affectsCatalogPrices ? t.discountAffectsCatalog : null,
  ].filter(Boolean);

  const sections: CrudViewDialogSection[] = [
    {
      id: "case",
      title: t.discountCaseExplain,
      content: (
        <div className="space-y-3 rounded-xl border border-brand/20 bg-brand-muted/40 p-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {explained.caseLabel}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{explained.explanation}</p>
          </div>
          {chips.length ? (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-brand/20 bg-background px-2 py-0.5 text-[10px] font-semibold text-brand"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "content",
      title: t.discountSectionContent,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.discountCode}>
            <span className="font-mono font-semibold">{discount.code}</span>
          </CrudDetailField>
          <CrudDetailField label={t.discountValue}>
            <span className="font-semibold">{formatDiscountValue(discount)}</span>
          </CrudDetailField>
          <CrudDetailField label={t.discountTitleEn}>{discount.titleEn}</CrudDetailField>
          <CrudDetailField label={t.discountTitleAr}>
            {discount.titleAr ? (
              <span dir="rtl" className="block">
                {discount.titleAr}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={t.discountDescEn}>
            {discount.descEn || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.discountDescAr}>
            {discount.descAr ? (
              <span dir="rtl" className="block">
                {discount.descAr}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "conditions",
      title: t.discountConditions,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.discountType}>{discount.type}</CrudDetailField>
          <CrudDetailField label={t.discountScope}>{discount.scope}</CrudDetailField>
          <CrudDetailField label={t.discountAudience}>{discount.audience}</CrudDetailField>
          <CrudDetailField label={t.status}>
            <StatusBadge label={statusLabel} variant={STATUS_VARIANTS[discount.status]} />
          </CrudDetailField>
          <CrudDetailField label={t.discountUsage}>
            {discount.usageCount}
            {discount.usageLimit != null ? ` / ${discount.usageLimit}` : ""}
            {discount.usageLimitPerUser != null
              ? ` · ${t.discountUsageLimitPerUser}: ${discount.usageLimitPerUser}`
              : ""}
          </CrudDetailField>
          <CrudDetailField label={t.discountPriority}>{discount.priority}</CrudDetailField>
          <CrudDetailField label={t.discountMinOrder}>
            {discount.currencyCode} {discount.minimumOrderAmount}
          </CrudDetailField>
          <CrudDetailField label={t.discountMaxDiscount}>
            {discount.maximumDiscountAmount == null
              ? "—"
              : `${discount.currencyCode} ${discount.maximumDiscountAmount}`}
          </CrudDetailField>
          <CrudDetailField label={t.discountStartsAt}>{discount.startsAt}</CrudDetailField>
          <CrudDetailField label={t.discountExpireAt}>{discount.expireAt}</CrudDetailField>
          <CrudDetailField label={t.discountConditions}>
            {flags.length ? flags.join(" · ") : "—"}
          </CrudDetailField>
          {discount.productIds?.length ? (
            <CrudDetailField label={t.discountProductIds}>
              {discount.productIds.join(", ")}
            </CrudDetailField>
          ) : null}
          {discount.categories?.length ? (
            <CrudDetailField label={t.discountCategories}>
              {discount.categories.join(", ")}
            </CrudDetailField>
          ) : null}
          {discount.brands?.length ? (
            <CrudDetailField label={t.discountBrands}>{discount.brands.join(", ")}</CrudDetailField>
          ) : null}
          {discount.tags?.length ? (
            <CrudDetailField label={t.discountTags}>{discount.tags.join(", ")}</CrudDetailField>
          ) : null}
          {discount.allowedUserIds?.length ? (
            <CrudDetailField label={t.discountAllowedUsers}>
              {discount.allowedUserIds.join(", ")}
            </CrudDetailField>
          ) : null}
          <CrudDetailField label={t.discountWebsiteHint}>
            <span className="font-mono text-xs">{discount.websiteUrlHint}</span>
          </CrudDetailField>
          <CrudDetailField label={t.discountProductSaleNote}>
            <span className="text-xs text-muted-foreground">{t.discountBogoNote}</span>
          </CrudDetailField>
        </div>
      ),
    },
  ];

  return (
    <CrudViewDialog
      open={open}
      entity={discount}
      onOpenChange={onOpenChange}
      title={t.viewDiscount}
      cancelLabel={t.cancel}
      canUpdate={canUpdate}
      canDelete={canDelete}
      editLabel={t.editAction}
      deleteLabel={t.deleteAction}
      onEdit={onEdit}
      onDelete={onDelete}
      sections={sections}
      hero={
        <div className="min-w-0 space-y-3">
          <div>
            <p className="font-mono text-lg font-semibold text-foreground">{discount.code}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {discount.titleEn || discount.titleAr}
            </p>
            {discount.titleAr && discount.titleEn ? (
              <p dir="rtl" className="mt-1 text-sm text-muted-foreground">
                {discount.titleAr}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={formatDiscountValue(discount)} variant="info" />
            <StatusBadge label={statusLabel} variant={STATUS_VARIANTS[discount.status]} />
            <StatusBadge label={discount.scope} variant="neutral" />
            <StatusBadge label={explained.caseLabel} variant="success" />
          </div>
        </div>
      }
    />
  );
}
