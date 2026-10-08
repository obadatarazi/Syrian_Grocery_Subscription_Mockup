import { productVariantsService } from "@/features/products/services/product-variants.service";
import type { ProductsService } from "@/features/products/services/products.service.types";
import type { ProductImportSummary } from "@/features/products/types/product-import.types";
import type {
  Product,
  ProductFormData,
  ProductImageFormItem,
  ProductListParams,
  ProductType,
  ProductVariantFormItem,
} from "@/features/products/types/products.types";
import { mapProductFromApi } from "@/features/products/utils/map-product-from-api";
import { mapProductImportFromApi } from "@/features/products/utils/map-product-import-from-api";
import { uniqueNumberIds } from "@/features/products/utils/variant-attribute.utils";
import {
  apiRequest,
  appendBoolean,
  appendFile,
  appendNumberArray,
  appendOptional,
  appendProductTranslations,
  buildLaravelListParams,
  type LaravelPaginatedResponse,
  type LaravelSuccessResponse,
  mapPaginatedFromApi,
  submitMultipartFormData,
} from "@/shared/lib/api";

function appendProductImages(formData: FormData, images: ProductImageFormItem[]): void {
  images.forEach((image, index) => {
    if (!image.id && !(image.file instanceof File)) {
      return;
    }

    const prefix = `images[${index}]`;
    if (image.id) {
      formData.append(`${prefix}[id]`, String(image.id));
    }
    if (image.file instanceof File) {
      formData.append(`${prefix}[image]`, image.file);
    }
    appendBoolean(formData, `${prefix}[featured]`, image.featured);
  });
}

function appendVariantImages(
  formData: FormData,
  variantPrefix: string,
  images: ProductImageFormItem[],
): void {
  images.forEach((image, index) => {
    if (!image.id && !(image.file instanceof File)) {
      return;
    }

    const prefix = `${variantPrefix}[images][${index}]`;
    if (image.id) {
      formData.append(`${prefix}[id]`, String(image.id));
    }
    if (image.file instanceof File) {
      formData.append(`${prefix}[image]`, image.file);
    }
    appendBoolean(formData, `${prefix}[featured]`, image.featured);
  });
}

type BuildProductFormDataOptions = {
  /** When true, empty strings/arrays that are present in the payload are sent (partial updates). */
  allowEmptyValues?: boolean;
};

function appendProductVariants(
  formData: FormData,
  variants: Array<Partial<ProductVariantFormItem>>,
  options: BuildProductFormDataOptions = {},
): void {
  const { allowEmptyValues = false } = options;

  variants.forEach((variant, index) => {
    const prefix = `variants[${index}]`;

    if (variant.id) {
      formData.append(`${prefix}[id]`, String(variant.id));
    }
    if (variant.price !== undefined) {
      appendOptional(formData, `${prefix}[price]`, variant.price);
    }
    if (variant.stock !== undefined) {
      appendOptional(formData, `${prefix}[stock]`, variant.stock);
    }
    if (variant.skuCode !== undefined) {
      appendOptional(formData, `${prefix}[sku_code]`, variant.skuCode, {
        allowEmpty: allowEmptyValues,
      });
    }
    if (variant.eanCode !== undefined) {
      appendOptional(formData, `${prefix}[ean_code]`, variant.eanCode, {
        allowEmpty: allowEmptyValues,
      });
    }
    if (variant.hasDiscountPrice !== undefined) {
      appendBoolean(formData, `${prefix}[has_discount_price]`, variant.hasDiscountPrice);
    }

    if (variant.attributeIds !== undefined) {
      appendNumberArray(
        formData,
        `${prefix}[attributeIds]`,
        uniqueNumberIds(variant.attributeIds),
        "bracket",
        { allowEmpty: allowEmptyValues },
      );
    }
    if (variant.attributeValueIds !== undefined) {
      appendNumberArray(
        formData,
        `${prefix}[attributeValueIds]`,
        uniqueNumberIds(variant.attributeValueIds),
        "bracket",
        { allowEmpty: allowEmptyValues },
      );
    }

    if (variant.images) {
      appendVariantImages(formData, prefix, variant.images);
    }

    if (variant.deletedImageIds?.length) {
      appendNumberArray(formData, `${prefix}[deleted_image_ids]`, variant.deletedImageIds);
    }
  });
}

