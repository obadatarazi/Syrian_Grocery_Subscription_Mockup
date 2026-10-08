/**
 * Website-prototype Coupon Lab — mock catalog + apply engine.
 * Demo only (not wired to Backend).
 */

export type CouponType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
export type CouponScope = "CART" | "PRODUCT" | "CATEGORY" | "BRAND" | "TAG";
export type CouponAudience = "EVERYONE" | "SPECIFIC_USERS";
export type CouponErrorKey =
  | "invalid"
  | "expired"
  | "inactive"
  | "login_required"
  | "first_order_only"
  | "not_for_you"
  | "usage_limit"
  | "min_order"
  | "scope_mismatch"
  | "empty_cart";

export interface DemoCoupon {
  code: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  type: CouponType;
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  scope: CouponScope;
  audience: CouponAudience;
  firstOrderOnly: boolean;
  requireLogin: boolean;
  isAutoApply: boolean;
  isCombinable: boolean;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DRAFT";
  /** Demo: treat as already used by this user */
  alreadyUsed: boolean;
  productIds?: number[];
  categories?: string[];
  brands?: string[];
  /** Demo VIP user ids — only used when audience = SPECIFIC_USERS */
  allowedUserIds?: string[];
  /** Tag slugs when scope = TAG */
  tags?: string[];
  /** When true, discounted unit prices show on listing/PDP for all (or scoped) products */
  affectsCatalogPrices?: boolean;
  color: string;
}

export interface CouponCartLine {
  productId: number;
  brand: string;
  category: string;
  price: number;
  qty: number;
}

export interface CouponContext {
  cart: CouponCartLine[];
  isLoggedIn: boolean;
  isFirstOrder: boolean;
  /** Demo logged-in user id: "user" | "vip" */
  userId: string;
}

export interface CouponApplySuccess {
  ok: true;
  coupon: DemoCoupon;
  discountAmount: number;
  freeShipping: boolean;
  eligibleSubtotal: number;
}

export interface CouponApplyFailure {
  ok: false;
  errorKey: CouponErrorKey;
  coupon?: DemoCoupon;
  meta?: { minOrder?: number; remaining?: number };
}

export type CouponApplyResult = CouponApplySuccess | CouponApplyFailure;

export const PENDING_COUPON_KEY = "aroma_pending_coupon";
export const DEMO_FLAGS_KEY = "aroma_coupon_demo_flags";

export interface DemoFlags {
  isFirstOrder: boolean;
  userId: "user" | "vip";
}

export const DEFAULT_DEMO_FLAGS: DemoFlags = {
  isFirstOrder: true,
  userId: "user",
};

