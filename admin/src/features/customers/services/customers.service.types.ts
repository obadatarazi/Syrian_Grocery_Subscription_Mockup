import type {
  CrmCustomer,
  CrmCustomerListParams,
  CrmNoteInput,
  CrmProfileInput,
  CrmReport,
  CrmStats,
} from "@/features/customers/types/customers.types";
import type { PaginatedResult } from "@/shared/types";

export interface CustomersService {
  list(params?: CrmCustomerListParams, signal?: AbortSignal): Promise<PaginatedResult<CrmCustomer>>;
  getById(id: number): Promise<CrmCustomer>;
  getStats(): Promise<CrmStats>;
  getReport(): Promise<CrmReport>;
  addNote(id: number, input: CrmNoteInput): Promise<CrmCustomer>;
  toggleCarePlan(id: number): Promise<CrmCustomer>;
  toggleTag(id: number, tag: "vip"): Promise<CrmCustomer>;
  sendNotification(id: number): Promise<CrmCustomer>;
  assignCoupon(id: number): Promise<CrmCustomer>;
  updateProfile(id: number, input: CrmProfileInput): Promise<CrmCustomer>;
}
