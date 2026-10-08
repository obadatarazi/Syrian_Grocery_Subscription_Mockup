// Haseri (حصري) — Demo Data
// All data is hard-coded for the static mock-up. Reloading resets everything.

// === Subscription fee constant ===
const SUBSCRIPTION_FEE = 5; // $5/month

// === Cities ===
const CITIES = [
  { id: "damascus", nameAr: "دمشق", nameEn: "Damascus", available: true },
  { id: "aleppo", nameAr: "حلب", nameEn: "Aleppo", available: false },
  { id: "homs", nameAr: "حمص", nameEn: "Homs", available: false },
];

// === Suppliers ===
const SUPPLIERS = [
  { id: "s1", nameAr: "معمل الشام للزيوت", nameEn: "Al-Sham Oils Factory", tier: "standard", category: "oil" },
  { id: "s2", nameAr: "معمل الغربلة للرز", nameEn: "Al-Gharbala Rice Factory", tier: "standard", category: "rice" },
  { id: "s3", nameAr: "معمل السمن الذهبي", nameEn: "Golden Ghee Factory", tier: "exclusive", category: "ghee" },
];

// === Categories ===
const CATEGORIES = [
  { id: "rice", nameAr: "الرز", nameEn: "Rice", icon: "🌾" },
  { id: "oil", nameAr: "زيت الطبخ", nameEn: "Cooking Oil", icon: "🛢️" },
  { id: "sugar", nameAr: "السكر", nameEn: "Sugar", icon: "🧂" },
  { id: "ghee", nameAr: "السمن", nameEn: "Ghee", icon: "🫙" },
  { id: "vegetables", nameAr: "الخضار", nameEn: "Vegetables", icon: "🥬" },
  { id: "canned", nameAr: "المعلبات", nameEn: "Canned Goods", icon: "🥫" },
  { id: "frozen", nameAr: "المجمدات", nameEn: "Frozen Goods", icon: "❄️" }, // intentionally empty
];

// === Products ===
const PRODUCTS = [
  // Rice
  { id: "p1", categoryId: "rice", supplierId: "s2", nameAr: "رز بسمتي فاخر", nameEn: "Premium Basmati Rice", sizeAr: "5 كغ", sizeEn: "5kg", factoryPrice: 8, retailPrice: 12, hidden: false },
  { id: "p2", categoryId: "rice", supplierId: "s2", nameAr: "رز مصري", nameEn: "Egyptian Rice", sizeAr: "10 كغ", sizeEn: "10kg", factoryPrice: 15, retailPrice: 22, hidden: false },
  // Oil
  { id: "p3", categoryId: "oil", supplierId: "s1", nameAr: "زيت دوار الشمس", nameEn: "Sunflower Oil", sizeAr: "1.5 لتر", sizeEn: "1.5L", factoryPrice: 5, retailPrice: 7.5, hidden: false },
  { id: "p4", categoryId: "oil", supplierId: "s1", nameAr: "زيت زيتون", nameEn: "Olive Oil", sizeAr: "1 لتر", sizeEn: "1L", factoryPrice: 10, retailPrice: 14, hidden: false },
  // Sugar
  { id: "p5", categoryId: "sugar", supplierId: "s1", nameAr: "سكر أبيض", nameEn: "White Sugar", sizeAr: "2 كغ", sizeEn: "2kg", factoryPrice: 3, retailPrice: 4.5, hidden: false },
  { id: "p6", categoryId: "sugar", supplierId: "s1", nameAr: "سكر بني", nameEn: "Brown Sugar", sizeAr: "1 كغ", sizeEn: "1kg", factoryPrice: 2, retailPrice: null, hidden: false }, // no retail price edge case
  // Ghee (exclusive supplier)
  { id: "p7", categoryId: "ghee", supplierId: "s3", nameAr: "سمن ذهبي فاخر", nameEn: "Golden Premium Ghee", sizeAr: "1 كغ", sizeEn: "1kg", factoryPrice: 12, retailPrice: 18, hidden: false },
  { id: "p8", categoryId: "ghee", supplierId: "s3", nameAr: "سمن ذهبي عادي", nameEn: "Golden Regular Ghee", sizeAr: "500 غ", sizeEn: "500g", factoryPrice: 6, retailPrice: 9, hidden: false },
  // Vegetables
  { id: "p9", categoryId: "vegetables", supplierId: "s1", nameAr: "بطاطا", nameEn: "Potatoes", sizeAr: "5 كغ", sizeEn: "5kg", factoryPrice: 4, retailPrice: 6, hidden: false },
  { id: "p10", categoryId: "vegetables", supplierId: "s1", nameAr: "طماطم", nameEn: "Tomatoes", sizeAr: "3 كغ", sizeEn: "3kg", factoryPrice: 3, retailPrice: 4.5, hidden: false },
  // Canned
  { id: "p11", categoryId: "canned", supplierId: "s2", nameAr: "حمص معلب", nameEn: "Canned Chickpeas", sizeAr: "400 غ", sizeEn: "400g", factoryPrice: 1.5, retailPrice: 2.5, hidden: false },
  { id: "p12", categoryId: "canned", supplierId: "s2", nameAr: "فول مدمس", nameEn: "Canned Foul", sizeAr: "400 غ", sizeEn: "400g", factoryPrice: 1.2, retailPrice: 2, hidden: false },
];

