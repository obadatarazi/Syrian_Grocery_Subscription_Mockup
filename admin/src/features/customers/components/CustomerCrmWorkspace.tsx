import {
  Bell,
  CreditCard,
  HeartPulse,
  MapPin,
  Pause,
  Pencil,
  Percent,
  Play,
  Plus,
  Receipt,
  ShoppingBag,
  Star,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/app/router/routes";
import { CustomerTagBadges } from "@/features/customers/components/CustomerTagBadges";
import { CustomerCrmProfileDialog } from "@/features/customers/components/CustomerCrmProfileDialog";
import { useCustomerMutations } from "@/features/customers/hooks/use-customer-mutations";
import type {
  CrmCouponStatus,
  CrmCustomer,
  CrmNoteType,
  CrmPaymentStatus,
  CrmTimelineType,
} from "@/features/customers/types/customers.types";
import { visibleTags } from "@/features/customers/utils/crm-segments";
import {
  AppButton,
  AppCard,
  StatusBadge,
  type StatusBadgeVariant,
  UserAvatar,
} from "@/shared/components";
import { CrudDetailField, CrudDetailSection } from "@/shared/crud";
import { Textarea } from "@/shared/design-system/components/ui/textarea";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { formatKwd, TierBadge } from "@/shared/demo";
import { formatDateTime } from "@/shared/lib/datetime.utils";

type CustomerCrmWorkspaceProps = {
  customer: CrmCustomer;
  onCustomerChange: (customer: CrmCustomer) => void;
};

const ORDER_STATUS: Record<string, StatusBadgeVariant> = {
  delivered: "success",
  shipped: "info",
  processing: "warning",
  pending: "neutral",
  cancelled: "danger",
};

const RX_STATUS: Record<string, StatusBadgeVariant> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

const COUPON_STATUS: Record<CrmCouponStatus, StatusBadgeVariant> = {
  used: "success",
  unused: "info",
  expired: "neutral",
};

const PAYMENT_STATUS: Record<CrmPaymentStatus, StatusBadgeVariant> = {
  success: "success",
  failed: "danger",
  refunded: "warning",
  pending: "neutral",
};

const PLAN_STATUS: Record<string, StatusBadgeVariant> = {
  ACTIVE: "success",
  PAUSED: "warning",
  CANCELLED: "danger",
};

const NOTE_TYPES: CrmNoteType[] = ["general", "call", "complaint", "delivery"];

export function CustomerCrmWorkspace({ customer, onCustomerChange }: CustomerCrmWorkspaceProps) {
  const t = useTranslation();
  const { language } = useLocalization();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const mutations = useCustomerMutations({ onSuccess: onCustomerChange });
  const [noteBody, setNoteBody] = useState("");
  const [noteType, setNoteType] = useState<CrmNoteType>("general");
  const [profileOpen, setProfileOpen] = useState(false);
  const name = isRTL ? customer.nameAr : customer.nameEn;
  const tags = visibleTags(customer);
  const canTogglePlan = Boolean(customer.carePlan && customer.carePlan.status !== "CANCELLED");
  const planPaused = customer.carePlan?.status === "PAUSED";

  const noteTypeLabel: Record<CrmNoteType, string> = {
    general: t.crmNoteGeneral,
    call: t.crmNoteCall,
    complaint: t.crmNoteComplaint,
    delivery: t.crmNoteDelivery,
  };

  return (
    <div className="space-y-6">
      <AppCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <UserAvatar name={customer.avatar} size="lg" className="size-16 text-xl" />
            <div className="min-w-0 space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground">
                  {customer.email} · {customer.phone}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TierBadge tier={customer.loyalty.tier} />
                <StatusBadge
                  label={customer.status === "active" ? t.active : t.inactive}
                  variant={customer.status === "active" ? "success" : "neutral"}
                />
                <CustomerTagBadges tags={tags} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppButton variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
              <Pencil className="size-4" aria-hidden="true" />
              {t.crmEditProfile}
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => void mutations.toggleVip.mutate(customer)}
            >
              <Star className="size-4" aria-hidden="true" />
              {customer.tags.includes("vip") ? t.crmRemoveVip : t.crmMarkVip}
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => void mutations.assignCoupon.mutate(customer)}
            >
              <Receipt className="size-4" aria-hidden="true" />
              {t.crmAssignCoupon}
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => void mutations.sendNotification.mutate(customer)}
            >
              <Bell className="size-4" aria-hidden="true" />
              {t.crmSendNotification}
            </AppButton>
            {canTogglePlan ? (
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => void mutations.toggleCarePlan.mutate(customer)}
              >
                {planPaused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
                {planPaused ? t.crmResumePlan : t.crmPausePlan}
              </AppButton>
            ) : null}
            <AppButton size="sm" onClick={() => navigate(ROUTES.admin.orders)}>
              <Plus className="size-4" aria-hidden="true" />
              {t.crmCreateOrder}
            </AppButton>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <CrudDetailField label={t.spent}>{formatKwd(customer.spent)}</CrudDetailField>
          <CrudDetailField label={t.orders}>{customer.ordersCount}</CrudDetailField>
          <CrudDetailField label={t.points}>
            {customer.loyalty.points.toLocaleString()}
          </CrudDetailField>
          <CrudDetailField label={t.joined}>
            {formatDateTime(customer.joinedAt, language)}
          </CrudDetailField>
          <CrudDetailField label={t.lastOrder}>
            {customer.lastOrderAt ? formatDateTime(customer.lastOrderAt, language) : "—"}
          </CrudDetailField>
        </dl>
      </AppCard>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-6 xl:col-span-3">
          <CrudDetailSection title={t.orders} description={t.crmOrdersHint}>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoOrders}</p>
            ) : (
              <ul className="divide-y divide-border">
                {customer.orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <ShoppingBag
                          className="size-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(order.placedAt, language)} · {order.items} {t.items} ·{" "}
                        {isRTL ? order.paymentAr : order.paymentEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        label={orderStatusLabel(order.status, t)}
                        variant={ORDER_STATUS[order.status] ?? "neutral"}
                      />
                      <span className="text-sm font-bold text-brand">{formatKwd(order.total)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>
          <CrudDetailSection title={t.crmPayments} description={t.crmPaymentsHint}>
            {customer.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoPayments}</p>
            ) : (
              <ul className="divide-y divide-border">
                {customer.payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CreditCard className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {payment.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.orderId} · {isRTL ? payment.methodAr : payment.methodEn} ·{" "}
                        {formatDateTime(payment.paidAt, language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        label={paymentStatusLabel(payment.status, t)}
                        variant={PAYMENT_STATUS[payment.status]}
                      />
                      <span className="text-sm font-bold text-brand">
                        {formatKwd(payment.amount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>
          <CrudDetailSection title={t.crmCarePlan}>
            {customer.carePlan ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <HeartPulse className="size-4 text-brand" aria-hidden="true" />
                  <span className="font-semibold text-foreground">{customer.carePlan.id}</span>
                  <StatusBadge
                    label={planStatusLabel(
                      customer.carePlan.status,
                      t.crmPlanActive,
                      t.crmPlanPaused,
                      t.crmPlanCancelled,
                    )}
                    variant={PLAN_STATUS[customer.carePlan.status]}
                  />
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <CrudDetailField label={t.crmFrequency}>
                    {frequencyLabel(customer.carePlan.frequency, t)}
                  </CrudDetailField>
                  <CrudDetailField label={t.crmNextDelivery}>
                    {formatDateTime(customer.carePlan.nextDeliveryAt, language)}
                  </CrudDetailField>
                </dl>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? customer.carePlan.itemsAr : customer.carePlan.itemsEn}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.crmNoCarePlan}</p>
            )}
          </CrudDetailSection>

          <CrudDetailSection title={t.crmLoyalty}>
            <dl className="grid gap-3 sm:grid-cols-3">
              <CrudDetailField label={t.points}>
                {customer.loyalty.points.toLocaleString()}
              </CrudDetailField>
              <CrudDetailField label={t.crmLifetimeEarned}>
                {customer.loyalty.lifetimeEarned.toLocaleString()}
              </CrudDetailField>
              <CrudDetailField label={t.crmLifetimeRedeemed}>
                {customer.loyalty.lifetimeRedeemed.toLocaleString()}
              </CrudDetailField>
            </dl>
          </CrudDetailSection>
          <CrudDetailSection title={t.crmCoupons} description={t.crmCouponsHint}>
            {customer.coupons.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoCoupons}</p>
            ) : (
              <ul className="divide-y divide-border">
                {customer.coupons.map((coupon) => (
                  <li
                    key={`${coupon.code}-${coupon.assignedAt}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                        <Percent className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {coupon.code}
                        <span className="font-sans text-xs text-brand">{coupon.valueLabel}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? coupon.titleAr : coupon.titleEn}
                        {coupon.orderId ? ` · ${coupon.orderId}` : ""}
                        {coupon.usedAt
                          ? ` · ${formatDateTime(coupon.usedAt, language)}`
                          : ` · ${formatDateTime(coupon.assignedAt, language)}`}
                      </p>
                    </div>
                    <StatusBadge
                      label={couponStatusLabel(coupon.status, t)}
                      variant={COUPON_STATUS[coupon.status]}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>
          <CrudDetailSection title={t.prescriptions}>
            {customer.prescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoPrescriptions}</p>
            ) : (
              <ul className="space-y-3">
                {customer.prescriptions.map((rx) => (
                  <li key={rx.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{rx.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? rx.productAr : rx.productEn} ·{" "}
                        {formatDateTime(rx.uploadedAt, language)}
                      </p>
                    </div>
                    <StatusBadge label={t[rx.status]} variant={RX_STATUS[rx.status]} />
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>

          <CrudDetailSection title={t.crmProductReviews} description={t.crmProductReviewsHint}>
            {customer.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoReviews}</p>
            ) : (
              <ul className="space-y-3">
                {customer.reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-lg border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {isRTL ? review.productAr : review.productEn}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-warning">
                          <Star className="size-3.5 fill-current" aria-hidden="true" />
                          {review.rating}/5
                        </p>
                      </div>
                      <StatusBadge label={t[review.status]} variant={RX_STATUS[review.status]} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {isRTL ? review.bodyAr : review.bodyEn}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.id} · {formatDateTime(review.createdAt, language)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>
          <CrudDetailSection title={t.crmAddresses}>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.crmNoAddresses}</p>
            ) : (
              <ul className="space-y-3">
                {customer.addresses.map((address) => (
                  <li key={address.id} className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {isRTL ? address.titleAr : address.titleEn}
                        {address.isDefault ? (
                          <span className="ms-2 text-xs font-medium text-brand">
                            {t.crmDefaultAddress}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? address.lineAr : address.lineEn} · {address.phone}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CrudDetailSection>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <CrudDetailSection title={t.crmInternalNotes} description={t.crmNotesHint}>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!noteBody.trim()) return;
                void mutations.addNote
                  .mutate({
                    id: customer.id,
                    input: { body: noteBody, type: noteType },
                  })
                  .then((result) => {
                    if (result.ok) setNoteBody("");
                  });
              }}
            >
              <div className="flex flex-wrap gap-2">
                {NOTE_TYPES.map((type) => (
                  <AppButton
                    key={type}
                    type="button"
                    size="sm"
                    variant={noteType === type ? "default" : "outline"}
                    onClick={() => setNoteType(type)}
                  >
                    {noteTypeLabel[type]}
                  </AppButton>
                ))}
              </div>
              <Textarea
                value={noteBody}
                onChange={(event) => setNoteBody(event.target.value)}
                placeholder={t.crmNotePlaceholder}
                rows={3}
              />
              <AppButton
                type="submit"
                size="sm"
                disabled={!noteBody.trim() || mutations.addNote.isPending}
              >
                <StickyNote className="size-4" aria-hidden="true" />
                {t.crmAddNote}
              </AppButton>
            </form>
            <ul className="mt-4 space-y-3">
              {customer.notes.length === 0 ? (
                <li className="text-sm text-muted-foreground">{t.crmNoNotes}</li>
              ) : (
                customer.notes.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-border bg-muted/40 px-3 py-2"
                  >
                    <p className="text-sm text-foreground">{item.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.author} · {noteTypeLabel[item.type]} ·{" "}
                      {formatDateTime(item.createdAt, language)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </CrudDetailSection>

          <CrudDetailSection title={t.crmTimeline} description={t.crmTimelineHint}>
            <ol className="space-y-3">
              {customer.timeline.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {isRTL ? item.titleAr : item.titleEn}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timelineLabel(item.type, t)} · {formatDateTime(item.at, language)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CrudDetailSection>
        </div>
      </div>

      <CustomerCrmProfileDialog
        open={profileOpen}
        customer={customer}
        isSaving={mutations.updateProfile.isPending}
        onOpenChange={setProfileOpen}
        onSave={async (input) => {
          const result = await mutations.updateProfile.mutate({ id: customer.id, input });
          return result.ok;
        }}
      />
    </div>
  );
}

function couponStatusLabel(
  status: CrmCouponStatus,
  t: { crmCouponUsed: string; crmCouponUnused: string; crmCouponExpired: string },
): string {
  if (status === "unused") return t.crmCouponUnused;
  if (status === "expired") return t.crmCouponExpired;
  return t.crmCouponUsed;
}

function paymentStatusLabel(
  status: CrmPaymentStatus,
  t: {
    crmPaymentSuccess: string;
    crmPaymentFailed: string;
    crmPaymentRefunded: string;
    crmPaymentPending: string;
  },
): string {
  if (status === "failed") return t.crmPaymentFailed;
  if (status === "refunded") return t.crmPaymentRefunded;
  if (status === "pending") return t.crmPaymentPending;
  return t.crmPaymentSuccess;
}

function orderStatusLabel(
  status: string,
  t: { delivered: string; shipped: string; processing: string; pending: string; cancelled: string },
): string {
  if (status === "delivered") return t.delivered;
  if (status === "shipped") return t.shipped;
  if (status === "processing") return t.processing;
  if (status === "cancelled") return t.cancelled;
  return t.pending;
}

function planStatusLabel(
  status: string,
  active: string,
  paused: string,
  cancelled: string,
): string {
  if (status === "PAUSED") return paused;
  if (status === "CANCELLED") return cancelled;
  return active;
}

function frequencyLabel(
  frequency: string,
  t: { crmWeekly: string; crmBiweekly: string; crmMonthly: string },
): string {
  if (frequency === "WEEKLY") return t.crmWeekly;
  if (frequency === "BIWEEKLY") return t.crmBiweekly;
  return t.crmMonthly;
}

function timelineLabel(
  type: CrmTimelineType,
  t: {
    crmEventRegistered: string;
    crmEventOrder: string;
    crmEventPayment: string;
    crmEventCarePlan: string;
    crmEventLoyalty: string;
    crmEventPrescription: string;
    crmEventNote: string;
    crmEventNotification: string;
    crmEventCoupon: string;
    crmEventReview: string;
    crmEventProfile: string;
  },
): string {
  switch (type) {
    case "registered":
      return t.crmEventRegistered;
    case "order":
      return t.crmEventOrder;
    case "payment":
      return t.crmEventPayment;
    case "care_plan":
      return t.crmEventCarePlan;
    case "loyalty":
      return t.crmEventLoyalty;
    case "prescription":
      return t.crmEventPrescription;
    case "note":
      return t.crmEventNote;
    case "notification":
      return t.crmEventNotification;
    case "coupon":
      return t.crmEventCoupon;
    case "review":
      return t.crmEventReview;
    case "profile":
      return t.crmEventProfile;
  }
}