function resolveProductType(data: Partial<ProductFormData>): ProductType | undefined {
  return data.type;
}

function buildProductFormData(
  data: Partial<ProductFormData>,
  options: BuildProductFormDataOptions = {},
): FormData {
  const formData = new FormData();
  const productType = resolveProductType(data);
  const { allowEmptyValues = false } = options;

  if (data.brandId != null) {
    formData.append("brand_id", String(data.brandId));
  }

  if (data.categoryIds) {
    appendNumberArray(formData, "category_ids", data.categoryIds);
  }

  if (data.tagIds) {
    appendNumberArray(formData, "tag_ids", data.tagIds);
  }

  if (productType) {
    formData.append("type", productType);
  }

  if (data.translations) {
    appendProductTranslations(formData, data.translations, {
      allowEmpty: allowEmptyValues,
    });
  }

  appendBoolean(formData, "publish", data.publish);
  appendBoolean(formData, "approve_add_to_care_plan", data.approveAddToCarePlan);
  appendBoolean(formData, "has_discount_price", data.hasDiscountPrice);
  appendBoolean(formData, "best_seller", data.bestSeller);
  appendBoolean(formData, "newly_arrived", data.newlyArrived);
  appendBoolean(formData, "featured", data.featured);
  appendBoolean(formData, "is_product_you_will_love", data.isProductYouWillLove);

  if (data.expiryStartDate !== undefined) {
    appendOptional(formData, "expiry_start_date", data.expiryStartDate, {
      allowEmpty: allowEmptyValues,
    });
  }
  if (data.expiryEndDate !== undefined) {
    appendOptional(formData, "expiry_end_date", data.expiryEndDate, {
      allowEmpty: allowEmptyValues,
    });
  }

  // Partial updates often omit `type`. Infer SIMPLE only when variant payload is absent.
  const isSimpleProduct =
    productType === "SIMPLE" ||
    (productType === undefined &&
      data.variants === undefined &&
      (data.deletedVariantIds?.length ?? 0) === 0 &&
      (data.attributeIds !== undefined ||
        data.attributeValueIds !== undefined ||
        data.skuCode !== undefined ||
        data.eanCode !== undefined ||
        data.price !== undefined ||
        data.stock !== undefined));

  if (isSimpleProduct) {
    if (data.skuCode !== undefined) {
      appendOptional(formData, "sku_code", data.skuCode, { allowEmpty: allowEmptyValues });
    }
    if (data.eanCode !== undefined) {
      appendOptional(formData, "ean_code", data.eanCode, { allowEmpty: allowEmptyValues });
    }
    if (data.price !== undefined) {
      appendOptional(formData, "price", data.price);
    }
    if (data.stock !== undefined) {
      appendOptional(formData, "stock", data.stock);
    }

    // OpenAPI form-data: attributeIds[], attributeValueIds[]
    if (data.attributeIds !== undefined) {
      appendNumberArray(formData, "attributeIds", data.attributeIds, "bracket", {
        allowEmpty: allowEmptyValues,
      });
    }
    if (data.attributeValueIds !== undefined) {
      appendNumberArray(formData, "attributeValueIds", data.attributeValueIds, "bracket", {
        allowEmpty: allowEmptyValues,
      });
    }
  }

  // Partial updates often omit `type`. Still append VARIABLE_PRODUCT fields when they are present.
  const isVariantProduct =
    productType === "VARIABLE_PRODUCT" ||
    (productType === undefined &&
      (data.variants !== undefined || (data.deletedVariantIds?.length ?? 0) > 0));

  if (isVariantProduct) {
    if (data.variants) {
      appendProductVariants(formData, data.variants, options);
    }
  }

  if (data.video instanceof File) {
    appendFile(formData, "video", data.video);
  }

  if (data.images) {
    appendProductImages(formData, data.images);
  }

  if (data.deletedImageIds?.length) {
    appendNumberArray(formData, "deleted_image_ids", data.deletedImageIds);
  }

  if (isVariantProduct && data.deletedVariantIds?.length) {
    appendNumberArray(formData, "deleted_variant_ids", data.deletedVariantIds);
  }

  return formData;
}