// === Sample Customers ===
const SAMPLE_CUSTOMERS = [
  { id: "c1", nameAr: "أحمد", nameEn: "Ahmad", phone: "0991", city: "damascus", subscriptionStatus: "active", subscriptionEndDate: null },
  { id: "c2", nameAr: "سارة", nameEn: "Sara", phone: "0992", city: "damascus", subscriptionStatus: "expired", subscriptionEndDate: "2026-09-30" },
  { id: "c3", nameAr: "محمد", nameEn: "Mohammad", phone: "0993", city: "damascus", subscriptionStatus: "cancelled", subscriptionEndDate: "2026-10-15" },
];

// === Sample Orders ===
const SAMPLE_ORDERS = [
  {
    id: "ORD-001", customerId: "c1", date: "2026-10-06", status: "confirmed",
    estimatedDelivery: "2026-10-08", city: "damascus", address: "المزة - شارع الجامعة",
    items: [
      { productId: "p1", qty: 2, price: 8 },
      { productId: "p7", qty: 1, price: 12 },
    ],
    paid: true,
  },
  {
    id: "ORD-002", customerId: "c1", date: "2026-10-05", status: "dispatched",
    estimatedDelivery: "2026-10-07", city: "damascus", address: "المزة - شارع الجامعة",
    items: [
      { productId: "p3", qty: 3, price: 5 },
      { productId: "p5", qty: 2, price: 3 },
    ],
    paid: true,
    dispatchedAt: "2026-10-05T14:00:00",
  },
  {
    id: "ORD-003", customerId: "c2", date: "2026-09-28", status: "delivered",
    estimatedDelivery: "2026-09-30", city: "damascus", address: "باب توما",
    items: [
      { productId: "p9", qty: 2, price: 4 },
      { productId: "p11", qty: 5, price: 1.5 },
    ],
    paid: true,
    deliveredAt: "2026-09-30T11:00:00",
  },
];

// === Cart (in-memory) ===
let cart = [];

// === Current user (simulated) ===
let currentUser = { id: "c1", nameAr: "أحمد", nameEn: "Ahmad", phone: "0991", city: "damascus", subscriptionStatus: "active", subscriptionEndDate: null };

// === Admin dashboard demo toggle ===
let adminShowData = true;

// Export to window for non-module scripts
if (typeof window !== "undefined") {
  window.SUBSCRIPTION_FEE = SUBSCRIPTION_FEE;
  window.CITIES = CITIES;
  window.SUPPLIERS = SUPPLIERS;
  window.CATEGORIES = CATEGORIES;
  window.PRODUCTS = PRODUCTS;
  window.SAMPLE_CUSTOMERS = SAMPLE_CUSTOMERS;
  window.SAMPLE_ORDERS = SAMPLE_ORDERS;
  window.cart = cart;
  window.currentUser = currentUser;
  window.adminShowData = adminShowData;
}
