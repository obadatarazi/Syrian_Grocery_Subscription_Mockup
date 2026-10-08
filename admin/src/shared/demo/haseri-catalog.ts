/**
 * In-memory حصري catalog demo data (adapted from website/src/haseri-data.ts).
 * Mutations live in the session only; reload resets state.
 */

export type SupplierTier = "exclusive" | "standard";

export type HaseriCategory = {
  id: string;
  nameAr: string;
  nameEn: string;
};

export type HaseriSupplier = {
  id: string;
  nameAr: string;
  nameEn: string;
  tier: SupplierTier;
  categoryId: string;
};

export type HaseriProduct = {
  id: string;
  categoryId: string;
  supplierId: string;
  nameAr: string;
  nameEn: string;
  sizeAr: string;
  sizeEn: string;
  factoryPrice: number;
  retailPrice: number | null;
  hidden: boolean;
};

export const HASERI_CATEGORIES: HaseriCategory[] = [
  { id: "rice", nameAr: "الرز", nameEn: "Rice" },
  { id: "oil", nameAr: "زيت الطبخ", nameEn: "Cooking Oil" },
  { id: "sugar", nameAr: "السكر والبهارات", nameEn: "Sugar & Staples" },
  { id: "ghee", nameAr: "السمن والألبان", nameEn: "Ghee & Dairy" },
  { id: "vegetables", nameAr: "بقوليات وتوابل", nameEn: "Legumes & Spices" },
  { id: "canned", nameAr: "المعلبات", nameEn: "Canned Goods" },
  { id: "frozen", nameAr: "المجمدات", nameEn: "Frozen Goods" },
];

const SUPPLIERS_SEED: HaseriSupplier[] = [
  { id: "s1", nameAr: "حسين الناصر", nameEn: "Hussein Al-Nasser", tier: "standard", categoryId: "oil" },
  { id: "s2", nameAr: "سيدي هشام", nameEn: "Sidi Hisham", tier: "standard", categoryId: "rice" },
  { id: "s3", nameAr: "المراعي", nameEn: "Al-Marai", tier: "exclusive", categoryId: "ghee" },
  { id: "s4", nameAr: "سمن بلدي — تعبئة تموينية", nameEn: "Baladi Ghee", tier: "standard", categoryId: "ghee" },
  { id: "s5", nameAr: "الدرة", nameEn: "Al-Durra", tier: "standard", categoryId: "canned" },
  { id: "s6", nameAr: "هنا", nameEn: "Hana", tier: "standard", categoryId: "canned" },
  { id: "s7", nameAr: "الراعي", nameEn: "Al-Raii", tier: "standard", categoryId: "canned" },
  { id: "s8", nameAr: "الغوطة", nameEn: "Al-Gota", tier: "standard", categoryId: "canned" },
  { id: "s9", nameAr: "أبيدو", nameEn: "Abido", tier: "standard", categoryId: "vegetables" },
  { id: "s10", nameAr: "السمير / الحسني", nameEn: "Al-Samir / Al-Hasani", tier: "standard", categoryId: "rice" },
];

