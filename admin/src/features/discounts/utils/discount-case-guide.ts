import type { Discount } from "@/features/discounts/types/discounts.types";

export type DiscountCaseCategory =
  | "type"
  | "scope"
  | "eligibility"
  | "limits"
  | "status"
  | "behavior"
  | "out_of_scope";

export type DiscountCaseGuideRow = {
  code: string;
  category: DiscountCaseCategory;
  caseEn: string;
  caseAr: string;
  explainEn: string;
  explainAr: string;
};

/** Team-review matrix: every seeded demo code + what condition it proves. */
export const DISCOUNT_CASE_GUIDE: DiscountCaseGuideRow[] = [
  {
    code: "ALL15",
    category: "behavior",
    caseEn: "Catalog / storewide %",
    caseAr: "نسبة على كل المنتجات",
    explainEn:
      "PERCENTAGE + CART + affectsCatalogPrices. Prices drop on listing/PDP; also works via ?coupon=ALL15.",
    explainAr:
      "نسبة + سلة + يؤثر على الكتالوج. يظهر السعر المخفّض في القائمة؛ يعمل عبر ?coupon=ALL15.",
  },
  {
    code: "AROMA10",
    category: "limits",
    caseEn: "Min order (percentage)",
    caseAr: "حد أدنى للطلب (نسبة)",
    explainEn: "10% cart discount only if order ≥ KWD 5. Classic min-order gate.",
    explainAr: "خصم ١٠٪ على السلة إذا كان الطلب ≥ ٥ د.ك. شرط الحد الأدنى.",
  },
  {
    code: "SAVE2",
    category: "type",
    caseEn: "Fixed amount",
    caseAr: "مبلغ ثابت",
    explainEn: "FIXED type — take KWD 2 off when min order ≥ 8.",
    explainAr: "نوع FIXED — خصم ٢ د.ك عند حد أدنى ٨.",
  },
  {
    code: "FREESHIP",
    category: "type",
    caseEn: "Free shipping (type)",
    caseAr: "توصيل مجاني (نوع)",
    explainEn: "FREE_SHIPPING is a Type (not a Scope). Shipping fee becomes 0; cart lines unchanged.",
    explainAr: "FREE_SHIPPING نوع خصم وليس نطاق. يصبح الشحن ٠؛ أسعار المنتجات كما هي.",
  },
  {
    code: "FREE500",
    category: "type",
    caseEn: "Free shipping (loyalty)",
    caseAr: "توصيل مجاني (ولاء)",
    explainEn: "Same FREE_SHIPPING type; demo for loyalty-issued coupons.",
    explainAr: "نفس نوع FREE_SHIPPING؛ ديمو لكوبونات الولاء.",
  },
  {
    code: "BIG50",
    category: "limits",
    caseEn: "Max discount cap",
    caseAr: "سقف أقصى للخصم",
    explainEn: "50% off but maximumDiscountAmount = KWD 3 — proves percentage + cap.",
    explainAr: "خصم ٥٠٪ لكن أقصى خصم ٣ د.ك — يثبت النسبة مع السقف.",
  },
  {
    code: "WELCOME10",
    category: "eligibility",
    caseEn: "First order only",
    caseAr: "أول طلب فقط",
    explainEn: "firstOrderOnly — reject if customer already ordered.",
    explainAr: "firstOrderOnly — يُرفض إن كان للعميل طلب سابق.",
  },
  {
    code: "LOGIN5",
    category: "eligibility",
    caseEn: "Require login",
    caseAr: "يتطلب تسجيل دخول",
    explainEn: "requireLogin — guests cannot apply.",
    explainAr: "requireLogin — الضيف لا يستطيع التطبيق.",
  },
  {
    code: "VIP25",
    category: "eligibility",
    caseEn: "Specific users + non-combinable",
    caseAr: "مستخدمون محددون + غير قابل للدمج",
    explainEn:
      "audience=SPECIFIC_USERS (vip), requireLogin, max discount 5, isCombinable=false.",
    explainAr:
      "جمهور SPECIFIC_USERS (vip)، تسجيل دخول، سقف ٥، isCombinable=false.",
  },
  {
    code: "PRODUCT1",
    category: "scope",
    caseEn: "Scope: PRODUCT",
    caseAr: "نطاق: منتج",
    explainEn: "Only productIds [1] are eligible lines; other cart items ignored.",
    explainAr: "فقط المنتجات ذات المعرّف 1 مؤهلة؛ باقي السلة يُتجاهل.",
  },
  {
    code: "SKIN20",
    category: "scope",
    caseEn: "Scope: CATEGORY (beauty)",
    caseAr: "نطاق: فئة (beauty)",
    explainEn: "CATEGORY scope — categories: beauty.",
    explainAr: "نطاق CATEGORY — الفئات: beauty.",
  },
  {
    code: "SUPP15",
    category: "scope",
    caseEn: "Scope: CATEGORY (supplements)",
    caseAr: "نطاق: فئة (مكملات)",
    explainEn: "Second category example — supplements.",
    explainAr: "مثال ثانٍ على الفئة — supplements.",
  },
  {
    code: "CETAPHIL15",
    category: "scope",
    caseEn: "Scope: BRAND",
    caseAr: "نطاق: علامة",
    explainEn: "BRAND scope — brands: Cetaphil.",
    explainAr: "نطاق BRAND — العلامات: Cetaphil.",
  },
  {
    code: "TAGSALE",
    category: "scope",
    caseEn: "Scope: TAG",
    caseAr: "نطاق: وسم",
    explainEn: "TAG scope — tags: summer. Targets products by tag, not category/brand.",
    explainAr: "نطاق TAG — الوسوم: summer. يستهدف بالوسم لا الفئة/العلامة.",
  },
  {
    code: "AUTO5",
    category: "behavior",
    caseEn: "Auto apply",
    caseAr: "تطبيق تلقائي",
    explainEn: "isAutoApply — engine applies when eligible without typing the code.",
    explainAr: "isAutoApply — يُطبَّق تلقائياً عند الأهلية دون كتابة الكود.",
  },
  {
    code: "NOSTACK",
    category: "behavior",
    caseEn: "Not combinable",
    caseAr: "غير قابل للدمج",
    explainEn: "isCombinable=false — cannot stack with other coupons.",
    explainAr: "isCombinable=false — لا يُدمج مع كوبونات أخرى.",
  },
  {
    code: "ONCE5",
    category: "limits",
    caseEn: "Usage limit reached",
    caseAr: "بلغ حد الاستخدام",
    explainEn: "alreadyUsed / usageLimit=1 — redeem fails with usage_limit.",
    explainAr: "alreadyUsed / حد=1 — يفشل بـ usage_limit.",
  },
  {
    code: "EXPIRED",
    category: "status",
    caseEn: "Status: EXPIRED",
    caseAr: "حالة: منتهٍ",
    explainEn: "status=EXPIRED — reject with expired error.",
    explainAr: "status=EXPIRED — يُرفض بخطأ انتهاء الصلاحية.",
  },
  {
    code: "DRAFT10",
    category: "status",
    caseEn: "Status: DRAFT",
    caseAr: "حالة: مسودة",
    explainEn: "Not live — customers cannot redeem until ACTIVE.",
    explainAr: "غير منشور — لا يُستخدم حتى يصبح ACTIVE.",
  },
  {
    code: "PAUSED",
    category: "status",
    caseEn: "Status: INACTIVE",
    caseAr: "حالة: غير نشط",
    explainEn: "Temporarily disabled — inactive error on apply.",
    explainAr: "متوقف مؤقتاً — خطأ inactive عند التطبيق.",
  },
];