export const DEMO_COUPONS: DemoCoupon[] = [
  {
    code: "ALL15",
    titleEn: "15% off everything",
    titleAr: "خصم ١٥٪ على كل المنتجات",
    descEn: "Storewide — all product prices (also via ?coupon=ALL15)",
    descAr: "على كل المنتجات — يعمل أيضاً عبر ?coupon=ALL15",
    type: "PERCENTAGE",
    value: 15,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    affectsCatalogPrices: true,
    color: "from-rose-500 to-orange-500",
  },
  {
    code: "WELCOME10",
    titleEn: "Welcome 10%",
    titleAr: "ترحيب ١٠٪",
    descEn: "10% off first order — everyone",
    descAr: "خصم ١٠٪ على أول طلب",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: true,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-amber-400 to-orange-500",
  },
  {
    code: "AROMA10",
    titleEn: "Aroma 10%",
    titleAr: "أروما ١٠٪",
    descEn: "10% off any cart over KWD 5",
    descAr: "خصم ١٠٪ على السلة فوق ٥ د.ك",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 5,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-emerald-400 to-teal-500",
  },
  {
    code: "SAVE2",
    titleEn: "Save 2 KWD",
    titleAr: "وفّر ٢ د.ك",
    descEn: "Fixed KWD 2 off (min order 8)",
    descAr: "خصم ثابت ٢ د.ك (حد أدنى ٨)",
    type: "FIXED",
    value: 2,
    minimumOrderAmount: 8,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-sky-400 to-blue-500",
  },
  {
    code: "FREESHIP",
    titleEn: "Free Delivery",
    titleAr: "توصيل مجاني",
    descEn: "Free shipping on any order",
    descAr: "توصيل مجاني لأي طلب",
    type: "FREE_SHIPPING",
    value: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-blue-400 to-indigo-500",
  },
  {
    code: "SKIN20",
    titleEn: "Skincare 20%",
    titleAr: "عناية بالبشرة ٢٠٪",
    descEn: "20% off beauty category items only",
    descAr: "خصم ٢٠٪ على فئة العناية بالبشرة فقط",
    type: "PERCENTAGE",
    value: 20,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CATEGORY",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    categories: ["beauty"],
    color: "from-rose-400 to-pink-500",
  },
  {
    code: "CETAPHIL15",
    titleEn: "Cetaphil 15%",
    titleAr: "سيتافيل ١٥٪",
    descEn: "15% off Cetaphil brand",
    descAr: "خصم ١٥٪ على ماركة سيتافيل",
    type: "PERCENTAGE",
    value: 15,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "BRAND",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    brands: ["Cetaphil"],
    color: "from-violet-400 to-purple-500",
  },
  {
    code: "LOGIN5",
    titleEn: "Login 5%",
    titleAr: "تسجيل دخول ٥٪",
    descEn: "5% off — must be logged in",
    descAr: "خصم ٥٪ — يتطلب تسجيل الدخول",
    type: "PERCENTAGE",
    value: 5,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: true,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-cyan-400 to-teal-600",
  },
  {
    code: "VIP25",
    titleEn: "VIP 25%",
    titleAr: "VIP ٢٥٪",
    descEn: "25% off — VIP demo user only",
    descAr: "خصم ٢٥٪ — لمستخدم VIP التجريبي فقط",
    type: "PERCENTAGE",
    value: 25,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 5,
    scope: "CART",
    audience: "SPECIFIC_USERS",
    firstOrderOnly: false,
    requireLogin: true,
    isAutoApply: false,
    isCombinable: false,
    status: "ACTIVE",
    alreadyUsed: false,
    allowedUserIds: ["vip"],
    color: "from-yellow-400 to-amber-600",
  },
  {
    code: "ONCE5",
    titleEn: "One-time 5%",
    titleAr: "مرة واحدة ٥٪",
    descEn: "Already used (usage limit demo)",
    descAr: "مستخدم مسبقاً (حد الاستخدام)",
    type: "PERCENTAGE",
    value: 5,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: true,
    color: "from-gray-400 to-slate-500",
  },
  {
    code: "EXPIRED",
    titleEn: "Expired promo",
    titleAr: "عرض منتهٍ",
    descEn: "Expired coupon (error demo)",
    descAr: "كوبون منتهٍ (عرض الخطأ)",
    type: "PERCENTAGE",
    value: 30,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "EXPIRED",
    alreadyUsed: false,
    color: "from-stone-400 to-stone-600",
  },
  {
    code: "BIG50",
    titleEn: "Big 50% (capped)",
    titleAr: "٥٠٪ بحد أقصى",
    descEn: "50% off cart — max discount KWD 3",
    descAr: "خصم ٥٠٪ — بحد أقصى ٣ د.ك",
    type: "PERCENTAGE",
    value: 50,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 3,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-fuchsia-400 to-pink-600",
  },
  {
    code: "PRODUCT1",
    titleEn: "Product #1 10%",
    titleAr: "منتج ١ بخصم ١٠٪",
    descEn: "10% off product id 1 only (Cetaphil cream in demo cart)",
    descAr: "خصم ١٠٪ على المنتج رقم ١ فقط",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "PRODUCT",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    productIds: [1],
    color: "from-lime-400 to-green-600",
  },
  {
    code: "FREE500",
    titleEn: "Free Delivery (loyalty)",
    titleAr: "توصيل مجاني (ولاء)",
    descEn: "Free shipping — loyalty coupon demo",
    descAr: "توصيل مجاني — كوبون ولاء تجريبي",
    type: "FREE_SHIPPING",
    value: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-blue-400 to-indigo-500",
  },
  {
    code: "SUPP15",
    titleEn: "Supplements 15%",
    titleAr: "مكملات ١٥٪",
    descEn: "15% off supplements category",
    descAr: "خصم ١٥٪ على فئة المكملات",
    type: "PERCENTAGE",
    value: 15,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CATEGORY",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    categories: ["supplements"],
    color: "from-emerald-400 to-teal-500",
  },
  {
    code: "TAGSALE",
    titleEn: "Tag sale 12%",
    titleAr: "خصم وسم ١٢٪",
    descEn: "12% off products tagged 'summer' (TAG scope demo)",
    descAr: "خصم ١٢٪ على منتجات وسم summer (نطاق TAG)",
    type: "PERCENTAGE",
    value: 12,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "TAG",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    tags: ["summer"],
    color: "from-orange-400 to-rose-500",
  },
  {
    code: "AUTO5",
    titleEn: "Auto-apply 5%",
    titleAr: "تطبيق تلقائي ٥٪",
    descEn: "5% auto-applied when eligible (no code typing)",
    descAr: "خصم ٥٪ يُطبَّق تلقائياً عند الأهلية",
    type: "PERCENTAGE",
    value: 5,
    minimumOrderAmount: 3,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: true,
    isCombinable: true,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-teal-400 to-emerald-600",
  },
  {
    code: "NOSTACK",
    titleEn: "Exclusive 8%",
    titleAr: "حصري ٨٪",
    descEn: "8% off — not combinable with other coupons",
    descAr: "خصم ٨٪ — غير قابل للدمج مع كوبونات أخرى",
    type: "PERCENTAGE",
    value: 8,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: false,
    status: "ACTIVE",
    alreadyUsed: false,
    color: "from-indigo-400 to-violet-600",
  },
  {
    code: "DRAFT10",
    titleEn: "Draft 10%",
    titleAr: "مسودة ١٠٪",
    descEn: "Draft — not redeemable until published ACTIVE",
    descAr: "مسودة — غير قابلة للاستخدام حتى تصبح ACTIVE",
    type: "PERCENTAGE",
    value: 10,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "DRAFT",
    alreadyUsed: false,
    color: "from-slate-300 to-slate-500",
  },
  {
    code: "PAUSED",
    titleEn: "Paused / inactive",
    titleAr: "متوقف / غير نشط",
    descEn: "INACTIVE status — temporarily disabled (error: inactive)",
    descAr: "حالة INACTIVE — متوقف مؤقتاً",
    type: "FIXED",
    value: 1,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    scope: "CART",
    audience: "EVERYONE",
    firstOrderOnly: false,
    requireLogin: false,
    isAutoApply: false,
    isCombinable: true,
    status: "INACTIVE",
    alreadyUsed: false,
    color: "from-amber-300 to-amber-600",
  },
];

