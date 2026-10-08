// haseri-data.ts — حصري Demo Data
// Syrian grocery subscription mock. Everything lives in memory; reloading resets it.

// ─── Constants ────────────────────────────────────────────────────────────────
export const SUBSCRIPTION_FEE = 500; // SYP / month

// ─── Types ────────────────────────────────────────────────────────────────────
export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  available: boolean;
}

export interface Supplier {
  id: string;
  nameAr: string;
  nameEn: string;
  tier: "exclusive" | "standard";
  category: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface Product {
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
}

export type SubscriptionStatus = "active" | "expired" | "cancelled" | "none";

export interface Customer {
  id: string;
  nameAr: string;
  nameEn: string;
  phone: string;
  city: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string | null;
}

export type OrderStatus = "confirmed" | "dispatched" | "delivered";

export interface OrderItem {
  productId: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  status: OrderStatus;
  estimatedDelivery: string;
  city: string;
  address: string;
  items: OrderItem[];
  paid: boolean;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

// ─── Cities ───────────────────────────────────────────────────────────────────
export const CITIES: City[] = [
  { id: "damascus", nameAr: "دمشق", nameEn: "Damascus", available: true },
  { id: "aleppo", nameAr: "حلب", nameEn: "Aleppo", available: false },
  { id: "homs", nameAr: "حمص", nameEn: "Homs", available: false },
];

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const SUPPLIERS: Supplier[] = [
  { id: "s1", nameAr: "حسين الناصر", nameEn: "Hussein Al-Nasser", tier: "standard", category: "oil" },
  { id: "s2", nameAr: "سيدي هشام", nameEn: "Sidi Hisham", tier: "standard", category: "rice" },
  { id: "s3", nameAr: "المراعي", nameEn: "Al-Marai", tier: "exclusive", category: "ghee" },
  { id: "s4", nameAr: "سمن بلدي — تعبئة تموينية", nameEn: "Baladi Ghee (Staples Pack)", tier: "standard", category: "ghee" },
  { id: "s5", nameAr: "الدرة", nameEn: "Al-Durra", tier: "standard", category: "canned" },
  { id: "s6", nameAr: "هنا", nameEn: "Hana", tier: "standard", category: "canned" },
  { id: "s7", nameAr: "الراعي", nameEn: "Al-Raii", tier: "standard", category: "canned" },
  { id: "s8", nameAr: "الغوطة", nameEn: "Al-Gota", tier: "standard", category: "canned" },
  { id: "s9", nameAr: "أبيدو", nameEn: "Abido", tier: "standard", category: "vegetables" },
  { id: "s10", nameAr: "السمير / الحسني", nameEn: "Al-Samir / Al-Hasani", tier: "standard", category: "rice" },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: "rice", nameAr: "الرز", nameEn: "Rice", icon: "🌾" },
  { id: "oil", nameAr: "زيت الطبخ", nameEn: "Cooking Oil", icon: "🛢️" },
  { id: "sugar", nameAr: "السكر والبهارات", nameEn: "Sugar & Staples", icon: "🧂" },
  { id: "ghee", nameAr: "السمن والألبان", nameEn: "Ghee & Dairy", icon: "🫙" },
  { id: "vegetables", nameAr: "بقوليات وتوابل", nameEn: "Legumes & Spices", icon: "🥬" },
  { id: "canned", nameAr: "المعلبات", nameEn: "Canned Goods", icon: "🥫" },
  { id: "frozen", nameAr: "المجمدات", nameEn: "Frozen Goods", icon: "❄️" }, // intentionally empty
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  // Rice
  { id: "p1",  categoryId: "rice",       supplierId: "s2",  nameAr: "رز سيدي هشام معطر",        nameEn: "Sidi Hisham Aromatic Rice",       sizeAr: "5 كغ",   sizeEn: "5kg",   factoryPrice: 8000,  retailPrice: 12000, hidden: false },
  { id: "p2",  categoryId: "rice",       supplierId: "s2",  nameAr: "رز سيدي هشام مصري",        nameEn: "Sidi Hisham Egyptian Rice",       sizeAr: "10 كغ",  sizeEn: "10kg",  factoryPrice: 15000, retailPrice: 22000, hidden: false },
  { id: "p14", categoryId: "rice",       supplierId: "s10", nameAr: "رز السمير / الحسني",       nameEn: "Al-Samir / Al-Hasani Rice",       sizeAr: "5 كغ",   sizeEn: "5kg",   factoryPrice: 7500,  retailPrice: 11000, hidden: false },
  { id: "p15", categoryId: "rice",       supplierId: "s10", nameAr: "برغل السمير خشن",          nameEn: "Al-Samir Coarse Bulgur",          sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 2500,  retailPrice: 3800,  hidden: false },
  // Cooking oil
  { id: "p3",  categoryId: "oil",        supplierId: "s1",  nameAr: "زيت دوار الشمس — الناصر", nameEn: "Al-Nasser Sunflower Oil",         sizeAr: "1.5 لتر",sizeEn: "1.5L",  factoryPrice: 5000,  retailPrice: 7500,  hidden: false },
  { id: "p4",  categoryId: "oil",        supplierId: "s1",  nameAr: "زيت ذرة — الناصر",        nameEn: "Al-Nasser Corn Oil",              sizeAr: "1 لتر",  sizeEn: "1L",    factoryPrice: 4500,  retailPrice: 6500,  hidden: false },
  // Sugar / staples
  { id: "p5",  categoryId: "sugar",      supplierId: "s1",  nameAr: "سكر الناصر أبيض",         nameEn: "Al-Nasser White Sugar",           sizeAr: "2 كغ",   sizeEn: "2kg",   factoryPrice: 3000,  retailPrice: 4500,  hidden: false },
  { id: "p6",  categoryId: "sugar",      supplierId: "s1",  nameAr: "سميد الناصر",             nameEn: "Al-Nasser Semolina",              sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 2000,  retailPrice: null,  hidden: false },
  { id: "p16", categoryId: "sugar",      supplierId: "s1",  nameAr: "شاي الناصر / كبوس",       nameEn: "Al-Nasser / Kabous Tea",          sizeAr: "400 غ",  sizeEn: "400g",  factoryPrice: 3500,  retailPrice: 5000,  hidden: false },
  // Ghee / dairy
  { id: "p7",  categoryId: "ghee",       supplierId: "s3",  nameAr: "زبدة المراعي",            nameEn: "Al-Marai Butter",                 sizeAr: "200 غ",  sizeEn: "200g",  factoryPrice: 4000,  retailPrice: 6000,  hidden: false },
  { id: "p8",  categoryId: "ghee",       supplierId: "s3",  nameAr: "قشطة المراعي",            nameEn: "Al-Marai Cream",                  sizeAr: "170 غ",  sizeEn: "170g",  factoryPrice: 2500,  retailPrice: 3800,  hidden: false },
  { id: "p13", categoryId: "ghee",       supplierId: "s4",  nameAr: "سمن بلدي تقليدي",         nameEn: "Traditional Baladi Ghee",         sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 11000, retailPrice: 16000, hidden: false },
  // Vegetables / legumes
  { id: "p9",  categoryId: "vegetables", supplierId: "s2",  nameAr: "عدس سيدي هشام",           nameEn: "Sidi Hisham Lentils",             sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 2200,  retailPrice: 3500,  hidden: false },
  { id: "p10", categoryId: "vegetables", supplierId: "s2",  nameAr: "حمص حب سيدي هشام",        nameEn: "Sidi Hisham Chickpeas",           sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 2800,  retailPrice: 4000,  hidden: false },
  { id: "p17", categoryId: "vegetables", supplierId: "s9",  nameAr: "زعتر أبيدو",              nameEn: "Abido Za'atar Blend",             sizeAr: "400 غ",  sizeEn: "400g",  factoryPrice: 3000,  retailPrice: 4500,  hidden: false },
  { id: "p18", categoryId: "vegetables", supplierId: "s9",  nameAr: "بهارات أبيدو مشكلة",      nameEn: "Abido Mixed Spices",              sizeAr: "200 غ",  sizeEn: "200g",  factoryPrice: 2000,  retailPrice: 3200,  hidden: false },
  { id: "p19", categoryId: "vegetables", supplierId: "s10", nameAr: "فريكة السمير",            nameEn: "Al-Samir Freekeh",                sizeAr: "1 كغ",   sizeEn: "1kg",   factoryPrice: 4000,  retailPrice: 6000,  hidden: false },
  // Canned
  { id: "p11", categoryId: "canned",     supplierId: "s5",  nameAr: "فول مدمس الدرة",          nameEn: "Al-Durra Foul Medames",           sizeAr: "400 غ",  sizeEn: "400g",  factoryPrice: 1200,  retailPrice: 2000,  hidden: false },
  { id: "p12", categoryId: "canned",     supplierId: "s5",  nameAr: "حمص بالطحينة الدرة",      nameEn: "Al-Durra Hummus Tahini",          sizeAr: "380 غ",  sizeEn: "380g",  factoryPrice: 1800,  retailPrice: 2800,  hidden: false },
  { id: "p20", categoryId: "canned",     supplierId: "s5",  nameAr: "طحينة الدرة",             nameEn: "Al-Durra Tahini",                 sizeAr: "400 غ",  sizeEn: "400g",  factoryPrice: 2500,  retailPrice: 3800,  hidden: false },
  { id: "p21", categoryId: "canned",     supplierId: "s5",  nameAr: "مخلل خيار الدرة",         nameEn: "Al-Durra Pickled Cucumber",       sizeAr: "600 غ",  sizeEn: "600g",  factoryPrice: 1500,  retailPrice: 2400,  hidden: false },
  { id: "p22", categoryId: "canned",     supplierId: "s6",  nameAr: "مرتديلا هنا دجاج بالزيتون",nameEn: "Hana Chicken Mortadella (Olives)",sizeAr: "200 غ",  sizeEn: "200g",  factoryPrice: 2200,  retailPrice: 3500,  hidden: false },
  { id: "p23", categoryId: "canned",     supplierId: "s6",  nameAr: "مرتديلا هنا بقري بالفستق",nameEn: "Hana Beef Mortadella (Pistachio)",sizeAr: "200 غ",  sizeEn: "200g",  factoryPrice: 2800,  retailPrice: 4200,  hidden: false },
  { id: "p24", categoryId: "canned",     supplierId: "s7",  nameAr: "مرتديلا الراعي",          nameEn: "Al-Raii Mortadella",              sizeAr: "200 غ",  sizeEn: "200g",  factoryPrice: 2000,  retailPrice: 3200,  hidden: false },
  { id: "p25", categoryId: "canned",     supplierId: "s8",  nameAr: "مربى مشمش الغوطة",        nameEn: "Al-Gota Apricot Jam",             sizeAr: "450 غ",  sizeEn: "450g",  factoryPrice: 2200,  retailPrice: 3500,  hidden: false },
  { id: "p26", categoryId: "canned",     supplierId: "s8",  nameAr: "دبس رمان الغوطة",         nameEn: "Al-Gota Pomegranate Molasses",    sizeAr: "500 غ",  sizeEn: "500g",  factoryPrice: 3000,  retailPrice: 4500,  hidden: false },
];

// ─── Sample Customers ─────────────────────────────────────────────────────────
export const SAMPLE_CUSTOMERS: Customer[] = [
  { id: "c1", nameAr: "أحمد", nameEn: "Ahmad",    phone: "0991", city: "damascus", subscriptionStatus: "active",    subscriptionEndDate: null },
  { id: "c2", nameAr: "سارة", nameEn: "Sara",     phone: "0992", city: "damascus", subscriptionStatus: "expired",   subscriptionEndDate: "2026-09-30" },
  { id: "c3", nameAr: "محمد", nameEn: "Mohammad", phone: "0993", city: "damascus", subscriptionStatus: "cancelled", subscriptionEndDate: "2026-10-15" },
];

// ─── Sample Orders ─────────────────────────────────────────────────────────────
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001", customerId: "c1", date: "2026-10-06", status: "confirmed",
    estimatedDelivery: "2026-10-08", city: "damascus", address: "المزة - شارع الجامعة",
    items: [{ productId: "p1", qty: 2, price: 8000 }, { productId: "p7", qty: 1, price: 4000 }],
    paid: true,
  },
  {
    id: "ORD-002", customerId: "c1", date: "2026-10-05", status: "dispatched",
    estimatedDelivery: "2026-10-07", city: "damascus", address: "المزة - شارع الجامعة",
    items: [{ productId: "p3", qty: 3, price: 5000 }, { productId: "p5", qty: 2, price: 3000 }],
    paid: true, dispatchedAt: "2026-10-05T14:00:00",
  },
  {
    id: "ORD-003", customerId: "c1", date: "2026-09-28", status: "delivered",
    estimatedDelivery: "2026-09-30", city: "damascus", address: "المزة - شارع الجامعة",
    items: [{ productId: "p11", qty: 4, price: 1200 }, { productId: "p22", qty: 2, price: 2200 }],
    paid: true, deliveredAt: "2026-10-02T11:00:00",
  },
  {
    id: "ORD-004", customerId: "c2", date: "2026-10-06", status: "confirmed",
    estimatedDelivery: "2026-10-08", city: "damascus", address: "باب توما",
    items: [{ productId: "p2", qty: 1, price: 15000 }],
    paid: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatSYP(amount: number): string {
  return `${amount.toLocaleString("en-US")} ل.س`;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getSupplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find(s => s.id === id);
}

export function getCityById(id: string): City | undefined {
  return CITIES.find(c => c.id === id);
}

export function getProductsForCategory(categoryId: string): Product[] {
  return PRODUCTS.filter(p => p.categoryId === categoryId && !p.hidden);
}

/** Add 2 calendar days to a YYYY-MM-DD string */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function formatArabicDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ar-SY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: "latn",
  });
}
