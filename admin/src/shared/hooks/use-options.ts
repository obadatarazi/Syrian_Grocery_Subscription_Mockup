import { useMemo } from "react";

import {
  resolveStaticEnumOptions,
  type StaticEnumOptionsKey,
} from "@/shared/constants/static-enum-options";
import { useLocalization } from "@/shared/design-system/localization/contexts/LocalizationContext";

export type SelectOption = {
  label: string;
  value: string;
};

function useStaticEnumOptions(key: StaticEnumOptionsKey) {
  const { language } = useLocalization();

  const options = useMemo(
    () => resolveStaticEnumOptions(key, language === "ar" ? "ar" : "en"),
    [key, language],
  );

  return {
    data: options,
    options,
    error: null as Error | null,
    status: "success" as const,
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: true,
    refetch: async () => undefined,
    patchData: () => undefined,
  };
}

export function useMultiTypeSettingTypeOptions() {
  return useStaticEnumOptions("multiTypeSettingType");
}

export function useUserGenderOptions() {
  return useStaticEnumOptions("userGender");
}

export function useUserTypeOptions() {
  return useStaticEnumOptions("userType");
}

export function useContactUsStatusOptions() {
  return useStaticEnumOptions("contactUsStatus");
}

export function useNotificationTypeOptions() {
  return useStaticEnumOptions("notificationType");
}

export function useStaticPromotionTypeOptions() {
  return useStaticEnumOptions("staticPromotionType");
}

export function useSliderPromotionTypeOptions() {
  return useStaticEnumOptions("sliderPromotionType");
}

export function useProductTypeOptions() {
  return useStaticEnumOptions("productType");
}

export function useProductStatusOptions() {
  return useStaticEnumOptions("productStatus");
}

export function useOrderStatusOptions() {
  return useStaticEnumOptions("orderStatus");
}

export function useOrderCreatedByOptions() {
  return useStaticEnumOptions("orderCreatedBy");
}

export function useInvoiceStatusOptions() {
  return useStaticEnumOptions("invoiceStatus");
}

export function useInvoicePaymentProviderOptions() {
  return useStaticEnumOptions("invoicePaymentProvider");
}
