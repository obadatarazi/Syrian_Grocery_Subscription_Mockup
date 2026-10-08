import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

import { NotificationMarkReadButton } from "@/features/notifications/components/NotificationMarkReadButton";
import type { Notification } from "@/features/notifications/types/notifications.types";
import {
  getNotificationUserLabel,
  getNotificationVisual,
} from "@/features/notifications/utils/notification-display.utils";
import { getNotificationTargetHref } from "@/features/notifications/utils/notification-target.utils";
import { AppButton, StatusBadge } from "@/shared/components";
import { CrudDetailField, CrudViewDialog, type CrudViewDialogSection } from "@/shared/crud";
import {
  useLocalization,
  useTranslation,
} from "@/shared/design-system/localization/contexts/LocalizationContext";
import { cn } from "@/shared/design-system/components/ui/utils";
import { enumLabel } from "@/shared/lib/api";
import { formatDateTime } from "@/shared/lib/datetime.utils";
import { getBilingualTitle } from "@/shared/lib/translation-display.utils";

type NotificationViewDialogProps = {
  open: boolean;
  entity: Notification | null;
  canMarkRead?: boolean;
  canDelete?: boolean;
  isReadUpdating?: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkRead?: (entity: Notification) => void;
  onDelete?: (entity: Notification) => void;
};

export function NotificationViewDialog({
  open,
  entity,
  canMarkRead = false,
  canDelete = false,
  isReadUpdating = false,
  onOpenChange,
  onMarkRead,
  onDelete,
}: NotificationViewDialogProps) {
  const t = useTranslation();
  const navigate = useNavigate();
  const { language } = useLocalization();

  if (!entity) return null;

  const title = getBilingualTitle(entity.translations, entity.title);
  const bodyEn = entity.translations?.en?.body ?? entity.body ?? "";
  const bodyAr = entity.translations?.ar?.body ?? "";
  const typeLabel = enumLabel(entity.type) || t.notSet;
  const visual = getNotificationVisual(entity.type?.value);
  const Icon = visual.icon;
  const targetHref = getNotificationTargetHref(entity);

  const sections: CrudViewDialogSection[] = [
    {
      id: "content",
      title: t.notificationContent,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label={t.titleEnglish}>
            {title.en || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.titleArabic}>
            {title.ar ? (
              <span dir="rtl" className="block">
                {title.ar}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
          <CrudDetailField label={t.notificationBodyEnglish}>
            {bodyEn || <span className="text-muted-foreground">{t.notSet}</span>}
          </CrudDetailField>
          <CrudDetailField label={t.notificationBodyArabic}>
            {bodyAr ? (
              <span dir="rtl" className="block whitespace-pre-wrap">
                {bodyAr}
              </span>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
        </div>
      ),
    },
    {
      id: "details",
      title: t.notificationDetails,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <CrudDetailField label="ID">{entity.id}</CrudDetailField>
          <CrudDetailField label={t.notificationType}>{typeLabel}</CrudDetailField>
          <CrudDetailField label={t.readStatus}>
            {canMarkRead && onMarkRead ? (
              <NotificationMarkReadButton
                read={entity.read}
                isLoading={isReadUpdating}
                onMarkRead={() => onMarkRead(entity)}
              />
            ) : entity.read ? (
              t.read
            ) : (
              t.unread
            )}
          </CrudDetailField>
          <CrudDetailField label={t.date}>
            {formatDateTime(entity.createdAt, language)}
          </CrudDetailField>
          <CrudDetailField label={t.notificationRecipients}>
            {(entity.users ?? []).length > 0 ? (
              <ul className="space-y-1">
                {(entity.users ?? []).map((user) => (
                  <li key={user.id}>{getNotificationUserLabel(user)}</li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">{t.notSet}</span>
            )}
          </CrudDetailField>
        </div>
      ),
    },
  ];

  return (
    <CrudViewDialog
      open={open}
      entity={entity}
      onOpenChange={onOpenChange}
      title={t.viewNotification}
      cancelLabel={t.cancel}
      canUpdate={false}
      canDelete={canDelete}
      deleteLabel={t.deleteAction}
      onDelete={onDelete}
      sections={sections}
      footerActions={
        targetHref ? (
          <AppButton
            onClick={() => {
              onOpenChange(false);
              navigate(targetHref);
            }}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {t.openRelated}
          </AppButton>
        ) : undefined
      }
      hero={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className={cn(
              "flex size-20 shrink-0 items-center justify-center rounded-xl",
              visual.chipClass,
            )}
            aria-hidden="true"
          >
            <Icon className={cn("size-8", visual.iconClass)} />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{title.en || title.ar}</p>
              {title.ar && title.en ? (
                <p dir="rtl" className="mt-1 text-sm text-muted-foreground">
                  {title.ar}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge label={typeLabel} variant="neutral" />
              <StatusBadge
                label={entity.read ? t.read : t.unread}
                variant={entity.read ? "neutral" : "info"}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
