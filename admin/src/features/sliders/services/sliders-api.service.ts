import type { SlidersService } from "@/features/sliders/services/sliders.service.types";
import type {
  Slider,
  SliderFormData,
  SliderListParams,
  SliderTranslationsInput,
} from "@/features/sliders/types/sliders.types";
import { mapSliderFromApi } from "@/features/sliders/utils/map-slider-from-api";
import {
  apiRequest,
  appendBoolean,
  appendFile,
  appendOptional,
  buildLaravelListParams,
  submitMultipartFormData,
  type LaravelPaginatedResponse,
  type LaravelSuccessResponse,
  mapPaginatedFromApi,
} from "@/shared/lib/api";

function appendSliderTranslations(formData: FormData, translations: SliderTranslationsInput): void {
  for (const [locale, translation] of Object.entries(translations)) {
    if (!translation) continue;
    const prefix = `translations[${locale}]`;
    if (translation.badge?.trim()) {
      formData.append(`${prefix}[badge]`, translation.badge.trim());
    }
    if (translation.title?.trim()) {
      formData.append(`${prefix}[title]`, translation.title.trim());
    }
    if (translation.description?.trim()) {
      formData.append(`${prefix}[description]`, translation.description.trim());
    }
    if (translation.buttonText?.trim()) {
      formData.append(`${prefix}[button_text]`, translation.buttonText.trim());
    }
  }
}

function buildSliderFormData(data: Partial<SliderFormData>): FormData {
  const formData = new FormData();
  if (data.translations) {
    appendSliderTranslations(formData, data.translations);
  }
  if (data.publish !== undefined) {
    appendBoolean(formData, "publish", data.publish);
  }
  if (data.image) {
    appendFile(formData, "image", data.image);
  }
  appendOptional(formData, "button_link", data.buttonLink);
  appendOptional(formData, "button_color_code", data.buttonColorCode);
  appendOptional(formData, "background_color_code", data.backgroundColorCode);
  return formData;
}

function createApiSlidersService(): SlidersService {
  return {
    async list(params: SliderListParams = {}, signal?: AbortSignal) {
      const response = await apiRequest<LaravelPaginatedResponse<Slider>>("/admin/sliders", {
        signal,
        params: buildLaravelListParams(
          {
            page: params.page,
            limit: params.limit,
            search: params.search,
            publish: params.publish,
            sort: params.sort,
            direction: params.direction,
          },
          { limit: 10 },
        ),
      });
      return mapPaginatedFromApi(response, mapSliderFromApi);
    },

    async getById(id) {
      const response = await apiRequest<LaravelSuccessResponse<Slider>>(`/admin/sliders/${id}`);
      return mapSliderFromApi(response.data);
    },

    async create(data: SliderFormData) {
      const response = await apiRequest<LaravelSuccessResponse<Slider>>("/admin/sliders", {
        method: "POST",
        body: buildSliderFormData(data),
      });
      return mapSliderFromApi(response.data);
    },

    async update(id, data: Partial<SliderFormData>) {
      const formData = buildSliderFormData(data);
      const { method, body } = submitMultipartFormData(formData, "PUT");
      const response = await apiRequest<LaravelSuccessResponse<Slider>>(`/admin/sliders/${id}`, {
        method,
        body,
      });
      return mapSliderFromApi(response.data);
    },

    async delete(id) {
      await apiRequest(`/admin/sliders/${id}`, { method: "DELETE" });
    },
  };
}

export { createApiSlidersService };
