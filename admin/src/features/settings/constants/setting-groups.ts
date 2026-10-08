export const SETTING_GROUP_IDS = [
  "socialMedia",
  "contact",
  "appLinks",
  "business",
  "other",
] as const;

export type SettingGroupId = (typeof SETTING_GROUP_IDS)[number];

/** Maps known setting keys to purpose-based groups. Unknown keys fall into "other". */
export const SETTING_KEY_GROUP_MAP: Record<string, SettingGroupId> = {
  FACEBOOK_LINK: "socialMedia",
  INSTAGRAM_LINK: "socialMedia",
  YOUTUBE_LINK: "socialMedia",

  CONTACT_EMAIL: "contact",
  CONTACT_HOURS: "contact",
  PHONE_NUMBER: "contact",
  ADDRESS_LOCATION: "contact",
  EMAIL: "contact",

  WEBSITE_LINK: "appLinks",
  DASHBOARD_LINK: "appLinks",

  COMMISSION_TAX_RATE: "business",
  ACTIVE_COMMISSION_TAX_RATE: "business",
};

/** Preferred display order within the business group (active switch before rate). */
export const BUSINESS_SETTING_ORDER = [
  "ACTIVE_COMMISSION_TAX_RATE",
  "COMMISSION_TAX_RATE",
] as const;

export function resolveSettingGroupId(settingKey: string): SettingGroupId {
  return SETTING_KEY_GROUP_MAP[settingKey] ?? "other";
}