export function normalizeCouponCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function findCoupon(code: string): DemoCoupon | undefined {
  const n = normalizeCouponCode(code);
  return DEMO_COUPONS.find((c) => c.code === n);
}

function lineEligible(coupon: DemoCoupon, line: CouponCartLine): boolean {
  switch (coupon.scope) {
    case "CART":
      return true;
    case "PRODUCT":
      return (coupon.productIds ?? []).includes(line.productId);
    case "CATEGORY":
      return (coupon.categories ?? []).includes(line.category);
    case "BRAND":
      return (coupon.brands ?? []).some(
        (b) => b.toLowerCase() === line.brand.toLowerCase(),
      );
    case "TAG":
      return true;
    default:
      return true;
  }
}

export function applyCoupon(
  code: string,
  ctx: CouponContext,
): CouponApplyResult {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, errorKey: "invalid" };
  if (coupon.status === "EXPIRED") return { ok: false, errorKey: "expired", coupon };
  if (coupon.status !== "ACTIVE") return { ok: false, errorKey: "inactive", coupon };
  if (coupon.requireLogin && !ctx.isLoggedIn) {
    return { ok: false, errorKey: "login_required", coupon };
  }
  if (coupon.firstOrderOnly && !ctx.isFirstOrder) {
    return { ok: false, errorKey: "first_order_only", coupon };
  }
  if (
    coupon.audience === "SPECIFIC_USERS" &&
    !(coupon.allowedUserIds ?? []).includes(ctx.userId)
  ) {
    return { ok: false, errorKey: "not_for_you", coupon };
  }
  if (coupon.alreadyUsed) return { ok: false, errorKey: "usage_limit", coupon };
  if (ctx.cart.length === 0) return { ok: false, errorKey: "empty_cart", coupon };

  const eligibleLines = ctx.cart.filter((l) => lineEligible(coupon, l));
  const eligibleSubtotal = eligibleLines.reduce(
    (s, l) => s + l.price * l.qty,
    0,
  );
  const cartSubtotal = ctx.cart.reduce((s, l) => s + l.price * l.qty, 0);

  if (coupon.scope !== "CART" && eligibleSubtotal <= 0) {
    return { ok: false, errorKey: "scope_mismatch", coupon };
  }

  const baseForMin = coupon.scope === "CART" ? cartSubtotal : eligibleSubtotal;
  if (baseForMin < coupon.minimumOrderAmount) {
    return {
      ok: false,
      errorKey: "min_order",
      coupon,
      meta: {
        minOrder: coupon.minimumOrderAmount,
        remaining: Math.max(0, coupon.minimumOrderAmount - baseForMin),
      },
    };
  }

  if (coupon.type === "FREE_SHIPPING") {
    return {
      ok: true,
      coupon,
      discountAmount: 0,
      freeShipping: true,
      eligibleSubtotal,
    };
  }

  let discountAmount = 0;
  const base = coupon.scope === "CART" ? cartSubtotal : eligibleSubtotal;
  if (coupon.type === "PERCENTAGE") {
    discountAmount = (base * coupon.value) / 100;
  } else if (coupon.type === "FIXED") {
    discountAmount = coupon.value;
  }
  if (coupon.maximumDiscountAmount != null) {
    discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
  }
  discountAmount = Math.min(discountAmount, base);
  discountAmount = Math.round(discountAmount * 1000) / 1000;

  return {
    ok: true,
    coupon,
    discountAmount,
    freeShipping: false,
    eligibleSubtotal,
  };
}

