import type { Slider, SliderFormData, SliderListParams } from "@/features/sliders/types/sliders.types";
import type { PaginatedResult } from "@/shared/types";

export interface SlidersService {
  list(params?: SliderListParams, signal?: AbortSignal): Promise<PaginatedResult<Slider>>;
  getById(id: number): Promise<Slider>;
  create(data: SliderFormData): Promise<Slider>;
  update(id: number, data: Partial<SliderFormData>): Promise<Slider>;
  delete(id: number): Promise<void>;
}
