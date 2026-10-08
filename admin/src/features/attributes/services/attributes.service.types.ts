import type {
  Attribute,
  AttributeFormData,
  AttributeListParams,
  AttributeListResult,
} from "@/features/attributes/types/attributes.types";

export interface AttributesService {
  list(params?: AttributeListParams, signal?: AbortSignal): Promise<AttributeListResult>;
  getById(id: number): Promise<Attribute>;
  create(data: AttributeFormData): Promise<Attribute>;
  update(id: number, data: Partial<AttributeFormData>): Promise<Attribute>;
  delete(id: number): Promise<void>;
}