export function readCouponFromLocation(
  loc: Location = window.location,
): string | null {
  const params = new URLSearchParams(loc.search);
  const fromSearch =
    params.get("coupon") || params.get("promo") || params.get("code");
  if (fromSearch) return normalizeCouponCode(fromSearch);

  const hash = loc.hash.replace(/^#/, "");
  if (!hash) return null;
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return null;
  const hashParams = new URLSearchParams(hash.slice(qIndex + 1));
  const fromHash =
    hashParams.get("coupon") || hashParams.get("promo") || hashParams.get("code");
  return fromHash ? normalizeCouponCode(fromHash) : null;
}

export function buildCouponUrl(code: string, path = ""): string {
  const url = new URL(window.location.href);
  url.searchParams.set("coupon", normalizeCouponCode(code));
  // Keep path clean for prototype (SPA state); coupon in query is enough
  if (path) {
    url.hash = path.startsWith("#") ? path : `#${path}`;
  }
  return url.toString();
}

export function stripCouponFromUrl(): void {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of ["coupon", "promo", "code"]) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }
}

export function savePendingCoupon(code: string | null): void {
  if (!code) sessionStorage.removeItem(PENDING_COUPON_KEY);
  else sessionStorage.setItem(PENDING_COUPON_KEY, normalizeCouponCode(code));
}

export function loadPendingCoupon(): string | null {
  return sessionStorage.getItem(PENDING_COUPON_KEY);
}

export function loadDemoFlags(): DemoFlags {
  try {
    const raw = sessionStorage.getItem(DEMO_FLAGS_KEY);
    if (!raw) return { ...DEFAULT_DEMO_FLAGS };
    return { ...DEFAULT_DEMO_FLAGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_DEMO_FLAGS };
  }
}

export function saveDemoFlags(flags: DemoFlags): void {
  sessionStorage.setItem(DEMO_FLAGS_KEY, JSON.stringify(flags));
}

export function couponErrorMessage(
  lang: "en" | "ar",
  key: CouponErrorKey,
  meta?: { minOrder?: number; remaining?: number },
): string {
  const en: Record<CouponErrorKey, string> = {
    invalid: "Invalid promo code",
    expired: "This promo code has expired",
    inactive: "This promo code is not active",
    login_required: "Please log in to use this code",
    first_order_only: "This code is for first orders only (toggle on Coupon Lab)",
    not_for_you: "This code is for VIP demo user only (toggle on Coupon Lab)",
    usage_limit: "You have already used this code",
    min_order: `Minimum order is KWD ${meta?.minOrder?.toFixed(3) ?? "—"}`,
    scope_mismatch: "No eligible items in cart for this code",
    empty_cart: "Add items to cart before applying a code",
  };
  const ar: Record<CouponErrorKey, string> = {
    invalid: "كود خصم غير صالح",
    expired: "انتهت صلاحية كود الخصم",
    inactive: "كود الخصم غير مفعّل",
    login_required: "يجب تسجيل الدخول لاستخدام هذا الكود",
    first_order_only: "هذا الكود لأول طلب فقط (فعّل الخيار في مختبر الكوبونات)",
    not_for_you: "هذا الكود لمستخدم VIP فقط (فعّل الخيار في مختبر الكوبونات)",
    usage_limit: "لقد استخدمت هذا الكود مسبقاً",
    min_order: `الحد الأدنى للطلب ${meta?.minOrder?.toFixed(3) ?? "—"} د.ك`,
    scope_mismatch: "لا توجد منتجات مؤهلة في السلة لهذا الكود",
    empty_cart: "أضف منتجات للسلة قبل تطبيق الكود",
  };
  return (lang === "ar" ? ar : en)[key];
}

