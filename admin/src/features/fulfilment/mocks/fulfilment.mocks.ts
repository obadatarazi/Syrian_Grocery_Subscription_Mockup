export type FulfilmentOrder = {
  id: string;
  customerAr: string;
  customerEn: string;
  phone: string;
  paid: boolean;
  items: { productAr: string; productEn: string; qty: number }[];
  date: string; // ISO date string
};

export const FULFILMENT_ORDERS: FulfilmentOrder[] = [
  {
    id: "HSR-1001",
    customerAr: "أحمد الخطيب",
    customerEn: "Ahmad Al-Khatib",
    phone: "0912 345 678",
    paid: true,
    date: "2026-10-08",
    items: [
      { productAr: "أرز عنبر ٥ كيلو", productEn: "Anbar Rice 5kg", qty: 2 },
      { productAr: "زيت ذرة ١.٨ لتر", productEn: "Corn Oil 1.8L", qty: 1 },
    ],
  },
  {
    id: "HSR-1002",
    customerAr: "فاطمة السيد",
    customerEn: "Fatima Al-Sayed",
    phone: "0933 222 111",
    paid: true,
    date: "2026-10-08",
    items: [
      { productAr: "سكر أبيض ٢ كيلو", productEn: "White Sugar 2kg", qty: 3 },
      { productAr: "سمن نباتي ٩٠٠ج", productEn: "Vegetable Ghee 900g", qty: 2 },
    ],
  },
  {
    id: "HSR-1003",
    customerAr: "محمد العلي",
    customerEn: "Mohammad Al-Ali",
    phone: "0944 888 777",
    paid: false, // unpaid — should not appear in fulfilment
    date: "2026-10-08",
    items: [
      { productAr: "أرز عنبر ٥ كيلو", productEn: "Anbar Rice 5kg", qty: 1 },
    ],
  },
  {
    id: "HSR-1004",
    customerAr: "منى حسن",
    customerEn: "Mona Hassan",
    phone: "0955 666 555",
    paid: true,
    date: "2026-10-08",
    items: [
      { productAr: "أرز عنبر ٥ كيلو", productEn: "Anbar Rice 5kg", qty: 1 },
      { productAr: "معجنات طماطم ٤٠٠ج", productEn: "Tomato Paste 400g", qty: 4 },
      { productAr: "زيت ذرة ١.٨ لتر", productEn: "Corn Oil 1.8L", qty: 2 },
    ],
  },
  {
    id: "HSR-1005",
    customerAr: "سامي الرفاعي",
    customerEn: "Sami Al-Rifai",
    phone: "0911 444 333",
    paid: true,
    date: "2026-10-09",
    items: [
      { productAr: "سكر أبيض ٢ كيلو", productEn: "White Sugar 2kg", qty: 2 },
      { productAr: "حبوب عدس أخضر ١ كيلو", productEn: "Green Lentils 1kg", qty: 3 },
    ],
  },
  {
    id: "HSR-1006",
    customerAr: "نادية البكري",
    customerEn: "Nadia Al-Bakri",
    phone: "0922 777 888",
    paid: true,
    date: "2026-10-09",
    items: [
      { productAr: "زيت ذرة ١.٨ لتر", productEn: "Corn Oil 1.8L", qty: 1 },
      { productAr: "سمن نباتي ٩٠٠ج", productEn: "Vegetable Ghee 900g", qty: 1 },
      { productAr: "معجنات طماطم ٤٠٠ج", productEn: "Tomato Paste 400g", qty: 2 },
    ],
  },
];
