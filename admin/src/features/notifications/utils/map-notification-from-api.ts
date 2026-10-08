import type { Notification } from "@/features/notifications/types/notifications.types";
import { normalizeEnumLabelValue } from "@/shared/lib/api/normalize-enum.utils";
import { mapTranslatableFromApi } from "@/shared/lib/api/map-translatable-from-api.utils";
import {
  getTitleFromApiTranslations,
  normalizeTranslationsFromApi,
} from "@/shared/lib/api/normalize-translations.utils";

export function mapNotificationFromApi(entity: Notification): Notification {
  const mapped = mapTranslatableFromApi<Notification, { title?: string; body?: string }>(entity);
  const translations = normalizeTranslationsFromApi<{ title?: string; body?: string }>(
    entity.translations,
  );
  const title =
    mapped.title?.trim() ||
    getTitleFromApiTranslations(entity.translations, "") ||
    "";
  const body =
    (typeof entity.body === "string" ? entity.body : null)?.trim() ||
    translations?.en?.body?.trim() ||
    translations?.ar?.body?.trim() ||
    null;

  return {
    ...mapped,
    title,
    body,
    read: Boolean(entity.read),
    type: normalizeEnumLabelValue(entity.type) ?? { label: null, value: null },
    translations: translations
      ? {
          en: {
            title: translations.en?.title ?? "",
            body: translations.en?.body ?? "",
          },
          ar: {
            title: translations.ar?.title ?? "",
            body: translations.ar?.body ?? "",
          },
        }
      : mapped.translations,
    users: Array.isArray(entity.users) ? entity.users : [],
    metaData:
      entity.metaData && typeof entity.metaData === "object"
        ? (entity.metaData as Record<string, unknown>)
        : null,
  };
}
