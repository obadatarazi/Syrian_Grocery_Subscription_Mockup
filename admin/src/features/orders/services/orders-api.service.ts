import type { OrdersService } from "@/features/orders/services/orders.service.types";
import type {
  Order,
  OrderFormData,
  OrderListParams,
  OrderPackingSlipDownload,
} from "@/features/orders/types/orders.types";
import {
  buildOrderCreatePayload,
  buildOrderUpdatePayload,
} from "@/features/orders/types/orders.types";
import { mapOrderFromApi } from "@/features/orders/utils/map-order-from-api";
import {
  apiRequest,
  buildLaravelListParams,
  type LaravelPaginatedResponse,
  type LaravelSuccessResponse,
  mapLaravelPagination,
} from "@/shared/lib/api";

function createApiOrdersService(): OrdersService {
  return {
    async list(params: OrderListParams = {}, signal?: AbortSignal) {
      const response = await apiRequest<LaravelPaginatedResponse<Order>>("/admin/orders", {
        signal,
        params: buildLaravelListParams(
          {
            page: params.page,
            limit: params.limit,
            search: params.search,
            userId: params.userId,
            orderRefNumber: params.orderRefNumber,
            status: params.status,
            createdBy: params.createdBy,
            hasDiscount: params.hasDiscount,
            invoiceStatus: params.invoiceStatus,
            paymentProvider: params.paymentProvider,
            sort: params.sort,
            direction: params.direction,
          },
          { limit: 20 },
        ),
      });
      const page = mapLaravelPagination(response);
      return { ...page, data: page.data.map(mapOrderFromApi) };
    },

    async getById(id) {
      const response = await apiRequest<LaravelSuccessResponse<Order>>(`/admin/orders/${id}`);
      return mapOrderFromApi(response.data);
    },

    async create(data: OrderFormData) {
      const response = await apiRequest<LaravelSuccessResponse<Order>>("/admin/orders", {
        method: "POST",
        body: buildOrderCreatePayload(data),
      });
      return mapOrderFromApi(response.data);
    },

    async update(id, data, original) {
      if (!original) {
        throw new Error("Original order form data is required for update.");
      }
      const payload = buildOrderUpdatePayload(original, data as OrderFormData);
      const response = await apiRequest<LaravelSuccessResponse<Order>>(`/admin/orders/${id}`, {
        method: "PUT",
        body: payload,
      });
      return mapOrderFromApi(response.data);
    },

    async downloadPackingSlip(orderRefNumber) {
      const response = await apiRequest<LaravelSuccessResponse<OrderPackingSlipDownload>>(
        `/admin/orders/${encodeURIComponent(orderRefNumber)}/packing-slip`,
      );
      return response.data;
    },
  };
}

export { createApiOrdersService };
