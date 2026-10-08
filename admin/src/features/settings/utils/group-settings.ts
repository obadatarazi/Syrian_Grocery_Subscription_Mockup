import {
  BUSINESS_SETTING_ORDER,
  SETTING_GROUP_IDS,
  resolveSettingGroupId,
  type SettingGroupId,
} from "@/features/settings/constants/setting-groups";
import type { MultiTypeSetting } from "@/features/settings/types/settings.types";

export type SettingsGroup = {
  id: SettingGroupId;
  settings: MultiTypeSetting[];
};

function sortBusinessSettings(settings: MultiTypeSetting[]): MultiTypeSetting[] {
  const order = new Map(BUSINESS_SETTING_ORDER.map((key, index) => [key, index]));
  return [...settings].sort((a, b) => {
    const aOrder = order.get(a.settingKey as (typeof BUSINESS_SETTING_ORDER)[number]) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = order.get(b.settingKey as (typeof BUSINESS_SETTING_ORDER)[number]) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

export function groupSettingsByPurpose(settings: MultiTypeSetting[]): SettingsGroup[] {
  const buckets = Object.fromEntries(
    SETTING_GROUP_IDS.map((id) => [id, [] as MultiTypeSetting[]]),
  ) as Record<SettingGroupId, MultiTypeSetting[]>;

  for (const setting of settings) {
    buckets[resolveSettingGroupId(setting.settingKey)].push(setting);
  }

  return SETTING_GROUP_IDS.filter((id) => buckets[id].length > 0).map((id) => ({
    id,
    settings: id === "business" ? sortBusinessSettings(buckets[id]) : buckets[id],
  }));
}