/** Admin list row — Discount table fields + demo usage */
export interface AdminDiscount extends DemoCoupon {
  id: number;
  usageCount: number;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  priority: number;
  currencyCode: string;
  startsAt: string;
  expireAt: string;
  websiteUrlHint: string;
}

const USAGE_SEED: Record<string, { usage: number; limit: number | null; priority: number }> = {
  ALL15: { usage: 96, limit: null, priority: 1 },
  WELCOME10: { usage: 512, limit: null, priority: 1 },
  AROMA10: { usage: 284, limit: 1000, priority: 5 },
  SAVE2: { usage: 41, limit: 200, priority: 10 },
  FREESHIP: { usage: 431, limit: null, priority: 2 },
  FREE500: { usage: 88, limit: 500, priority: 3 },
  SKIN20: { usage: 147, limit: 500, priority: 8 },
  SUPP15: { usage: 62, limit: 300, priority: 8 },
  CETAPHIL15: { usage: 33, limit: 150, priority: 9 },
  LOGIN5: { usage: 19, limit: null, priority: 12 },
  VIP25: { usage: 7, limit: 50, priority: 1 },
  ONCE5: { usage: 1, limit: 1, priority: 20 },
  EXPIRED: { usage: 210, limit: 500, priority: 99 },
  BIG50: { usage: 12, limit: 100, priority: 4 },
  PRODUCT1: { usage: 9, limit: 100, priority: 15 },
  TAGSALE: { usage: 4, limit: 200, priority: 11 },
  AUTO5: { usage: 55, limit: null, priority: 6 },
  NOSTACK: { usage: 14, limit: 300, priority: 7 },
  DRAFT10: { usage: 0, limit: null, priority: 50 },
  PAUSED: { usage: 3, limit: 100, priority: 40 },
};

export function buildAdminDiscounts(websiteOrigin = "http://localhost:5173"): AdminDiscount[] {
  return DEMO_COUPONS.map((c, i) => {
    const seed = USAGE_SEED[c.code] ?? { usage: 0, limit: null, priority: 50 };
    return {
      ...c,
      id: i + 1,
      usageCount: seed.usage,
      usageLimit: seed.limit,
      usageLimitPerUser: c.firstOrderOnly || c.alreadyUsed ? 1 : null,
      priority: seed.priority,
      currencyCode: "KWD",
      startsAt: "2025-06-01",
      expireAt: c.status === "EXPIRED" ? "2025-06-30" : "2025-12-31",
      websiteUrlHint: `${websiteOrigin}/?coupon=${c.code}`,
    };
  });
}

export function formatDiscountValue(d: Pick<DemoCoupon, "type" | "value">): string {
  if (d.type === "FREE_SHIPPING") return "Free ship";
  if (d.type === "FIXED") return `KWD ${d.value.toFixed(3)}`;
  return `${d.value}%`;
}

export const MOCK_DISCOUNT_USAGES = [
  { id: 1, code: "AROMA10", user: "Fatima Al-Rashidi", orderId: "ARC-4872", amount: 1.25, at: "2025-07-08 14:22" },
  { id: 2, code: "FREESHIP", user: "Mohammed Al-Sabah", orderId: "ARC-4860", amount: 1.5, at: "2025-07-08 11:05" },
  { id: 3, code: "SKIN20", user: "Sara Hassan", orderId: "ARC-4851", amount: 2.1, at: "2025-07-07 19:40" },
  { id: 4, code: "WELCOME10", user: "Noor Al-Ahmad", orderId: "ARC-4844", amount: 0.95, at: "2025-07-07 09:12" },
  { id: 5, code: "VIP25", user: "VIP Demo User", orderId: "ARC-4830", amount: 5.0, at: "2025-07-06 16:55" },
];
