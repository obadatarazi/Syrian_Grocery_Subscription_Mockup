import type {
  Order,
  OrderFormData,
  OrderListParams,
  OrderListResult,
  OrderPackingSlipDownload,
} from "@/features/orders/types/orders.types";

export interface OrdersService {
  list(params?: OrderListParams, signal?: AbortSignal): Promise<OrderListResult>;
  getById(id: number): Promise<Order>;
  create(data: OrderFormData): Promise<Order>;
  update(id: number, data: Partial<OrderFormData>, original?: OrderFormData): Promise<Order>;
  downloadPackingSlip(orderRefNumber: string): Promise<OrderPackingSlipDownload>;
}