export const DISCOUNT_OUT_OF_SCOPE_NOTES = [
  {
    id: "sale",
    titleEn: "Product SALE price",
    titleAr: "سعر SALE على المنتج",
    explainEn:
      "Sale / compare-at lives on product/variant (has_discount_price). Not a Discount/Coupon row.",
    explainAr:
      "سعر التخفيض على المنتج/المتغير. ليس صفاً في جدول الخصم/الكوبون.",
  },
  {
    id: "bogo",
    titleEn: "BOGO",
    titleAr: "اشترِ واحصل",
    explainEn: "Buy-one-get-one is a separate campaign feature — not a coupon type here.",
    explainAr: "اشترِ واحصل ميزة حملة منفصلة — ليست نوع كوبون هنا.",
  },
] as const;

export function explainDiscountCase(
  discount: Discount,
  lang: "en" | "ar",
): { caseLabel: string; explanation: string } {
  const row = DISCOUNT_CASE_GUIDE.find((item) => item.code === discount.code);
  if (row) {
    return {
      caseLabel: lang === "ar" ? row.caseAr : row.caseEn,
      explanation: lang === "ar" ? row.explainAr : row.explainEn,
    };
  }

  const parts: string[] =
    lang === "ar"
      ? [`نوع: ${discount.type}`, `نطاق: ${discount.scope}`, `حالة: ${discount.status}`]
      : [`Type: ${discount.type}`, `Scope: ${discount.scope}`, `Status: ${discount.status}`];

  if (discount.minimumOrderAmount > 0) {
    parts.push(
      lang === "ar"
        ? `حد أدنى ${discount.minimumOrderAmount}`
        : `Min order ${discount.minimumOrderAmount}`,
    );
  }
  if (discount.maximumDiscountAmount != null) {
    parts.push(
      lang === "ar"
        ? `سقف ${discount.maximumDiscountAmount}`
        : `Max cap ${discount.maximumDiscountAmount}`,
    );
  }
  if (discount.requireLogin) parts.push(lang === "ar" ? "يتطلب دخول" : "Require login");
  if (discount.firstOrderOnly) parts.push(lang === "ar" ? "أول طلب" : "First order");
  if (discount.isAutoApply) parts.push(lang === "ar" ? "تلقائي" : "Auto apply");
  if (!discount.isCombinable) parts.push(lang === "ar" ? "غير قابل للدمج" : "Not combinable");
  if (discount.affectsCatalogPrices) parts.push(lang === "ar" ? "كتالوج" : "Catalog prices");

  return {
    caseLabel: lang === "ar" ? "شروط مخصّصة" : "Custom conditions",
    explanation: parts.join(" · "),
  };
}

export function discountConditionChips(discount: Discount): string[] {
  const chips: string[] = [];
  if (discount.requireLogin) chips.push("login");
  if (discount.firstOrderOnly) chips.push("1st");
  if (discount.isAutoApply) chips.push("auto");
  if (!discount.isCombinable) chips.push("no-stack");
  if (discount.affectsCatalogPrices) chips.push("catalog");
  if (discount.audience === "SPECIFIC_USERS") chips.push("VIP");
  if (discount.maximumDiscountAmount != null) chips.push("capped");
  if (discount.minimumOrderAmount > 0) chips.push(`min≥${discount.minimumOrderAmount}`);
  return chips;
}
