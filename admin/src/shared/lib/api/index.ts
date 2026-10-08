export { apiRequest, DEFAULT_API_REQUEST_TIMEOUT_MS, type ApiLocale, type ApiRequestOptions } from "@/shared/lib/api/api-client";
export {
  appendBoolean,
  appendFile,
  appendNumberArray,
  appendOptional,
  appendProductTranslations,
  appendTranslations,
  submitMultipartFormData,
  type LocaleCode,
  type ProductTranslationInput,
  type ProductTranslationsInput,
  type TranslationInput,
  type TranslationsInput,
} from "@/shared/lib/api/form-data.utils";
export type {
  ApiLoginData,
  ApiProfileData,
  ApiRoleData,
  ApiUser,
  LaravelEnumOption,
  LaravelErrorResponse,
  LaravelPaginatedResponse,
  LaravelSuccessResponse,
} from "@/shared/lib/api/laravel.types";
export { fetchEnumOptions, OPTIONS_ENDPOINTS } from "@/shared/services/options-api.service";
export type { OptionsEndpoint } from "@/shared/services/options-api.service";
export { buildLaravelListParams, buildQueryString, mapLaravelError, mapLaravelPagination } from "@/shared/lib/api/laravel.utils";
export {
  getTitleFromApiTranslations,
  normalizeTranslationsFromApi,
  type ApiTranslationRow,
  type LocaleCode as ApiLocaleCode,
  type LocaleTranslations,
} from "@/shared/lib/api/normalize-translations.utils";
export {
  enumLabel,
  enumValue,
  normalizeEnumLabelValue,
  type EnumLabelValue as ApiEnumLabelValue,
} from "@/shared/lib/api/normalize-enum.utils";
export {
  mapPaginatedTranslatableFromApi,
  mapTranslatableFromApi,
  mapTranslatableListFromApi,
} from "@/shared/lib/api/map-translatable-from-api.utils";
export { mapPaginatedFromApi } from "@/shared/lib/api/map-paginated-from-api.utils";
