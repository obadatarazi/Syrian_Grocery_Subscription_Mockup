import { apiRequest, type LaravelEnumOption, type LaravelSuccessResponse } from "@/shared/lib/api";

export const OPTIONS_ENDPOINTS = {
  multiTypeSettingType: "/options/multi-type-settings/type",
  userGender: "/options/users/gender",
  userType: "/options/users/type",
  contactUsStatus: "/options/contact-us/status",
  notificationType: "/options/notifications/type",
  staticPromotionType: "/options/static-promotions/type",
  sliderPromotionType: "/options/slider-promotions/type",
  productType: "/options/products/type",
  productStatus: "/options/products/status",
  orderStatus: "/options/orders/status",
  orderCreatedBy: "/options/orders/created-by",
  invoiceStatus: "/options/invoices/status",
  invoicePaymentProvider: "/options/invoices/payment-provider",
} as const;

export type OptionsEndpoint = (typeof OPTIONS_ENDPOINTS)[keyof typeof OPTIONS_ENDPOINTS];

export async function fetchEnumOptions(
  endpoint: OptionsEndpoint,
  signal?: AbortSignal,
): Promise<LaravelEnumOption[]> {
  const response = await apiRequest<LaravelSuccessResponse<LaravelEnumOption[]>>(endpoint, {
    skipAuth: true,
    signal,
  });
  return response.data;
}
