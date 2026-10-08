import type {
  Discount,
  DiscountFormData,
  DiscountListParams,
  DiscountListResult,
} from "@/features/discounts/types/discounts.types";

export interface DiscountsService {
  list(params?: DiscountListParams, signal?: AbortSignal): Promise<DiscountListResult>;
  getById(id: number): Promise<Discount>;
  create(data: DiscountFormData): Promise<Discount>;
  update(id: number, data: Partial<DiscountFormData>): Promise<Discount>;
  delete(id: number): Promise<void>;
}
