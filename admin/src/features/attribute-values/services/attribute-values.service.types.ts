import type {
  AttributeValue,
  AttributeValueFormData,
  AttributeValueListParams,
  AttributeValueListResult,
} from "@/features/attribute-values/types/attribute-values.types";

export interface AttributeValuesService {
  list(params?: AttributeValueListParams, signal?: AbortSignal): Promise<AttributeValueListResult>;
  getById(id: number): Promise<AttributeValue>;
  create(data: AttributeValueFormData): Promise<AttributeValue>;
  update(id: number, data: Partial<AttributeValueFormData>): Promise<AttributeValue>;
  delete(id: number): Promise<void>;
}