const PRODUCTS_SEED: HaseriProduct[] = [
  { id: "p1", categoryId: "rice", supplierId: "s2", nameAr: "رز سيدي هشام معطر", nameEn: "Sidi Hisham Aromatic Rice", sizeAr: "5 كغ", sizeEn: "5kg", factoryPrice: 8000, retailPrice: 12000, hidden: false },
  { id: "p2", categoryId: "rice", supplierId: "s2", nameAr: "رز سيدي هشام مصري", nameEn: "Sidi Hisham Egyptian Rice", sizeAr: "10 كغ", sizeEn: "10kg", factoryPrice: 15000, retailPrice: 22000, hidden: false },
  { id: "p14", categoryId: "rice", supplierId: "s10", nameAr: "رز السمير / الحسني", nameEn: "Al-Samir / Al-Hasani Rice", sizeAr: "5 كغ", sizeEn: "5kg", factoryPrice: 7500, retailPrice: 11000, hidden: false },
  { id: "p3", categoryId: "oil", supplierId: "s1", nameAr: "زيت دوار الشمس — الناصر", nameEn: "Al-Nasser Sunflower Oil", sizeAr: "1.5 لتر", sizeEn: "1.5L", factoryPrice: 5000, retailPrice: 7500, hidden: false },
  { id: "p4", categoryId: "oil", supplierId: "s1", nameAr: "زيت ذرة — الناصر", nameEn: "Al-Nasser Corn Oil", sizeAr: "1 لتر", sizeEn: "1L", factoryPrice: 4500, retailPrice: 6500, hidden: false },
  { id: "p5", categoryId: "sugar", supplierId: "s1", nameAr: "سكر الناصر أبيض", nameEn: "Al-Nasser White Sugar", sizeAr: "2 كغ", sizeEn: "2kg", factoryPrice: 3000, retailPrice: 4500, hidden: false },
  { id: "p6", categoryId: "sugar", supplierId: "s1", nameAr: "سميد الناصر", nameEn: "Al-Nasser Semolina", sizeAr: "1 كغ", sizeEn: "1kg", factoryPrice: 2000, retailPrice: null, hidden: false },
  { id: "p7", categoryId: "ghee", supplierId: "s3", nameAr: "زبدة المراعي", nameEn: "Al-Marai Butter", sizeAr: "200 غ", sizeEn: "200g", factoryPrice: 4000, retailPrice: 6000, hidden: false },
  { id: "p8", categoryId: "ghee", supplierId: "s3", nameAr: "قشطة المراعي", nameEn: "Al-Marai Cream", sizeAr: "170 غ", sizeEn: "170g", factoryPrice: 2500, retailPrice: 3800, hidden: false },
  { id: "p13", categoryId: "ghee", supplierId: "s4", nameAr: "سمن بلدي تقليدي", nameEn: "Traditional Baladi Ghee", sizeAr: "1 كغ", sizeEn: "1kg", factoryPrice: 11000, retailPrice: 16000, hidden: false },
  { id: "p9", categoryId: "vegetables", supplierId: "s2", nameAr: "عدس سيدي هشام", nameEn: "Sidi Hisham Lentils", sizeAr: "1 كغ", sizeEn: "1kg", factoryPrice: 2200, retailPrice: 3500, hidden: false },
  { id: "p11", categoryId: "canned", supplierId: "s5", nameAr: "فول مدمس الدرة", nameEn: "Al-Durra Foul Medames", sizeAr: "400 غ", sizeEn: "400g", factoryPrice: 1200, retailPrice: 2000, hidden: false },
  { id: "p12", categoryId: "canned", supplierId: "s5", nameAr: "حمص بالطحينة الدرة", nameEn: "Al-Durra Hummus Tahini", sizeAr: "380 غ", sizeEn: "380g", factoryPrice: 1800, retailPrice: 2800, hidden: false },
  { id: "p22", categoryId: "canned", supplierId: "s6", nameAr: "مرتديلا هنا دجاج بالزيتون", nameEn: "Hana Chicken Mortadella", sizeAr: "200 غ", sizeEn: "200g", factoryPrice: 2200, retailPrice: 3500, hidden: false },
];

function cloneProducts(): HaseriProduct[] {
  return PRODUCTS_SEED.map((p) => ({ ...p }));
}

function cloneSuppliers(): HaseriSupplier[] {
  return SUPPLIERS_SEED.map((s) => ({ ...s }));
}

let products = cloneProducts();
let suppliers = cloneSuppliers();
let nextProductSeq = PRODUCTS_SEED.length + 1;

export function getHaseriProducts(): HaseriProduct[] {
  return products;
}

export function getHaseriSuppliers(): HaseriSupplier[] {
  return suppliers;
}

export function resetHaseriCatalog() {
  products = cloneProducts();
  suppliers = cloneSuppliers();
  nextProductSeq = PRODUCTS_SEED.length + 1;
}

export function upsertHaseriProduct(
  input: Omit<HaseriProduct, "id"> & { id?: string },
): HaseriProduct {
  if (input.id) {
    const idx = products.findIndex((p) => p.id === input.id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...input, id: input.id };
      return products[idx];
    }
  }
  const created: HaseriProduct = {
    id: `p-new-${nextProductSeq++}`,
    categoryId: input.categoryId,
    supplierId: input.supplierId,
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    sizeAr: input.sizeAr,
    sizeEn: input.sizeEn,
    factoryPrice: input.factoryPrice,
    retailPrice: input.retailPrice,
    hidden: input.hidden,
  };
  products = [...products, created];
  return created;
}

export function setHaseriProductHidden(id: string, hidden: boolean) {
  products = products.map((p) => (p.id === id ? { ...p, hidden } : p));
}

export function setSupplierTier(supplierId: string, tier: SupplierTier) {
  suppliers = suppliers.map((s) => (s.id === supplierId ? { ...s, tier } : s));
}

/** Catalog preview: exclusive supplier in a category hides other brands' products. */
export function getCatalogPreviewProducts(): HaseriProduct[] {
  const visible = products.filter((p) => !p.hidden);
  const exclusiveByCategory = new Map<string, string>();
  for (const s of suppliers) {
    if (s.tier === "exclusive") {
      exclusiveByCategory.set(s.categoryId, s.id);
    }
  }
  return visible.filter((p) => {
    const exclusiveSupplierId = exclusiveByCategory.get(p.categoryId);
    if (!exclusiveSupplierId) return true;
    return p.supplierId === exclusiveSupplierId;
  });
}

export function formatSypInteger(amount: number): string {
  return `${Math.round(amount).toLocaleString("ar-SY")} ل.س`;
}