/**
 * Sync variant create/update/delete through AdminProductVariant endpoints
 * (`/admin/products/{product}/product-variants`) instead of embedding them
 * in the product multipart payload.
 */
async function syncProductVariantsViaDedicatedApi(
  productId: number,
  variants: Array<Partial<ProductVariantFormItem>> = [],
  deletedVariantIds: number[] = [],
): Promise<void> {
  for (const variantId of deletedVariantIds) {
    await productVariantsService.delete(productId, variantId);
  }

  for (const variant of variants) {
    if (variant.id) {
      const changes = { ...variant };
      delete changes.id;
      await productVariantsService.update(productId, variant.id, changes);
      continue;
    }

    await productVariantsService.create(productId, variant as ProductVariantFormItem);
  }
}

function hasProductPayloadFields(data: Partial<ProductFormData>): boolean {
  return Object.entries(data).some(([key, value]) => {
    if (key === "variants" || key === "deletedVariantIds") return false;
    if (value === undefined) return false;
    if (Array.isArray(value) && value.length === 0) {
      return key === "deletedImageIds" || key === "categoryIds" || key === "tagIds";
    }
    return true;
  });
}

function createApiProductsService(): ProductsService {
  async function getById(id: number, signal?: AbortSignal): Promise<Product> {
    const response = await apiRequest<LaravelSuccessResponse<Product>>(`/admin/products/${id}`, {
      signal,
    });
    return mapProductFromApi(response.data);
  }

  return {
    async list(params: ProductListParams = {}, signal?: AbortSignal) {
      const response = await apiRequest<LaravelPaginatedResponse<Product>>("/admin/products", {
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
      });
      return mapPaginatedFromApi(response, mapProductFromApi);
    },

    getById,

    async getBySlug(slug) {
      const response = await apiRequest<LaravelSuccessResponse<Product>>(`/products/slug/${slug}`, {
        skipAuth: false,
      });
      return mapProductFromApi(response.data);
    },

    async create(data: ProductFormData) {
      const response = await apiRequest<LaravelSuccessResponse<Product>>("/admin/products", {
        method: "POST",
        body: buildProductFormData(data),
      });

      return mapProductFromApi(response.data);
    },

    async update(id, data: Partial<ProductFormData>) {
      const existing = await getById(id);
      const nextType = data.type ?? existing.type;
      const isConvertingSimpleToVariable =
        existing.type === "SIMPLE" && nextType === "VARIABLE_PRODUCT";

      const variants = data.variants;
      const deletedVariantIds = data.deletedVariantIds;
      const hasVariantOps =
        (variants !== undefined && variants.length > 0) ||
        (deletedVariantIds !== undefined && deletedVariantIds.length > 0);

      // SIMPLE → VARIABLE still uses product update so the backend can migrate
      // simple-level inventory into the first variant.
      if (isConvertingSimpleToVariable) {
        const formData = buildProductFormData(data, { allowEmptyValues: true });
        const { method, body } = submitMultipartFormData(formData, "PUT");
        const response = await apiRequest<LaravelSuccessResponse<Product>>(
          `/admin/products/${id}`,
          { method, body },
        );
        return mapProductFromApi(response.data);
      }

      const productPayload: Partial<ProductFormData> = { ...data };
      delete productPayload.variants;
      delete productPayload.deletedVariantIds;

      if (hasProductPayloadFields(productPayload)) {
        const formData = buildProductFormData(productPayload, { allowEmptyValues: true });
        const { method, body } = submitMultipartFormData(formData, "PUT");
        await apiRequest<LaravelSuccessResponse<Product>>(`/admin/products/${id}`, {
          method,
          body,
        });
      }

      if (hasVariantOps && nextType === "VARIABLE_PRODUCT") {
        await syncProductVariantsViaDedicatedApi(id, variants ?? [], deletedVariantIds ?? []);
      }

      return getById(id);
    },

    async delete(id) {
      await apiRequest(`/admin/products/${id}`, { method: "DELETE" });
    },

    async importFromCsv(file: File): Promise<ProductImportSummary> {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest<LaravelSuccessResponse<ProductImportSummary>>(
        "/admin/products/import",
        {
          method: "POST",
          body: formData,
        },
      );

      return mapProductImportFromApi(response.data);
    },
  };
}

export { buildProductFormData, createApiProductsService };
