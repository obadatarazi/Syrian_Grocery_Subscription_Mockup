import { Eye, EyeOff, Plus, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageContainer, PageHeader } from "@/shared/components";
import { DemoDataBanner } from "@/shared/demo";
import {
  formatSypInteger,
  getCatalogPreviewProducts,
  getHaseriProducts,
  getHaseriSuppliers,
  HASERI_CATEGORIES,
  type HaseriProduct,
  type SupplierTier,
  setHaseriProductHidden,
  setSupplierTier,
  upsertHaseriProduct,
} from "@/shared/demo/haseri-catalog";

type DraftProduct = {
  id?: string;
  nameAr: string;
  categoryId: string;
  supplierId: string;
  sizeAr: string;
  factoryPrice: string;
  retailPrice: string;
};

function emptyDraft(suppliers = getHaseriSuppliers()): DraftProduct {
  return {
    nameAr: "",
    categoryId: HASERI_CATEGORIES[0]?.id ?? "rice",
    supplierId: suppliers[0]?.id ?? "",
    sizeAr: "",
    factoryPrice: "",
    retailPrice: "",
  };
}

export function GroceryProductsPage() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const products = useMemo(() => getHaseriProducts(), [tick]);
  const suppliers = useMemo(() => getHaseriSuppliers(), [tick]);
  const preview = useMemo(() => getCatalogPreviewProducts(), [tick]);

  const [draft, setDraft] = useState<DraftProduct>(() => emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);

  const categoryName = (id: string) =>
    HASERI_CATEGORIES.find((c) => c.id === id)?.nameAr ?? id;
  const supplierName = (id: string) =>
    suppliers.find((s) => s.id === id)?.nameAr ?? id;

  const startEdit = (product: HaseriProduct) => {
    setEditingId(product.id);
    setDraft({
      id: product.id,
      nameAr: product.nameAr,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      sizeAr: product.sizeAr,
      factoryPrice: String(product.factoryPrice),
      retailPrice: product.retailPrice == null ? "" : String(product.retailPrice),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft(suppliers));
  };

  const saveProduct = () => {
    const factoryPrice = Number(draft.factoryPrice);
    if (!draft.nameAr.trim() || !Number.isFinite(factoryPrice) || factoryPrice < 0) {
      toast.error("أدخل اسم المنتج وسعر المصنع بشكل صحيح");
      return;
    }
    const retailRaw = draft.retailPrice.trim();
    const retailPrice = retailRaw === "" ? null : Number(retailRaw);
    if (retailPrice != null && (!Number.isFinite(retailPrice) || retailPrice < 0)) {
      toast.error("سعر التجزئة غير صالح");
      return;
    }

    upsertHaseriProduct({
      id: draft.id,
      nameAr: draft.nameAr.trim(),
      nameEn: draft.nameAr.trim(),
      categoryId: draft.categoryId,
      supplierId: draft.supplierId,
      sizeAr: draft.sizeAr.trim() || "—",
      sizeEn: draft.sizeAr.trim() || "—",
      factoryPrice: Math.round(factoryPrice),
      retailPrice: retailPrice == null ? null : Math.round(retailPrice),
      hidden: draft.id
        ? (products.find((p) => p.id === draft.id)?.hidden ?? false)
        : false,
    });
    toast.success(editingId ? "تم تحديث المنتج" : "تمت إضافة المنتج");
    cancelEdit();
    refresh();
  };

  const toggleHidden = (product: HaseriProduct) => {
    setHaseriProductHidden(product.id, !product.hidden);
    toast.success(product.hidden ? "المنتج ظاهر في الكتالوج" : "تم إخفاء المنتج");
    refresh();
  };

  const changeTier = (supplierId: string, tier: SupplierTier) => {
    setSupplierTier(supplierId, tier);
    toast.success(
      tier === "exclusive"
        ? "تم تعيين المورد كحصري لهذه الفئة"
        : "تم تعيين المورد كقياسي لهذه الفئة",
    );
    refresh();
  };

  return (
    <PageContainer>
      <DemoDataBanner />
      <PageHeader
        title="المنتجات والمستويات"
        description="أضف وعدّل وأخفِ المنتجات، واضبط مستوى المورد (حصري / قياسي)، ومعاينة الكتالوج."
      />

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Product form + list */}
        <div className="space-y-6 xl:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Plus className="size-4 text-brand" />
              {editingId ? "تعديل منتج" : "إضافة منتج"}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block text-muted-foreground">الاسم</span>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.nameAr}
                  onChange={(e) => setDraft((d) => ({ ...d, nameAr: e.target.value }))}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">الفئة</span>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.categoryId}
                  onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
                >
                  {HASERI_CATEGORIES.filter((c) => c.id !== "frozen").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">المورد</span>
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.supplierId}
                  onChange={(e) => setDraft((d) => ({ ...d, supplierId: e.target.value }))}
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameAr} ({s.tier === "exclusive" ? "حصري" : "قياسي"})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">الحجم</span>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.sizeAr}
                  onChange={(e) => setDraft((d) => ({ ...d, sizeAr: e.target.value }))}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">سعر المصنع (ل.س)</span>
                <input
                  type="number"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.factoryPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, factoryPrice: e.target.value }))}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted-foreground">سعر التجزئة (اختياري)</span>
                <input
                  type="number"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={draft.retailPrice}
                  onChange={(e) => setDraft((d) => ({ ...d, retailPrice: e.target.value }))}
                />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={saveProduct}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
              >
                {editingId ? "حفظ التعديلات" : "إضافة"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-border px-4 py-2 text-sm"
                >
                  إلغاء
                </button>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">قائمة المنتجات ({products.length})</h2>
            </div>
            <div className="divide-y divide-border/50">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex flex-wrap items-center gap-3 px-5 py-3 ${product.hidden ? "opacity-60" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{product.nameAr}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName(product.categoryId)} · {supplierName(product.supplierId)} ·{" "}
                      {product.sizeAr} · {formatSypInteger(product.factoryPrice)}
                      {product.retailPrice != null
                        ? ` · تجزئة ${formatSypInteger(product.retailPrice)}`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHidden(product)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                  >
                    {product.hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {product.hidden ? "إظهار" : "إخفاء"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tiers + catalog preview */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">مستويات الموردين</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                الحصري يُخفي علامات أخرى في نفس الفئة من معاينة كتالوج العميل.
              </p>
            </div>
            <ul className="divide-y divide-border/50">
              {suppliers.map((supplier) => (
                <li key={supplier.id} className="flex flex-wrap items-center gap-2 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{supplier.nameAr}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName(supplier.categoryId)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => changeTier(supplier.id, "exclusive")}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        supplier.tier === "exclusive"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Star className="size-3" />
                      حصري
                    </button>
                    <button
                      type="button"
                      onClick={() => changeTier(supplier.id, "standard")}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        supplier.tier === "standard"
                          ? "bg-brand/10 text-brand"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      قياسي
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">معاينة كتالوج العميل</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {preview.length} منتج ظاهر بعد تطبيق المستويات والإخفاء
              </p>
            </div>
            {preview.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                لا توجد منتجات ظاهرة.
              </p>
            ) : (
              <ul className="divide-y divide-border/50">
                {preview.map((p) => (
                  <li key={p.id} className="px-5 py-3 text-sm">
                    <p className="font-medium text-foreground">{p.nameAr}</p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName(p.categoryId)} · {formatSypInteger(p.factoryPrice)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
