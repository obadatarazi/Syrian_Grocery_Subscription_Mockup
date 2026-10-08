import type { MultiTypeSetting } from "@/features/settings/types/settings.types";
import type { Translation } from "@/shared/design-system/localization/locales/en";

const SETTING_TITLE_KEYS = {
  FACEBOOK_LINK: "settingTitleFacebookLink",
  INSTAGRAM_LINK: "settingTitleInstagramLink",
  YOUTUBE_LINK: "settingTitleYoutubeLink",
  CONTACT_EMAIL: "settingTitleContactEmail",
  CONTACT_HOURS: "settingTitleContactHours",
  PHONE_NUMBER: "settingTitlePhoneNumber",
  ADDRESS_LOCATION: "settingTitleAddressLocation",
  EMAIL: "settingTitleEmail",
  WEBSITE_LINK: "settingTitleWebsiteLink",
  DASHBOARD_LINK: "settingTitleDashboardLink",
  COMMISSION_TAX_RATE: "settingTitleCommissionTaxRate",
  ACTIVE_COMMISSION_TAX_RATE: "settingTitleActiveCommissionTaxRate",
} as const satisfies Record<string, keyof Translation>;

const SETTING_DESCRIPTION_KEYS = {
  FACEBOOK_LINK: "settingDescFacebookLink",
  INSTAGRAM_LINK: "settingDescInstagramLink",
  YOUTUBE_LINK: "settingDescYoutubeLink",
  CONTACT_EMAIL: "settingDescContactEmail",
  CONTACT_HOURS: "settingDescContactHours",
  PHONE_NUMBER: "settingDescPhoneNumber",
  ADDRESS_LOCATION: "settingDescAddressLocation",
  EMAIL: "settingDescEmail",
  WEBSITE_LINK: "settingDescWebsiteLink",
  DASHBOARD_LINK: "settingDescDashboardLink",
  COMMISSION_TAX_RATE: "settingDescCommissionTaxRate",
  ACTIVE_COMMISSION_TAX_RATE: "settingDescActiveCommissionTaxRate",
} as const satisfies Record<string, keyof Translation>;

function formatFallbackSettingLabel(settingKey: string): string {
  return settingKey
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSettingTitle(settingKey: string, t: Translation): string {
  const key = SETTING_TITLE_KEYS[settingKey as keyof typeof SETTING_TITLE_KEYS];
  if (key) return t[key];
  return formatFallbackSettingLabel(settingKey);
}

export function getSettingDescription(
  settingKey: string,
  fallback: string | null | undefined,
  t: Translation,
): string {
  const key = SETTING_DESCRIPTION_KEYS[settingKey as keyof typeof SETTING_DESCRIPTION_KEYS];
  if (key) return t[key];
  return fallback?.trim() || formatFallbackSettingLabel(settingKey);
}

export function parseSettingBoolean(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

/** Matches backend OrderService: missing ACTIVE_COMMISSION_TAX_RATE is treated as on. */
export function isCommissionTaxActive(settings: MultiTypeSetting[]): boolean {
  const flag = settings.find((setting) => setting.settingKey === "ACTIVE_COMMISSION_TAX_RATE");
  if (!flag) return true;
  return parseSettingBoolean(flag.value);
}

export function isCommissionTaxRateLocked(
  setting: MultiTypeSetting,
  settings: MultiTypeSetting[],
): boolean {
  return setting.settingKey === "COMMISSION_TAX_RATE" && !isCommissionTaxActive(settings);
}
