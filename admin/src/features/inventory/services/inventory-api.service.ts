import type {
  InventoryListParams,
  InventoryService,
  UpdateInventoryPayload,
} from "@/features/inventory/services/inventory.service.types";
import type { Product } from "@/features/products/types/products.types";
import { mapProductFromApi } from "@/features/products/utils/map-product-from-api";
import {
  apiRequest,
  buildLaravelListParams,
  mapPaginatedFromApi,
  type LaravelPaginatedResponse,
  type LaravelSuccessResponse,
} from "@/shared/lib/api";

function createApiInventoryService(): InventoryService {
  return {
    async list(params: InventoryListParams = {}, signal?: AbortSignal) {
      const response = await apiRequest<LaravelPaginatedResponse<Product>>(
        "/admin/product/inventories",
        {
        signal,
          params: buildLaravelListParams(
            {
              page: params.page,
              limit: params.limit,
              search: params.search,
              publish: params.publish,
              brandId: params.brandId,
              type: params.type,
              categoryId: params.categoryId,
              tagId: params.tagId,
              featured: params.featured,
              bestSeller: params.bestSeller,
              newlyArrived: params.newlyArrived,
              isProductYouWillLove: params.isProductYouWillLove,
              skuCode: params.skuCode,
              eanCode: params.eanCode,
              attributeId: params.attributeId,
              attributeValueId: params.attributeValueId,
              sort: params.sort,
              direction: params.direction,
            },
            { limit: 12 },
          ),
        },
      );

      return mapPaginatedFromApi(response, mapProductFromApi);
    },

    async update(data: UpdateInventoryPayload) {
      await apiRequest<LaravelSuccessResponse<null>>("/admin/product/inventories", {
        method: "POST",
        body: {
          eanCode: data.eanCode || undefined,
          skuCode: data.skuCode || undefined,
          price: data.price ?? undefined,
          stock: data.stock ?? undefined,
        },
      });
    },
  };
}

export { createApiInventoryService };
