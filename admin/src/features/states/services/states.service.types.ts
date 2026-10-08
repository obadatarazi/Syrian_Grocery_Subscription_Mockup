import type {
  State,
  StateFormData,
  StateListParams,
  StateListResult,
} from "@/features/states/types/states.types";

export interface StatesService {
  list(params?: StateListParams, signal?: AbortSignal): Promise<StateListResult>;
  getById(id: number): Promise<State>;
  create(data: StateFormData): Promise<State>;
  update(id: number, data: Partial<StateFormData>): Promise<State>;
  delete(id: number): Promise<void>;
}
