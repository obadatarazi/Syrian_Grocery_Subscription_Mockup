import { useState, useEffect, useRef, createContext, useContext, type ReactNode, type MouseEvent, type ElementType } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import {
  Search, ShoppingCart, Heart, Bookmark, User, Menu, X,
  ChevronRight, ChevronLeft, Star, Plus, Check,
  MapPin, Facebook, Instagram, Twitter, Youtube,
  Shield, Truck, Gift, Bell, Award,
  Tag, Activity, Package,
  Headphones, RotateCcw, Filter, Grid3X3, List,
  ChevronDown, Upload, Minus, Trash2, CreditCard,
  CheckCircle2, Share2, Play, FileText, Info, AlertCircle,
  SlidersHorizontal,
  LogOut, Eye, EyeOff, Calendar, TrendingUp,
  Pause, PlayCircle, SkipForward, XCircle, Repeat, Pencil,
  Copy, Home as HomeIcon, Briefcase,
  Wallet, ClipboardList, LayoutDashboard, LocateFixed,
  Smartphone, Sparkles,
} from "lucide-react";
import { SUBSCRIPTION_FEE } from "./haseri-data";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "en" | "ar";

function logoSrc(_lang: Lang): string {
  return ""; // text brand used instead
}

function BrandLogo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  const size =
    className.includes("h-12") || className.includes("h-14") || className.includes("h-16")
      ? "text-3xl sm:text-4xl"
      : className.includes("w-6")
        ? "text-lg"
        : className.includes("h-8") || className.includes("h-10")
          ? "text-2xl"
          : "text-2xl sm:text-3xl";
  return (
    <span className={`inline-flex items-center font-black tracking-tight select-none leading-none ${size} ${invert ? "text-white" : "text-[#0b7a6e]"}`}>
      حصري
    </span>
  );
}

const SHAMCASH_LOGO_URL = "https://shamcash-api.com/shamcash.svg";
const SHAMCASH_LOGO_LOCAL = "/shamcash.svg";

function ShamCashLogo({ className = "h-8 w-auto object-contain" }: { className?: string }) {
  const [src, setSrc] = useState(SHAMCASH_LOGO_URL);
  return (
    <img
      src={src}
      alt="شام كاش"
      className={className}
      onError={() => {
        if (src !== SHAMCASH_LOGO_LOCAL) setSrc(SHAMCASH_LOGO_LOCAL);
      }}
    />
  );
}

type Page =
  | "home" | "listing" | "product" | "cart" | "checkout"
  | "login" | "register" | "forgot"
  | "dashboard" | "orders" | "order-detail" | "addresses"
  | "wishlist-page" | "notifications" | "loyalty"
  | "subscription" | "sub-dashboard" | "upload-rx";
interface CartItem { product: Product; qty: number }
interface Product {
  id: number; nameEn: string; nameAr: string; brand: string;
  price: number; orig: number | null; rating: number; reviews: number;
  badge: string | null; img: string; category: string; isPrescription: boolean;
}

/** Thematic grocery photos matched by product/category name (not brand packaging). */
const FOOD_PHOTO: Record<string, string[]> = {
  rice: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=700&h=700&fit=crop&auto=format",
  ],
  grains: [
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505576399279-565b52d4c709?w=700&h=700&fit=crop&auto=format",
  ],
  oil: [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&h=700&fit=crop&auto=format",
  ],
  sugar: [
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700&h=700&fit=crop&auto=format",
  ],
  tea: [
    "https://images.unsplash.com/photo-1564890369479-c4d3678f4c5b?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=700&h=700&fit=crop&auto=format",
  ],
  butter: [
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=700&h=700&fit=crop&auto=format",
  ],
  dairy: [
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=700&h=700&fit=crop&auto=format",
  ],
  lentils: [
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&h=700&fit=crop&auto=format",
  ],
  chickpeas: [
    "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=700&h=700&fit=crop&auto=format",
  ],
  spices: [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1505576399279-565b52d4c709?w=700&h=700&fit=crop&auto=format",
  ],
  canned: [
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&h=700&fit=crop&auto=format",
  ],
  hummus: [
    "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=700&h=700&fit=crop&auto=format",
  ],
  meat: [
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=700&h=700&fit=crop&auto=format",
  ],
  jam: [
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=700&h=700&fit=crop&auto=format",
  ],
  pantry: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&h=700&fit=crop&auto=format",
  ],
};

function namedPlaceholder(label: string, tone = 0): string {
  const n = label.toLowerCase();
  let key = "pantry";
  if (/شاي|tea/.test(n)) key = "tea";
  else if (/سكر|sugar/.test(n)) key = "sugar";
  else if (/زيت|oil|olive/.test(n)) key = "oil";
  else if (/برغل|فريكة|سميد|bulgur|freekeh|semolina|طحين|flour/.test(n)) key = "grains";
  else if (/زبدة|butter/.test(n)) key = "butter";
  else if (/سمن|ghee|قشطة|cream|ألبان|dairy/.test(n)) key = "dairy";
  else if (/عدس|lentil|فاصوليا|bean/.test(n)) key = "lentils";
  else if (/حمص حب|chickpea/.test(n)) key = "chickpeas";
  else if (/زعتر|بهار|spice|توابل|za.?atar/.test(n)) key = "spices";
  else if (/طحينة|hummus|حمص بال/.test(n)) key = "hummus";
  else if (/مرتديلا|mortadella|لحم|دجاج|beef|chicken/.test(n)) key = "meat";
  else if (/مربى|jam|دبس|molasses/.test(n)) key = "jam";
  else if (/مخلل|pickle|فول|foul|معلب|canned/.test(n)) key = "canned";
  else if (/رز|rice|حبوب|grain/.test(n)) key = "rice";
  else if (/بقول|legume/.test(n)) key = "lentils";
  else if (/تموين|pantry|مصنع|اشتراك|عروض|حصري|family|save|شهر/.test(n)) key = "pantry";
  const pool = FOOD_PHOTO[key] ?? FOOD_PHOTO.pantry;
  return pool[Math.abs(tone) % pool.length];
}


interface DeliveryLocation {
  id: string;
  areaEn: string;
  areaAr: string;
  addressEn: string;
  addressAr: string;
  lat: number;
  lng: number;
}

const SYRIA_LOCATIONS: DeliveryLocation[] = [
  { id: "damascus-mezzeh", areaEn: "Damascus — Mezzeh", areaAr: "دمشق — المزة", addressEn: "University St — Mezzeh, Damascus", addressAr: "شارع الجامعة — المزة، دمشق", lat: 33.5035, lng: 36.2600 },
  { id: "damascus-bab-touma", areaEn: "Damascus — Bab Touma", areaAr: "دمشق — باب توما", addressEn: "Bab Touma — Old City, Damascus", addressAr: "باب توما — المدينة القديمة، دمشق", lat: 33.5126, lng: 36.3170 },
  { id: "damascus-kafr-sousa", areaEn: "Damascus — Kafr Sousa", areaAr: "دمشق — كفر سوسة", addressEn: "Kafr Sousa — Damascus", addressAr: "كفر سوسة — دمشق", lat: 33.4950, lng: 36.2780 },
  { id: "aleppo", areaEn: "Aleppo", areaAr: "حلب", addressEn: "Aleppo (delivery not yet available)", addressAr: "حلب (التوصيل غير متاح بعد)", lat: 36.2021, lng: 37.1343 },
  { id: "homs", areaEn: "Homs", areaAr: "حمص", addressEn: "Homs (delivery not yet available)", addressAr: "حمص (التوصيل غير متاح بعد)", lat: 34.7268, lng: 36.7234 },
];

function findNearestLocation(lat: number, lng: number): DeliveryLocation {
  let best = SYRIA_LOCATIONS[0];
  let bestDist = Infinity;
  for (const loc of SYRIA_LOCATIONS) {
    const d = (loc.lat - lat) ** 2 + (loc.lng - lng) ** 2;
    if (d < bestDist) { bestDist = d; best = loc; }
  }
  return best;
}

function mapEmbedUrl(lat: number, lng: number) {
  const dLat = 0.012;
  const dLng = 0.018;
  const bbox = `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

// ─── Nav Context ──────────────────────────────────────────────────────────────
interface NavCtx {
  page: Page;
  goTo: (p: Page, product?: Product) => void;
  isLoggedIn: boolean;
  logout: () => void;
  currentProduct: Product;
  cartItems: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  wishIds: Set<number>;
  toggleWish: (id: number) => void;
  cartCount: number; wishCount: number;
  lang: Lang;
  deliveryLocation: DeliveryLocation;
  setDeliveryLocation: (loc: DeliveryLocation) => void;
  locationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}
const NavContext = createContext<NavCtx>({} as NavCtx);
const useNav = () => useContext(NavContext);

// ─── Translations ─────────────────────────────────────────────────────────────
const T: Record<Lang, Record<string, string>> = {
  en: {
    promoA: "🎁 توصيل مجاني للطلبات فوق 50,000 ل.س",
    promoB: "📦 Subscribe for 500 ل.س/month — factory prices",
    promoC: "⭐ Earn Reward Points on Every Purchase",
    topBarBadge: "اشتراك البقالة بأسعار المصنع",
    topBarPromo: "اشترك بـ 500 ل.س شهرياً واحصل على أسعار المصنع",
    country: "Syria",
    loginRegister: "Login / Register",
    navShop: "Catalog",
    navWellness: "Legumes & Spices",
    navOffers: "Offers & Promotions",
    locationLabel: "Location: دمشق",
    selectLocation: "Select Location",
    searchLocation: "Search for your location",
    orderDeliveredHere: "Your order will be delivered here",
    movePin: "Move pin to your exact location",
    selectDeliveryLocation: "Select Delivery Location",
    confirmLocation: "Confirm Location",
    changeLocation: "Change",
    usingDeliveryLocation: "Delivery Location",
    locateMe: "Locate me",
    searchPlaceholder: "Search rice, oil, sugar, ghee, canned goods...",
    login: "Login", register: "Register", wishlist: "Wishlist",
    cart: "Cart", account: "Account", home: "Home",
    wellness: "Legumes", beauty: "Rice",
    supplements: "Sugar & Tea", personalCare: "Spices",
    motherBaby: "Bulgur & Freekeh", medicalDevices: "Jams & Spreads",
    offers: "Offers 🔥",
    shopNow: "Shop Now", viewAll: "View All", viewOffers: "View Offers",
    off: "OFF", new: "NEW", sale: "SALE", kwd: "ل.س",
    rice: "Rice", oil: "Cooking Oil", sugar: "Sugar & Tea", ghee: "Ghee & Dairy",
    vegetables: "Legumes & Spices", canned: "Canned Goods", frozen: "Frozen",
    addToCart: "Add to Cart", added: "Added", buyNow: "Buy Now",
    quickCategories: "Shop by Category",
    qsOffers: "Offers", qsShopPharmacy: "Shop Catalog",
    qsExpress: "Express Delivery", qsShopByConcern: "Shop by Concern",
    qsMyRewards: "My Rewards", qsUploadRx: "Browse Staples", qsSubscribe: "Subscribe & Save",
    qsLoyaltyRewards: "Member Savings", qsDelivery: "Delivery",
    qsBadge50: "Up to 50%", qsBadgeExpress: "express", qsBadgeSave10: "500 ل.س",
    todayOffers: "Today's Offers", bogo: "Buy 1 Get 1",
    newArrivals: "New Arrivals", bestSellers: "Best Sellers",
    rewardPoints: "Reward Points", monthlyDeals: "Monthly Deals",
    bestCats: "Top Categories",
    topCategories: "Top Categories",
    oneNationTitle: "One Nation. One People",
    primePicks: "Prime Picks",
    hairCare: "Cooking Oil",
    newArrival: "New Arrival",
    healthWellness: "Pantry Staples",
    kBeauty: "Ghee & Dairy",
    topDeals: "Top Deals",
    sunscreenStore: "Tea & Sugar",
    homeHealth: "Legumes & Spices",
    medicalEssentials: "Canned Goods",
    bogoPackagesTitle: "Buy 1 Get 1 FREE on Selected حصري Packages",
    limitedDealsTitle: "Limited Time حصري Deals",
    catSkincareBeauty: "Rice & Grains",
    catVitaminsSupps: "Oils & Fats",
    catPersonalCare: "Canned Goods",
    catWellnessBundle: "Member Bundles",
    catEnergyBoost: "Tea & Sweets",
    campaignTitle: "Factory Prices for Every Family",
    campaignSub: "Rice, oil, sugar, ghee & canned goods at factory prices — delivered in Damascus.",
    products1Title: "Featured Products", products2Title: "Best Sellers", products3Title: "New Arrivals",
    brandsTitle: "Featured Brands",
    topBrandsTitle: "Top Brands Your Way",
    productsYouLoveTitle: "Products You'll Love",
    exploreBeautyCategories: "Explore Grocery Categories",
    beautyStoreTitle: "Grocery Aisle",
    beautyStoreDiscount: "UP TO 50% OFF",
    beautyStoreSub: "أسعار المصنع تبدأ هنا",
    nutritionStoreTitle: "Pantry Guide",
    yourNutritionGuide: "Your Pantry Guide",
    momBabyStoreTitle: "Dry Goods",
    momBabyStoreSub: "Bulgur, freekeh, lentils & spices",
    gentleCareMomBaby: "Everyday Pantry Essentials",
    appSub: "Don't miss app-exclusive deals & rewards",
    appTitle: "Download the حصري app today!",
    appFeature1: "Exclusive app-only deals",
    appFeature2: "Track orders in real-time",
    appFeature3: "Earn loyalty points faster",
    comingSoon: "Coming Soon",
    comingSoonMessage: "Our mobile app is launching soon. Stay tuned!",
    getOnGooglePlay: "GET IT ON",
    googlePlay: "Google Play",
    downloadOnThe: "Download on the",
    appStore: "App Store",
    trustTitle: "Why Choose حصري?",
    fastDelivery: "Fast Delivery", fastDeliveryDesc: "توصيل خلال يومين في دمشق",
    securePayment: "Secure Payment", securePaymentDesc: "Sham Cash mock payment",
    genuine: "100% Genuine", genuineDesc: "Trusted Syrian factory brands",
    support: "24/7 Support", supportDesc: "Member support for your orders",
    easyReturns: "Easy Returns", easyReturnsDesc: "Hassle-free 7-day returns",
    loyaltyRewards: "Loyalty Rewards", loyaltyRewardsDesc: "Earn points on every purchase",
    faqTitle: "Frequently Asked Questions",
    faqSub: "Quick answers about shopping, delivery, and returns at حصري.",
    faq1Q: "Which areas in Syria do you deliver to?",
    faq1A: "We deliver in Damascus (Mezzeh, Bab Touma, Kafr Sousa). Aleppo and Homs are listed but not yet available. Estimated delivery within 2 days.",
    faq2Q: "Are all products 100% genuine?",
    faq2A: "Yes. Products come from Syrian factories and trusted brands like Al-Durra, Sidi Hisham, Abido, and Al-Marai.",
    faq3Q: "What is your return policy?",
    faq3A: "Unopened items in original packaging can be returned within 7 days of delivery. Contact our support team to start a hassle-free return or exchange.",
    faq4Q: "Which payment methods do you accept?",
    faq4A: "Payment is simulated with Sham Cash (Pay / Cancel). No real payment is processed in this mock-up.",
    faq5Q: "How fast is delivery?",
    faq5A: "Estimated delivery within 2 days in Damascus. Aleppo and Homs are not yet available.",
    faq6Q: "How does the subscription work?",
    faq6A: "Pay 500 SYP/month via Sham Cash to unlock factory prices. Cancel anytime — access ends at the end of the current period.",
    footerDesc: "Syrian grocery subscription at factory prices — Damascus delivery.",
    company: "Company", aboutUs: "About Us", contact: "Contact", careers: "Careers",
    customerService: "Customer Service", faq: "FAQ", shipping: "Shipping",
    returns: "Returns", privacy: "Privacy Policy", terms: "Terms of Service",
    categoriesCol: "Categories", newsletter: "Newsletter",
    newsletterSub: "Subscribe for pantry deals and factory prices.",
    emailPH: "Your email address", subscribe: "Subscribe",
    paymentMethods: "Payment Methods", downloadApp: "Download the App",
    copyright: "© 2026 حصري. All rights reserved.",
    poweredBy: "Powered by حصري",
    products: "Products",
    // Listing page
    allProducts: "All Products", filters: "Filters", clearAll: "Clear All",
    sortBy: "Sort By", sortFeatured: "Featured", sortPriceLow: "Price: Low to High",
    sortPriceHigh: "Price: High to Low", sortRating: "Highest Rated", sortNewest: "Newest",
    priceRange: "Price Range", minPrice: "Min", maxPrice: "Max",
    minRating: "Minimum Rating", prescriptionOnly: "Members Only",
    inStockOnly: "In Stock Only", results: "results", noProducts: "No products found",
    clearFilters: "Clear Filters",
    // Product detail
    brand: "Brand", sku: "SKU", availability: "Availability", inStock: "In Stock",
    outOfStock: "Out of Stock", qty: "Quantity", description: "Description",
    benefits: "Why Buy", ingredients: "Contents", howToUse: "Storage & Use",
    reviews: "Reviews", writeReview: "Write a Review", verifiedPurchase: "Verified Purchase",
    helpful: "Helpful", people: "people",
    prescriptionRequired: "Subscription Required",
    uploadPrescription: "Subscribe Now",
    prescriptionInfo: "Factory prices require an active حصري subscription (500 SYP/month).",
    estimatedDelivery: "Estimated Delivery",
    deliveryToday: "Within 2 days", freeDeliveryLabel: "Free Delivery",
    relatedProducts: "Related Products",
    shareProduct: "Share",
    addToWishlist: "Add to Wishlist", removeFromWishlist: "Remove from Wishlist",
    size: "Size", strength: "Strength",
    originalPrice: "Original Price", discount: "Discount",
    // Cart
    yourCart: "Your Cart", emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping", proceedToCheckout: "Proceed to Checkout",
    orderSummary: "Order Summary", subtotal: "Subtotal", delivery: "Delivery",
    deliveryFree: "Free", promoCode: "Promo Code", applyCode: "Apply",
    invalidCode: "Invalid promo code", codeApplied: "Code applied!",
    usePoints: "Use Loyalty Points", pointsBalance: "Your balance:",
    loyaltyDiscount: "Loyalty Discount", total: "Total", remove: "Remove",
    openCartApply: "Open cart",
    freeShippingApplied: "Free delivery applied",
    loginToApply: "Log in then retry",
    exampleUrls: "Example URLs",
    condType: "Type",
    condAudience: "Audience",
    condFirstOrder: "First order only",
    condLogin: "Requires login",
    condAuto: "Auto-apply",
    condCombinable: "Combinable with other discounts",
    condCatalog: "Updates all product prices on site",
    condUsed: "Already used (limit reached)",
    condProducts: "Products",
    condCategories: "Categories",
    condBrands: "Brands",
    yes: "Yes",
    no: "No",
    itemCount: "item", itemsCount: "items",
    // Checkout
    checkout: "Checkout", deliveryInfo: "Delivery Info", paymentInfo: "Payment",
    orderReview: "Review Order",
    savedAddresses: "Saved Addresses", addNewAddress: "Add New Address",
    fullName: "Full Name", phoneNumber: "Phone Number", addressLine: "Address",
    area: "Area", building: "Building / Block", floor: "Floor", apartment: "Apartment",
    specialInstructions: "Special Instructions (optional)",
    deliveryMethod: "Delivery Method",
    expressDelivery: "Express Delivery", expressDesc: "1–2 hours",
    standardDelivery: "Standard Delivery", standardDesc: "Same day by 6 PM",
    scheduledDelivery: "Scheduled", scheduledDesc: "Choose your time slot",
    expressPrice: "2.000", standardPrice: "Free",
    creditCard: "Credit / Debit Card", knet: "Sham Cash", applePay: "Apple Pay",
    cashOnDelivery: "Cash on Delivery",
    cardNumber: "Card Number", expiryDate: "MM/YY", cvv: "CVV",
    nameOnCard: "Name on Card",
    loyaltyPoints: "Loyalty Points", useMyPoints: "Use my points",
    pointsAvailable: "points available", pointsWorth: "worth",
    placeOrder: "Place Order", back: "Back", next: "Continue",
    orderPlaced: "Order Placed Successfully!", orderNumber: "Order Number",
    trackOrder: "Track Order",
    estDelivery: "Estimated Delivery",
    step1: "Delivery", step2: "Payment", step3: "Review",
    home2: "Home", listing: "Products",
    prescriptionBadge: "Member",
    // Browse Staples demo
    uploadCreamRxTitle: "Subscribe to حصري",
    uploadCreamRxSub: "Pay 500 SYP/month and unlock factory prices on pantry staples.",
    rxStepSelect: "Select Products", rxStepUpload: "Pay", rxStepDetails: "Your Details", rxStepReview: "Review",
    rxSelectCreams: "Select Pantry Staples",
    rxSelectCreamsHint: "Choose pantry staples for your membership.",
    rxHowItWorks: "How It Works",
    rxHow1: "Choose your subscription plan",
    rxHow2: "Upload a clear photo or scan of your Rx",
    rxHow3: "Factory prices unlock immediately after payment",
    rxHow4: "Get your order توصيل في دمشق",
    rxDragDrop: "Drag & drop or click to select",
    rxFileTypes: "JPG, PNG, PDF — max 10MB",
    rxFileUploaded: "Subscription confirmed",
    rxRemoveFile: "Remove file",
    rxDoctorName: "Doctor's Name", rxPatientName: "Patient Name",
    rxDate: "Prescription Date", rxCivilId: "City (optional)",
    rxReviewTitle: "Review Your Request",
    rxReviewNote: "Your membership unlocks factory prices immediately after Sham Cash payment.",
    rxSubmit: "Confirm Subscription",
    rxSubmitted: "Subscription Active!",
    rxSubmittedMsg: "Your subscription payment was received.",
    rxRefNumber: "Reference Number",
    rxTrackStatus: "Track Status",
    rxSelectOneCream: "Please select at least one product",
    rxUploadRequired: "Please complete Sham Cash payment",
    rxDemoBadge: "Front-end Demo",
    // Auth
    signIn: "Sign In", signUp: "Create Account", orContinueWith: "or continue with",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    forgotPassword: "Forgot Password?", resetPassword: "Reset Password",
    emailAddress: "Email Address", password: "Password", confirmPassword: "Confirm Password",
    firstName: "First Name", lastName: "Last Name", phoneField: "Phone Number",
    agreeToTerms: "I agree to the", sendResetLink: "Send Reset Link",
    backToLogin: "Back to Sign In", checkEmail: "Check your email",
    resetSent: "We've sent a password reset link to your email address.",
    showPassword: "Show", hidePassword: "Hide",
    enterMobileContinue: "Enter Mobile Number to continue",
    encryptedSafe: "Your information is encrypted and stored safely",
    forAssistance: "For Assistance,",
    visitHelpCenter: "Visit Help Center",
    aromaTagline: "Factory Prices In Your Hands",
    verifyMobileTitle: "Please Verify Your Mobile Number",
    otpSentPrefix: "Enter the 6 digit pin you received on",
    changeNumber: "Change Number",
    resendCode: "Resend Code",
    sendCode: "Send Code",
    setNewPassword: "Set New Password",
    setNewPasswordDesc: "Create a new password for your account",
    passwordUpdated: "Password updated successfully",
    resetMobileDesc: "Enter your mobile number and we'll send you a verification code",
    welcomeBackAroma: "Welcome back to حصري",
    // Account general
    myAccount: "My Account", editProfile: "Edit Profile", saveChanges: "Save Changes",
    signOut: "Sign Out", welcomeBack: "Welcome back,", memberSince: "Member since",
    goldTier: "Gold Member", silverTier: "Silver Member", bronzeTier: "Bronze Member",
    verified: "Verified",
    // Dashboard
    accountOverview: "Account Overview", totalOrdersLabel: "Total Orders",
    pointsBalanceLabel: "Reward Points", activeSubsLabel: "Active Subscriptions",
    savedItemsLabel: "Saved Items", recentOrders: "Recent Orders",
    quickActions: "Quick Actions", viewAllOrders: "View All Orders",
    // Orders
    orderHistory: "Order History", orderDetailsTitle: "Order Details",
    orderNum: "Order Number", orderDate: "Order Date", orderStatusLabel: "Status",
    orderTotalLabel: "Total", viewDetails: "View Details", reorder: "Reorder",
    downloadInvoice: "Download Invoice", cancelOrder: "Cancel Order",
    trackOrderBtn: "Track Order",
    statusPlaced: "Order Placed", statusConfirmed: "Confirmed", statusPreparing: "Preparing",
    statusShipped: "Shipped", statusDelivered: "Delivered", statusCancelled: "Cancelled",
    statusProcessing: "Processing",
    deliveredTo: "Delivered to", paymentMethod2: "Payment Method",
    // Addresses
    addressesTitle: "Saved Addresses", addAddress: "Add Address", editAddress: "Edit",
    deleteAddress: "Delete", setDefault: "Set as Default", defaultBadge: "Default",
    homeType: "Home", workType: "Work", otherType: "Other",
    // Wishlist
    myWishlist: "My Wishlist", addAllToCart: "Add All to Cart",
    emptyWishlist: "Your wishlist is empty", browseProducts: "Browse Products",
    // Notifications
    notificationsTitle: "Notifications", markAllRead: "Mark all as read",
    allNotifs: "All", orderNotifs: "Orders", promoNotifs: "Promotions",
    systemNotifs: "System", noNotifications: "No notifications yet",
    markRead: "Mark as read",
    // Loyalty
    loyaltyTitle2: "Loyalty & Rewards", pointsBalance2: "Points Balance",
    totalEarned: "Total Earned", totalRedeemed: "Total Redeemed",
    howToEarn: "How to Earn Points", redeemPoints: "Redeem Points",
    pointsHistoryTitle: "Points History",
    pointsExpire: "Points expire in 12 months", expiresOn: "Expires",
    nextTierLabel: "Points to next tier",
    redeemFor: "Redeem for", ptsNeeded: "pts needed",
    // Subscriptions
    subscribeAndSave: "Subscribe to حصري", savePercent: "500 ل.س / month — factory prices",
    chooseFrequency: "Choose Frequency", startDate: "Start Date",
    weeklyFreq: "Weekly", biweeklyFreq: "Bi-weekly", monthlyFreq: "Monthly",
    every2Freq: "Every 2 Months", customFreq: "Custom",
    subscribeBtn: "Confirm & Pay with Sham Cash", subscriptionSummary: "Subscription Summary",
    subDashTitle: "My Subscriptions", upcomingDeliveries: "Upcoming Deliveries",
    pauseSub: "Pause", resumeSub: "Resume", skipNext: "Skip Next",
    cancelSub: "Cancel Subscription", manageSub: "Manage",
    nextDelivery: "Next Delivery", subFrequency: "Frequency",
    subActive: "Active", subPaused: "Paused", subCancelled: "Cancelled",
    noSubscriptions: "No active subscriptions", createSubscription: "Create Subscription",
    subConfirm: "Subscription Confirmed!", subConfirmMsg: "Your subscription is active. Factory prices are unlocked.",
  },
  ar: {
    promoA: "🎁 توصيل مجاني للطلبات فوق 50,000 ل.س",
    promoB: "📦 اشترك بـ 500 ل.س شهرياً — أسعار المصنع",
    promoC: "⭐ اكسب نقاط مكافآت مع كل عملية شراء",
    topBarBadge: "اشتراك البقالة بأسعار المصنع",
    topBarPromo: "اشترك بـ 500 ل.س شهرياً واحصل على أسعار المصنع",
    country: "سوريا",
    loginRegister: "تسجيل الدخول / إنشاء حساب",
    navShop: "الكتالوج",
    navWellness: "بقوليات وتوابل",
    navOffers: "العروض والتخفيضات",
    locationLabel: "الموقع: دمشق",
    selectLocation: "اختر الموقع",
    searchLocation: "ابحث عن موقعك",
    orderDeliveredHere: "سيتم توصيل طلبك إلى هنا",
    movePin: "حرّك الدبوس إلى موقعك الدقيق",
    selectDeliveryLocation: "اختر موقع التوصيل",
    confirmLocation: "تأكيد الموقع",
    changeLocation: "تغيير",
    usingDeliveryLocation: "موقع التوصيل",
    locateMe: "حدّد موقعي",
    searchPlaceholder: "ابحث عن رز، زيت، سكر، سمن، معلبات...",
    login: "تسجيل الدخول", register: "إنشاء حساب", wishlist: "المفضلة",
    cart: "السلة", account: "حسابي", home: "الرئيسية",
    wellness: "بقوليات", beauty: "الرز",
    supplements: "السكر والشاي", personalCare: "توابل",
    motherBaby: "برغل وفريكة", medicalDevices: "مربى ومعلبات",
    offers: "العروض 🔥",
    shopNow: "تسوّق الآن", viewAll: "عرض الكل", viewOffers: "عرض العروض",
    off: "خصم", new: "جديد", sale: "تخفيض", kwd: "ل.س",
    rice: "الرز", oil: "زيت الطبخ", sugar: "السكر والشاي", ghee: "السمن والألبان",
    vegetables: "بقوليات وتوابل", canned: "المعلبات", frozen: "المجمدات",
    addToCart: "أضف للسلة", added: "أُضيف", buyNow: "اشترِ الآن",
    quickCategories: "تسوق حسب الفئة",
    qsOffers: "العروض", qsShopPharmacy: "تسوق الكتالوج",
    qsExpress: "توصيل سريع", qsShopByConcern: "تسوق حسب الحاجة",
    qsMyRewards: "مكافآتي", qsUploadRx: "تصفح التموين", qsSubscribe: "اشترك ووفر",
    qsLoyaltyRewards: "توفير المشتركين", qsDelivery: "ديلفري",
    qsBadge50: "حتى 50٪", qsBadgeExpress: "سريع", qsBadgeSave10: "500 ل.س",
    todayOffers: "عروض اليوم", bogo: "اشترِ 1 واحصل على 1",
    newArrivals: "وصل حديثًا", bestSellers: "الأكثر مبيعًا",
    rewardPoints: "نقاط المكافآت", monthlyDeals: "عروض الشهر",
    bestCats: "أبرز الفئات",
    topCategories: "أبرز الفئات",
    oneNationTitle: "وطن واحد. شعب واحد.",
    primePicks: "اختيارات مميزة",
    hairCare: "زيت الطبخ",
    newArrival: "وصل حديثًا",
    healthWellness: "أساسيات التموين",
    kBeauty: "السمن والألبان",
    topDeals: "أفضل العروض",
    sunscreenStore: "السكر والشاي",
    homeHealth: "بقوليات وتوابل",
    medicalEssentials: "المعلبات",
    bogoPackagesTitle: "اشترِ 1 واحصل على 1 مجانًا على باقات حصري المختارة",
    limitedDealsTitle: "عروض حصري لفترة محدودة",
    catSkincareBeauty: "الرز والحبوب",
    catVitaminsSupps: "الزيوت والسمن",
    catPersonalCare: "المعلبات",
    catWellnessBundle: "باقات المشتركين",
    catEnergyBoost: "شاي وحلويات",
    campaignTitle: "أسعار المصنع لكل عائلة",
    campaignSub: "من الرز والزيت إلى المعلبات والسمن — كل تموينك بأسعار المصنع يصلك في دمشق.",
    products1Title: "منتجات مميزة", products2Title: "الأكثر مبيعًا", products3Title: "وصل حديثًا",
    brandsTitle: "العلامات التجارية",
    topBrandsTitle: "أفضل العلامات على طريقتك",
    productsYouLoveTitle: "منتجات ستحبها",
    exploreBeautyCategories: "استكشف أصناف التموين",
    beautyStoreTitle: "ممر البقالة",
    beautyStoreDiscount: "خصم حتى 50٪",
    beautyStoreSub: "أسعار المصنع تبدأ هنا",
    nutritionStoreTitle: "دليل التموين",
    yourNutritionGuide: "دليل مخزنك",
    momBabyStoreTitle: "مواد جافة",
    momBabyStoreSub: "برغل وفريكة وعدس وتوابل",
    gentleCareMomBaby: "أساسيات التموين اليومية",
    appSub: "لا تفوّت العروض الحصرية ومكافآت التطبيق",
    appTitle: "حمّل تطبيق حصري اليوم!",
    appFeature1: "عروض حصرية للتطبيق فقط",
    appFeature2: "تتبّع طلباتك لحظة بلحظة",
    appFeature3: "اكسب نقاط ولاء أسرع",
    comingSoon: "قريبًا",
    comingSoonMessage: "تطبيقنا للجوال قادم قريبًا. ترقّبونا!",
    getOnGooglePlay: "احصل عليه من",
    googlePlay: "Google Play",
    downloadOnThe: "حمّل من",
    appStore: "App Store",
    trustTitle: "لماذا تختار حصري؟",
    fastDelivery: "توصيل سريع", fastDeliveryDesc: "توصيل في نفس اليوم بدمشق",
    securePayment: "دفع آمن", securePaymentDesc: "شام كاش — دفع تجريبي آمن",
    genuine: "100٪ أصلي", genuineDesc: "علامات مصانع سورية موثوقة",
    support: "دعم 24/7", supportDesc: "فريق دعم للمشتركين وطلباتهم",
    easyReturns: "إرجاع سهل", easyReturnsDesc: "إرجاع مريح خلال 7 أيام",
    loyaltyRewards: "مكافآت الولاء", loyaltyRewardsDesc: "اكسب نقاطًا مع كل عملية شراء",
    faqTitle: "الأسئلة الشائعة",
    faqSub: "إجابات سريعة عن التسوق والتوصيل والإرجاع في حصري.",
    faq1Q: "ما المناطق التي توصّلون إليها في سوريا؟",
    faq1A: "نوصّل حالياً في دمشق: المزة وباب توما وكفر سوسة والمناطق المجاورة. حلب وحمص مدرجتان لكن التوصيل غير متاح بعد. اختر منطقتك عند إتمام الطلب — التوصيل المتوقع خلال يومين.",
    faq2Q: "هل جميع المنتجات أصلية 100٪؟",
    faq2A: "نعم. المنتجات من مصانع سورية وعلامات موثوقة مثل الدرة وسيدي هشام وعبيدو والمرعي.",
    faq3Q: "ما هي سياسة الإرجاع لديكم؟",
    faq3A: "يمكن إرجاع المنتجات غير المفتوحة في عبوتها الأصلية خلال 7 أيام من التسليم. تواصل مع فريق الدعم لبدء عملية إرجاع أو استبدال بسهولة.",
    faq4Q: "ما طرق الدفع المتاحة؟",
    faq4A: "الدفع عبر شام كاش التجريبي (ادفع / إلغاء). لا يتم تحصيل أي مبلغ حقيقي في هذا النموذج.",
    faq5Q: "كم يستغرق التوصيل؟",
    faq5A: "التوصيل المتوقع خلال يومين داخل دمشق. حلب وحمص غير متاحتين بعد.",
    faq6Q: "كيف يعمل الاشتراك؟",
    faq6A: "ادفع 500 ل.س شهرياً عبر شام كاش لفتح أسعار المصنع. يمكنك الإلغاء في أي وقت — ينتهي الوصول بنهاية الدورة.",
    footerDesc: "اشتراك بقالة سورية بأسعار المصنع — توصيل دمشق.",
    company: "الشركة", aboutUs: "من نحن", contact: "تواصل معنا", careers: "الوظائف",
    customerService: "خدمة العملاء", faq: "الأسئلة الشائعة", shipping: "الشحن",
    returns: "الإرجاع", privacy: "سياسة الخصوصية", terms: "شروط الخدمة",
    categoriesCol: "الفئات", newsletter: "النشرة البريدية",
    newsletterSub: "اشترك لتصلك عروض التموين وأسعار المصنع.",
    emailPH: "بريدك الإلكتروني", subscribe: "اشتراك",
    paymentMethods: "طرق الدفع", downloadApp: "تحميل التطبيق",
    copyright: "© 2026 حصري. جميع الحقوق محفوظة.",
    poweredBy: "مدعوم من حصري",
    products: "المنتجات",
    allProducts: "جميع المنتجات", filters: "الفلاتر", clearAll: "مسح الكل",
    sortBy: "ترتيب حسب", sortFeatured: "المميزة", sortPriceLow: "السعر: من الأقل",
    sortPriceHigh: "السعر: من الأعلى", sortRating: "الأعلى تقييمًا", sortNewest: "الأحدث",
    priceRange: "نطاق السعر", minPrice: "الأدنى", maxPrice: "الأعلى",
    minRating: "أدنى تقييم", prescriptionOnly: "للمشتركين فقط",
    inStockOnly: "المتوفر فقط", results: "نتيجة", noProducts: "لا توجد منتجات",
    clearFilters: "مسح الفلاتر",
    brand: "العلامة التجارية", sku: "رمز المنتج", availability: "التوفر", inStock: "متوفر",
    outOfStock: "غير متوفر", qty: "الكمية", description: "الوصف",
    benefits: "لماذا تشتريه", ingredients: "المحتويات", howToUse: "التخزين والاستخدام",
    reviews: "التقييمات", writeReview: "اكتب تقييمًا", verifiedPurchase: "مشتري موثق",
    helpful: "مفيد", people: "شخص",
    prescriptionRequired: "يتطلب اشتراكاً",
    uploadPrescription: "اشترك الآن",
    prescriptionInfo: "أسعار المصنع تتطلب اشتراك حصري نشط (500 ل.س شهرياً).",
    estimatedDelivery: "التسليم المتوقع",
    deliveryToday: "خلال يومين", freeDeliveryLabel: "توصيل مجاني",
    relatedProducts: "منتجات ذات صلة",
    shareProduct: "مشاركة",
    addToWishlist: "أضف للمفضلة", removeFromWishlist: "إزالة من المفضلة",
    size: "الحجم", strength: "التركيز",
    originalPrice: "السعر الأصلي", discount: "الخصم",
    yourCart: "سلة التسوق", emptyCart: "سلتك فارغة",
    continueShopping: "مواصلة التسوق", proceedToCheckout: "إتمام الطلب",
    orderSummary: "ملخص الطلب", subtotal: "المجموع الجزئي", delivery: "التوصيل",
    deliveryFree: "مجاني", promoCode: "كود الخصم", applyCode: "تطبيق",
    invalidCode: "كود غير صحيح", codeApplied: "تم تطبيق الكود!",
    usePoints: "استخدام نقاط الولاء", pointsBalance: "رصيدك:",
    loyaltyDiscount: "خصم المكافآت", total: "الإجمالي", remove: "إزالة",
    openCartApply: "فتح السلة",
    freeShippingApplied: "تم تطبيق التوصيل المجاني",
    loginToApply: "سجّل الدخول ثم أعد المحاولة",
    exampleUrls: "أمثلة الروابط",
    condType: "النوع",
    condAudience: "الجمهور",
    condFirstOrder: "أول طلب فقط",
    condLogin: "يتطلب تسجيل دخول",
    condAuto: "تطبيق تلقائي",
    condCombinable: "قابل للدمج مع خصومات أخرى",
    condCatalog: "يحدّث أسعار كل المنتجات في الموقع",
    condUsed: "مستخدم مسبقاً (وصل للحد)",
    condProducts: "منتجات",
    condCategories: "فئات",
    condBrands: "ماركات",
    yes: "نعم",
    no: "لا",
    itemCount: "منتج", itemsCount: "منتجات",
    checkout: "إتمام الشراء", deliveryInfo: "معلومات التوصيل", paymentInfo: "الدفع",
    orderReview: "مراجعة الطلب",
    savedAddresses: "العناوين المحفوظة", addNewAddress: "إضافة عنوان جديد",
    fullName: "الاسم الكامل", phoneNumber: "رقم الهاتف", addressLine: "العنوان",
    area: "المنطقة", building: "المبنى / القطعة", floor: "الطابق", apartment: "الشقة",
    specialInstructions: "تعليمات خاصة (اختياري)",
    deliveryMethod: "طريقة التوصيل",
    expressDelivery: "توصيل سريع", expressDesc: "1–2 ساعة",
    standardDelivery: "توصيل عادي", standardDesc: "نفس اليوم بحلول 6 م",
    scheduledDelivery: "توصيل مجدول", scheduledDesc: "اختر الوقت المناسب",
    expressPrice: "مجاني للمشتركين", standardPrice: "مجاني",
    creditCard: "بطاقة ائتمانية / مدينة", knet: "شام كاش", applePay: "Apple Pay",
    cashOnDelivery: "الدفع عند الاستلام",
    cardNumber: "رقم البطاقة", expiryDate: "شهر/سنة", cvv: "CVV",
    nameOnCard: "الاسم على البطاقة",
    loyaltyPoints: "نقاط الولاء", useMyPoints: "استخدام نقاطي",
    pointsAvailable: "نقطة متاحة", pointsWorth: "بقيمة",
    placeOrder: "تأكيد الطلب", back: "رجوع", next: "متابعة",
    orderPlaced: "تم تقديم طلبك بنجاح!", orderNumber: "رقم الطلب",
    trackOrder: "تتبع الطلب",
    estDelivery: "التسليم المتوقع",
    step1: "التوصيل", step2: "الدفع", step3: "المراجعة",
    home2: "الرئيسية", listing: "المنتجات",
    prescriptionBadge: "Member",
    // Browse Staples demo
    uploadCreamRxTitle: "تصفح التموين",
    uploadCreamRxSub: "ادفع 500 ل.س شهرياً وافتح أسعار المصنع على التموين.",
    rxStepSelect: "اختر المنتجات", rxStepUpload: "رفع الاشتراك", rxStepDetails: "بياناتك", rxStepReview: "المراجعة",
    rxSelectCreams: "اختر منتجات التموين",
    rxSelectCreamsHint: "اختر منتجات التموين لاشتراكك.",
    rxHowItWorks: "كيف يعمل",
    rxHow1: "اختر خطة الاشتراك الشهري",
    rxHow2: "ادفع عبر شام كاش لتفعيل الاشتراك",
    rxHow3: "تفعيل فوري لأسعار المصنع",
    rxHow4: "استلم طلبك في دمشق",
    rxDragDrop: "اسحب الملف وأفلته هنا أو انقر للتحديد",
    rxFileTypes: "JPG, PNG, PDF — بحد أقصى 10 ميجابايت",
    rxFileUploaded: "تم تأكيد الاشتراك",
    rxRemoveFile: "إزالة الملف",
    rxDoctorName: "الاسم الكامل", rxPatientName: "رقم الهاتف",
    rxDate: "تاريخ الاشتراك", rxCivilId: "المدينة (اختياري)",
    rxReviewTitle: "مراجعة طلبك",
    rxReviewNote: "بعد الدفع عبر شام كاش يصبح اشتراكك نشطاً وأسعار المصنع متاحة فوراً.",
    rxSubmit: "تأكيد الاشتراك",
    rxSubmitted: "تم تفعيل الاشتراك!",
    rxSubmittedMsg: "تم استلام دفع الاشتراك. أسعار المصنع متاحة الآن.",
    rxRefNumber: "رقم المرجع",
    rxTrackStatus: "تتبع الحالة",
    rxSelectOneCream: "يرجى اختيار منتج واحد على الأقل",
    rxUploadRequired: "يرجى إتمام الدفع عبر شام كاش",
    rxDemoBadge: "عرض تجريبي",
    // Auth
    signIn: "تسجيل الدخول", signUp: "إنشاء حساب", orContinueWith: "أو تابع بـ",
    noAccount: "ليس لديك حساب؟", haveAccount: "لديك حساب بالفعل؟",
    forgotPassword: "نسيت كلمة المرور؟", resetPassword: "إعادة تعيين كلمة المرور",
    emailAddress: "البريد الإلكتروني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور",
    firstName: "الاسم الأول", lastName: "اسم العائلة", phoneField: "رقم الهاتف",
    agreeToTerms: "أوافق على", sendResetLink: "إرسال رابط الاسترداد",
    backToLogin: "العودة لتسجيل الدخول", checkEmail: "تحقق من بريدك الإلكتروني",
    resetSent: "أرسلنا رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.",
    showPassword: "إظهار", hidePassword: "إخفاء",
    enterMobileContinue: "أدخل رقم الجوال للمتابعة",
    encryptedSafe: "معلوماتك مشفرة ومخزنة بأمان",
    forAssistance: "للمساعدة،",
    visitHelpCenter: "زيارة مركز المساعدة",
    aromaTagline: "أسعار المصنع بين يديك",
    verifyMobileTitle: "يرجى التحقق من رقم جوالك",
    otpSentPrefix: "أدخل الرمز المكوّن من 6 أرقام الذي استلمته على",
    changeNumber: "تغيير الرقم",
    resendCode: "إعادة إرسال الرمز",
    sendCode: "إرسال الرمز",
    setNewPassword: "تعيين كلمة مرور جديدة",
    setNewPasswordDesc: "أنشئ كلمة مرور جديدة لحسابك",
    passwordUpdated: "تم تحديث كلمة المرور بنجاح",
    resetMobileDesc: "أدخل رقم جوالك وسنرسل لك رمز التحقق",
    welcomeBackAroma: "مرحبًا بعودتك إلى حصري",
    // Account general
    myAccount: "حسابي", editProfile: "تعديل الملف الشخصي", saveChanges: "حفظ التغييرات",
    signOut: "تسجيل الخروج", welcomeBack: "مرحبًا،", memberSince: "عضو منذ",
    goldTier: "عضو ذهبي", silverTier: "عضو فضي", bronzeTier: "عضو برونزي",
    verified: "موثق",
    // Dashboard
    accountOverview: "نظرة عامة على الحساب", totalOrdersLabel: "إجمالي الطلبات",
    pointsBalanceLabel: "نقاط المكافآت", activeSubsLabel: "الاشتراكات النشطة",
    savedItemsLabel: "العناصر المحفوظة", recentOrders: "الطلبات الأخيرة",
    quickActions: "إجراءات سريعة", viewAllOrders: "عرض كل الطلبات",
    // Orders
    orderHistory: "سجل الطلبات", orderDetailsTitle: "تفاصيل الطلب",
    orderNum: "رقم الطلب", orderDate: "تاريخ الطلب", orderStatusLabel: "الحالة",
    orderTotalLabel: "الإجمالي", viewDetails: "عرض التفاصيل", reorder: "إعادة الطلب",
    downloadInvoice: "تحميل الفاتورة", cancelOrder: "إلغاء الطلب",
    trackOrderBtn: "تتبع الطلب",
    statusPlaced: "تم الطلب", statusConfirmed: "مؤكد", statusPreparing: "جارٍ التحضير",
    statusShipped: "في الطريق", statusDelivered: "تم التسليم", statusCancelled: "ملغي",
    statusProcessing: "قيد المعالجة",
    deliveredTo: "تسليم إلى", paymentMethod2: "طريقة الدفع",
    // Addresses
    addressesTitle: "العناوين المحفوظة", addAddress: "إضافة عنوان", editAddress: "تعديل",
    deleteAddress: "حذف", setDefault: "تعيين كافتراضي", defaultBadge: "افتراضي",
    homeType: "المنزل", workType: "العمل", otherType: "أخرى",
    // Wishlist
    myWishlist: "قائمة المفضلة", addAllToCart: "إضافة الكل للسلة",
    emptyWishlist: "قائمة مفضلتك فارغة", browseProducts: "تصفح المنتجات",
    // Notifications
    notificationsTitle: "الإشعارات", markAllRead: "تحديد الكل كمقروء",
    allNotifs: "الكل", orderNotifs: "الطلبات", promoNotifs: "العروض",
    systemNotifs: "النظام", noNotifications: "لا توجد إشعارات بعد",
    markRead: "تحديد كمقروء",
    // Loyalty
    loyaltyTitle2: "الولاء والمكافآت", pointsBalance2: "رصيد النقاط",
    totalEarned: "إجمالي المكتسب", totalRedeemed: "إجمالي المستبدل",
    howToEarn: "كيف تكسب النقاط", redeemPoints: "استبدال النقاط",
    pointsHistoryTitle: "سجل النقاط",
    pointsExpire: "تنتهي صلاحية النقاط خلال 12 شهرًا", expiresOn: "ينتهي",
    nextTierLabel: "نقاط للمستوى التالي",
    redeemFor: "استبدال بـ", ptsNeeded: "نقطة مطلوبة",
    // Subscriptions
    subscribeAndSave: "اشترك في حصري", savePercent: "500 ل.س شهرياً — أسعار المصنع",
    chooseFrequency: "اختر التكرار", startDate: "تاريخ البدء",
    weeklyFreq: "أسبوعيًا", biweeklyFreq: "كل أسبوعين", monthlyFreq: "شهريًا",
    every2Freq: "كل شهرين", customFreq: "مخصص",
    subscribeBtn: "تأكيد والدفع عبر شام كاش", subscriptionSummary: "ملخص الاشتراك",
    subDashTitle: "اشتراكاتي", upcomingDeliveries: "التوصيلات القادمة",
    pauseSub: "إيقاف مؤقت", resumeSub: "استئناف", skipNext: "تخطي القادم",
    cancelSub: "إلغاء الاشتراك", manageSub: "إدارة",
    nextDelivery: "التوصيل القادم", subFrequency: "التكرار",
    subActive: "نشط", subPaused: "موقوف مؤقتًا", subCancelled: "ملغي",
    noSubscriptions: "لا توجد اشتراكات نشطة", createSubscription: "إنشاء اشتراك",
    subConfirm: "تم تأكيد الاشتراك!", subConfirmMsg: "اشتراكك نشط. أسعار المصنع متاحة الآن.",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // —— الرز ——
  { id: 1,  nameEn: "Sidi Hisham Aromatic Rice 5kg", nameAr: "رز سيدي هشام معطر 5 كغ", brand: "سيدي هشام", price: 8000, orig: 12000, rating: 5, reviews: 210, badge: "SALE", img: namedPlaceholder("رز سيدي هشام معطر 5 كغ", 1), category: "rice", isPrescription: false },
  { id: 2,  nameEn: "Sidi Hisham Egyptian Rice 10kg", nameAr: "رز سيدي هشام مصري 10 كغ", brand: "سيدي هشام", price: 15000, orig: 22000, rating: 5, reviews: 156, badge: "SALE", img: namedPlaceholder("رز سيدي هشام مصري 10 كغ", 2), category: "rice", isPrescription: false },
  { id: 3,  nameEn: "Al-Samir / Al-Hasani Rice 5kg", nameAr: "رز السمير / الحسني 5 كغ", brand: "السمير", price: 7500, orig: 11000, rating: 4, reviews: 98, badge: "SALE", img: namedPlaceholder("رز السمير / الحسني 5 كغ", 3), category: "rice", isPrescription: false },
  { id: 4,  nameEn: "Al-Samir Coarse Bulgur 1kg", nameAr: "برغل السمير خشن 1 كغ", brand: "السمير", price: 2500, orig: 3800, rating: 4, reviews: 64, badge: null, img: namedPlaceholder("برغل السمير خشن 1 كغ", 4), category: "rice", isPrescription: false },
  { id: 21, nameEn: "Sidi Hisham Basmati Rice 5kg", nameAr: "رز سيدي هشام بسمتي 5 كغ", brand: "سيدي هشام", price: 9500, orig: 14000, rating: 5, reviews: 120, badge: "NEW", img: namedPlaceholder("رز سيدي هشام بسمتي 5 كغ", 21), category: "rice", isPrescription: false },
  { id: 22, nameEn: "Al-Samir Freekeh 1kg", nameAr: "فريكة السمير 1 كغ", brand: "السمير", price: 4000, orig: 6000, rating: 5, reviews: 87, badge: "SALE", img: namedPlaceholder("فريكة السمير 1 كغ", 22), category: "rice", isPrescription: false },

  // —— زيت الطبخ ——
  { id: 5,  nameEn: "Al-Nasser Sunflower Oil 1.5L", nameAr: "زيت دوار الشمس — الناصر 1.5 لتر", brand: "حسين الناصر", price: 5000, orig: 7500, rating: 5, reviews: 188, badge: "SALE", img: namedPlaceholder("زيت دوار الشمس — الناصر 1.5 لتر", 5), category: "oil", isPrescription: false },
  { id: 6,  nameEn: "Al-Nasser Corn Oil 1L", nameAr: "زيت ذرة — الناصر 1 لتر", brand: "حسين الناصر", price: 4500, orig: 6500, rating: 4, reviews: 112, badge: "SALE", img: namedPlaceholder("زيت ذرة — الناصر 1 لتر", 6), category: "oil", isPrescription: false },
  { id: 23, nameEn: "Al-Nasser Sunflower Oil 3L", nameAr: "زيت دوار الشمس — الناصر 3 لتر", brand: "حسين الناصر", price: 9000, orig: 13500, rating: 5, reviews: 95, badge: "SALE", img: namedPlaceholder("زيت دوار الشمس — الناصر 3 لتر", 23), category: "oil", isPrescription: false },
  { id: 24, nameEn: "Al-Nasser Frying Oil 1.8L", nameAr: "زيت قلي — الناصر 1.8 لتر", brand: "حسين الناصر", price: 5500, orig: 8000, rating: 4, reviews: 70, badge: null, img: namedPlaceholder("زيت قلي — الناصر 1.8 لتر", 24), category: "oil", isPrescription: false },

  // —— السكر والشاي ——
  { id: 7,  nameEn: "Al-Nasser White Sugar 2kg", nameAr: "سكر الناصر أبيض 2 كغ", brand: "حسين الناصر", price: 3000, orig: 4500, rating: 5, reviews: 240, badge: "SALE", img: namedPlaceholder("سكر الناصر أبيض 2 كغ", 7), category: "sugar", isPrescription: false },
  { id: 8,  nameEn: "Al-Nasser Semolina 1kg", nameAr: "سميد الناصر 1 كغ", brand: "حسين الناصر", price: 2000, orig: null, rating: 4, reviews: 71, badge: "NEW", img: namedPlaceholder("سميد الناصر 1 كغ", 8), category: "sugar", isPrescription: false },
  { id: 9,  nameEn: "Al-Nasser / Kabous Tea 400g", nameAr: "شاي الناصر / كبوس 400 غ", brand: "حسين الناصر", price: 3500, orig: 5000, rating: 5, reviews: 133, badge: "SALE", img: namedPlaceholder("شاي الناصر / كبوس 400 غ", 9), category: "sugar", isPrescription: false },
  { id: 25, nameEn: "Al-Nasser White Sugar 5kg", nameAr: "سكر الناصر أبيض 5 كغ", brand: "حسين الناصر", price: 7000, orig: 10500, rating: 5, reviews: 160, badge: "SALE", img: namedPlaceholder("سكر الناصر أبيض 5 كغ", 25), category: "sugar", isPrescription: false },
  { id: 26, nameEn: "Kabous Black Tea 200g", nameAr: "شاي كبوس أسود 200 غ", brand: "كبوس", price: 2200, orig: 3200, rating: 4, reviews: 88, badge: null, img: namedPlaceholder("شاي كبوس أسود 200 غ", 26), category: "sugar", isPrescription: false },

  // —— السمن والألبان ——
  { id: 10, nameEn: "Al-Marai Butter 200g", nameAr: "زبدة المراعي 200 غ", brand: "المراعي", price: 4000, orig: 6000, rating: 5, reviews: 301, badge: "SALE", img: namedPlaceholder("زبدة المراعي 200 غ", 10), category: "ghee", isPrescription: false },
  { id: 11, nameEn: "Al-Marai Cream 170g", nameAr: "قشطة المراعي 170 غ", brand: "المراعي", price: 2500, orig: 3800, rating: 4, reviews: 145, badge: null, img: namedPlaceholder("قشطة المراعي 170 غ", 11), category: "ghee", isPrescription: false },
  { id: 12, nameEn: "Traditional Baladi Ghee 1kg", nameAr: "سمن بلدي تقليدي 1 كغ", brand: "سمن بلدي", price: 11000, orig: 16000, rating: 5, reviews: 89, badge: "SALE", img: namedPlaceholder("سمن بلدي تقليدي 1 كغ", 12), category: "ghee", isPrescription: false },
  { id: 27, nameEn: "Baladi Ghee 500g", nameAr: "سمن بلدي 500 غ", brand: "سمن بلدي", price: 6000, orig: 9000, rating: 4, reviews: 55, badge: "NEW", img: namedPlaceholder("سمن بلدي 500 غ", 27), category: "ghee", isPrescription: false },

  // —— بقوليات وتوابل ——
  { id: 13, nameEn: "Sidi Hisham Lentils 1kg", nameAr: "عدس سيدي هشام 1 كغ", brand: "سيدي هشام", price: 2200, orig: 3500, rating: 4, reviews: 77, badge: null, img: namedPlaceholder("عدس سيدي هشام 1 كغ", 13), category: "vegetables", isPrescription: false },
  { id: 14, nameEn: "Sidi Hisham Chickpeas 1kg", nameAr: "حمص حب سيدي هشام 1 كغ", brand: "سيدي هشام", price: 2800, orig: 4000, rating: 4, reviews: 92, badge: "NEW", img: namedPlaceholder("حمص حب سيدي هشام 1 كغ", 14), category: "vegetables", isPrescription: false },
  { id: 15, nameEn: "Abido Za'atar Blend 400g", nameAr: "زعتر أبيدو 400 غ", brand: "أبيدو", price: 3000, orig: 4500, rating: 5, reviews: 168, badge: "SALE", img: namedPlaceholder("زعتر أبيدو 400 غ", 15), category: "vegetables", isPrescription: false },
  { id: 16, nameEn: "Abido Mixed Spices 200g", nameAr: "بهارات أبيدو مشكلة 200 غ", brand: "أبيدو", price: 2000, orig: 3200, rating: 4, reviews: 54, badge: null, img: namedPlaceholder("بهارات أبيدو مشكلة 200 غ", 16), category: "vegetables", isPrescription: false },
  { id: 28, nameEn: "Abido Seven Spices 50g", nameAr: "بهارات أبيدو سبعة بهارات 50 غ", brand: "أبيدو", price: 1200, orig: 1800, rating: 5, reviews: 200, badge: "SALE", img: namedPlaceholder("بهارات أبيدو سبعة بهارات 50 غ", 28), category: "vegetables", isPrescription: false },
  { id: 29, nameEn: "Sidi Hisham White Beans 1kg", nameAr: "فاصوليا بيضاء سيدي هشام 1 كغ", brand: "سيدي هشام", price: 2600, orig: 3900, rating: 4, reviews: 60, badge: null, img: namedPlaceholder("فاصوليا بيضاء سيدي هشام 1 كغ", 29), category: "vegetables", isPrescription: false },

  // —— المعلبات ——
  { id: 17, nameEn: "Al-Durra Foul Medames 400g", nameAr: "فول مدمس الدرة 400 غ", brand: "الدرة", price: 1200, orig: 2000, rating: 5, reviews: 220, badge: "SALE", img: namedPlaceholder("فول مدمس الدرة 400 غ", 17), category: "canned", isPrescription: false },
  { id: 18, nameEn: "Al-Durra Hummus Tahini 380g", nameAr: "حمص بالطحينة الدرة 380 غ", brand: "الدرة", price: 1800, orig: 2800, rating: 5, reviews: 190, badge: "SALE", img: namedPlaceholder("حمص بالطحينة الدرة 380 غ", 18), category: "canned", isPrescription: false },
  { id: 19, nameEn: "Hana Chicken Mortadella 200g", nameAr: "مرتديلا هنا دجاج بالزيتون 200 غ", brand: "هنا", price: 2200, orig: 3500, rating: 4, reviews: 101, badge: "NEW", img: namedPlaceholder("مرتديلا هنا دجاج بالزيتون 200 غ", 19), category: "canned", isPrescription: false },
  { id: 20, nameEn: "Al-Gota Apricot Jam 450g", nameAr: "مربى مشمش الغوطة 450 غ", brand: "الغوطة", price: 2200, orig: 3500, rating: 5, reviews: 143, badge: "SALE", img: namedPlaceholder("مربى مشمش الغوطة 450 غ", 20), category: "canned", isPrescription: false },
  { id: 30, nameEn: "Al-Durra Tahini 400g", nameAr: "طحينة الدرة 400 غ", brand: "الدرة", price: 2500, orig: 3800, rating: 5, reviews: 175, badge: "SALE", img: namedPlaceholder("طحينة الدرة 400 غ", 30), category: "canned", isPrescription: false },
  { id: 31, nameEn: "Al-Durra Pickled Cucumber 600g", nameAr: "مخلل خيار الدرة 600 غ", brand: "الدرة", price: 1500, orig: 2400, rating: 4, reviews: 110, badge: null, img: namedPlaceholder("مخلل خيار الدرة 600 غ", 31), category: "canned", isPrescription: false },
  { id: 32, nameEn: "Hana Beef Mortadella Pistachio 200g", nameAr: "مرتديلا هنا بقري بالفستق 200 غ", brand: "هنا", price: 2800, orig: 4200, rating: 5, reviews: 90, badge: "NEW", img: namedPlaceholder("مرتديلا هنا بقري بالفستق 200 غ", 32), category: "canned", isPrescription: false },
  { id: 33, nameEn: "Al-Raii Mortadella 200g", nameAr: "مرتديلا الراعي 200 غ", brand: "الراعي", price: 2000, orig: 3200, rating: 4, reviews: 80, badge: null, img: namedPlaceholder("مرتديلا الراعي 200 غ", 33), category: "canned", isPrescription: false },
  { id: 34, nameEn: "Al-Gota Pomegranate Molasses 500g", nameAr: "دبس رمان الغوطة 500 غ", brand: "الغوطة", price: 3000, orig: 4500, rating: 5, reviews: 130, badge: "SALE", img: namedPlaceholder("دبس رمان الغوطة 500 غ", 34), category: "canned", isPrescription: false },
];

const CREAM_RX_PRODUCTS: Product[] = [];

const HERO_SLIDES = [
  { bg: "from-[#063e38] to-[#0a5c52]", badgeEn: "🌾 Factory Prices", badgeAr: "🌾 أسعار المصنع", titleEn: "Save up to 40%", titleAr: "وفّر حتى 40٪", subEn: "Subscribe for 500 SYP/month and shop staples at factory prices.", subAr: "اشترك بـ 500 ل.س شهرياً واشترِ التموين بأسعار المصنع.", img: namedPlaceholder("رز", 0), cta: "shopNow", accent: "#c9a85c" },
  { bg: "from-[#7c2d12] to-[#c2410c]", badgeEn: "🛢️ Cooking Essentials", badgeAr: "🛢️ أساسيات الطبخ", titleEn: "Oil, Rice & Sugar Deals", titleAr: "عروض الزيت والرز والسكر", subEn: "Stock your pantry with exclusive member pricing in Damascus.", subAr: "جهّز مطبخك بأسعار المشتركين الحصرية في دمشق.", img: namedPlaceholder("زيت", 1), cta: "shopNow", accent: "#fdba74" },
  { bg: "from-[#14532d] to-[#1a6b3e]", badgeEn: "📦 Monthly Subscription", badgeAr: "📦 اشتراك شهري", titleEn: "500 SYP / month", titleAr: "500 ل.س / شهر", subEn: "Unlock factory prices on rice, oil, ghee, canned goods & more.", subAr: "افتح أسعار المصنع على الرز والزيت والسمن والمعلبات وأكثر.", img: namedPlaceholder("تموين", 2), cta: "shopNow", accent: "#86efac" },
];

const QUICK_SERVICES: {
  id: string;
  labelKey: string;
  page: Page;
  badgeKey?: string;
  badgeTone?: "red" | "green" | "gold";
}[] = [
  { id: "subscribe", labelKey: "qsSubscribe",       page: "subscription", badgeKey: "qsBadgeSave10", badgeTone: "gold" },
  { id: "offers",    labelKey: "qsOffers",          page: "listing",      badgeKey: "qsBadge50",     badgeTone: "red" },
  { id: "rx",        labelKey: "qsUploadRx",        page: "listing" },
  { id: "delivery",  labelKey: "qsDelivery",        page: "listing" },
  { id: "today",     labelKey: "todayOffers",       page: "listing" },
  { id: "rewards",   labelKey: "qsLoyaltyRewards",  page: "listing" },
];

function QuickServiceIllustration({ id }: { id: string }) {
  const base = "w-full h-full";
  switch (id) {
    case "offers":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <defs>
            <linearGradient id="qs-tag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M14 18h28l12 14-12 14H14V18z" fill="url(#qs-tag)" />
          <circle cx="22" cy="32" r="7" fill="#fff" opacity=".95" />
          <text x="22" y="35.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#059669">%</text>
        </svg>
      );
    case "pharmacy":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <path d="M18 24h28c2 0 4 2 4 4v18c0 2-2 4-4 4H18c-2 0-4-2-4-4V28c0-2 2-4 4-4z" fill="#10b981" />
          <path d="M22 20h20l-2 4H24l-2-4z" fill="#059669" />
          <rect x="24" y="30" width="6" height="14" rx="2" fill="#fff" opacity=".9" />
          <rect x="34" y="28" width="6" height="16" rx="2" fill="#fde68a" />
          <rect x="28" y="34" width="8" height="10" rx="2" fill="#fda4af" />
        </svg>
      );
    case "rx":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <rect x="16" y="12" width="30" height="40" rx="4" fill="#10b981" />
          <rect x="20" y="16" width="22" height="32" rx="2" fill="#fff" />
          <text x="31" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b7a6e">Rx</text>
          <circle cx="46" cy="42" r="7" fill="#60a5fa" />
          <circle cx="46" cy="42" r="4" fill="#fff" />
          <circle cx="50" cy="48" r="5" fill="#f472b6" />
          <circle cx="50" cy="48" r="2.5" fill="#fff" />
        </svg>
      );
    case "subscribe":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <circle cx="32" cy="32" r="18" fill="none" stroke="#10b981" strokeWidth="5" />
          <path d="M32 18v8l6 4" fill="none" stroke="#c9a85c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M46 32h-8l-4 6" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "express":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <defs>
            <linearGradient id="qs-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M36 10 20 36h12l-4 18 20-28H36l4-16z" fill="url(#qs-bolt)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "concern":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <circle cx="32" cy="32" r="20" fill="#fecaca" />
          <circle cx="32" cy="32" r="14" fill="#fff" />
          <circle cx="32" cy="32" r="8" fill="#ef4444" />
          <circle cx="32" cy="32" r="3" fill="#fff" />
          <path d="M42 18l4 6-10 4" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <polygon points="46,16 50,22 42,22" fill="#2563eb" />
        </svg>
      );
    case "mother":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <rect x="24" y="16" width="16" height="34" rx="8" fill="#fda4af" />
          <rect x="26" y="18" width="12" height="24" rx="6" fill="#fff" opacity=".85" />
          <rect x="22" y="12" width="20" height="8" rx="4" fill="#fbbf24" />
          <circle cx="32" cy="14" r="3" fill="#f59e0b" />
        </svg>
      );
    case "rewards":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <defs>
            <linearGradient id="qs-trophy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" /><stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path d="M22 18h20v8c0 8-4.5 14-10 16-5.5-2-10-8-10-16v-8z" fill="url(#qs-trophy)" />
          <path d="M22 20H14c0 6 3 10 8 12M42 20h8c0 6-3 10-8 12" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          <rect x="24" y="44" width="16" height="5" rx="2" fill="#b45309" />
          <rect x="20" y="49" width="24" height="5" rx="2" fill="#92400e" />
        </svg>
      );
    case "delivery":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <defs>
            <linearGradient id="qs-bolt-d" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M36 10 20 36h12l-4 18 20-28H36l4-16z" fill="url(#qs-bolt-d)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "today":
      return (
        <svg viewBox="0 0 64 64" className={base} aria-hidden>
          <rect x="14" y="16" width="36" height="34" rx="5" fill="#10b981" />
          <rect x="14" y="16" width="36" height="10" rx="5" fill="#059669" />
          <rect x="22" y="10" width="4" height="10" rx="2" fill="#6b7280" />
          <rect x="38" y="10" width="4" height="10" rx="2" fill="#6b7280" />
          <circle cx="24" cy="36" r="3" fill="#fff" />
          <circle cx="32" cy="36" r="3" fill="#fff" />
          <circle cx="40" cy="36" r="3" fill="#fde68a" />
          <circle cx="24" cy="44" r="3" fill="#fff" opacity=".6" />
          <circle cx="32" cy="44" r="3" fill="#fff" opacity=".6" />
        </svg>
      );
    default:
      return null;
  }
}

const TOP_CATEGORIES: {
  id: string;
  labelKey: string;
  kind: "graphic" | "image";
  graphic?: "prime" | "new" | "deals";
  img?: string;
}[] = [
  { id: "prime-picks",   labelKey: "primePicks",        kind: "graphic", graphic: "prime" },
  { id: "rice",          labelKey: "beauty",            kind: "image",   img: namedPlaceholder("رز", 0) },
  { id: "oil",           labelKey: "hairCare",          kind: "image",   img: namedPlaceholder("زيت", 1) },
  { id: "new-arrival",   labelKey: "newArrival",        kind: "graphic", graphic: "new" },
  { id: "sugar",         labelKey: "supplements",       kind: "image",   img: namedPlaceholder("سكر", 0) },
  { id: "ghee",          labelKey: "kBeauty",           kind: "image",   img: namedPlaceholder("سمن", 1) },
  { id: "top-deals",     labelKey: "topDeals",          kind: "graphic", graphic: "deals" },
  { id: "canned",        labelKey: "medicalEssentials", kind: "image",   img: namedPlaceholder("معلبات", 0) },
];

interface BrandedTextBanner {
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  bgClass: string;
  titleClass: string;
  subtitleClass?: string;
}

const SECTION_ONE_PROMO_SLIDES: BrandedTextBanner[] = [
  {
    titleEn: "Factory prices for every Syrian family",
    titleAr: "أسعار المصنع لكل عائلة سورية",
    subtitleEn: "Rice, oil, sugar, ghee & canned goods — delivered in Damascus",
    subtitleAr: "رز وزيت وسكر وسمن ومعلبات — توصيل في دمشق",
    bgClass: "bg-gradient-to-r from-[#063e38] via-[#0a5c52] to-[#0b7a6e]",
    titleClass: "text-white",
    subtitleClass: "text-white/90",
  },
  {
    titleEn: "Subscribe · 500 SYP/month · Sham Cash",
    titleAr: "اشترك · 500 ل.س شهرياً · شام كاش",
    subtitleEn: "Pay with Sham Cash mock — unlock member factory prices",
    subtitleAr: "ادفع عبر شام كاش التجريبي — وافتح أسعار المصنع للمشتركين",
    bgClass: "bg-gradient-to-r from-[#0b7a6e] to-[#063e38]",
    titleClass: "text-white",
    subtitleClass: "text-[#c9a85c]",
  },
];

const SECTION_ONE_STATIC_BANNER: BrandedTextBanner = {
  titleEn: "Featured Syrian Brands at حصري",
  titleAr: "علامات سورية مميزة لدى حصري",
  subtitleEn: "Al-Durra · Abido · Sidi Hisham · Al-Marai · Al-Nasser · Al-Gota",
  subtitleAr: "الدرة · أبيدو · سيدي هشام · المراعي · الناصر · الغوطة",
  bgClass: "bg-gradient-to-br from-[#fdf8ee] via-[#f3e4c4] to-[#e8f5f3]",
  titleClass: "text-[#063e38]",
  subtitleClass: "text-[#0b7a6e]",
};

const SECTION_ONE_STATIC_BANNER_TWO: BrandedTextBanner = {
  titleEn: "Subscribe for 500 SYP/month",
  titleAr: "اشترك بـ 500 ل.س شهرياً",
  subtitleEn: "Unlock factory prices on pantry staples — never overpay again",
  subtitleAr: "افتح أسعار المصنع على أساسيات التموين — لا تدفع أكثر",
  bgClass: "bg-gradient-to-r from-[#063e38] to-[#0b7a6e]",
  titleClass: "text-white",
  subtitleClass: "text-[#c9a85c]",
};

const BEAUTY_CATEGORY_TILE_BG = "#fce8ec";
const NUTRITION_TILE_TOP_BG = "#fce8ec";
const NUTRITION_TILE_BOTTOM_BG = "#faf7f4";
const MOM_BABY_TILE_TOP_BG = "#f5d5b9";
const MOM_BABY_TILE_BOTTOM_BG = "#faf7f4";
const CATEGORY_PROMO_BANNER_HEIGHT = 160;

const EXPLORE_BEAUTY_CATEGORIES: { en: string; ar: string; img: string }[] = [
  { en: "Rice", ar: "الرز", img: namedPlaceholder("رز", 0) },
  { en: "Cooking Oil", ar: "زيت الطبخ", img: namedPlaceholder("زيت الطبخ", 3) },
  { en: "Sugar & Tea", ar: "السكر والشاي", img: namedPlaceholder("السكر والشاي", 1) },
  { en: "Ghee & Dairy", ar: "السمن والألبان", img: namedPlaceholder("السمن والألبان", 4) },
  { en: "Legumes & Spices", ar: "بقوليات وتوابل", img: namedPlaceholder("بقوليات وتوابل", 1) },
  { en: "Canned Goods", ar: "المعلبات", img: namedPlaceholder("المعلبات", 3) },
  { en: "Bulgur & Freekeh", ar: "برغل وفريكة", img: namedPlaceholder("برغل وفريكة", 0) },
  { en: "Member Deals", ar: "عروض المشتركين", img: namedPlaceholder("تموين", 1) },
];

const NUTRITION_GUIDE_CATEGORIES: { en: string; ar: string; img1: string; img2: string }[] = [
  { en: "Rice & Grains", ar: "الرز والحبوب", img1: namedPlaceholder("الرز والحبوب", 0), img2: namedPlaceholder("الرز والحبوب", 1) },
  { en: "Cooking Oils", ar: "زيوت الطبخ", img1: namedPlaceholder("زيوت الطبخ", 1), img2: namedPlaceholder("زيوت الطبخ", 2) },
  { en: "Sugar & Tea", ar: "السكر والشاي", img1: namedPlaceholder("السكر والشاي", 1), img2: namedPlaceholder("السكر والشاي", 2) },
  { en: "Ghee & Dairy", ar: "السمن والألبان", img1: namedPlaceholder("السمن والألبان", 4), img2: namedPlaceholder("السمن والألبان", 5) },
  { en: "Legumes", ar: "البقوليات", img1: namedPlaceholder("البقوليات", 4), img2: namedPlaceholder("البقوليات", 5) },
  { en: "Spices", ar: "التوابل", img1: namedPlaceholder("التوابل", 0), img2: namedPlaceholder("التوابل", 1) },
  { en: "Canned Foods", ar: "المعلبات", img1: namedPlaceholder("المعلبات", 3), img2: namedPlaceholder("المعلبات", 4) },
  { en: "Jams & Spreads", ar: "مربى ومعلبات حلوة", img1: namedPlaceholder("مربى ومعلبات حلوة", 5), img2: namedPlaceholder("مربى ومعلبات حلوة", 6) },
];

const MOM_BABY_CATEGORIES: { en: string; ar: string; img1: string; img2: string }[] = [
  { en: "Bulgur", ar: "برغل", img1: namedPlaceholder("برغل", 6), img2: namedPlaceholder("برغل", 7) },
  { en: "Freekeh", ar: "فريكة", img1: namedPlaceholder("فريكة", 6), img2: namedPlaceholder("فريكة", 7) },
  { en: "Lentils", ar: "عدس", img1: namedPlaceholder("عدس", 2), img2: namedPlaceholder("عدس", 3) },
  { en: "Chickpeas", ar: "حمص حب", img1: namedPlaceholder("حمص حب", 3), img2: namedPlaceholder("حمص حب", 4) },
  { en: "Za'atar", ar: "زعتر", img1: namedPlaceholder("زعتر", 3), img2: namedPlaceholder("زعتر", 4) },
  { en: "Spices", ar: "بهارات", img1: namedPlaceholder("بهارات", 7), img2: namedPlaceholder("بهارات", 8) },
  { en: "Rice", ar: "رز", img1: namedPlaceholder("رز", 0), img2: namedPlaceholder("رز", 1) },
  { en: "Semolina", ar: "سميد", img1: namedPlaceholder("سميد", 5), img2: namedPlaceholder("سميد", 6) },
];

interface DealCarouselItem {
  product: Product;
  categoryKey: string;
  titleEn: string;
  titleAr: string;
}

const SECTION_ONE_BOGO_DEALS: DealCarouselItem[] = [
  { product: PRODUCTS[0], categoryKey: "catSkincareBeauty", titleEn: "Buy 1 Get 1 Sidi Hisham Aromatic Rice 5kg", titleAr: "اشترِ 1 واحصل على 1 رز سيدي هشام معطر 5 كغ" },
  { product: PRODUCTS[4], categoryKey: "catVitaminsSupps", titleEn: "Buy 1 Get 1 Al-Nasser Sunflower Oil 1.5L", titleAr: "اشترِ 1 واحصل على 1 زيت دوار الشمس — الناصر" },
  { product: PRODUCTS[6], categoryKey: "catVitaminsSupps", titleEn: "Buy 1 Get 1 Al-Nasser White Sugar 2kg", titleAr: "اشترِ 1 واحصل على 1 سكر الناصر أبيض 2 كغ" },
  { product: PRODUCTS[9], categoryKey: "catWellnessBundle", titleEn: "Buy 1 Get 1 Al-Marai Butter 200g", titleAr: "اشترِ 1 واحصل على 1 زبدة المراعي 200 غ" },
  { product: PRODUCTS[16], categoryKey: "catPersonalCare", titleEn: "Buy 1 Get 1 Al-Durra Foul Medames 400g", titleAr: "اشترِ 1 واحصل على 1 فول مدمس الدرة" },
];

const SECTION_ONE_LIMITED_DEALS: DealCarouselItem[] = [
  { product: PRODUCTS[1], categoryKey: "catSkincareBeauty", titleEn: "Sidi Hisham Egyptian Rice 10kg", titleAr: "رز سيدي هشام مصري 10 كغ" },
  { product: PRODUCTS[5], categoryKey: "catSkincareBeauty", titleEn: "Al-Nasser Corn Oil 1L", titleAr: "زيت ذرة — الناصر 1 لتر" },
  { product: PRODUCTS[11], categoryKey: "catSkincareBeauty", titleEn: "Traditional Baladi Ghee 1kg", titleAr: "سمن بلدي تقليدي 1 كغ" },
  { product: PRODUCTS[14], categoryKey: "catPersonalCare", titleEn: "Abido Za'atar Blend 400g", titleAr: "زعتر أبيدو 400 غ" },
  { product: PRODUCTS[17], categoryKey: "catEnergyBoost", titleEn: "Al-Durra Hummus Tahini 380g", titleAr: "حمص بالطحينة الدرة 380 غ" },
  { product: PRODUCTS[19], categoryKey: "catWellnessBundle", titleEn: "Al-Gota Apricot Jam 450g", titleAr: "مربى مشمش الغوطة 450 غ" },
];

function DealCarouselCard({ item, lang }: { item: DealCarouselItem; lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const p = item.product;
  const isAr = lang === "ar";

  return (
    <button
      type="button"
      onClick={() => goTo("product", p)}
      className="deal-card-scroll bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-start overflow-hidden"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <ImageWithFallback
          src={p.img}
          alt={isAr ? item.titleAr : item.titleEn}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-2.5 sm:p-3">
        <p className="text-[9px] sm:text-[10px] font-bold text-[#0b7a6e] uppercase tracking-wide mb-1 leading-tight">
          {t[item.categoryKey]}
        </p>
        <p className="text-[11px] sm:text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
          {isAr ? item.titleAr : item.titleEn}
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <ProductPriceDisplay product={p} lang={lang} size="sm" />
        </div>
      </div>
    </button>
  );
}

function DealCarouselSection({
  lang,
  titleKey,
  items,
  variant,
}: {
  lang: Lang;
  titleKey: string;
  items: DealCarouselItem[];
  variant: "bogo" | "limited";
}) {
  const t = T[lang];
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";
  const isLimited = variant === "limited";

  const scroll = (dir: "l" | "r") => {
    const amount = dir === "l" ? -280 : 280;
    scrollRef.current?.scrollBy({ left: isAr ? -amount : amount, behavior: "smooth" });
  };

  const sectionClass = isLimited
    ? "bg-gradient-to-r from-[#063e38] via-[#0a5c52] to-[#0b7a6e]"
    : "bg-gradient-to-br from-[#fdf8ee] via-[#f3e4c4] to-[#e8f5f3]";

  return (
    <section className={`relative overflow-hidden py-5 sm:py-6 ${sectionClass}`}>
      {isLimited ? (
        <>
          <div className="pointer-events-none absolute -top-14 end-1/4 w-56 h-56 rounded-full bg-[#c9a85c]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -end-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute top-1/2 -start-10 w-32 h-32 rounded-full bg-[#c9a85c]/10 blur-2xl" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -top-10 -end-6 w-44 h-44 rounded-full bg-[#c9a85c]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -start-8 w-52 h-52 rounded-full bg-[#0b7a6e]/12 blur-3xl" />
        </>
      )}
      <div className="relative z-10 section-container">
        <div className="flex items-center gap-2.5 mb-4">
          <span className={`block w-1 h-6 rounded-full shrink-0 ${isLimited ? "bg-[#c9a85c]" : "bg-[#0b7a6e]"}`} />
          <h2
            className={`text-sm sm:text-base font-bold leading-snug ${isLimited ? "text-white" : "text-[#063e38]"}`}
            style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
          >
            {t[titleKey]}
          </h2>
        </div>
        <div className="relative group/deals">
          <button
            type="button"
            onClick={() => scroll("l")}
            aria-label={isAr ? "التمرير لليمين" : "Scroll left"}
            className={`hidden sm:flex absolute -start-3 top-[42%] -translate-y-1/2 z-10 w-9 h-9 rounded-full shadow-lg border items-center justify-center opacity-0 group-hover/deals:opacity-100 transition-opacity ${
              isLimited
                ? "bg-white/95 border-white/40 text-[#063e38] hover:bg-[#c9a85c] hover:text-white hover:border-[#c9a85c]"
                : "bg-white border-gray-100 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e]"
            }`}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <div
            ref={scrollRef}
            dir={isAr ? "rtl" : "ltr"}
            className="flex gap-3 sm:gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth pe-10 sm:pe-12 snap-x snap-mandatory"
          >
            {items.map(item => (
              <DealCarouselCard key={`${titleKey}-${item.product.id}`} item={item} lang={lang} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("r")}
            aria-label={isAr ? "التمرير لليسار" : "Scroll right"}
            className={`absolute end-0 top-[42%] -translate-y-1/2 z-10 w-9 h-9 rounded-full shadow-lg border flex items-center justify-center transition-colors ${
              isLimited
                ? "bg-white/95 border-white/40 text-[#063e38] hover:bg-[#c9a85c] hover:text-white hover:border-[#c9a85c]"
                : "bg-white border-gray-100 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e]"
            }`}
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}

function BrandedTextBannerContent({
  banner,
  lang,
  compact = false,
}: {
  banner: BrandedTextBanner;
  lang: Lang;
  compact?: boolean;
}) {
  const isAr = lang === "ar";
  const title = isAr ? banner.titleAr : banner.titleEn;
  const subtitle = isAr ? banner.subtitleAr : banner.subtitleEn;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center px-6 text-center ${banner.bgClass}`}
      style={{ fontFamily: isAr ? "Cairo,sans-serif" : "inherit" }}
    >
      <h3
        className={`font-bold leading-tight ${banner.titleClass} ${
          compact ? "text-lg sm:text-xl md:text-2xl" : "text-xl sm:text-2xl md:text-3xl"
        }`}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          className={`mt-2 max-w-3xl leading-snug ${banner.subtitleClass ?? "text-white/90"} ${
            compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SectionOnePromoSlider({ lang }: { lang: Lang }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SECTION_ONE_PROMO_SLIDES.length;

  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setCur(c => (c + 1) % n), 5000);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <div
      className="mt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl h-[160px]">
        {SECTION_ONE_PROMO_SLIDES.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === cur ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <BrandedTextBannerContent banner={banner} lang={lang} compact />
          </div>
        ))}
        {n > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {SECTION_ONE_PROMO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCur(i)}
                aria-label={lang === "ar" ? `الشريحة ${i + 1}` : `Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === cur ? "w-4 bg-[#0b7a6e]" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionOneStaticBanner({
  lang,
  banner = SECTION_ONE_STATIC_BANNER,
  height = 350,
  className = "mt-3",
}: {
  lang: Lang;
  banner?: BrandedTextBanner;
  height?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl" style={{ height: `${height}px` }}>
        <BrandedTextBannerContent banner={banner} lang={lang} />
      </div>
    </div>
  );
}

/** New Syrian independence flag: green / white / black with three red stars. */
function SyriaFlagIllustration({ className = "h-full w-auto drop-shadow-md" }: { className?: string }) {
  const star = (cx: number, cy: number, r = 5.2) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
      const b = a + Math.PI / 5;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      pts.push(`${cx + r * 0.38 * Math.cos(b)},${cy + r * 0.38 * Math.sin(b)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden>
      <defs>
        <linearGradient id="syria-flag-wave" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".12" />
          <stop offset="100%" stopColor="#000000" stopOpacity=".08" />
        </linearGradient>
        <clipPath id="syria-flag-clip">
          <rect x="10" y="8" width="100" height="64" rx="3" />
        </clipPath>
      </defs>
      <path d="M8 6h104c2 0 4 2 4 4v60c0 2-2 4-4 4H8c-2 0-4-2-4-4V10c0-2 2-4 4-4z" fill="#fff" opacity=".08" />
      <g clipPath="url(#syria-flag-clip)">
        <rect x="10" y="8" width="100" height="21.33" fill="#007a3d" />
        <rect x="10" y="29.33" width="100" height="21.34" fill="#fff" />
        <rect x="10" y="50.67" width="100" height="21.33" fill="#000" />
        <polygon points={star(40, 40)} fill="#ce1126" />
        <polygon points={star(60, 40)} fill="#ce1126" />
        <polygon points={star(80, 40)} fill="#ce1126" />
      </g>
      <path d="M10 8 L118 8 Q122 40 118 72 L10 72 Q6 40 10 8Z" fill="url(#syria-flag-wave)" />
    </svg>
  );
}

function SyriaFlagBadge({ className = "w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm ring-1 ring-black/10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 14" className={className} aria-hidden>
      <rect width="21" height="4.67" y="0" fill="#007a3d" />
      <rect width="21" height="4.66" y="4.67" fill="#fff" />
      <rect width="21" height="4.67" y="9.33" fill="#000" />
      {[7, 10.5, 14].map((cx) => {
        const cy = 7;
        const r = 1.35;
        const pts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const a = (-Math.PI / 2) + (i * 2 * Math.PI) / 5;
          const b = a + Math.PI / 5;
          pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
          pts.push(`${cx + r * 0.38 * Math.cos(b)},${cy + r * 0.38 * Math.sin(b)}`);
        }
        return <polygon key={cx} points={pts.join(" ")} fill="#ce1126" />;
      })}
    </svg>
  );
}

function TopCategoryGraphic({ type }: { type: "prime" | "new" | "deals" }) {
  if (type === "prime") {
    return (
      <svg viewBox="0 0 120 80" className="w-[72%] h-[72%] object-contain" aria-hidden>
        <path d="M18 52 L62 18 L104 52 Z" fill="#063e38" />
        <path d="M28 52 L62 26 L96 52 Z" fill="#c9a85c" />
        <text x="62" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" transform="rotate(-18 62 40)">PRIME</text>
        <text x="62" y="54" textAnchor="middle" fontSize="10" fontWeight="900" fill="#063e38" transform="rotate(-18 62 54)">PICKS</text>
      </svg>
    );
  }
  if (type === "new") {
    return (
      <svg viewBox="0 0 120 80" className="w-[72%] h-[72%] object-contain" aria-hidden>
        <path d="M16 54 L60 20 L104 54 Z" fill="#063e38" />
        <text x="60" y="38" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c9a85c" transform="rotate(-16 60 38)">NEW</text>
        <text x="60" y="52" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" transform="rotate(-16 60 52)">ARRIVAL</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 80" className="w-[72%] h-[72%] object-contain" aria-hidden>
      <path d="M18 52 L62 18 L104 52 Z" fill="#0b7a6e" />
      <path d="M30 52 L62 28 L94 52 Z" fill="#fff" />
      <text x="62" y="40" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" transform="rotate(-18 62 40)">TOP</text>
      <text x="62" y="54" textAnchor="middle" fontSize="10" fontWeight="900" fill="#063e38" transform="rotate(-18 62 54)">DEALS</text>
    </svg>
  );
}

function NationAndTopCategoriesSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";

  return (
    <>
    <section className="bg-white pb-8">
      <div className="section-container">
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#063e38] to-[#0a5c52] flex items-center min-h-[72px] sm:min-h-[88px]"
        >
          <div className="flex-shrink-0 h-[72px] sm:h-[88px] ps-3 sm:ps-5 pe-2">
            <SyriaFlagIllustration />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-3 py-3">
            <p className="text-white text-sm sm:text-lg font-semibold tracking-wide leading-snug" style={{ fontFamily: isAr ? "Cairo,sans-serif" : "inherit" }}>
              {t.oneNationTitle}
            </p>
            {!isAr && (
              <p className="text-[#c9a85c] text-xs sm:text-base mt-0.5" style={{ fontFamily: "Cairo,sans-serif" }}>
                وطن واحد. شعب واحد.
              </p>
            )}
          </div>
          <div className="hidden sm:block w-[88px] flex-shrink-0" aria-hidden />
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="block w-1 h-6 rounded-full bg-[#0b7a6e] shrink-0" />
            <h2
              className="text-base sm:text-lg font-bold text-[#063e38]"
              style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
            >
              {t.topCategories}
            </h2>
          </div>
          {TOP_CATEGORIES.length > CATEGORY_ROW_COUNT && (
            <button
              type="button"
              onClick={() => goTo("listing")}
              className="flex-none text-xs sm:text-sm font-semibold text-[#0b7a6e] hover:underline flex items-center gap-1"
            >
              {t.viewAll}
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        <div className={CATEGORY_TILE_GRID}>
          {TOP_CATEGORIES.slice(0, CATEGORY_ROW_COUNT).map(({ id, labelKey, kind, graphic, img }) => (
            <button
              key={id}
              onClick={() => goTo("listing")}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[1.05/1] rounded-xl bg-[#e8f5f3] overflow-hidden border border-[#0b7a6e]/10 group-hover:shadow-md group-hover:border-[#0b7a6e]/25 group-active:scale-[0.98] transition-all duration-150">
                {kind === "image" ? (
                  <ImageWithFallback
                    src={img}
                    alt={t[labelKey]}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] h-[52%] bg-[#0b7a6e]/15 rounded-t-[999px]" />
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-2 sm:p-3">
                      {graphic && <TopCategoryGraphic type={graphic} />}
                    </div>
                  </>
                )}
              </div>
              <span className="mt-2 text-[12px] font-medium text-[#063e38] leading-tight px-0.5 line-clamp-2 group-hover:text-[#0b7a6e] transition-colors">
                {t[labelKey]}
              </span>
            </button>
          ))}
        </div>

        <SectionOnePromoSlider lang={lang} />
      </div>
    </section>
    </>
  );
}

const BRAND_COLORS = ["#e8f5f3","#eef0ff","#fff8e8","#f0faf0","#fff0f3","#fdf0ff","#e8f5f3","#fef9e8","#f0faf0","#fff5e8"];

const TOP_BRANDS: { name: string; domain: string }[] = [
  { name: "الدرة", domain: "aldurra.com" },
  { name: "أبيدو", domain: "abido.com" },
  { name: "سيدي هشام", domain: "example.com" },
  { name: "المراعي", domain: "almarai.com" },
  { name: "حسين الناصر", domain: "example.com" },
  { name: "الغوطة", domain: "example.com" },
  { name: "هنا", domain: "example.com" },
  { name: "الراعي", domain: "example.com" },
];

interface MegaSubItem { en: string; ar: string }
interface MegaCategory {
  id: string;
  en: string;
  ar: string;
  type: "brands" | "subs";
  subs?: MegaSubItem[];
}

const MEGA_BRANDS = [
  "الدرة", "أبيدو", "سيدي هشام", "المراعي", "حسين الناصر", "الغوطة",
  "هنا", "الراعي", "السمير", "الحسني", "كبوس", "سمن بلدي",
];

const SHOP_MEGA_MENU: MegaCategory[] = [
  { id: "brands", en: "Brands", ar: "العلامات التجارية", type: "brands" },
  { id: "rice", en: "Rice & Grains", ar: "الرز والحبوب", type: "subs", subs: [
    { en: "Aromatic Rice", ar: "رز معطر" }, { en: "Egyptian Rice", ar: "رز مصري" },
    { en: "Bulgur", ar: "برغل" }, { en: "Freekeh", ar: "فريكة" },
    { en: "Semolina", ar: "سميد" }, { en: "Lentils", ar: "عدس" },
  ]},
  { id: "oil", en: "Cooking Oils", ar: "زيوت الطبخ", type: "subs", subs: [
    { en: "Sunflower Oil", ar: "زيت دوار الشمس" }, { en: "Corn Oil", ar: "زيت ذرة" },
    { en: "Olive Oil", ar: "زيت زيتون" }, { en: "Frying Oil", ar: "زيت قلي" },
  ]},
  { id: "sugar", en: "Sugar & Tea", ar: "السكر والشاي", type: "subs", subs: [
    { en: "White Sugar", ar: "سكر أبيض" }, { en: "Tea", ar: "شاي" },
    { en: "Semolina", ar: "سميد" }, { en: "Flour", ar: "طحين" },
  ]},
  { id: "ghee", en: "Ghee & Dairy", ar: "السمن والألبان", type: "subs", subs: [
    { en: "Butter", ar: "زبدة" }, { en: "Cream", ar: "قشطة" },
    { en: "Baladi Ghee", ar: "سمن بلدي" }, { en: "Ghee", ar: "سمن" },
  ]},
  { id: "vegetables", en: "Legumes & Spices", ar: "بقوليات وتوابل", type: "subs", subs: [
    { en: "Chickpeas", ar: "حمص حب" }, { en: "Lentils", ar: "عدس" },
    { en: "Za'atar", ar: "زعتر" }, { en: "Mixed Spices", ar: "بهارات مشكلة" },
  ]},
  { id: "canned", en: "Canned Goods", ar: "المعلبات", type: "subs", subs: [
    { en: "Foul Medames", ar: "فول مدمس" }, { en: "Hummus", ar: "حمص" },
    { en: "Tahini", ar: "طحينة" }, { en: "Mortadella", ar: "مرتديلا" },
    { en: "Jam", ar: "مربى" }, { en: "Pickles", ar: "مخلل" },
  ]},
];

const CATEGORY_ROW_COUNT = 8;
const CATEGORY_TILE_GRID = "category-tile-grid";
const PRODUCT_GRID = "product-grid";

const MAIN_CATEGORY_TILE_BG: Record<string, string> = {
  rice: "#fdf0e8",
  oil: "#edf7ed",
  sugar: "#fef9e8",
  ghee: "#fff5f0",
  vegetables: "#f0fdf4",
  canned: "#e8f2fc",
};

function getSubCategoryImg(_catId: string, subAr: string, index: number) {
  return namedPlaceholder(subAr || "فئة", index);
}

const WELLNESS_MEGA_SUBS: MegaSubItem[] = [
  { en: "Lentils", ar: "عدس" }, { en: "Chickpeas", ar: "حمص حب" },
  { en: "Za'atar", ar: "زعتر" }, { en: "Mixed Spices", ar: "بهارات" },
  { en: "Freekeh", ar: "فريكة" }, { en: "Bulgur", ar: "برغل" },
  { en: "Beans", ar: "فاصوليا" }, { en: "Peas", ar: "بازلاء" },
];

const BEAUTY_MEGA_SUBS: MegaSubItem[] = [
  { en: "Aromatic Rice", ar: "رز معطر" }, { en: "Egyptian Rice", ar: "رز مصري" },
  { en: "Basmati", ar: "بسمتي" }, { en: "Bulgur", ar: "برغل" },
  { en: "Freekeh", ar: "فريكة" }, { en: "Semolina", ar: "سميد" },
];

const SUPPLEMENTS_MEGA_SUBS: MegaSubItem[] = [
  { en: "White Sugar", ar: "سكر أبيض" }, { en: "Tea", ar: "شاي" },
  { en: "Semolina", ar: "سميد" }, { en: "Flour", ar: "طحين" },
  { en: "Salt", ar: "ملح" }, { en: "Yeast", ar: "خميرة" },
];

const MOCK_REVIEWS = [
  { id: 1, nameEn: "Sara Al-Rashidi", nameAr: "سارة الراشدي", rating: 5, date: "أيار 2025", textEn: "Great rice quality at a real factory price. Delivery in Mezzeh was within two days. Will order again.", textAr: "جودة الرز ممتازة وسعر المصنع حقيقي. وصلني للمزة خلال يومين. سأطلب مرة ثانية.", verified: true, helpful: 24 },
  { id: 2, nameEn: "Mohammed K.", nameAr: "محمد ك.", rating: 4, date: "نيسان 2025", textEn: "Good oil and fast packaging. One star less only because I wanted a larger bottle size.", textAr: "الزيت جيد والتعبئة محكمة والتوصيل سريع. نقصت نجمة لأنني كنت أفضّل عبوة أكبر.", verified: true, helpful: 18 },
  { id: 3, nameEn: "Fatima Hassan", nameAr: "فاطمة حسن", rating: 5, date: "آذار 2025", textEn: "Subscription savings on sugar and tea are worth it. حصري prices beat the local shop.", textAr: "توفير الاشتراك على السكر والشاي يستحق. أسعار حصري أقل من المحل عندنا.", verified: false, helpful: 9 },
  { id: 4, nameEn: "Ahmad Al-Dimashqi", nameAr: "أحمد الدمشقي", rating: 3, date: "آذار 2025", textEn: "Product is fine for daily cooking. Delivery took the full two days to Kafr Sousa.", textAr: "المنتج مناسب للطبخ اليومي. التوصيل لكفر سوسة استغرق يومين كاملين.", verified: true, helpful: 4 },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Shows product.price with optional product.orig strike-through. */
function ProductPriceDisplay({
  product,
  lang,
  size = "md",
}: {
  product: Product;
  lang: Lang;
  size?: "sm" | "md" | "lg";
}) {
  const t = T[lang];
  const price = product.price;
  const strike = product.orig;
  const priceCls =
    size === "lg"
      ? "text-3xl font-black text-[#0b7a6e]"
      : size === "sm"
        ? "text-xs sm:text-sm font-black text-gray-900"
        : "text-base font-black text-[#0b7a6e]";
  const strikeCls = size === "lg" ? "text-sm text-gray-400 line-through" : "text-[10px] text-gray-400 line-through";

  return (
    <div className={size === "lg" ? "space-y-1" : ""}>
      <div className={`flex items-baseline gap-1.5 flex-wrap ${size === "lg" ? "items-center gap-2" : ""}`}>
        <span className={priceCls}>{t.kwd} {fmt(price)}</span>
        {strike != null && strike > price && (
          <span className={strikeCls}>{t.kwd} {fmt(strike)}</span>
        )}
      </div>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function SectionHeading({ title, lang, viewAll = true }: { title: string; lang: Lang; viewAll?: boolean }) {
  const t = T[lang];
  const { goTo } = useNav();
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="block w-1 h-7 rounded-full bg-[#0b7a6e]" />
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>{title}</h2>
      </div>
      {viewAll && (
        <button onClick={() => goTo("listing")} className="text-sm font-semibold text-[#0b7a6e] hover:underline flex items-center gap-1">
          {t.viewAll}{lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

function ProductScrollRow({ lang, products }: { lang: Lang; products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";

  const scroll = (dir: "l" | "r") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 560);
    const delta = dir === "l" ? -amount : amount;
    el.scrollBy({ left: isAr ? -delta : delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll("l")}
        aria-label={isAr ? "التمرير لليمين" : "Scroll left"}
        className="hidden sm:flex absolute -start-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e] transition-colors"
      >
        {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      <div
        ref={scrollRef}
        dir={isAr ? "rtl" : "ltr"}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 pe-11 sm:pe-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory touch-pan-x"
      >
        {products.map(p => (
          <ProductCard key={p.id} p={p} lang={lang} layout="scroll" />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("r")}
        aria-label={isAr ? "التمرير لليسار" : "Scroll right"}
        className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e] transition-colors"
      >
        {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p, lang, layout = "scroll" }: { p: Product; lang: Lang; layout?: "scroll" | "grid" }) {
  const t = T[lang];
  const { addToCart, wishIds, toggleWish, goTo } = useNav();
  const [added, setAdded] = useState(false);
  const disc = p.orig ? Math.round(((p.orig - p.price) / p.orig) * 100) : null;
  const wished = wishIds.has(p.id);

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => goTo("product", p)}
      className={`group ${layout === "grid" ? "w-full min-w-0" : "product-card-scroll"} bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer`}
    >
      <div className="relative p-3 pb-0 flex-none">
        <div className="absolute top-2 start-2 z-10 flex flex-col gap-1">
          {disc && (
            <span className="text-[10px] font-bold bg-rose-500 text-white ps-2 pe-2.5 py-0.5 rounded-e-full">
              {disc}% {t.off}
            </span>
          )}
          {p.isPrescription && (
            <span className="text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-e-full">Rx</span>
          )}
          {!disc && p.badge === "NEW" && (
            <span className="text-[9px] font-bold bg-[#0b7a6e] text-white px-2 py-0.5 rounded-e-full">{t.new}</span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
          aria-label={t.wishlist}
          className={`absolute top-2 end-2 z-10 p-1 transition-colors ${wished ? "text-rose-500" : "text-gray-300 hover:text-gray-500"}`}
        >
          <Bookmark className="w-4 h-4" fill={wished ? "currentColor" : "none"} strokeWidth={wished ? 0 : 2} />
        </button>
        <div className="aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={p.img}
            alt={lang === "ar" ? p.nameAr : p.nameEn}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
      <div className="px-3 pb-3 pt-2 flex flex-col flex-1 min-h-0">
        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 flex-1">
          {lang === "ar" ? p.nameAr : p.nameEn}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="min-w-0">
            <ProductPriceDisplay product={p} lang={lang} size="sm" />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={added ? t.added : t.addToCart}
            className={`flex-none w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
              added ? "bg-emerald-500 text-white scale-105" : "bg-[#0b7a6e] text-white hover:bg-[#09655b]"
            }`}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER + NAV  (myAster-style layout, Aroma branding)
// ═══════════════════════════════════════════════════════════════════════════════
function LocationPickerModal() {
  const { lang, deliveryLocation, setDeliveryLocation, locationModalOpen, closeLocationModal } = useNav();
  const t = T[lang];
  const [draft, setDraft] = useState<DeliveryLocation>(deliveryLocation);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [pinOffset, setPinOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (locationModalOpen) {
      setDraft(deliveryLocation);
      setQuery("");
      setPinOffset({ x: 0, y: 0 });
    }
  }, [locationModalOpen, deliveryLocation]);

  if (!locationModalOpen) return null;

  const filtered = query.trim()
    ? SYRIA_LOCATIONS.filter((loc) => {
        const q = query.toLowerCase();
        return loc.areaEn.toLowerCase().includes(q) || loc.areaAr.includes(query)
          || loc.addressEn.toLowerCase().includes(q) || loc.addressAr.includes(query);
      })
    : [];

  const displayLat = draft.lat + pinOffset.y * 0.00008;
  const displayLng = draft.lng + pinOffset.x * 0.00008;

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setDraft(findNearestLocation(pos.coords.latitude, pos.coords.longitude)); setPinOffset({ x: 0, y: 0 }); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const onPinPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: pinOffset.x, oy: pinOffset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPinPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setPinOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  };
  const onPinPointerUp = () => { dragRef.current = null; };

  const confirm = () => {
    const adjusted = pinOffset.x || pinOffset.y
      ? { ...draft, lat: displayLat, lng: displayLng,
          addressEn: `${draft.addressEn}${pinOffset.x || pinOffset.y ? " (adjusted pin)" : ""}`,
          addressAr: `${draft.addressAr}${pinOffset.x || pinOffset.y ? " (موقع معدّل)" : ""}` }
      : draft;
    setDeliveryLocation(adjusted);
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={closeLocationModal} aria-hidden />
      <div
        role="dialog"
        aria-modal
        aria-label={t.selectLocation}
        className="location-drawer fixed top-0 end-0 h-full w-full max-w-[380px] bg-white shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">{t.selectLocation}</h2>
          <button type="button" onClick={closeLocationModal} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-[180px] bg-[#e8ecef] shrink-0">
          <iframe
            title="map"
            src={mapEmbedUrl(displayLat, displayLng)}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
          />
          <div className="absolute inset-x-3 top-3 z-10">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchLocation}
                className="w-full bg-white rounded-lg ps-9 pe-3 py-2 text-xs shadow-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/25"
              />
              {filtered.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 max-h-36 overflow-y-auto z-20">
                  {filtered.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => { setDraft(loc); setQuery(""); setPinOffset({ x: 0, y: 0 }); }}
                      className="w-full text-start px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                    >
                      <p className="text-xs font-semibold text-gray-800">{lang === "ar" ? loc.areaAr : loc.areaEn}</p>
                      <p className="text-[11px] text-gray-500 truncate">{lang === "ar" ? loc.addressAr : loc.addressEn}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
            <div
              className="relative -mt-6 pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={onPinPointerDown}
              onPointerMove={onPinPointerMove}
              onPointerUp={onPinPointerUp}
            >
              <div className="absolute bottom-full start-1/2 -translate-x-1/2 mb-1.5 w-44 bg-[#1a2332] text-white text-center rounded-md px-2.5 py-1.5 shadow-lg pointer-events-none">
                <p className="text-[10px] font-bold leading-snug">{t.orderDeliveredHere}</p>
                <p className="text-[9px] text-white/70 mt-0.5">{t.movePin}</p>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-[#1a2332] rotate-45" />
              </div>
              <MapPin className="w-8 h-8 text-[#0b7a6e] drop-shadow-md fill-[#0b7a6e]/20" strokeWidth={1.5} />
            </div>
          </div>

          <div className="absolute end-2.5 top-12 z-10">
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              title={t.locateMe}
              className="w-8 h-8 bg-white rounded-md shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 disabled:opacity-60"
            >
              <LocateFixed className={`w-3.5 h-3.5 text-gray-600 ${locating ? "animate-pulse" : ""}`} />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-900 mb-2">{t.selectDeliveryLocation}</h3>
          <div className="flex gap-2.5">
            <MapPin className="w-4 h-4 text-[#0b7a6e] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">{lang === "ar" ? draft.areaAr : draft.areaEn}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lang === "ar" ? draft.addressAr : draft.addressEn}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SYRIA_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => { setDraft(loc); setPinOffset({ x: 0, y: 0 }); }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${draft.id === loc.id ? "bg-[#0b7a6e]/10 border-[#0b7a6e] text-[#0b7a6e] font-semibold" : "border-gray-200 text-gray-600 hover:border-[#0b7a6e]/40"}`}
              >
                {lang === "ar" ? loc.areaAr : loc.areaEn}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={confirm}
            className="w-full py-3 rounded-lg text-sm font-bold bg-[#0b7a6e] text-white hover:bg-[#09655b] transition-colors"
          >
            {t.confirmLocation}
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteHeader({ lang, page }: { lang: Lang; page: Page }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const hideOnMobileHome = page === "home";
  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : ""} ${hideOnMobileHome ? "hidden md:block" : ""}`}>
      <TopBar lang={lang} />
      <Header lang={lang} />
      <CategoryNav lang={lang} />
    </header>
  );
}

const ACTIVE_REGION = { code: "SYP", nameEn: "Syria", nameAr: "سوريا" } as const;

function TopBar({ lang }: { lang: Lang }) {
  const t = T[lang];

  return (
    <div className="bg-[#f5f5f5] border-b border-gray-200/70 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9 gap-3">
        <div className="hidden md:flex items-center gap-6 text-gray-600 min-w-0">
          <span className="flex items-center gap-1.5 shrink-0">
            <Activity className="w-3.5 h-3.5 text-[#0b7a6e] shrink-0" />
            <span className="whitespace-nowrap">{t.topBarBadge}</span>
          </span>
          <span className="flex items-center gap-1.5 min-w-0">
            <Tag className="w-3.5 h-3.5 text-[#0b7a6e] shrink-0" />
            <span className="truncate">{t.topBarPromo}</span>
          </span>
        </div>
        <div className="md:hidden flex-1 min-w-0 text-gray-600">
          <span className="flex items-center justify-center gap-1.5 truncate w-full">
            <Tag className="w-3.5 h-3.5 text-[#0b7a6e] shrink-0" />
            <span className="truncate">{t.topBarPromo}</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="flex items-center gap-1.5 text-gray-700">
            <SyriaFlagBadge />
            <span className="font-medium">{ACTIVE_REGION.nameAr}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Header({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { cartCount, goTo, deliveryLocation, openLocationModal, isLoggedIn } = useNav();
  const areaLabel = lang === "ar" ? deliveryLocation.areaAr : deliveryLocation.areaEn;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileTarget: Page = isLoggedIn ? "dashboard" : "login";
  const profileLabel = isLoggedIn ? t.account : t.loginRegister;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6 h-[72px] sm:h-[84px]">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); goTo("home"); }}
            className="flex-none shrink-0"
          >
            <BrandLogo className="h-12 sm:h-16 w-auto object-contain" />
          </a>

          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
              <input
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#f0f0f0] rounded-full ps-11 pe-5 py-3 text-sm text-gray-800 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/25 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ms-auto">
            <button
              type="button"
              onClick={() => goTo("subscription")}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#0b7a6e] text-white text-xs font-bold px-3 py-2 rounded-full hover:bg-[#09655b] transition-colors"
            >
              {t.qsSubscribe}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button
              type="button"
              onClick={() => goTo("cart")}
              className="relative p-1.5 hover:opacity-80 transition-opacity"
              aria-label={t.cart}
            >
              <ShoppingCart className="w-6 h-6 text-[#0b7a6e]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => goTo(profileTarget)}
              className="hidden sm:flex items-center gap-2.5 group"
            >
              <span className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-[#0b7a6e]/40 transition-colors">
                <User className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-[#1a2332] group-hover:text-[#0b7a6e] transition-colors whitespace-nowrap">
                {profileLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => goTo(profileTarget)}
              className="sm:hidden w-10 h-10 rounded-full border-2 border-[#0b7a6e]/30 bg-[#0b7a6e]/10 flex items-center justify-center hover:border-[#0b7a6e]/60 hover:bg-[#0b7a6e]/15 transition-colors"
              aria-label={profileLabel}
            >
              <User className="w-5 h-5 text-[#0b7a6e]" strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#f0f0f0] rounded-full ps-11 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/25"
              />
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 py-4 space-y-1">
            <button
              type="button"
              onClick={() => { openLocationModal(); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0b7a6e] hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#0b7a6e]" />
              {lang === "ar" ? `الموقع: ${areaLabel}` : `Location: ${areaLabel}`}
            </button>
            <button
              type="button"
              onClick={() => { goTo("subscription"); setMobileOpen(false); }}
              className="block w-full text-start px-2 py-2.5 text-sm font-bold text-[#0b7a6e] hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t.qsSubscribe}
            </button>
            {[t.navShop, t.navWellness, t.beauty, t.supplements, t.navOffers].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => { goTo("listing"); setMobileOpen(false); }}
                className="block w-full text-start px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-[#0b7a6e] hover:bg-gray-50 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { goTo(profileTarget); setMobileOpen(false); }}
              className="flex items-center gap-2.5 w-full px-2 py-3 text-base font-bold text-[#1a2332] hover:text-[#0b7a6e] transition-colors"
            >
              <span className="w-7 h-7 rounded-full border border-[#0b7a6e]/30 bg-[#0b7a6e]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#0b7a6e]" strokeWidth={2.2} />
              </span>
              {profileLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MegaSubGrid({ items, lang, onSelect }: { items: MegaSubItem[]; lang: Lang; onSelect: () => void }) {
  const { goTo } = useNav();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-1">
      {items.map((item) => (
        <button
          key={item.en}
          type="button"
          onClick={() => { goTo("listing"); onSelect(); }}
          className="text-start text-[13px] text-gray-700 hover:text-[#0b7a6e] py-1.5 transition-colors"
        >
          {lang === "ar" ? item.ar : item.en}
        </button>
      ))}
    </div>
  );
}

function ShopMegaPanel({ lang, activeId, setActiveId, onClose }: { lang: Lang; activeId: string; setActiveId: (id: string) => void; onClose: () => void }) {
  const t = T[lang];
  const { goTo } = useNav();
  const active = SHOP_MEGA_MENU.find((c) => c.id === activeId) ?? SHOP_MEGA_MENU[0];

  return (
    <div className="flex min-h-[340px] max-h-[min(520px,70vh)]">
      <aside className="w-52 shrink-0 bg-[#faf7f4] border-e border-[#ede8e3] py-3 overflow-y-auto">
        {SHOP_MEGA_MENU.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onMouseEnter={() => setActiveId(cat.id)}
            onClick={() => setActiveId(cat.id)}
            className={`w-full text-start px-4 py-2.5 text-[13px] transition-colors ${activeId === cat.id ? "font-bold text-gray-900 bg-white/70" : "font-medium text-gray-600 hover:text-[#0b7a6e] hover:bg-white/40"}`}
          >
            {lang === "ar" ? cat.ar : cat.en}
          </button>
        ))}
      </aside>
      <div className="flex-1 bg-white p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">{lang === "ar" ? active.ar : active.en}</h3>
          <button type="button" onClick={() => { goTo("listing"); onClose(); }} className="text-sm font-semibold text-[#0b7a6e] hover:underline">
            {t.viewAll}
          </button>
        </div>
        {active.type === "brands" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
            {MEGA_BRANDS.map((brand, i) => (
              <button
                key={`${brand}-${i}`}
                type="button"
                onClick={() => { goTo("listing"); onClose(); }}
                className="h-[52px] px-2 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-[11px] font-semibold text-gray-700 hover:border-[#0b7a6e]/40 hover:text-[#0b7a6e] hover:shadow-sm transition-all text-center leading-tight"
                style={{ backgroundColor: BRAND_COLORS[i % BRAND_COLORS.length] }}
              >
                {brand}
              </button>
            ))}
          </div>
        ) : (
          <MegaSubGrid items={active.subs ?? []} lang={lang} onSelect={onClose} />
        )}
      </div>
    </div>
  );
}

function SimpleMegaPanel({ title, items, lang, onClose }: { title: string; items: MegaSubItem[]; lang: Lang; onClose: () => void }) {
  const t = T[lang];
  const { goTo } = useNav();
  return (
    <div className="bg-white p-5 min-h-[200px] max-h-[min(400px,60vh)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={() => { goTo("listing"); onClose(); }} className="text-sm font-semibold text-[#0b7a6e] hover:underline">
          {t.viewAll}
        </button>
      </div>
      <MegaSubGrid items={items} lang={lang} onSelect={onClose} />
    </div>
  );
}

function CategoryNav({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo, deliveryLocation, openLocationModal } = useNav();
  const areaLabel = lang === "ar" ? deliveryLocation.areaAr : deliveryLocation.areaEn;
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeShopId, setActiveShopId] = useState("brands");
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const OPEN_DELAY_MS = 280;
  const CLOSE_DELAY_MS = 150;

  const dropdownItems = [
    { key: "shop", label: t.navShop },
    { key: "wellness", label: t.navWellness },
    { key: "beauty", label: t.beauty },
    { key: "supplements", label: t.supplements },
  ] as const;

  const linkItems = [
    { key: "subscribe", label: t.qsSubscribe, page: "subscription" as Page },
    { key: "offers", label: t.navOffers, page: "listing" as Page },
  ] as const;

  const clearOpenTimer = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };
  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = (key: string) => {
    clearCloseTimer();
    if (openMenu) {
      setOpenMenu(key);
      if (key === "shop") setActiveShopId("brands");
      return;
    }
    clearOpenTimer();
    openTimer.current = setTimeout(() => {
      setOpenMenu(key);
      if (key === "shop") setActiveShopId("brands");
      openTimer.current = null;
    }, OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimer.current = null;
    }, CLOSE_DELAY_MS);
  };

  const cancelClose = () => {
    clearCloseTimer();
  };

  useEffect(() => () => {
    clearOpenTimer();
    clearCloseTimer();
  }, []);

  return (
    <nav
      className="hidden md:block relative bg-[#faf7f4] border-b border-[#ede8e3]"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-12 gap-0.5">
          {dropdownItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onMouseEnter={() => scheduleOpen(item.key)}
              onMouseLeave={clearOpenTimer}
              onClick={() => { clearOpenTimer(); setOpenMenu(openMenu === item.key ? null : item.key); }}
              className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium transition-colors whitespace-nowrap ${openMenu === item.key ? "text-[#0b7a6e]" : "text-gray-800 hover:text-[#0b7a6e]"}`}
            >
              {item.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === item.key ? "rotate-180 text-[#0b7a6e]" : "text-gray-500"}`} />
            </button>
          ))}

          <span className="mx-2 text-gray-300 select-none">|</span>

          {linkItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => goTo(item.page)}
              className="px-3.5 py-2 text-[13px] font-medium text-gray-800 hover:text-[#0b7a6e] transition-colors whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}

          <div className="ms-auto ps-4">
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200/80 shadow-sm hover:border-[#0b7a6e]/30 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0b7a6e] shrink-0" />
              <span className="truncate max-w-[200px]">{lang === "ar" ? `الموقع: ${areaLabel}` : `Location: ${areaLabel}`}</span>
              <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {openMenu && (
        <div className="absolute inset-x-0 top-full bg-white border-t border-gray-200 shadow-xl z-40" onMouseEnter={cancelClose}>
          <div className="max-w-7xl mx-auto">
            {openMenu === "shop" && (
              <ShopMegaPanel lang={lang} activeId={activeShopId} setActiveId={setActiveShopId} onClose={() => setOpenMenu(null)} />
            )}
            {openMenu === "wellness" && (
              <SimpleMegaPanel title={t.navWellness} items={WELLNESS_MEGA_SUBS} lang={lang} onClose={() => setOpenMenu(null)} />
            )}
            {openMenu === "beauty" && (
              <SimpleMegaPanel title={t.beauty} items={BEAUTY_MEGA_SUBS} lang={lang} onClose={() => setOpenMenu(null)} />
            )}
            {openMenu === "supplements" && (
              <SimpleMegaPanel title={t.supplements} items={SUPPLEMENTS_MEGA_SUBS} lang={lang} onClose={() => setOpenMenu(null)} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function MobileHomeHero({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { cartCount, goTo, deliveryLocation, openLocationModal } = useNav();
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = HERO_SLIDES.length;
  const areaLabel = lang === "ar" ? deliveryLocation.areaAr : deliveryLocation.areaEn;
  const isAr = lang === "ar";

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCur((c) => (c + 1) % n), 4500);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <div className="md:hidden">
      <div className="bg-[#0b7a6e] text-white text-[11px] font-semibold py-2.5 px-4">
        <p className="text-center leading-snug">{t.topBarPromo}</p>
      </div>

      <section
        className="relative overflow-hidden"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="relative h-[340px]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f8d4b8] via-[#f0a67a] to-[#e8915e]" />
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-25`} />

              <div className="absolute end-0 bottom-14 w-[58%] h-[220px] z-[5] pointer-events-none">
                <img
                  src={s.img}
                  alt=""
                  className="w-full h-full object-contain object-bottom drop-shadow-lg"
                />
              </div>

              <div className="relative z-20 h-full flex flex-col px-4 pt-3 pb-14">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); goTo("home"); }}
                      className="inline-block"
                    >
                      <BrandLogo className="h-8 w-auto object-contain brightness-0 invert" />
                    </a>
                    <button
                      type="button"
                      onClick={openLocationModal}
                      className="mt-1.5 flex items-center gap-1 text-white text-xs font-medium max-w-[200px]"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="truncate">{areaLabel}</span>
                      <ChevronDown className="w-3 h-3 shrink-0 opacity-80" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo("cart")}
                    className="relative p-1.5 shrink-0"
                    aria-label={t.cart}
                  >
                    <ShoppingCart className="w-6 h-6 text-white" strokeWidth={1.75} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -end-0.5 min-w-[16px] h-[16px] px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className={`mt-auto max-w-[52%] pb-2 ${isAr ? "text-right ms-auto" : ""}`}>
                  <span
                    className="inline-block text-[10px] font-black uppercase tracking-wider text-[#1a2332] mb-1.5"
                    style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
                  >
                    {isAr ? s.badgeAr : s.badgeEn}
                  </span>
                  <h1
                    className="text-[22px] font-black text-white leading-[1.15] mb-1"
                    style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
                  >
                    {isAr ? s.titleAr : s.titleEn}
                  </h1>
                  <p className="text-white/85 text-[11px] leading-snug line-clamp-2 mb-3">
                    {isAr ? s.subAr : s.subEn}
                  </p>
                  <button
                    type="button"
                    onClick={() => goTo("listing")}
                    className="inline-flex items-center gap-1.5 bg-[#1a2332] text-white text-[11px] font-bold uppercase tracking-wide px-5 py-2.5 rounded-full shadow-md active:scale-[0.98] transition-transform"
                  >
                    {t[s.cta] ?? t.shopNow}
                    {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-[52px] left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCur(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === cur ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-40 px-4 -mt-5">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] px-4 py-3.5 border border-gray-100">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 border-0 focus:outline-none"
              onFocus={() => goTo("listing")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroSlider({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = HERO_SLIDES.length;
  useEffect(() => { if (paused) return; const id = setInterval(() => setCur(c => (c + 1) % n), 4500); return () => clearInterval(id); }, [paused]);
  return (
    <section className="hidden md:block" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="section-container">
        <div style={{ height: 340 }} className="relative overflow-hidden rounded-xl">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg}`} />
            <div className="relative z-10 h-full flex items-center px-4 sm:px-6">
              <div className="grid grid-cols-5 gap-6 items-center w-full h-full py-8">
                <div className={`col-span-2 space-y-4 ${lang === "ar" ? "text-right" : ""}`}>
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full px-3 py-1.5" style={{ background: `${s.accent}33`, color: s.accent }}>{lang === "ar" ? s.badgeAr : s.badgeEn}</span>
                  <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>{lang === "ar" ? s.titleAr : s.titleEn}</h1>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">{lang === "ar" ? s.subAr : s.subEn}</p>
                  <button
                    type="button"
                    onClick={() => goTo("listing")}
                    className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
                    style={{ background: s.accent, color: "#1a2332" }}
                  >
                    {t[s.cta] ?? t.shopNow}{lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
                <div className="col-span-3 flex items-end justify-center h-full overflow-hidden">
                  <img src={s.img} alt="" className="h-full w-full object-cover object-center rounded-2xl opacity-90" />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setCur(i)} className={`h-2 rounded-full transition-all duration-300 ${i === cur ? "w-6 bg-white" : "w-2 bg-white/50"}`} />)}
        </div>
        </div>
      </div>
    </section>
  );
}

function QuickServicesSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";
  const badgeToneClass = { red: "bg-[#ef4444]", green: "bg-[#22c55e]", gold: "bg-[#f59e0b]" };

  return (
    <section className="bg-white pt-3 pb-6 sm:py-8">
      <div className="section-container">
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="grid grid-cols-4 gap-x-2 gap-y-4 md:grid-cols-7 md:gap-2"
        >
          {QUICK_SERVICES.map(({ id, labelKey, page, badgeKey, badgeTone }) => (
            <button
              key={id}
              onClick={() => goTo(page)}
              className="group flex flex-col items-center min-w-0"
            >
              <div className="relative w-full aspect-square max-w-[72px] sm:max-w-[68px] mx-auto mb-1.5">
                <div className="w-full h-full bg-[#eef0f2] rounded-2xl flex items-center justify-center p-3 group-hover:bg-[#e6e8eb] group-active:scale-[0.97] transition-all duration-150">
                  <QuickServiceIllustration id={id} />
                </div>
                {badgeKey && badgeTone && (
                  <span
                    className={`absolute z-10 ${badgeToneClass[badgeTone]} text-white text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none whitespace-nowrap shadow-sm ${
                      badgeTone === "red"
                        ? "-top-1.5 start-0 -translate-x-0"
                        : "-top-1.5 left-1/2 -translate-x-1/2"
                    }`}
                  >
                    {t[badgeKey]}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-gray-900 text-center leading-[1.3] w-full px-0.5">
                {t[labelKey]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({ lang, title, products, bg = "bg-white" }: { lang: Lang; title: string; products: Product[]; bg?: string }) {
  return (
    <section className={`py-8 sm:py-10 ${bg}`}>
      <div className="section-container">
        <SectionHeading title={title} lang={lang} />
        <ProductScrollRow lang={lang} products={products} />
      </div>
    </section>
  );
}

function TopBrandCard({ name, domain, onSelect }: { name: string; domain: string; onSelect: () => void }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="brand-card-scroll h-[4.5rem] sm:h-[5.25rem] bg-white rounded-lg border border-gray-200 flex items-center justify-center p-3 sm:p-4 hover:border-[#0b7a6e]/35 hover:shadow-sm transition-all"
    >
      {!logoFailed ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="text-xs sm:text-sm font-bold text-gray-700 text-center leading-tight px-1">{name}</span>
      )}
    </button>
  );
}

function TopBrandsSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";

  const scroll = (dir: "l" | "r") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 720);
    const delta = dir === "l" ? -amount : amount;
    el.scrollBy({ left: isAr ? -delta : delta, behavior: "smooth" });
  };

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="section-container">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <h2
            className="text-base sm:text-lg font-bold text-gray-900"
            style={{ fontFamily: isAr ? "Cairo,sans-serif" : "inherit" }}
          >
            {t.topBrandsTitle}
          </h2>
          <button
            type="button"
            onClick={() => goTo("listing")}
            className="flex-none text-xs sm:text-sm font-bold uppercase tracking-wide text-[#0b7a6e] hover:underline"
          >
            {t.viewAll}
          </button>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("l")}
            aria-label={isAr ? "التمرير لليمين" : "Scroll left"}
            className="hidden sm:flex absolute -start-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 items-center justify-center text-gray-600 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e] transition-colors"
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <div
            ref={scrollRef}
            dir={isAr ? "rtl" : "ltr"}
            className="flex gap-3 overflow-x-auto pb-1 pe-11 sm:pe-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth sm:px-1"
          >
            {TOP_BRANDS.map(brand => (
              <TopBrandCard
                key={brand.domain}
                name={brand.name}
                domain={brand.domain}
                onSelect={() => goTo("listing")}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("r")}
            aria-label={isAr ? "التمرير لليسار" : "Scroll right"}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#0b7a6e] hover:text-white hover:border-[#0b7a6e] transition-colors"
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}

function ProductsYouLoveSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";
  const products = PRODUCTS.slice(0, 12);

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="section-container">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <h2
            className="text-base sm:text-lg font-bold text-gray-900"
            style={{ fontFamily: isAr ? "Cairo,sans-serif" : "inherit" }}
          >
            {t.productsYouLoveTitle}
          </h2>
          <button
            type="button"
            onClick={() => goTo("listing")}
            className="flex-none text-xs sm:text-sm font-bold uppercase tracking-wide text-[#0b7a6e] hover:underline"
          >
            {t.viewAll}
          </button>
        </div>
        <ProductScrollRow lang={lang} products={products} />
      </div>
    </section>
  );
}

function CategoryPromoBanner({
  lang,
  variant,
  titleKey,
  productIds,
}: {
  lang: Lang;
  variant: "beauty" | "nutrition" | "mombaby";
  titleKey: "beautyStoreTitle" | "nutritionStoreTitle" | "momBabyStoreTitle";
  productIds: number[];
}) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";
  const products = productIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
  const gradient =
    variant === "beauty"
      ? "from-[#fdf2f4] via-[#fef9fa] to-white border-[#f5d5dc]/60"
      : variant === "nutrition"
        ? "from-[#fdf2f4] via-[#fef5f7] to-[#faf7f4] border-[#f5d5dc]/50"
        : "from-[#c08078] to-[#b07068] border-[#a86860]/40";
  const isMomBaby = variant === "mombaby";

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${isMomBaby ? "bg-gradient-to-r" : "bg-gradient-to-r"} ${gradient} border`}
      style={{ height: `${CATEGORY_PROMO_BANNER_HEIGHT}px` }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-10 end-0 w-40 h-40 rounded-full blur-2xl ${isMomBaby ? "bg-white/10" : "bg-[#0b7a6e]/5"}`} />
      </div>
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="relative z-10 h-full flex items-center justify-between gap-3 px-4 sm:px-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-shrink">
          <div className="min-w-0">
            <h2
              className={`text-sm sm:text-lg font-bold leading-tight truncate ${isMomBaby ? "text-white" : "text-[#063e38]"}`}
              style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
            >
              {t[titleKey]}{" "}
              <span className={`whitespace-nowrap ${isMomBaby ? "text-white" : "text-[#0b7a6e]"}`}>{t.beautyStoreDiscount}</span>
            </h2>
            {(variant === "beauty" || isMomBaby) && (
              <p className={`hidden sm:block text-xs mt-0.5 ${isMomBaby ? "text-white/85" : "text-gray-500"}`}>
                {isMomBaby ? t.momBabyStoreSub : t.beautyStoreSub}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => goTo("listing")}
            className={`flex-none inline-flex items-center justify-center px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-colors ${
              isMomBaby
                ? "bg-white text-gray-900 hover:bg-white/90"
                : "bg-[#063e38] text-white hover:bg-[#0b7a6e]"
            }`}
          >
            {t.shopNow}
          </button>
        </div>
        <div className="flex-shrink-0 flex items-center justify-end gap-1.5 sm:gap-2 h-[78%] max-w-[48%] sm:max-w-[42%]">
          {products.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              className={`h-full aspect-[3/4] max-h-[118px] rounded-md overflow-hidden shadow-sm border ${
                isMomBaby ? "bg-white/95 border-white/80" : "bg-white/90 border-white"
              }`}
              style={{ transform: `rotate(${(i - 1.5) * 3}deg)` }}
            >
              <ImageWithFallback
                src={p.img}
                alt={isAr ? p.nameAr : p.nameEn}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreBeautyCategoriesSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="section-container">
        <h2
          className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5"
          style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
        >
          {t.exploreBeautyCategories}
        </h2>
        <div className={CATEGORY_TILE_GRID}>
          {EXPLORE_BEAUTY_CATEGORIES.slice(0, CATEGORY_ROW_COUNT).map(cat => (
            <button
              key={cat.en}
              type="button"
              onClick={() => goTo("listing")}
              className="group flex flex-col items-center text-center min-w-0"
            >
              <div
                className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-2 sm:p-2.5 border border-[#f5d5dc]/50 group-hover:shadow-md group-hover:border-[#0b7a6e]/25 group-active:scale-[0.98] transition-all duration-150"
                style={{ backgroundColor: BEAUTY_CATEGORY_TILE_BG }}
              >
                <ImageWithFallback
                  src={cat.img}
                  alt={isAr ? cat.ar : cat.en}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-800 leading-tight px-0.5 line-clamp-2 group-hover:text-[#0b7a6e] transition-colors">
                {isAr ? cat.ar : cat.en}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function YourNutritionGuideSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="section-container">
        <h2
          className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5"
          style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
        >
          {t.yourNutritionGuide}
        </h2>
        <div className={CATEGORY_TILE_GRID}>
          {NUTRITION_GUIDE_CATEGORIES.slice(0, CATEGORY_ROW_COUNT).map(cat => (
            <button
              key={cat.en}
              type="button"
              onClick={() => goTo("listing")}
              className="group flex flex-col rounded-xl overflow-hidden border border-gray-200/80 hover:shadow-md hover:border-[#0b7a6e]/25 transition-all text-start"
            >
              <div
                className="flex items-center justify-center gap-1 p-2 sm:p-2.5 h-[5.5rem] sm:h-[6.5rem]"
                style={{ backgroundColor: NUTRITION_TILE_TOP_BG }}
              >
                <ImageWithFallback
                  src={cat.img1}
                  alt=""
                  className="h-[3.25rem] sm:h-16 w-auto max-w-[42%] object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <ImageWithFallback
                  src={cat.img2}
                  alt=""
                  className="h-[3.25rem] sm:h-16 w-auto max-w-[42%] object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div
                className="flex items-center justify-center px-2 py-2.5 sm:py-3 min-h-[2.75rem]"
                style={{ backgroundColor: NUTRITION_TILE_BOTTOM_BG }}
              >
                <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2 group-hover:text-[#0b7a6e] transition-colors">
                  {isAr ? cat.ar : cat.en}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function GentleCareMomBabySection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="section-container">
        <h2
          className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5"
          style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
        >
          {t.gentleCareMomBaby}
        </h2>
        <div className={CATEGORY_TILE_GRID}>
          {MOM_BABY_CATEGORIES.slice(0, CATEGORY_ROW_COUNT).map(cat => (
            <button
              key={cat.en}
              type="button"
              onClick={() => goTo("listing")}
              className="group flex flex-col rounded-xl overflow-hidden border border-gray-200/80 hover:shadow-md hover:border-[#0b7a6e]/25 transition-all text-start"
            >
              <div
                className="flex items-center justify-center gap-1 p-2 sm:p-2.5 h-[5.5rem] sm:h-[6.5rem]"
                style={{ backgroundColor: MOM_BABY_TILE_TOP_BG }}
              >
                <ImageWithFallback
                  src={cat.img1}
                  alt=""
                  className="h-[3.25rem] sm:h-16 w-auto max-w-[42%] object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <ImageWithFallback
                  src={cat.img2}
                  alt=""
                  className="h-[3.25rem] sm:h-16 w-auto max-w-[42%] object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <div
                className="flex items-center justify-center px-2 py-2.5 sm:py-3 min-h-[2.75rem]"
                style={{ backgroundColor: MOM_BABY_TILE_BOTTOM_BG }}
              >
                <span className="text-[10px] sm:text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2 group-hover:text-[#0b7a6e] transition-colors">
                  {isAr ? cat.ar : cat.en}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainCategoriesSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const isAr = lang === "ar";
  const categories = SHOP_MEGA_MENU.filter(c => c.type === "subs" && c.subs?.length);
  const MAX_VISIBLE = CATEGORY_ROW_COUNT;

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="section-container space-y-8 sm:space-y-10">
        {categories.map(cat => {
          const subs = cat.subs ?? [];
          const visibleSubs = subs.slice(0, MAX_VISIBLE);
          const hasMore = subs.length > MAX_VISIBLE;

          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                <h2
                  className="text-base sm:text-lg font-bold text-gray-900"
                  style={{ fontFamily: isAr ? "Cairo,sans-serif" : "'Playfair Display',serif" }}
                >
                  {isAr ? cat.ar : cat.en}
                </h2>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => goTo("listing")}
                    className="flex-none text-xs sm:text-sm font-semibold text-[#0b7a6e] hover:underline flex items-center gap-1"
                  >
                    {t.viewAll}
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <div className={CATEGORY_TILE_GRID}>
                {visibleSubs.map((sub, i) => (
                  <button
                    key={sub.en}
                    type="button"
                    onClick={() => goTo("listing")}
                    className="group flex flex-col items-center text-center min-w-0"
                  >
                    <div
                      className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-2 sm:p-2.5 border border-black/[0.04] group-hover:shadow-md group-hover:border-[#0b7a6e]/20 group-active:scale-[0.98] transition-all duration-150"
                      style={{ backgroundColor: MAIN_CATEGORY_TILE_BG[cat.id] ?? "#f5f5f5" }}
                    >
                      <ImageWithFallback
                        src={getSubCategoryImg(cat.id, sub.ar, i)}
                        alt={isAr ? sub.ar : sub.en}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-2 text-[9px] sm:text-[10px] md:text-xs font-medium text-gray-800 leading-tight px-0.5 line-clamp-2 group-hover:text-[#0b7a6e] transition-colors">
                      {isAr ? sub.ar : sub.en}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t[`faq${n}Q` as keyof typeof t] as string,
    a: t[`faq${n}A` as keyof typeof t] as string,
  }));

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t.faqTitle}</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">{t.faqSub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {items.map(({ q, a }, i) => {
            const isOpen = openItems.has(i);
            return (
              <div
                key={i}
                className="self-start w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-3 p-5 text-start hover:bg-gray-50/80 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">{q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#0b7a6e] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileAppDownloadSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const isAr = lang === "ar";
  const [toast, setToast] = useState<"visible" | "hiding" | "hidden">("hidden");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showComingSoon = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast("visible");
    toastTimer.current = setTimeout(() => {
      setToast("hiding");
      toastTimer.current = setTimeout(() => setToast("hidden"), 300);
    }, 2800);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const features = [t.appFeature1, t.appFeature2, t.appFeature3];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#e8f5f3] via-white to-[#f0faf8] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 start-1/4 w-72 h-72 rounded-full bg-[#0b7a6e]/10 blur-3xl app-glow-pulse" />
      <div className="pointer-events-none absolute -bottom-20 end-1/4 w-80 h-80 rounded-full bg-[#c9a85c]/15 blur-3xl app-glow-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="section-container relative z-10">
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-[#0b7a6e]/10 shadow-xl shadow-[#0b7a6e]/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b7a6e]/[0.03] via-transparent to-[#c9a85c]/[0.06] pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-4 items-center p-6 sm:p-10 lg:p-12">
            <div className="hidden lg:flex justify-center items-center relative min-h-[320px]">
              <div className="absolute w-48 h-48 rounded-full bg-[#0b7a6e]/10 blur-2xl app-glow-pulse" />
              <div className="app-phone-float relative">
                <div className="w-[220px] h-[440px] rounded-[2.5rem] bg-gradient-to-b from-gray-800 to-gray-900 p-2 shadow-2xl shadow-gray-900/30 ring-1 ring-white/10">
                  <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#e8f5f3] to-white overflow-hidden flex flex-col">
                    <div className="h-7 flex items-center justify-center">
                      <div className="w-16 h-1 rounded-full bg-gray-300/80" />
                    </div>
                    <div className="px-4 pt-2 pb-3 flex items-center gap-2 border-b border-[#0b7a6e]/10">
                      <div className="w-8 h-8 rounded-xl bg-[#0b7a6e] flex items-center justify-center shrink-0">
                        <BrandLogo className="w-6 h-6 object-contain brightness-0 invert" />
                      </div>
                      <span className="text-[10px] font-bold text-[#063e38]">حصري</span>
                    </div>
                    <div className="flex-1 p-3 space-y-2">
                      <div className="h-16 rounded-xl bg-gradient-to-r from-[#0b7a6e] to-[#0d9488] p-2.5 flex flex-col justify-end">
                        <span className="text-[8px] text-white/80 font-medium">{isAr ? "عروض حصرية" : "Exclusive Deals"}</span>
                        <span className="text-[10px] text-white font-bold leading-tight">{isAr ? "خصم 10٪ على أول طلب" : "10% off 1st order"}</span>
                      </div>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex gap-2 items-center">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="h-2 rounded bg-gray-200 w-full" />
                            <div className="h-2 rounded bg-gray-100 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -end-3 bg-[#c9a85c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {t.comingSoon}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-start">
              <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#0b7a6e] to-[#065f56] shadow-lg shadow-[#0b7a6e]/25 flex items-center justify-center mb-5 ring-4 ring-[#0b7a6e]/10">
                <BrandLogo className="w-12 h-12 sm:w-14 sm:h-14 object-contain brightness-0 invert" />
              </div>

              <p className="text-sm sm:text-base text-[#1e3a5f] font-medium mb-2 max-w-sm">{t.appSub}</p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight max-w-md">
                {t.appTitle}
              </h2>

              <ul className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7 max-w-lg">
                {features.map((feat) => (
                  <li
                    key={feat}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#063e38] bg-[#e8f5f3] px-3 py-1.5 rounded-full border border-[#0b7a6e]/10"
                  >
                    <Check className="w-3.5 h-3.5 text-[#0b7a6e] shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={showComingSoon}
                  className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 min-w-[160px] hover:border-[#0b7a6e]/40 hover:shadow-lg hover:shadow-[#0b7a6e]/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  aria-label={`${t.getOnGooglePlay} ${t.googlePlay}`}
                >
                  <svg viewBox="0 0 256 283" className="w-auto h-7 shrink-0" aria-hidden>
                    <path fill="#EA4335" d="M119.55 134.92 1.06 259.06c2.7 9.56 9.66 17.33 18.86 21.06 9.2 3.73 19.61 2.99 28.2-1.99l133.33-75.93-61.9-67.28Z" />
                    <path fill="#FBBC04" d="m239.37 113.81-57.66-33.02-64.9 56.95 65.16 64.28 57.22-32.67c10.33-5.41 16.81-16.11 16.81-27.77 0-11.66-6.48-22.36-16.63-27.77Z" />
                    <path fill="#4285F4" d="M1.06 23.49C.34 26.13 0 28.87 0 31.61v219.33c0 2.74.36 5.47 1.06 8.12L123.61 138.1 1.06 23.49Z" />
                    <path fill="#34A853" d="m120.44 141.27 61.28-60.48L48.56 4.5C43.55 1.57 37.86.02 32.05 0 17.64-.03 4.98 9.53 1.06 23.4l119.38 117.87Z" />
                  </svg>
                  <div className={isAr ? "text-right" : "text-left"}>
                    <span className="block text-[9px] uppercase tracking-wide text-gray-500 leading-none">{t.getOnGooglePlay}</span>
                    <span className="block text-sm font-semibold text-gray-900 leading-tight mt-0.5">{t.googlePlay}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={showComingSoon}
                  className="group flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 min-w-[160px] hover:border-[#0b7a6e]/40 hover:shadow-lg hover:shadow-[#0b7a6e]/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  aria-label={`${t.downloadOnThe} ${t.appStore}`}
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 text-gray-900" fill="currentColor" aria-hidden>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className={isAr ? "text-right" : "text-left"}>
                    <span className="block text-[9px] text-gray-500 leading-none">{t.downloadOnThe}</span>
                    <span className="block text-sm font-semibold text-gray-900 leading-tight mt-0.5">{t.appStore}</span>
                  </div>
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                {t.comingSoon}
              </p>
            </div>
          </div>
        </div>
      </div>

      {toast !== "hidden" && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 sm:bottom-8 start-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-[#063e38] text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-[#063e38]/30 border border-white/10 max-w-[90vw] sm:max-w-sm ${
            toast === "visible" ? "app-toast-enter" : "app-toast-exit"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#0b7a6e] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className={isAr ? "text-right" : "text-left"}>
            <p className="text-sm font-bold">{t.comingSoon}</p>
            <p className="text-xs text-white/75">{t.comingSoonMessage}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function TrustSection({ lang }: { lang: Lang }) {
  const t = T[lang];
  const items = [
    { Icon: Truck, tk: "fastDelivery", dk: "fastDeliveryDesc", color: "text-teal-600", bg: "bg-teal-50" },
    { Icon: Shield, tk: "securePayment", dk: "securePaymentDesc", color: "text-blue-600", bg: "bg-blue-50" },
    { Icon: Award, tk: "genuine", dk: "genuineDesc", color: "text-emerald-600", bg: "bg-emerald-50" },
    { Icon: Headphones, tk: "support", dk: "supportDesc", color: "text-violet-600", bg: "bg-violet-50" },
    { Icon: RotateCcw, tk: "easyReturns", dk: "easyReturnsDesc", color: "text-rose-600", bg: "bg-rose-50" },
    { Icon: Gift, tk: "loyaltyRewards", dk: "loyaltyRewardsDesc", color: "text-amber-600", bg: "bg-amber-50" },
  ];
  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        <SectionHeading title={t.trustTitle} lang={lang} viewAll={false} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map(({ Icon, tk, dk, color, bg }) => (
            <div key={tk} className={`flex flex-col items-center text-center p-5 rounded-2xl ${bg} border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm"><Icon className={`w-6 h-6 ${color}`} /></div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">{t[tk]}</h4>
              <p className="text-xs text-gray-500 leading-snug">{t[dk]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <MobileHomeHero lang={lang} />
      <HeroSlider lang={lang} />
      <QuickServicesSection lang={lang} />
      <NationAndTopCategoriesSection lang={lang} />
      <MainCategoriesSection lang={lang} />
      <section className="pb-8 bg-white">
        <div className="section-container">
          <SectionOneStaticBanner
            lang={lang}
            banner={SECTION_ONE_STATIC_BANNER_TWO}
            height={350}
            className=""
          />
        </div>
      </section>
      <TopBrandsSection lang={lang} />
      <ProductsYouLoveSection lang={lang} />
      <section className="pt-2 pb-2 bg-white">
        <div className="section-container">
          <CategoryPromoBanner
            lang={lang}
            variant="beauty"
            titleKey="beautyStoreTitle"
            productIds={[PRODUCTS[0].id, PRODUCTS[2].id, PRODUCTS[5].id, PRODUCTS[6].id]}
          />
        </div>
      </section>
      <ExploreBeautyCategoriesSection lang={lang} />
      <section className="pt-2 pb-2 bg-white">
        <div className="section-container">
          <CategoryPromoBanner
            lang={lang}
            variant="mombaby"
            titleKey="momBabyStoreTitle"
            productIds={[PRODUCTS[0].id, PRODUCTS[4].id, PRODUCTS[3].id, PRODUCTS[9].id]}
          />
        </div>
      </section>
      <GentleCareMomBabySection lang={lang} />
      <ProductSection lang={lang} title={t.products1Title} products={PRODUCTS.slice(0, 12)} bg="bg-gray-50" />
      <ProductSection lang={lang} title={t.products2Title} products={PRODUCTS.slice(2, 10)} bg="bg-white" />
      <ProductSection lang={lang} title={t.products3Title} products={[...PRODUCTS].reverse()} bg="bg-gray-50" />
      <MobileAppDownloadSection lang={lang} />
      <TrustSection lang={lang} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — PRODUCTS LISTING
// ═══════════════════════════════════════════════════════════════════════════════
function ProductsListingPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allBrands = [...new Set(PRODUCTS.map(p => p.brand))];
  const allCats = [...new Set(PRODUCTS.map(p => p.category))];

  const filtered = PRODUCTS.filter(p => {
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
    if (selectedCats.length && !selectedCats.includes(p.category)) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (p.rating < minRating) return false;
    if (prescriptionOnly && !p.isPrescription) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  const hasFilters = selectedBrands.length > 0 || selectedCats.length > 0 || minRating > 0 || prescriptionOnly;
  const clearAll = () => { setSelectedBrands([]); setSelectedCats([]); setMinPrice(0); setMaxPrice(50000); setMinRating(0); setPrescriptionOnly(false); setInStockOnly(false); };

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">{lang === "ar" ? "العلامات التجارية" : "Brands"}</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleArr(selectedBrands, setSelectedBrands, brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#0b7a6e] focus:ring-[#0b7a6e]" />
              <span className="text-sm text-gray-700 group-hover:text-[#0b7a6e] transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">{lang === "ar" ? "الفئات" : "Categories"}</h4>
        <div className="space-y-2">
          {allCats.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleArr(selectedCats, setSelectedCats, cat)}
                className="w-4 h-4 rounded border-gray-300 text-[#0b7a6e] focus:ring-[#0b7a6e]" />
              <span className="text-sm text-gray-700 group-hover:text-[#0b7a6e] capitalize transition-colors">{t[cat] ?? cat}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">{t.priceRange}</h4>
        <div className="flex gap-2 items-center">
          <input type="number" value={minPrice} min={0} max={maxPrice} onChange={e => setMinPrice(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30" placeholder={t.minPrice} />
          <span className="text-gray-400 font-medium">—</span>
          <input type="number" value={maxPrice} min={minPrice} max={100000} onChange={e => setMaxPrice(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30" placeholder={t.maxPrice} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{t.kwd} {minPrice} — {t.kwd} {maxPrice}</p>
      </div>
      {/* Rating */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">{t.minRating}</h4>
        <div className="flex gap-1.5 flex-wrap">
          {[0, 1, 2, 3, 4].map(r => (
            <button key={r} onClick={() => setMinRating(r === minRating ? 0 : r)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${minRating === r && r > 0 ? "bg-[#0b7a6e] text-white border-[#0b7a6e]" : "border-gray-200 text-gray-600 hover:border-[#0b7a6e]/40"}`}>
              {r === 0 ? (lang === "ar" ? "الكل" : "All") : <>{r}+ <Star className="w-3 h-3 text-amber-400 fill-amber-400" /></>}
            </button>
          ))}
        </div>
      </div>
      {/* Toggles */}
      <div className="space-y-3 pt-1 border-t border-gray-100">
        {[{ key: "prescriptionOnly", val: prescriptionOnly, set: setPrescriptionOnly, label: t.prescriptionOnly },
          { key: "inStockOnly", val: inStockOnly, set: setInStockOnly, label: t.inStockOnly }].map(({ key, val, set, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">{label}</span>
            <button onClick={() => set(!val)} className={`relative w-11 h-6 rounded-full transition-colors ${val ? "bg-[#0b7a6e]" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? (lang === "ar" ? "translate-x-0.5" : "translate-x-5") : (lang === "ar" ? "translate-x-5" : "translate-x-0.5")}`} />
            </button>
          </label>
        ))}
      </div>
      {hasFilters && <button onClick={clearAll} className="w-full py-2 text-sm font-semibold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors">{t.clearAll}</button>}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="section-container flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => goTo("home")} className="hover:text-[#0b7a6e] transition-colors">{t.home2}</button>
          <ChevronRight className="w-3.5 h-3.5 flex-none" />
          <span className="text-gray-800 font-medium">{t.allProducts}</span>
        </div>
      </div>

      <div className="section-container py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:border-[#0b7a6e] transition-colors">
              <Filter className="w-4 h-4" />{t.filters}
              {hasFilters && <span className="w-5 h-5 bg-[#0b7a6e] text-white text-[10px] font-black rounded-full flex items-center justify-center">{selectedBrands.length + selectedCats.length + (minRating > 0 ? 1 : 0)}</span>}
            </button>
            <span className="text-sm text-gray-500">{filtered.length} {t.results}</span>
            {/* Active filter chips */}
            {selectedBrands.map(b => <span key={b} className="flex items-center gap-1 text-xs bg-[#0b7a6e]/10 text-[#0b7a6e] font-semibold px-2.5 py-1 rounded-full">{b}<button onClick={() => toggleArr(selectedBrands, setSelectedBrands, b)}><X className="w-3 h-3" /></button></span>)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 bg-white">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#0b7a6e] text-white" : "text-gray-400 hover:text-gray-600"}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#0b7a6e] text-white" : "text-gray-400 hover:text-gray-600"}`}><List className="w-4 h-4" /></button>
            </div>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pe-8 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30 cursor-pointer">
                {[["featured", t.sortFeatured], ["priceLow", t.sortPriceLow], ["priceHigh", t.sortPriceHigh], ["rating", t.sortRating], ["newest", t.sortNewest]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block flex-none w-60 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-36">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#0b7a6e]" />{t.filters}</h3>
              {hasFilters && <button onClick={clearAll} className="text-xs text-rose-500 hover:underline font-semibold">{t.clearAll}</button>}
            </div>
            <Sidebar />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className={`relative bg-white w-72 max-w-[85vw] h-full overflow-y-auto shadow-2xl flex flex-col ${lang === "ar" ? "ms-auto" : ""}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#0b7a6e]" />{t.filters}</h3>
                  <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto"><Sidebar /></div>
                <div className="p-4 border-t border-gray-100">
                  <button onClick={() => setSidebarOpen(false)} className="w-full py-3 bg-[#0b7a6e] text-white font-bold rounded-xl hover:bg-[#09655b]">
                    {lang === "ar" ? `عرض ${filtered.length} نتيجة` : `Show ${filtered.length} Results`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">{t.noProducts}</p>
                <button onClick={clearAll} className="mt-3 text-sm text-[#0b7a6e] font-semibold hover:underline">{t.clearFilters}</button>
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? PRODUCT_GRID
                : "flex flex-col gap-3"}>
                {filtered.map(p => viewMode === "grid" ? (
                  <div key={p.id} onClick={() => goTo("product", p)} className="cursor-pointer">
                    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-250 flex flex-col">
                      <div className="relative bg-gray-50 h-44 overflow-hidden">
                        <img src={p.img} alt={lang === "ar" ? p.nameAr : p.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        {p.isPrescription && <span className="absolute top-2.5 start-2.5 text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-md">Rx</span>}
                        {p.badge && <span className={`absolute ${p.isPrescription ? "top-8" : "top-2.5"} start-2.5 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${p.badge === "SALE" ? "bg-rose-500 text-white" : "bg-[#0b7a6e] text-white"}`}>{p.badge === "SALE" ? t.sale : t.new}</span>}
                      </div>
                      <div className="p-3.5 flex flex-col flex-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{p.brand}</p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-1">{lang === "ar" ? p.nameAr : p.nameEn}</p>
                        <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= p.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}<span className="text-[10px] text-gray-400 ms-1">({p.reviews})</span></div>
                        <div className="flex items-end justify-between">
                          <ProductPriceDisplay product={p} lang={lang} size="md" />
                          <button onClick={(e) => { e.stopPropagation(); useNav().addToCart(p); }} className="w-8 h-8 rounded-xl bg-[#0b7a6e] text-white flex items-center justify-center hover:bg-[#09655b] transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={p.id} onClick={() => goTo("product", p)}
                    className="cursor-pointer group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4">
                    <div className="w-28 h-28 flex-none rounded-xl overflow-hidden bg-gray-50">
                      <img src={p.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {p.isPrescription && <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-md me-1">Rx</span>}
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{p.brand}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1.5">{lang === "ar" ? p.nameAr : p.nameEn}</p>
                      <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= p.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}<span className="text-[10px] text-gray-400 ms-1">({p.reviews})</span></div>
                      <div className="flex items-center justify-between">
                        <ProductPriceDisplay product={p} lang={lang} size="md" />
                        <button onClick={(e) => { e.stopPropagation(); useNav().addToCart(p); }} className="flex items-center gap-1.5 bg-[#0b7a6e] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#09655b]"><Plus className="w-3.5 h-3.5" />{t.addToCart}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ChevronLeft className="w-4 h-4" /></button>
                {[1,2,3,4,5].map(n => <button key={n} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${n === 1 ? "bg-[#0b7a6e] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{n}</button>)}
                <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function ProductDetailPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { currentProduct: p, goTo, addToCart, wishIds, toggleWish } = useNav();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "benefits" | "ingredients" | "howToUse" | "reviews">("description");
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [added, setAdded] = useState(false);
  const [strength, setStrength] = useState(0);

  const wished = wishIds.has(p.id);
  const disc = p.orig ? Math.round(((p.orig - p.price) / p.orig) * 100) : null;
  const gallery = [p.img, ...PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3).map(x => x.img)];
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 6);

  const strengths: Record<string, string[][]> = {
    rice:        [["1kg", "1 كغ"], ["5kg", "5 كغ"], ["10kg", "10 كغ"]],
    oil:         [["1L", "1 لتر"], ["1.5L", "1.5 لتر"], ["3L", "3 لتر"]],
    sugar:       [["1kg", "1 كغ"], ["2kg", "2 كغ"], ["5kg", "5 كغ"]],
    ghee:        [["200g", "200 غ"], ["500g", "500 غ"], ["1kg", "1 كغ"]],
    vegetables:  [["200g", "200 غ"], ["400g", "400 غ"], ["1kg", "1 كغ"]],
    canned:      [["200g", "200 غ"], ["400g", "400 غ"], ["600g", "600 غ"]],
  };
  const variantOptions = strengths[p.category] ?? strengths.rice;

  const detailContent: Record<string, { descEn: string; descAr: string; benefitsEn: string[]; benefitsAr: string[]; ingEn: string; ingAr: string; htEn: string; htAr: string }> = {
    rice: {
      descEn: "Premium Syrian rice and grains from trusted factories. Clean, well-packed, and priced at factory rates for حصري members.",
      descAr: "رز وحبوب سورية من مصانع موثوقة. نظيفة ومعبأة جيداً وبأسعار المصنع لمشتركي حصري.",
      benefitsEn: ["Factory member pricing", "Suitable for daily family cooking", "Clear packing size on the label", "Damascus delivery within 2 days", "From known Syrian brands"],
      benefitsAr: ["أسعار المصنع للمشتركين", "مناسب للطبخ اليومي العائلي", "وزن واضح على العبوة", "توصيل دمشق خلال يومين", "من علامات سورية معروفة"],
      ingEn: "Rice / grains as labeled on the pack. No additives unless stated on the package.",
      ingAr: "رز / حبوب حسب الموضح على العبوة. بدون إضافات إلا ما هو مكتوب على الغلاف.",
      htEn: "Store in a cool dry place. Keep sealed after opening. Cook according to package instructions.",
      htAr: "يُحفظ في مكان بارد وجاف. أعد إغلاق العبوة بعد الفتح. اطبخ حسب إرشادات العبوة.",
    },
    oil: {
      descEn: "Cooking oils from Syrian factories for everyday frying and kitchen use, at حصري factory prices.",
      descAr: "زيوت طبخ من مصانع سورية للقلي والاستخدام اليومي، بأسعار المصنع عبر حصري.",
      benefitsEn: ["Clear bottle size options", "Everyday kitchen use", "Factory pricing for members", "Sealed packaging", "Damascus delivery"],
      benefitsAr: ["أحجام عبوات واضحة", "للاستخدام اليومي في المطبخ", "أسعار مصنع للمشتركين", "تعبئة محكمة", "توصيل دمشق"],
      ingEn: "Vegetable cooking oil as stated on the label (sunflower, corn, or frying blend).",
      ingAr: "زيت نباتي للطبخ حسب الموضح على العبوة (دوار الشمس أو ذرة أو قلي).",
      htEn: "Store away from heat and sunlight. Close the bottle tightly after use.",
      htAr: "يُحفظ بعيداً عن الحرارة وضوء الشمس. أغلق العبوة جيداً بعد الاستخدام.",
    },
    sugar: {
      descEn: "Sugar, tea, and dry pantry staples for Syrian households — factory-priced for subscribers.",
      descAr: "سكر وشاي وأساسيات تموين جافة للمنازل السورية — بأسعار المصنع للمشتركين.",
      benefitsEn: ["Everyday pantry staple", "Clear weight on pack", "Member factory price", "Easy to store", "Trusted local brands"],
      benefitsAr: ["أساسي يومي في المونة", "وزن واضح على العبوة", "سعر المصنع للمشتركين", "سهل التخزين", "علامات محلية موثوقة"],
      ingEn: "White sugar, tea, or dry goods as labeled.",
      ingAr: "سكر أبيض أو شاي أو مواد جافة حسب الموضح على العبوة.",
      htEn: "Keep dry and sealed. Away from moisture.",
      htAr: "يُحفظ جافاً ومغلقاً بعيداً عن الرطوبة.",
    },
    ghee: {
      descEn: "Butter, cream, and baladi ghee for Syrian cooking — exclusive member pricing on حصري.",
      descAr: "زبدة وقشطة وسمن بلدي للطبخ السوري — بأسعار المشتركين في حصري.",
      benefitsEn: ["Rich taste for cooking", "Factory / member price", "Sealed packs", "Popular Syrian brands", "Damascus delivery"],
      benefitsAr: ["طعم غني للطبخ", "سعر مصنع / مشتركين", "عبوات محكمة", "علامات سورية شائعة", "توصيل دمشق"],
      ingEn: "Dairy fat / ghee as labeled on the package.",
      ingAr: "دهون ألبان / سمن حسب الموضح على العبوة.",
      htEn: "Refrigerate after opening if the label requires it. Use by the date on the pack.",
      htAr: "برّد بعد الفتح إذا طلبت العبوة ذلك. استخدم قبل تاريخ الانتهاء.",
    },
    vegetables: {
      descEn: "Legumes and spices for Syrian kitchens — lentils, chickpeas, za'atar and blends at factory prices.",
      descAr: "بقوليات وتوابل للمطبخ السوري — عدس وحمص وزعتر وبهارات بأسعار المصنع.",
      benefitsEn: ["Pantry essentials", "Clear pack weights", "Member savings", "Trusted spice brands", "Ready for everyday meals"],
      benefitsAr: ["أساسيات المونة", "أوزان عبوات واضحة", "توفير للمشتركين", "علامات توابل موثوقة", "جاهزة للطبخ اليومي"],
      ingEn: "Dried legumes or spice blend as labeled.",
      ingAr: "بقوليات جافة أو خلطة بهارات حسب الموضح على العبوة.",
      htEn: "Store sealed in a cool dry cupboard. Rinse legumes before cooking.",
      htAr: "يُحفظ مغلقاً في مكان بارد وجاف. اغسل البقوليات قبل الطبخ.",
    },
    canned: {
      descEn: "Canned staples — foul, hummus, tahini, mortadella, jam and pickles — at حصري factory prices.",
      descAr: "معلبات أساسية — فول وحمص وطحينة ومرتديلا ومربى ومخلل — بأسعار المصنع في حصري.",
      benefitsEn: ["Ready pantry stock", "Long shelf life", "Member factory price", "Popular Syrian brands", "Damascus delivery within 2 days"],
      benefitsAr: ["مونة جاهزة", "صلاحية طويلة", "سعر مصنع للمشتركين", "علامات سورية معروفة", "توصيل دمشق خلال يومين"],
      ingEn: "As listed on the can or jar label.",
      ingAr: "حسب القائمة المطبوعة على العبوة.",
      htEn: "Store unopened in a cool place. Refrigerate after opening and consume promptly.",
      htAr: "احفظ العبوة غير المفتوحة في مكان بارد. بعد الفتح احفظ في البراد واستهلك بسرعة.",
    },
  };
  const detail = detailContent[p.category] ?? detailContent.rice;

  const ratingBreakdown = [
    { stars: 5, pct: 68 }, { stars: 4, pct: 20 }, { stars: 3, pct: 7 }, { stars: 2, pct: 3 }, { stars: 1, pct: 2 },
  ];

  const handleAddToCart = () => {
    addToCart(p, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="section-container flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <button onClick={() => goTo("home")} className="hover:text-[#0b7a6e]">{t.home2}</button>
          <ChevronRight className="w-3.5 h-3.5 flex-none" />
          <button onClick={() => goTo("listing")} className="hover:text-[#0b7a6e] capitalize">{t[p.category] ?? p.category}</button>
          <ChevronRight className="w-3.5 h-3.5 flex-none" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{lang === "ar" ? p.nameAr : p.nameEn}</span>
        </div>
      </div>

      <div className="section-container py-8">
        {/* ── Top: Gallery + Info ── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square shadow-sm group">
              <img src={gallery[galleryIdx]} alt={lang === "ar" ? p.nameAr : p.nameEn} className="w-full h-full object-cover" />
              {p.isPrescription && <div className="absolute top-4 start-4 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5"><FileText className="w-4 h-4" />{t.prescriptionRequired}</div>}
              {disc && <div className="absolute top-4 end-4 bg-rose-500 text-white text-sm font-black px-3 py-1.5 rounded-xl">-{disc}%</div>}
              <button className="absolute bottom-4 end-4 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-gray-600 hover:text-[#0b7a6e]">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2.5">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === galleryIdx ? "border-[#0b7a6e] shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Brand + badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#0b7a6e] uppercase tracking-wider bg-[#0b7a6e]/10 px-2.5 py-1 rounded-full">{p.brand}</span>
              {p.isPrescription && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{t.prescriptionRequired}</span>}
              {p.badge && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.badge === "SALE" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-[#0b7a6e]/10 text-[#0b7a6e]"}`}>{p.badge === "SALE" ? t.sale : t.new}</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>
              {lang === "ar" ? p.nameAr : p.nameEn}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= p.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}</div>
              <span className="text-sm font-semibold text-gray-700">{p.rating}.0</span>
              <span className="text-sm text-gray-400">({p.reviews.toLocaleString()} {t.reviews})</span>
              <span className="text-sm text-emerald-600 font-semibold">{t.inStock}</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <ProductPriceDisplay product={p} lang={lang} size="lg" />
              </div>
            </div>

            {/* Prescription info box */}
            {p.isPrescription && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-none mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 mb-1">{t.prescriptionRequired}</p>
                  <p className="text-xs text-amber-700 leading-relaxed mb-3">{t.prescriptionInfo}</p>
                  <button onClick={() => setPrescriptionModal(true)} className="inline-flex items-center gap-2 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors">
                    <Upload className="w-3.5 h-3.5" />{t.uploadPrescription}
                  </button>
                </div>
              </div>
            )}

            {/* Variants */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">{lang === "ar" ? "الحجم" : "Size"}</p>
              <div className="flex flex-wrap gap-2">
                {variantOptions.map(([en, ar], i) => (
                  <button key={i} onClick={() => setStrength(i)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${strength === i ? "border-[#0b7a6e] bg-[#0b7a6e]/5 text-[#0b7a6e]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {lang === "ar" ? ar : en}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-gray-700">{t.qty}</p>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center text-sm font-bold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all duration-200 min-w-[140px] ${added ? "bg-emerald-500 text-white" : "bg-[#0b7a6e] text-white hover:bg-[#09655b] shadow-lg shadow-[#0b7a6e]/20"}`}>
                {added ? <><Check className="w-5 h-5" />{t.added}</> : <><ShoppingCart className="w-5 h-5" />{t.addToCart}</>}
              </button>
              <button onClick={() => { addToCart(p, qty); goTo("checkout"); }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#c9a85c] text-white font-bold py-3.5 rounded-2xl hover:bg-[#b8943f] shadow-lg shadow-[#c9a85c]/20 transition-all min-w-[140px]">
                {t.buyNow}
              </button>
              <button onClick={() => goTo("subscription", p)}
                className="flex items-center justify-center gap-2 border-2 border-[#0b7a6e] text-[#0b7a6e] font-bold py-3.5 px-4 rounded-2xl hover:bg-[#0b7a6e]/5 transition-all">
                <Repeat className="w-4 h-4 flex-none" />
                <span className="text-sm whitespace-nowrap">{t.subscribeAndSave}</span>
              </button>
              <button onClick={() => toggleWish(p.id)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wished ? "border-rose-300 bg-rose-50 text-rose-500" : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400"}`}>
                <Heart className="w-5 h-5" fill={wished ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
              {[{ I: Truck, en: `${t.estimatedDelivery}: خلال يومين`, ar: `${t.estimatedDelivery}: خلال يومين` },
                { I: Shield, en: t.freeDeliveryLabel + " للطلبات فوق 50,000 ل.س", ar: t.freeDeliveryLabel + " للطلبات فوق 50,000 ل.س" },
                { I: RotateCcw, en: lang === "ar" ? t.easyReturns : "Easy 7-day returns", ar: t.easyReturns }].map(({ I, en, ar }) => (
                <div key={en} className="flex items-center gap-3 text-sm text-gray-600">
                  <I className="w-4 h-4 text-[#0b7a6e] flex-none" />
                  {lang === "ar" ? ar : en}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-10 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100 [scrollbar-width:none]">
            {(["description","benefits","ingredients","howToUse","reviews"] as const).map(tabId => (
              <button key={tabId} onClick={() => setTab(tabId)}
                className={`flex-none px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${tab === tabId ? "text-[#0b7a6e] border-[#0b7a6e]" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
                {t[tabId]}{tabId === "reviews" && <span className="ms-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{p.reviews}</span>}
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-8">
            {tab === "description" && <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{lang === "ar" ? detail.descAr : detail.descEn}</p>}
            {tab === "benefits" && (
              <ul className="space-y-3">
                {(lang === "ar" ? detail.benefitsAr : detail.benefitsEn).map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[#0b7a6e]/10 flex items-center justify-center flex-none mt-0.5"><Check className="w-3 h-3 text-[#0b7a6e]" /></span>{b}
                  </li>
                ))}
              </ul>
            )}
            {tab === "ingredients" && <p className="text-gray-700 leading-relaxed text-sm">{lang === "ar" ? detail.ingAr : detail.ingEn}</p>}
            {tab === "howToUse" && <p className="text-gray-700 leading-relaxed text-sm">{lang === "ar" ? detail.htAr : detail.htEn}</p>}
            {tab === "reviews" && (
              <div className="space-y-8">
                {/* Rating summary */}
                <div className="flex gap-8 flex-wrap">
                  <div className="text-center">
                    <div className="text-6xl font-black text-gray-900">{p.rating}.0</div>
                    <div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= p.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}</div>
                    <p className="text-sm text-gray-400">{p.reviews.toLocaleString()} {t.reviews}</p>
                  </div>
                  <div className="flex-1 space-y-2 min-w-[200px]">
                    {ratingBreakdown.map(({ stars, pct }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex gap-0.5 flex-none">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= stars ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                        <span className="text-xs text-gray-400 w-8 text-end">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Reviews list */}
                <div className="space-y-5">
                  {MOCK_REVIEWS.map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">{lang === "ar" ? r.nameAr : r.nameEn}</span>
                            {r.verified && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />{t.verifiedPurchase}</span>}
                          </div>
                          <div className="flex items-center gap-2"><div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" />)}</div><span className="text-xs text-gray-400">{r.date}</span></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">{lang === "ar" ? r.textAr : r.textEn}</p>
                      <p className="text-xs text-gray-400">{r.helpful} {t.people} {t.helpful}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 border-2 border-[#0b7a6e] text-[#0b7a6e] font-bold rounded-2xl hover:bg-[#0b7a6e]/5 transition-colors">{t.writeReview}</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div>
            <SectionHeading title={t.relatedProducts} lang={lang} />
            <ProductScrollRow lang={lang} products={related} />
          </div>
        )}
      </div>

      {/* Prescription Upload Modal */}
      {prescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPrescriptionModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8">
            <button onClick={() => setPrescriptionModal(false)} className="absolute top-4 end-4 w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X className="w-5 h-5 text-gray-500" /></button>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4"><FileText className="w-7 h-7 text-amber-500" /></div>
            <h3 className="text-lg font-black text-gray-900 mb-2">{t.uploadPrescription}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">{t.prescriptionInfo}</p>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-4 hover:border-[#0b7a6e]/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600">{lang === "ar" ? "اسحب الملف وأفلته هنا أو انقر للتحديد" : "Drag & drop or click to select"}</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF — max 10MB</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPrescriptionModal(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
              <button onClick={() => setPrescriptionModal(false)} className="flex-1 py-3 bg-[#0b7a6e] text-white font-bold rounded-2xl hover:bg-[#09655b]">{lang === "ar" ? "رفع" : "Upload"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — CART
// ═══════════════════════════════════════════════════════════════════════════════
function CartPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { cartItems, removeFromCart, updateQty, goTo } = useNav();
  const [usePoints, setUsePoints] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const promoDiscount = 0;
  const pointsDiscount = usePoints ? 2.500 : 0;
  const baseDelivery = subtotal >= 50000 ? 0 : 1.500;
  const deliveryFee = baseDelivery;
  const total = Math.max(0, subtotal - promoDiscount - pointsDiscount + deliveryFee);

  if (cartItems.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 py-20 bg-gray-50">
      <ShoppingCart className="w-16 h-16 text-gray-300" />
      <h2 className="text-xl font-black text-gray-700">{t.emptyCart}</h2>
      <button onClick={() => goTo("listing")} className="flex items-center gap-2 bg-[#0b7a6e] text-white font-bold px-7 py-3 rounded-2xl hover:bg-[#09655b] transition-colors">
        {lang === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}{t.continueShopping}
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="section-container flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => goTo("home")} className="hover:text-[#0b7a6e]">{t.home2}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">{t.yourCart}</span>
        </div>
      </div>
      <div className="section-container py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>
            {t.yourCart} <span className="text-base font-semibold text-gray-400 ms-2">({cartItems.reduce((s, i) => s + i.qty, 0)} {cartItems.reduce((s, i) => s + i.qty, 0) === 1 ? t.itemCount : t.itemsCount})</span>
          </h1>
        </div>
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Items */}
          <div className="space-y-4">
            {cartItems.map(({ product: p, qty }) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-none cursor-pointer" onClick={() => goTo("product", p)}>
                  <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{p.brand}</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-[#0b7a6e]" onClick={() => goTo("product", p)}>
                        {lang === "ar" ? p.nameAr : p.nameEn}
                      </p>
                      {p.isPrescription && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">Rx</span>}
                    </div>
                    <button onClick={() => removeFromCart(p.id)} className="text-gray-300 hover:text-rose-400 transition-colors p-1 flex-none"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(p.id, qty - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-10 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => updateQty(p.id, qty + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-[#0b7a6e]">{t.kwd} {fmt(p.price * qty)}</p>
                      {qty > 1 && <p className="text-xs text-gray-400">{t.kwd} {fmt(p.price)} {lang === "ar" ? "للوحدة" : "each"}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Loyalty points */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Award className="w-5 h-5 text-amber-500" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{t.usePoints}</h3>
                    <p className="text-xs text-gray-400">{t.pointsBalance} <span className="font-semibold text-amber-600">2,500 pts</span> {lang === "ar" ? "= 2,500 ل.س" : "= 2.500"}</p>
                  </div>
                </div>
                <button onClick={() => setUsePoints(!usePoints)} className={`relative w-12 h-6 rounded-full transition-colors ${usePoints ? "bg-[#0b7a6e]" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${usePoints ? (lang === "ar" ? "translate-x-0.5" : "translate-x-6") : (lang === "ar" ? "translate-x-6" : "translate-x-0.5")}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary — sticky */}
          <div className="sticky top-36 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-gray-900 text-lg">{t.orderSummary}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600"><span>{t.subtotal}</span><span className="font-semibold text-gray-900">{t.kwd} {fmt(subtotal)}</span></div>
                {usePoints && <div className="flex justify-between text-amber-600"><span>{t.loyaltyDiscount}</span><span className="font-semibold">-{t.kwd} {fmt(pointsDiscount)}</span></div>}
                <div className="flex justify-between text-gray-600">
                  <span>{t.delivery}</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? "text-emerald-600" : "text-gray-900"}`}>{deliveryFee === 0 ? t.deliveryFree : `${t.kwd} ${fmt(deliveryFee)}`}</span>
                </div>
                {deliveryFee > 0 && <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">{lang === "ar" ? "أضف " + fmt(50000 - subtotal) + " ل.س للتوصيل المجاني" : `Add ${t.kwd} ${fmt(50000 - subtotal)} more for free delivery`}</p>}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-black text-gray-900 text-base">{t.total}</span>
                <span className="font-black text-xl text-[#0b7a6e]">{t.kwd} {fmt(total)}</span>
              </div>
              <button onClick={() => goTo("checkout")} className="w-full py-4 bg-[#0b7a6e] text-white font-black rounded-2xl hover:bg-[#09655b] transition-all shadow-lg shadow-[#0b7a6e]/20 text-base">
                {t.proceedToCheckout}
              </button>
              <button onClick={() => goTo("listing")} className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                {lang === "ar" ? <span className="flex items-center justify-center gap-1"><ChevronRight className="w-4 h-4" />{t.continueShopping}</span> : <span className="flex items-center justify-center gap-1"><ChevronLeft className="w-4 h-4" />{t.continueShopping}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════
function CheckoutPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { cartItems, goTo, deliveryLocation, openLocationModal } = useNav();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [selAddress, setSelAddress] = useState<"header" | number>("header");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("knet");
  const [usePoints, setUsePoints] = useState(false);
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const savedAddresses = [
    { id: 0, nameEn: "Home", nameAr: "المنزل", addrEn: "University St — Mezzeh, Damascus", addrAr: "شارع الجامعة — المزة، دمشق" },
    { id: 1, nameEn: "Work", nameAr: "العمل", addrEn: "Al-Hamra Tower, Floor 18 — دمشق", addrAr: "برج الحمراء، الطابق 18 — دمشق" },
  ];

  const selectedAddressText = selAddress === "header"
    ? (lang === "ar" ? deliveryLocation.addressAr : deliveryLocation.addressEn)
    : (lang === "ar" ? savedAddresses[selAddress].addrAr : savedAddresses[selAddress].addrEn);
  const selectedAddressLabel = selAddress === "header"
    ? (lang === "ar" ? deliveryLocation.areaAr : deliveryLocation.areaEn)
    : (lang === "ar" ? savedAddresses[selAddress].nameAr : savedAddresses[selAddress].nameEn);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const baseDelivery = deliveryMethod === "express" ? 2.000 : subtotal >= 50000 ? 0 : 1.500;
  const deliveryFee = baseDelivery;
  const pointsDiscount = usePoints ? 2.500 : 0;
  const promoDiscount = 0;
  const total = Math.max(0, subtotal + deliveryFee - pointsDiscount - promoDiscount);

  const orderNum = `ARC-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
  const steps = [t.step1, t.step2, t.step3];

  const OrderSummary = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-36">
      <h3 className="font-black text-gray-900">{t.orderSummary}</h3>
      <div className="space-y-2 max-h-52 overflow-y-auto">
        {cartItems.map(({ product: p, qty }) => (
          <div key={p.id} className="flex items-center gap-3 py-1">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-none"><img src={p.img} alt="" className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 line-clamp-1">{lang === "ar" ? p.nameAr : p.nameEn}</p>
              <p className="text-xs text-gray-400">x{qty}</p>
            </div>
            <span className="text-xs font-bold text-gray-700 flex-none">{t.kwd} {fmt(p.price * qty)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600"><span>{t.subtotal}</span><span className="font-semibold">{t.kwd} {fmt(subtotal)}</span></div>
        <div className="flex justify-between text-gray-600"><span>{t.delivery}</span><span className={`font-semibold ${deliveryFee === 0 ? "text-emerald-600" : ""}`}>{deliveryFee === 0 ? t.deliveryFree : `${t.kwd} ${fmt(deliveryFee)}`}</span></div>
        {usePoints && <div className="flex justify-between text-amber-600"><span>{t.loyaltyDiscount}</span><span>-{t.kwd} {fmt(pointsDiscount)}</span></div>}
        <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-100 pt-2">
          <span>{t.total}</span><span className="text-[#0b7a6e]">{t.kwd} {fmt(total)}</span>
        </div>
      </div>
    </div>
  );

  // Order confirmed screen
  if (confirmed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>{t.orderPlaced}</h1>
        <p className="text-gray-500 text-sm mb-6">{lang === "ar" ? "سيتم تسليم طلبك في أقرب وقت ممكن." : "Your order is being prepared and will be delivered soon."}</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-400 mb-1">{t.orderNumber}</p>
          <p className="text-xl font-black text-[#0b7a6e]">#{orderNum}</p>
          <p className="text-xs text-gray-400 mt-3">{t.estDelivery}</p>
          <p className="text-sm font-semibold text-gray-700">{t.deliveryToday}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 border-2 border-[#0b7a6e] text-[#0b7a6e] font-bold rounded-2xl hover:bg-[#0b7a6e]/5 text-sm">{t.trackOrder}</button>
          <button onClick={() => goTo("home")} className="flex-1 py-3 bg-[#0b7a6e] text-white font-bold rounded-2xl hover:bg-[#09655b] text-sm">{t.continueShopping}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb + step indicator */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="section-container">
          <div className="flex items-center justify-center gap-0 mb-1">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === i + 1 ? "bg-[#0b7a6e]/10" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-all ${i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-[#0b7a6e] text-white" : "bg-gray-200 text-gray-500"}`}>
                    {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${i + 1 === step ? "text-[#0b7a6e]" : i + 1 < step ? "text-emerald-600" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 ${i + 1 < step ? "bg-emerald-300" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-5">
            {/* ── Step 1: Delivery ── */}
            {step === 1 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-black text-gray-900 text-lg">{t.savedAddresses}</h2>
                    <button type="button" onClick={openLocationModal} className="text-sm font-bold text-[#0b7a6e] hover:underline">{t.changeLocation}</button>
                  </div>
                  <div className="space-y-3">
                    <label className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selAddress === "header" ? "border-[#0b7a6e] bg-[#0b7a6e]/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="radio" checked={selAddress === "header"} onChange={() => setSelAddress("header")} className="mt-0.5 accent-[#0b7a6e]" />
                      <div>
                        <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                          {lang === "ar" ? deliveryLocation.areaAr : deliveryLocation.areaEn}
                          <span className="text-[10px] font-bold text-[#0b7a6e] bg-[#0b7a6e]/10 px-2 py-0.5 rounded-full">{t.usingDeliveryLocation}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{lang === "ar" ? deliveryLocation.addressAr : deliveryLocation.addressEn}</p>
                      </div>
                    </label>
                    {savedAddresses.map((a, i) => (
                      <label key={a.id} className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selAddress === i ? "border-[#0b7a6e] bg-[#0b7a6e]/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" checked={selAddress === i} onChange={() => setSelAddress(i)} className="mt-0.5 accent-[#0b7a6e]" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{lang === "ar" ? a.nameAr : a.nameEn}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{lang === "ar" ? a.addrAr : a.addrEn}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setShowAddForm(!showAddForm)} className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0b7a6e] hover:underline">
                    <Plus className="w-4 h-4" />{t.addNewAddress}
                  </button>
                  {showAddForm && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      {[[t.fullName, "text"], [t.phoneNumber, "tel"], [t.area, "text"], [t.building, "text"], [t.floor, "text"], [t.apartment, "text"]].map(([label, type]) => (
                        <div key={label}><label className="block text-xs font-bold text-gray-600 mb-1">{label}</label><input type={type} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30" /></div>
                      ))}
                      <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">{t.specialInstructions}</label><textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30 resize-none" /></div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-black text-gray-900 mb-5 text-lg">{t.deliveryMethod}</h2>
                  <div className="space-y-3">
                    {[["express", t.expressDelivery, t.expressDesc, t.expressPrice, "⚡"],
                      ["standard", t.standardDelivery, t.standardDesc, t.standardPrice, "🚚"],
                      ["scheduled", t.scheduledDelivery, t.scheduledDesc, lang === "ar" ? "اختر الوقت" : "Choose Slot", "📅"]].map(([id, name, desc, price, icon]) => (
                      <label key={id} className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryMethod === id ? "border-[#0b7a6e] bg-[#0b7a6e]/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" checked={deliveryMethod === id} onChange={() => setDeliveryMethod(id)} className="mt-1 accent-[#0b7a6e]" />
                        <span className="text-xl">{icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{name}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <span className={`text-sm font-black ${price === t.standardPrice ? "text-emerald-600" : "text-gray-700"}`}>{price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-black text-gray-900 mb-5 text-lg">{t.paymentInfo}</h2>
                  <div className="grid sm:grid-cols-2 gap-3 mb-5">
                    {([["knet", t.knet], ["cod", t.cashOnDelivery]] as const).map(([id, name]) => (
                      <label key={id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === id ? "border-[#0b7a6e] bg-[#0b7a6e]/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <input type="radio" checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="accent-[#0b7a6e]" />
                        {id === "knet" ? (
                          <ShamCashLogo className="h-8 w-auto object-contain" />
                        ) : (
                          <span className="text-xl">💵</span>
                        )}
                        <span className="font-semibold text-sm text-gray-800">{name}</span>
                      </label>
                    ))}
                  </div>
                  {paymentMethod === "card" && (
                    <div className="grid sm:grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.cardNumber}</label>
                        <input value={cardNo} onChange={e => setCardNo(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30 font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.expiryDate}</label>
                        <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30 font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.cvv}</label>
                        <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/,"").slice(0,4))} placeholder="•••" maxLength={4} type="password" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30 font-mono" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-600 mb-1">{t.nameOnCard}</label>
                        <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder={lang === "ar" ? "الاسم على البطاقة" : "Cardholder Name"} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Award className="w-5 h-5 text-amber-500" /></div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{t.useMyPoints}</h3>
                        <p className="text-xs text-gray-400">2,500 {t.pointsAvailable} — {t.kwd} 2.500 {t.pointsWorth}</p>
                      </div>
                    </div>
                    <button onClick={() => setUsePoints(!usePoints)} className={`relative w-12 h-6 rounded-full transition-colors ${usePoints ? "bg-[#0b7a6e]" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${usePoints ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-black text-gray-900 text-lg">{t.orderReview}</h2>
                <div className="space-y-4">
                  {[[lang === "ar" ? "العنوان" : "Delivery Address", `${selectedAddressLabel} — ${selectedAddressText}`, <MapPin className="w-4 h-4 text-[#0b7a6e]" />],
                    [lang === "ar" ? "طريقة التوصيل" : "Delivery Method", deliveryMethod === "express" ? t.expressDelivery : deliveryMethod === "standard" ? t.standardDelivery : t.scheduledDelivery, <Truck className="w-4 h-4 text-[#0b7a6e]" />],
                    [lang === "ar" ? "طريقة الدفع" : "Payment Method", paymentMethod === "card" ? `${t.creditCard} •••• ${cardNo.replace(/\s/g,"").slice(-4) || "0000"}` : paymentMethod === "knet" ? t.knet : paymentMethod === "apple" ? t.applePay : t.cashOnDelivery, <CreditCard className="w-4 h-4 text-[#0b7a6e]" />]].map(([label, val, icon]) => (
                    <div key={label as string} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                      {icon}<div><p className="text-xs text-gray-400 mb-0.5">{label}</p><p className="text-sm font-semibold text-gray-800">{val}</p></div>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-[#0b7a6e]/20 rounded-2xl p-4 bg-[#0b7a6e]/5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-gray-900">{t.total}</span>
                    <span className="font-black text-2xl text-[#0b7a6e]">{t.kwd} {fmt(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{lang === "ar" ? "شامل ضريبة القيمة المضافة" : "VAT inclusive"}</p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors">{lang === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}{t.back}</button>}
              {step < 3
                ? <button onClick={() => setStep(s => s + 1)} className="flex-1 flex items-center justify-center gap-2 bg-[#0b7a6e] text-white font-bold py-3.5 rounded-2xl hover:bg-[#09655b] transition-all shadow-lg">{t.next}{lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
                : <button onClick={() => setConfirmed(true)} className="flex-1 flex items-center justify-center gap-2 bg-[#c9a85c] text-white font-black py-3.5 rounded-2xl hover:bg-[#b8943f] transition-all shadow-lg text-base"><Check className="w-5 h-5" />{t.placeOrder}</button>}
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div><OrderSummary /></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT — MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_USER = {
  nameEn: "Fatima Al-Rashidi", nameAr: "فاطمة الراشدي",
  email: "fatima@example.com", phone: "+963 9988 7766",
  points: 2450, tier: "Gold", memberSince: "Jan 2024",
  totalOrders: 28, activeSubs: 2, savedItems: 6,
};

const MOCK_ORDERS = [
  { id: "ARC-2025-4872", dateEn: "Jun 15, 2025", dateAr: "15 يونيو 2025", status: "delivered",  items: 3, total: 18.500, products: [PRODUCTS[0], PRODUCTS[2], PRODUCTS[4]] },
  { id: "ARC-2025-4651", dateEn: "Jun 8, 2025",  dateAr: "8 يونيو 2025",  status: "shipped",   items: 2, total: 11.750, products: [PRODUCTS[1], PRODUCTS[9]] },
  { id: "ARC-2025-4320", dateEn: "May 28, 2025", dateAr: "28 مايو 2025",  status: "processing",items: 4, total: 25.200, products: [PRODUCTS[3], PRODUCTS[5], PRODUCTS[7], PRODUCTS[10]] },
  { id: "ARC-2025-3988", dateEn: "May 15, 2025", dateAr: "15 مايو 2025",  status: "delivered", items: 1, total: 7.900,  products: [PRODUCTS[2]] },
  { id: "ARC-2025-3654", dateEn: "May 3, 2025",  dateAr: "3 مايو 2025",   status: "cancelled", items: 2, total: 9.100,  products: [PRODUCTS[6], PRODUCTS[8]] },
  { id: "ARC-2025-3210", dateEn: "Apr 18, 2025", dateAr: "18 أبريل 2025", status: "delivered", items: 5, total: 32.450, products: [PRODUCTS[0], PRODUCTS[1], PRODUCTS[3], PRODUCTS[4], PRODUCTS[10]] },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "order", titleEn: "Order Delivered!", titleAr: "تم تسليم طلبك!", msgEn: "Your order #ARC-2025-4872 has been delivered successfully.", msgAr: "تم تسليم طلبك #ARC-2025-4872 بنجاح.", timeEn: "2h ago", timeAr: "منذ ساعتين", read: false },
  { id: 2, type: "promo", titleEn: "Special Offer for You!", titleAr: "عرض خاص لك!", msgEn: "Get 20% off your next pantry order with an active subscription.", msgAr: "احصل على خصم 20٪ على طلب التموين التالي مع اشتراك نشط.", timeEn: "1d ago", timeAr: "منذ يوم", read: false },
  { id: 3, type: "system", titleEn: "Profile Updated", titleAr: "تم تحديث الملف الشخصي", msgEn: "Your profile information has been updated successfully.", msgAr: "تم تحديث معلومات ملفك الشخصي بنجاح.", timeEn: "2d ago", timeAr: "منذ يومين", read: true },
  { id: 4, type: "order", titleEn: "Order Shipped", titleAr: "تم شحن طلبك", msgEn: "Your order #ARC-2025-4651 is on its way. Track it now.", msgAr: "طلبك #ARC-2025-4651 في الطريق إليك. تتبعه الآن.", timeEn: "3d ago", timeAr: "منذ 3 أيام", read: true },
  { id: 5, type: "promo", titleEn: "Loyalty Points Expiring", titleAr: "نقاط على وشك الانتهاء", msgEn: "You have 500 points expiring in 30 days. Redeem them now!", msgAr: "لديك 500 نقطة تنتهي صلاحيتها خلال 30 يومًا. استبدلها الآن!", timeEn: "5d ago", timeAr: "منذ 5 أيام", read: true },
];

const MOCK_POINTS_HISTORY = [
  { id: 1, descEn: "Purchase – Order #ARC-2025-4872", descAr: "شراء – طلب #ARC-2025-4872", pts: +350, dateEn: "Jun 15, 2025", dateAr: "15 يونيو 2025", type: "earn" },
  { id: 2, descEn: "Purchase – Order #ARC-2025-4651", descAr: "شراء – طلب #ARC-2025-4651", pts: +180, dateEn: "Jun 8, 2025",  dateAr: "8 يونيو 2025",  type: "earn" },
  { id: 3, descEn: "Redeemed for 10% Discount",        descAr: "استبدال بخصم 10٪",           pts: -500, dateEn: "Jun 8, 2025",  dateAr: "8 يونيو 2025",  type: "redeem" },
  { id: 4, descEn: "Purchase – Order #ARC-2025-4320",  descAr: "شراء – طلب #ARC-2025-4320",  pts: +420, dateEn: "May 28, 2025",dateAr: "28 مايو 2025",  type: "earn" },
  { id: 5, descEn: "Signup Bonus",                     descAr: "مكافأة التسجيل",              pts: +1000,dateEn: "Jan 10, 2024",dateAr: "10 يناير 2024", type: "earn" },
  { id: 6, descEn: "Review Submitted",                 descAr: "تم تقديم تقييم",              pts: +50,  dateEn: "Apr 18, 2025",dateAr: "18 أبريل 2025", type: "earn" },
];

type SubStatus = "active" | "paused" | "cancelled";
interface MockSubscription { id: number; product: Product; freq: string; freqAr: string; nextEn: string; nextAr: string; status: SubStatus; qty: number }
const MOCK_SUBS: MockSubscription[] = [
  { id: 1, product: PRODUCTS[0], freq: "Monthly",    freqAr: "شهريًا",      nextEn: "Jul 15, 2025", nextAr: "15 يوليو 2025",  status: "active",  qty: 2 },
  { id: 2, product: PRODUCTS[1], freq: "Weekly",     freqAr: "أسبوعيًا",   nextEn: "Jun 22, 2025", nextAr: "22 يونيو 2025", status: "paused",  qty: 1 },
  { id: 3, product: PRODUCTS[4], freq: "Bi-weekly",  freqAr: "كل أسبوعين", nextEn: "Jul 1, 2025",  nextAr: "1 يوليو 2025",   status: "active",  qty: 1 },
];

// ─── Account helpers ──────────────────────────────────────────────────────────
function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const t = T[lang];
  const map: Record<string, { label: string; cls: string }> = {
    delivered:  { label: t.statusDelivered,  cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    shipped:    { label: t.statusShipped,    cls: "bg-blue-50 text-blue-700 border-blue-200" },
    processing: { label: t.statusProcessing, cls: "bg-amber-50 text-amber-700 border-amber-200" },
    placed:     { label: t.statusPlaced,     cls: "bg-gray-50 text-gray-700 border-gray-200" },
    cancelled:  { label: t.statusCancelled,  cls: "bg-rose-50 text-rose-700 border-rose-200" },
    active:     { label: t.subActive,        cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    paused:     { label: t.subPaused,        cls: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  const s = map[status] ?? { label: status, cls: "bg-gray-50 text-gray-600 border-gray-200" };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}

// ─── Account Layout ───────────────────────────────────────────────────────────
function AccountLayout({ lang, activePage, children }: { lang: Lang; activePage: Page; children: ReactNode }) {
  const { goTo, logout } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = T[lang];

  const navItems: { id: Page; Icon: ElementType; en: string; ar: string; badge?: number }[] = [
    { id: "dashboard",     Icon: LayoutDashboard, en: "Dashboard",       ar: "لوحة التحكم" },
    { id: "orders",        Icon: ClipboardList,   en: "My Orders",       ar: "طلباتي" },
    { id: "addresses",     Icon: MapPin,          en: "Addresses",       ar: "العناوين" },
    { id: "wishlist-page", Icon: Heart,           en: "Wishlist",        ar: "المفضلة", badge: MOCK_USER.savedItems },
    { id: "loyalty",       Icon: Award,           en: "Loyalty & Rewards",ar: "المكافآت" },
    { id: "sub-dashboard", Icon: Repeat,          en: "Subscriptions",   ar: "الاشتراكات", badge: MOCK_SUBS.filter(s => s.status === "active").length },
    { id: "notifications", Icon: Bell,            en: "Notifications",   ar: "الإشعارات", badge: MOCK_NOTIFICATIONS.filter(n => !n.read).length },
  ];

  const SidebarInner = () => (
    <div>
      {/* User card */}
      <div className="bg-gradient-to-br from-[#0b7a6e] to-[#063e38] rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg font-black">
            {MOCK_USER.nameEn.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{lang === "ar" ? MOCK_USER.nameAr : MOCK_USER.nameEn}</p>
            <p className="text-white/60 text-xs truncate">{MOCK_USER.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">{t.pointsBalanceLabel}</p>
            <p className="font-black text-xl">{MOCK_USER.points.toLocaleString()}</p>
          </div>
          <span className="bg-[#c9a85c] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />{lang === "ar" ? t.goldTier : MOCK_USER.tier}
          </span>
        </div>
      </div>
      {/* Nav */}
      <div className="space-y-1">
        {navItems.map(({ id, Icon, en, ar, badge }) => (
          <button key={id} onClick={() => { goTo(id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activePage === id ? "bg-[#0b7a6e] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
            <Icon className="w-4 h-4 flex-none" />
            <span className="flex-1 text-start">{lang === "ar" ? ar : en}</span>
            {badge && badge > 0 ? <span className={`w-5 h-5 text-[9px] font-black rounded-full flex items-center justify-center ${activePage === id ? "bg-white text-[#0b7a6e]" : "bg-[#0b7a6e] text-white"}`}>{badge}</span>
              : activePage !== id && <ChevronRight className="w-3.5 h-3.5 opacity-30" />}
          </button>
        ))}
        <div className="border-t border-gray-100 pt-2 mt-2">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut className="w-4 h-4" />{t.signOut}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)} className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Menu className="w-5 h-5 text-[#0b7a6e]" />{t.myAccount}
        </button>
        <span className="text-xs font-semibold text-[#0b7a6e]">{lang === "ar" ? MOCK_USER.nameAr : MOCK_USER.nameEn}</span>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className={`relative bg-white w-72 h-full overflow-y-auto p-4 shadow-2xl ${lang === "ar" ? "ms-auto" : ""}`}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 end-4"><X className="w-5 h-5 text-gray-400" /></button>
            <SidebarInner />
          </div>
        </div>
      )}
      <div className="section-container py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-36"><SidebarInner /></div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ─── myAster-style split auth layout (Aroma branding) ───────────────────────
function AuthSplitLayout({ lang, children, onClose }: { lang: Lang; children: ReactNode; onClose: () => void }) {
  const t = T[lang];
  const isAr = lang === "ar";
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0b7a6e] items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{ backgroundImage: "repeating-linear-gradient(-32deg, transparent, transparent 28px, rgba(255,255,255,0.35) 28px, rgba(255,255,255,0.35) 56px)" }} />
        <div className="pointer-events-none absolute -top-24 -start-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -end-16 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <BrandLogo className="h-14 w-auto object-contain mx-auto mb-6" />
          <p className="text-lg font-medium text-white/90 tracking-wide">{t.aromaTagline}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col min-h-screen relative">
        <div className="lg:hidden bg-[#0b7a6e] px-6 py-8 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: "repeating-linear-gradient(-32deg, transparent, transparent 20px, rgba(255,255,255,0.35) 20px, rgba(255,255,255,0.35) 40px)" }} />
          <BrandLogo className="relative h-10 w-auto object-contain mx-auto" />
        </div>
        <button type="button" onClick={onClose} aria-label={isAr ? "إغلاق" : "Close"}
          className="absolute top-5 end-5 z-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
        <p className="text-center text-sm text-gray-500 pb-8 px-6">
          {t.forAssistance}{" "}
          <a href="#" className="text-gray-700 underline underline-offset-2 hover:text-[#0b7a6e] transition-colors">{t.visitHelpCenter}</a>
        </p>
      </div>
    </div>
  );
}

const SYRIA_DIAL = "+963";

function formatSyriaPhone(num: string) {
  const d = num.replace(/\D/g, "");
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)} ${d.slice(4)}`;
}

function AuthMobileField({ lang, value, onChange }: { lang: Lang; value: string; onChange: (v: string) => void }) {
  const t = T[lang];
  return (
    <div className="relative border border-gray-300 rounded-xl px-4 pt-5 pb-3.5 focus-within:border-[#0b7a6e] focus-within:ring-2 focus-within:ring-[#0b7a6e]/20 transition-all">
      <label className="absolute top-2.5 start-4 text-[11px] text-gray-400 font-medium">{t.phoneField}</label>
      <div className="flex items-center gap-2 mt-2">
        <button type="button" tabIndex={-1} className="flex items-center gap-1.5 shrink-0 text-sm text-gray-700 font-medium pe-2 border-e border-gray-200">
          <span className="text-base leading-none" aria-hidden>🇰🇼</span>
          <span>{SYRIA_DIAL}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
          required
          className="flex-1 min-w-0 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
          placeholder="XXXX XXXX"
        />
      </div>
    </div>
  );
}

function AuthPasswordField({ lang, value, onChange, label }: { lang: Lang; value: string; onChange: (v: string) => void; label: string }) {
  const t = T[lang];
  const [show, setShow] = useState(false);
  return (
    <div className="relative border border-gray-300 rounded-xl px-4 pt-5 pb-3.5 focus-within:border-[#0b7a6e] focus-within:ring-2 focus-within:ring-[#0b7a6e]/20 transition-all">
      <label className="absolute top-2.5 start-4 text-[11px] text-gray-400 font-medium">{label}</label>
      <div className="flex items-center gap-2 mt-2">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          className="flex-1 min-w-0 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300 pe-8"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute end-4 bottom-3.5 text-gray-400 hover:text-gray-600" aria-label={show ? t.hidePassword : t.showPassword}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function OtpVerificationBlock({ lang, phone, onChangeNumber, onComplete }: {
  lang: Lang; phone: string; onChangeNumber: () => void; onComplete: () => void;
}) {
  const t = T[lang];
  const OTP_LEN = 6;
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LEN).fill(""));
  const [seconds, setSeconds] = useState(180);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const setDigit = (idx: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < OTP_LEN - 1) refs.current[idx + 1]?.focus();
    if (next.every(d => d)) onComplete();
  };

  const handlePaste = (e: React.ClipboardEvent, idx: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length && idx + i < OTP_LEN; i++) next[idx + i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(idx + pasted.length, OTP_LEN - 1);
    refs.current[focusIdx]?.focus();
    if (next.every(d => d)) onComplete();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-4 leading-snug">{t.verifyMobileTitle}</h1>
      <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
        {t.otpSentPrefix}{" "}
        <span className="font-semibold text-gray-800">{SYRIA_DIAL} {formatSyriaPhone(phone)}</span>
        {" "}
        <button type="button" onClick={onChangeNumber} className="text-[#0b7a6e] font-semibold hover:underline">{t.changeNumber}</button>
      </p>
      <div className="flex justify-center gap-2 sm:gap-3 mb-6" dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => setDigit(i, e.target.value)}
            onKeyDown={e => { if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus(); }}
            onPaste={e => handlePaste(e, i)}
            className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0b7a6e] focus:ring-2 focus:ring-[#0b7a6e]/20 transition-all"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500">
        {seconds > 0 ? (
          <>{t.resendCode} <span className="font-semibold text-gray-700">{mm}:{ss}</span></>
        ) : (
          <button type="button" onClick={() => { setSeconds(180); setDigits(Array(OTP_LEN).fill("")); refs.current[0]?.focus(); }}
            className="text-[#0b7a6e] font-semibold hover:underline">{t.resendCode}</button>
        )}
      </p>
    </>
  );
}

function AuthPrimaryButton({ children, disabled, type = "submit", onClick }: { children: ReactNode; disabled?: boolean; type?: "submit" | "button"; onClick?: () => void }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className="w-full py-3.5 bg-[#0b7a6e] text-white font-bold rounded-xl hover:bg-[#09655b] transition-colors disabled:opacity-45 disabled:cursor-not-allowed text-base">
      {children}
    </button>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
function LoginPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  return (
    <AuthSplitLayout lang={lang} onClose={() => goTo("home")}>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-2 leading-snug">{t.signIn}</h1>
      <p className="text-sm text-gray-500 text-center mb-8">{t.welcomeBackAroma}</p>
      <form onSubmit={e => { e.preventDefault(); goTo("dashboard"); }} className="space-y-4">
        <AuthMobileField lang={lang} value={mobile} onChange={setMobile} />
        <div>
          <div className="flex justify-end mb-1">
            <button type="button" onClick={() => goTo("forgot")} className="text-xs text-[#0b7a6e] font-semibold hover:underline">{t.forgotPassword}</button>
          </div>
          <AuthPasswordField lang={lang} value={password} onChange={setPassword} label={t.password} />
        </div>
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
          <Shield className="w-3.5 h-3.5 shrink-0" />
          {t.encryptedSafe}
        </p>
        <AuthPrimaryButton disabled={mobile.length < 8 || !password}>{t.signIn}</AuthPrimaryButton>
      </form>
      <p className="text-center text-sm text-gray-500 mt-8">
        {t.noAccount}{" "}
        <button type="button" onClick={() => goTo("register")} className="text-[#0b7a6e] font-semibold hover:underline">{t.signUp}</button>
      </p>
    </AuthSplitLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: REGISTER  (myAster-style split layout)
// ═══════════════════════════════════════════════════════════════════════════════
function RegisterPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");

  return (
    <AuthSplitLayout lang={lang} onClose={() => goTo("home")}>
      {step === "mobile" ? (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-8 leading-snug">{t.enterMobileContinue}</h1>
          <form onSubmit={e => { e.preventDefault(); setStep("otp"); }} className="space-y-5">
            <AuthMobileField lang={lang} value={mobile} onChange={setMobile} />
            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              {t.encryptedSafe}
            </p>
            <AuthPrimaryButton disabled={mobile.length < 8}>{t.next}</AuthPrimaryButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-8">
            {t.haveAccount}{" "}
            <button type="button" onClick={() => goTo("login")} className="text-[#0b7a6e] font-semibold hover:underline">{t.signIn}</button>
          </p>
        </>
      ) : (
        <OtpVerificationBlock
          lang={lang}
          phone={mobile}
          onChangeNumber={() => setStep("mobile")}
          onComplete={() => goTo("dashboard")}
        />
      )}
    </AuthSplitLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: FORGOT PASSWORD
// ═══════════════════════════════════════════════════════════════════════════════
function ForgotPasswordPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [step, setStep] = useState<"mobile" | "otp" | "password" | "done">("mobile");
  const [mobile, setMobile] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const passwordsMatch = newPass.length >= 6 && newPass === confirmPass;

  return (
    <AuthSplitLayout lang={lang} onClose={() => goTo("home")}>
      {step === "mobile" && (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-2 leading-snug">{t.forgotPassword}</h1>
          <p className="text-sm text-gray-500 text-center mb-8">{t.resetMobileDesc}</p>
          <form onSubmit={e => { e.preventDefault(); setStep("otp"); }} className="space-y-5">
            <AuthMobileField lang={lang} value={mobile} onChange={setMobile} />
            <AuthPrimaryButton disabled={mobile.length < 8}>{t.sendCode}</AuthPrimaryButton>
          </form>
          <button type="button" onClick={() => goTo("login")} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 mt-8">
            {lang === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}{t.backToLogin}
          </button>
        </>
      )}
      {step === "otp" && (
        <OtpVerificationBlock
          lang={lang}
          phone={mobile}
          onChangeNumber={() => setStep("mobile")}
          onComplete={() => setStep("password")}
        />
      )}
      {step === "password" && (
        <>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-2 leading-snug">{t.setNewPassword}</h1>
          <p className="text-sm text-gray-500 text-center mb-8">{t.setNewPasswordDesc}</p>
          <form onSubmit={e => { e.preventDefault(); setStep("done"); }} className="space-y-4">
            <AuthPasswordField lang={lang} value={newPass} onChange={setNewPass} label={t.password} />
            <AuthPasswordField lang={lang} value={confirmPass} onChange={setConfirmPass} label={t.confirmPassword} />
            {confirmPass && !passwordsMatch && (
              <p className="text-xs text-red-500 text-center">{lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"}</p>
            )}
            <AuthPrimaryButton disabled={!passwordsMatch}>{t.resetPassword}</AuthPrimaryButton>
          </form>
        </>
      )}
      {step === "done" && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.passwordUpdated}</h2>
          <p className="text-sm text-gray-500 mb-8">{SYRIA_DIAL} {formatSyriaPhone(mobile)}</p>
          <AuthPrimaryButton type="button" onClick={() => goTo("login")}>{t.signIn}</AuthPrimaryButton>
        </div>
      )}
    </AuthSplitLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const stats = [
    { icon: ClipboardList, labelKey: "totalOrdersLabel",  val: MOCK_USER.totalOrders, color: "text-blue-600",   bg: "bg-blue-50",   action: () => goTo("orders") },
    { icon: Wallet,        labelKey: "pointsBalanceLabel", val: MOCK_USER.points.toLocaleString(), color: "text-[#c9a85c]",bg: "bg-amber-50",  action: () => goTo("loyalty") },
    { icon: Repeat,        labelKey: "activeSubsLabel",    val: MOCK_USER.activeSubs, color: "text-teal-600",  bg: "bg-teal-50",   action: () => goTo("sub-dashboard") },
    { icon: Heart,         labelKey: "savedItemsLabel",    val: MOCK_USER.savedItems, color: "text-rose-600",  bg: "bg-rose-50",   action: () => goTo("wishlist-page") },
  ];
  const quickActions = [
    { icon: Package,    en: "Track Order",    ar: "تتبع الطلب",     page: "orders" as Page },
    { icon: MapPin,     en: "Addresses",      ar: "العناوين",       page: "addresses" as Page },
    { icon: Repeat,     en: "Subscriptions",  ar: "الاشتراكات",     page: "sub-dashboard" as Page },
  ];
  return (
    <AccountLayout lang={lang} activePage="dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0b7a6e] to-[#063e38] rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute -end-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
        <p className="text-white/70 text-sm mb-1">{t.welcomeBack}</p>
        <h1 className="text-2xl font-black mb-1" style={{ fontFamily: lang === "ar" ? "Cairo,sans-serif" : "'Playfair Display',serif" }}>{lang === "ar" ? MOCK_USER.nameAr : MOCK_USER.nameEn}</h1>
        <p className="text-white/60 text-xs">{t.memberSince} {MOCK_USER.memberSince} · <span className="text-[#c9a85c] font-bold">{lang === "ar" ? t.goldTier : MOCK_USER.tier + " Member"}</span></p>
        <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div><p className="text-xs text-white/60">{lang === "ar" ? "نقاطك" : "Your Points"}</p><p className="text-xl font-black">{MOCK_USER.points.toLocaleString()}</p></div>
          <button onClick={() => goTo("loyalty")} className="text-xs font-bold bg-[#c9a85c] text-white px-3 py-1.5 rounded-lg hover:bg-[#b8943f] transition-colors">{t.redeemPoints}</button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(({ icon: Icon, labelKey, val, color, bg, action }) => (
          <button key={labelKey} onClick={action} className={`${bg} rounded-2xl p-4 text-start hover:shadow-md hover:-translate-y-0.5 transition-all`}>
            <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <p className="text-2xl font-black text-gray-900">{val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t[labelKey]}</p>
          </button>
        ))}
      </div>
      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">{t.recentOrders}</h2>
          <button onClick={() => goTo("orders")} className="text-xs font-bold text-[#0b7a6e] hover:underline flex items-center gap-1">{t.viewAllOrders}<ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="space-y-3">
          {MOCK_ORDERS.slice(0, 3).map(o => (
            <div key={o.id} onClick={() => goTo("order-detail")} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex -space-x-2 flex-none">
                {o.products.slice(0,2).map((p, i) => <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100"><img src={p.img} alt="" className="w-full h-full object-cover" /></div>)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{o.id}</p>
                <p className="text-xs text-gray-400">{lang === "ar" ? o.dateAr : o.dateEn} · {o.items} {t.itemsCount}</p>
              </div>
              <div className="text-end flex-none">
                <StatusBadge status={o.status} lang={lang} />
                <p className="text-sm font-black text-gray-800 mt-1">{T[lang].kwd} {fmt(o.total)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-4">{t.quickActions}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, en, ar, page }) => (
            <button key={en} onClick={() => goTo(page)} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-[#0b7a6e]/30 hover:bg-[#0b7a6e]/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#0b7a6e]/10 flex items-center justify-center group-hover:bg-[#0b7a6e] transition-colors"><Icon className="w-5 h-5 text-[#0b7a6e] group-hover:text-white transition-colors" /></div>
              <span className="text-xs font-semibold text-gray-600 text-center">{lang === "ar" ? ar : en}</span>
            </button>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ORDER HISTORY
// ═══════════════════════════════════════════════════════════════════════════════
function OrderHistoryPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [filter, setFilter] = useState("all");
  const tabs = ["all","delivered","processing","shipped","cancelled"];
  const filtered = filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);
  return (
    <AccountLayout lang={lang} activePage="orders">
      <div className="space-y-5">
        <h1 className="text-xl font-black text-gray-900">{t.orderHistory}</h1>
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === tab ? "bg-[#0b7a6e] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-[#0b7a6e]/40"}`}>
              {tab === "all" ? (lang === "ar" ? "الكل" : "All") : t["status" + tab.charAt(0).toUpperCase() + tab.slice(1)] ?? tab}
            </button>
          ))}
        </div>
        {/* Orders */}
        <div className="space-y-4">
          {filtered.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{o.id}</p>
                  <p className="text-xs text-gray-400">{lang === "ar" ? o.dateAr : o.dateEn} · {o.items} {t.itemsCount}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} lang={lang} />
                  <span className="font-black text-gray-900">{t.kwd} {fmt(o.total)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  {o.products.slice(0, 4).map((p, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-none border border-gray-100">
                      <img src={p.img} alt="" className="w-full h-full object-cover" />
                      {i === 3 && o.products.length > 4 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">+{o.products.length - 4}</div>}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => goTo("order-detail")} className="flex items-center gap-1.5 px-4 py-2 bg-[#0b7a6e] text-white text-xs font-bold rounded-xl hover:bg-[#09655b]">{t.viewDetails}</button>
                  {o.status === "delivered" && <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50">{t.reorder}</button>}
                  {o.status === "delivered" && <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50"><FileText className="w-3.5 h-3.5" />{t.downloadInvoice}</button>}
                  {(o.status === "placed" || o.status === "processing") && <button className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50">{t.cancelOrder}</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ORDER DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function OrderDetailPage2({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const order = MOCK_ORDERS[0];
  const steps = [
    { key: "statusPlaced",    icon: Check,    done: true },
    { key: "statusConfirmed", icon: CheckCircle2, done: true },
    { key: "statusPreparing", icon: Package,  done: true },
    { key: "statusShipped",   icon: Truck,    done: true },
    { key: "statusDelivered", icon: HomeIcon, done: true },
  ];
  return (
    <AccountLayout lang={lang} activePage="orders">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => goTo("orders")} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">{lang === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}</button>
          <h1 className="text-xl font-black text-gray-900">{t.orderDetailsTitle}</h1>
        </div>
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{t.orderNum}</p>
            <p className="text-lg font-black text-gray-900">{order.id}</p>
            <p className="text-xs text-gray-400 mt-1">{lang === "ar" ? order.dateAr : order.dateEn}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} lang={lang} />
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50"><FileText className="w-3.5 h-3.5" />{t.downloadInvoice}</button>
          </div>
        </div>
        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-5">{t.trackOrderBtn}</h3>
          <div className="flex items-start gap-0">
            {steps.map(({ key, icon: Icon, done }, i) => (
              <div key={key} className="flex-1 flex flex-col items-center gap-2 relative">
                {i < steps.length - 1 && <div className={`absolute top-5 start-1/2 w-full h-0.5 ${done && steps[i+1]?.done ? "bg-[#0b7a6e]" : "bg-gray-200"}`} />}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-[#0b7a6e] border-[#0b7a6e] text-white" : "bg-white border-gray-200 text-gray-400"}`}><Icon className="w-4 h-4" /></div>
                <p className="text-[9px] font-semibold text-center text-gray-600 leading-tight px-1">{t[key]}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">{lang === "ar" ? "المنتجات" : "Items"}</h3>
          <div className="space-y-3">
            {order.products.map(p => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-none"><img src={p.img} alt="" className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{p.brand}</p>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">{lang === "ar" ? p.nameAr : p.nameEn}</p>
                </div>
                <p className="text-sm font-black text-[#0b7a6e] flex-none">{T[lang].kwd} {fmt(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Delivery + Payment */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[[t.deliveredTo, <><MapPin className="w-4 h-4 text-[#0b7a6e]" /><span>شارع الجامعة — المزة<br/>دمشق</span></>],
            [t.paymentMethod2, <><CreditCard className="w-4 h-4 text-[#0b7a6e]" /><span>Visa •••• 4242</span></>]].map(([label, content]) => (
            <div key={label as string} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">{label}</h3>
              <div className="flex items-start gap-2 text-sm text-gray-600">{content}</div>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between text-gray-600"><span>{t.subtotal}</span><span>{T[lang].kwd} {fmt(order.total - 1.5)}</span></div>
            <div className="flex justify-between text-gray-600"><span>{t.delivery}</span><span className="text-emerald-600">{t.deliveryFree}</span></div>
          </div>
          <div className="flex justify-between font-black text-base border-t border-gray-100 pt-3"><span>{t.total}</span><span className="text-[#0b7a6e]">{T[lang].kwd} {fmt(order.total)}</span></div>
        </div>
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SAVED ADDRESSES
// ═══════════════════════════════════════════════════════════════════════════════
function SavedAddressesPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [addresses, setAddresses] = useState([
    { id: 1, type: "home",  nameEn: "Home",     nameAr: "المنزل", addrEn: "University St — Mezzeh, Damascus", addrAr: "شارع الجامعة — المزة، دمشق", phone: "+963 991 000 001", isDefault: true },
    { id: 2, type: "work",  nameEn: "Work",     nameAr: "العمل",  addrEn: "Al-Hamra Tower, Floor 18 — دمشق", addrAr: "برج الحمراء، الطابق 18 — دمشق",  phone: "+963 9988 7766", isDefault: false },
    { id: 3, type: "other", nameEn: "Parent's", nameAr: "المنزل الأهل", addrEn: "Block 3, St. 7, House 12 — Rumaithiya", addrAr: "القطعة 3، الشارع 7، البيت 12 — الرميثية", phone: "+963 5544 3322", isDefault: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const typeIcon = (type: string) => type === "home" ? <HomeIcon className="w-4 h-4" /> : type === "work" ? <Briefcase className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;
  return (
    <AccountLayout lang={lang} activePage="addresses">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900">{t.addressesTitle}</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#0b7a6e] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#09655b] transition-colors"><Plus className="w-4 h-4" />{t.addAddress}</button>
        </div>
        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">{t.addAddress}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[[t.fullName,"text"],[t.phoneField,"tel"],[t.area,"text"],[t.building,"text"],[t.floor,"text"],[t.apartment,"text"]].map(([label,type]) => (
                <div key={label as string}><label className="block text-xs font-bold text-gray-600 mb-1">{label}</label><input type={type as string} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b7a6e]/30" /></div>
              ))}
              <div className="sm:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">{t.specialInstructions}</label><textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-[#0b7a6e] text-white text-sm font-bold rounded-xl hover:bg-[#09655b]">{t.saveChanges}</button>
            </div>
          </div>
        )}
        {/* Address cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white rounded-2xl border-2 shadow-sm p-5 relative ${addr.isDefault ? "border-[#0b7a6e]" : "border-gray-100"}`}>
              {addr.isDefault && <span className="absolute top-4 end-4 text-[10px] font-black bg-[#0b7a6e] text-white px-2 py-0.5 rounded-full">{t.defaultBadge}</span>}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#0b7a6e]/10 flex items-center justify-center text-[#0b7a6e]">{typeIcon(addr.type)}</div>
                <span className="font-bold text-gray-900 text-sm">{lang === "ar" ? addr.nameAr : addr.nameEn}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-1">{lang === "ar" ? addr.addrAr : addr.addrEn}</p>
              <p className="text-xs text-gray-400 mb-4">{addr.phone}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0b7a6e] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#0b7a6e]/30 transition-colors"><Pencil className="w-3 h-3" />{t.editAddress}</button>
                {!addr.isDefault && <button onClick={() => setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === addr.id })))} className="flex items-center gap-1.5 text-xs font-semibold text-[#0b7a6e] px-3 py-1.5 rounded-lg border border-[#0b7a6e]/30 hover:bg-[#0b7a6e]/5 transition-colors">{t.setDefault}</button>}
                {!addr.isDefault && <button onClick={() => setAddresses(a => a.filter(x => x.id !== addr.id))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:border-rose-200 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: WISHLIST
// ═══════════════════════════════════════════════════════════════════════════════
function WishlistPageAccount({ lang }: { lang: Lang }) {
  const t = T[lang]; const { wishIds, toggleWish, addToCart, goTo } = useNav();
  const wishProducts = PRODUCTS.filter(p => wishIds.has(p.id));
  return (
    <AccountLayout lang={lang} activePage="wishlist-page">
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-black text-gray-900">{t.myWishlist} <span className="text-sm font-semibold text-gray-400">({wishProducts.length})</span></h1>
          {wishProducts.length > 0 && <button onClick={() => wishProducts.forEach(p => addToCart(p))} className="flex items-center gap-2 bg-[#0b7a6e] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#09655b] transition-colors"><ShoppingCart className="w-4 h-4" />{t.addAllToCart}</button>}
        </div>
        {wishProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-500 mb-2">{t.emptyWishlist}</p>
            <button onClick={() => goTo("listing")} className="text-sm text-[#0b7a6e] font-semibold hover:underline">{t.browseProducts}</button>
          </div>
        ) : (
          <div className={PRODUCT_GRID}>
            {wishProducts.map(p => (
              <div key={p.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-gray-50 overflow-hidden cursor-pointer" onClick={() => goTo("product", p)}>
                  <img src={p.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" />
                  <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }} className="absolute top-2.5 end-2.5 w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow hover:bg-rose-100 transition-colors"><Heart className="w-4 h-4" fill="currentColor" /></button>
                </div>
                <div className="p-3.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{p.brand}</p>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{lang === "ar" ? p.nameAr : p.nameEn}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#0b7a6e]">{t.kwd} {fmt(p.price)}</span>
                    <button onClick={() => addToCart(p)} className="flex items-center gap-1 text-xs font-bold bg-[#0b7a6e] text-white px-3 py-1.5 rounded-xl hover:bg-[#09655b]"><Plus className="w-3.5 h-3.5" />{t.addToCart}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
function NotificationsPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const unread = notifs.filter(n => !n.read).length;
  const typeIcon = (type: string) => type === "order" ? <Package className="w-4 h-4" /> : type === "promo" ? <Tag className="w-4 h-4" /> : <Bell className="w-4 h-4" />;
  const typeBg = (type: string) => type === "order" ? "bg-blue-50 text-blue-600" : type === "promo" ? "bg-rose-50 text-rose-600" : "bg-violet-50 text-violet-600";
  const filtered = filter === "all" ? notifs : notifs.filter(n => n.type === filter);
  return (
    <AccountLayout lang={lang} activePage="notifications">
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">{t.notificationsTitle}{unread > 0 && <span className="w-6 h-6 bg-rose-500 text-white text-xs font-black rounded-full flex items-center justify-center">{unread}</span>}</h1>
          {unread > 0 && <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} className="text-xs font-bold text-[#0b7a6e] hover:underline">{t.markAllRead}</button>}
        </div>
        {/* Filter */}
        <div className="flex gap-2">
          {[["all", t.allNotifs], ["order", t.orderNotifs], ["promo", t.promoNotifs], ["system", t.systemNotifs]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === val ? "bg-[#0b7a6e] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#0b7a6e]/40"}`}>{label}</button>
          ))}
        </div>
        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center"><Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 font-medium">{t.noNotifications}</p></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {filtered.map(n => (
              <div key={n.id} className={`flex gap-4 p-4 hover:bg-gray-50 transition-colors ${!n.read ? "bg-[#0b7a6e]/3" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${typeBg(n.type)}`}>{typeIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-sm font-bold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>{lang === "ar" ? n.titleAr : n.titleEn}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#0b7a6e] flex-none mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-1">{lang === "ar" ? n.msgAr : n.msgEn}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400">{lang === "ar" ? n.timeAr : n.timeEn}</p>
                    {!n.read && <button onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} className="text-[10px] font-bold text-[#0b7a6e] hover:underline">{t.markRead}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: LOYALTY & REWARDS
// ═══════════════════════════════════════════════════════════════════════════════
function LoyaltyPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const tierProgress = 75; // % to Gold from Silver
  const tiers = [
    { name: lang === "ar" ? "برونزي" : "Bronze", pts: 0,    color: "text-amber-700",  bg: "bg-amber-100"  },
    { name: lang === "ar" ? "فضي"    : "Silver", pts: 1000, color: "text-gray-600",   bg: "bg-gray-100"   },
    { name: lang === "ar" ? "ذهبي"   : "Gold",   pts: 2000, color: "text-[#c9a85c]",  bg: "bg-amber-50"   },
    { name: lang === "ar" ? "بلاتيني": "Platinum",pts: 5000, color: "text-violet-600", bg: "bg-violet-50"  },
  ];
  const redeemOptions = [
    { pts: 500,  en: "5% Discount",    ar: "خصم 5٪",           icon: "🏷️" },
    { pts: 1000, en: "Free Delivery",  ar: "توصيل مجاني",       icon: "🚚" },
    { pts: 2000, en: "10% Discount",   ar: "خصم 10٪",           icon: "🎟️" },
    { pts: 3000, en: "Free Product",   ar: "منتج مجاني",        icon: "🎁" },
  ];
  return (
    <AccountLayout lang={lang} activePage="loyalty">
      <div className="space-y-6">
        <h1 className="text-xl font-black text-gray-900">{t.loyaltyTitle2}</h1>
        {/* Points Hero */}
        <div className="bg-gradient-to-br from-[#1a2332] to-[#0b7a6e] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -end-10 -top-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -start-5 -bottom-10 w-32 h-32 rounded-full bg-[#c9a85c]/10" />
          <div className="relative grid sm:grid-cols-3 gap-6 items-center">
            <div className="sm:col-span-2">
              <p className="text-white/60 text-sm mb-1">{t.pointsBalance2}</p>
              <p className="text-5xl font-black mb-1">{MOCK_USER.points.toLocaleString()}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#c9a85c] text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1"><Award className="w-3 h-3" />{lang === "ar" ? t.goldTier : MOCK_USER.tier}</span>
                <span className="text-white/50 text-xs">{t.pointsExpire}</span>
              </div>
              {/* Progress to Platinum */}
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1.5"><span>{lang === "ar" ? "الذهبي" : "Gold"}</span><span>{lang === "ar" ? "البلاتيني" : "Platinum"} ({(5000 - MOCK_USER.points).toLocaleString()} {t.nextTierLabel})</span></div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-[#c9a85c] rounded-full" style={{ width: `${tierProgress}%` }} /></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["totalEarned", 3450], ["totalRedeemed", 1000]].map(([key, val]) => (
                <div key={key as string} className="bg-white/10 rounded-2xl p-3 text-center">
                  <p className="text-xl font-black">{(val as number).toLocaleString()}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">{t[key as string]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Tiers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">{lang === "ar" ? "مستويات العضوية" : "Membership Tiers"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tiers.map((tier) => (
              <div key={tier.name} className={`p-3 rounded-xl text-center ${tier.bg} ${MOCK_USER.tier === tier.name ? "ring-2 ring-[#c9a85c]" : ""}`}>
                <p className={`font-black text-sm ${tier.color}`}>{tier.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{tier.pts.toLocaleString()}+ pts</p>
                {MOCK_USER.tier === tier.name && <span className="text-[10px] font-bold text-[#0b7a6e] bg-white rounded-full px-2 py-0.5 mt-1.5 inline-block">{lang === "ar" ? "مستواك الحالي" : "Current"}</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Redeem */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">{t.redeemPoints}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {redeemOptions.map(opt => (
              <div key={opt.pts} className={`p-4 rounded-2xl border-2 text-center transition-all ${MOCK_USER.points >= opt.pts ? "border-[#0b7a6e]/30 bg-[#0b7a6e]/5 cursor-pointer hover:border-[#0b7a6e] hover:shadow-md" : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"}`}>
                <span className="text-2xl">{opt.icon}</span>
                <p className="text-sm font-bold text-gray-800 mt-2">{lang === "ar" ? opt.ar : opt.en}</p>
                <p className="text-[11px] text-[#0b7a6e] font-bold mt-1">{opt.pts} pts</p>
                {MOCK_USER.points < opt.pts && <p className="text-[9px] text-gray-400 mt-0.5">{opt.pts - MOCK_USER.points} {t.ptsNeeded}</p>}
              </div>
            ))}
          </div>
        </div>
        {/* Points History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">{t.pointsHistoryTitle}</h3>
          <div className="space-y-3">
            {MOCK_POINTS_HISTORY.map(h => (
              <div key={h.id} className="flex items-center gap-4 py-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${h.type === "earn" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                  {h.type === "earn" ? <TrendingUp className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{lang === "ar" ? h.descAr : h.descEn}</p>
                  <p className="text-xs text-gray-400">{lang === "ar" ? h.dateAr : h.dateEn}</p>
                </div>
                <span className={`font-black text-sm flex-none ${h.type === "earn" ? "text-emerald-600" : "text-rose-500"}`}>{h.type === "earn" ? "+" : ""}{h.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: UPLOAD CREAM RX (DEMO)
// ═══════════════════════════════════════════════════════════════════════════════
function UploadCreamRxPage({ lang }: { lang: Lang }) {
  const { goTo } = useNav();
  useEffect(() => { goTo("subscription"); }, [goTo]);
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
      {lang === "ar" ? "جاري التحويل إلى الاشتراك…" : "Redirecting to subscription…"}
    </div>
  );
}

function SubscriptionSetupPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const { goTo } = useNav();
  const [showShamCash, setShowShamCash] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [payFailed, setPayFailed] = useState(false);

  if (confirmed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#0b7a6e]/10 flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-8 h-8 text-[#0b7a6e]" /></div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">{t.subConfirm}</h2>
        <p className="text-sm text-gray-500 mb-6">{t.subConfirmMsg}</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-start space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">{lang === "ar" ? "الخطة" : "Plan"}</span><span className="font-semibold text-gray-800">{lang === "ar" ? "اشتراك شهري" : "Monthly membership"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">{lang === "ar" ? "الرسوم" : "Fee"}</span><span className="font-bold text-[#0b7a6e]">{t.kwd} {fmt(SUBSCRIPTION_FEE)}</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => goTo("listing")} className="flex-1 py-3 bg-[#0b7a6e] text-white font-black rounded-2xl hover:bg-[#09655b] text-sm">{lang === "ar" ? "تصفح الكتالوج" : "Browse catalog"}</button>
          <button onClick={() => goTo("sub-dashboard")} className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 text-sm">{lang === "ar" ? "حسابي" : "My account"}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="section-container flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => goTo("home")} className="hover:text-[#0b7a6e]">{t.home}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium">{t.subscribeAndSave}</span>
        </div>
      </div>
      <div className="section-container max-w-2xl mx-auto py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 text-center">
          <p className="text-sm font-bold text-[#0b7a6e] mb-2">{lang === "ar" ? "اشتراك حصري" : "حصري Membership"}</p>
          <h1 className="text-3xl font-black text-gray-900 mb-3">{t.subscribeAndSave}</h1>
          <p className="text-gray-500 mb-6">{t.savePercent}</p>
          <p className="text-5xl font-black text-[#0b7a6e] mb-2">{fmt(SUBSCRIPTION_FEE)} <span className="text-lg">{t.kwd}</span></p>
          <p className="text-sm text-gray-400 mb-8">{lang === "ar" ? "شهرياً" : "per month"}</p>
          <ul className="text-start space-y-3 mb-8 max-w-sm mx-auto">
            {(lang === "ar"
              ? ["أسعار المصنع على الرز والزيت والسكر والسمن والمعلبات", "توصيل خلال يومين في دمشق", "إلغاء في أي وقت — ينتهي بنهاية الدورة", "الدفع عبر شام كاش (تجريبي)"]
              : ["Factory prices on rice, oil, sugar, ghee & canned goods", "Delivery within 2 days in Damascus", "Cancel anytime — ends at period end", "Pay with Sham Cash (mock)"]
            ).map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#0b7a6e] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {payFailed && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2 mb-4">
              {lang === "ar" ? "فشل الدفع. يمكنك المحاولة مرة أخرى." : "Payment failed. You can try again."}
            </p>
          )}
          <button
            onClick={() => { setPayFailed(false); setShowShamCash(true); }}
            className="w-full sm:w-auto px-10 py-4 bg-[#0b7a6e] text-white font-black rounded-2xl hover:bg-[#09655b] text-base shadow-lg shadow-[#0b7a6e]/20"
          >
            {t.subscribeBtn}
          </button>
        </div>
      </div>

      {showShamCash && (
        <div className="fixed inset-0 z-[9998] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <ShamCashLogo className="h-14 w-auto object-contain" />
            </div>
            <p className="text-xs text-gray-400 mb-1">{lang === "ar" ? "شام كاش — بيئة تجريبية" : "Sham Cash — demo"}</p>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{lang === "ar" ? "اشتراك حصري الشهري" : "حصري monthly subscription"}</h2>
            <p className="text-3xl font-black text-green-700 mb-6">{fmt(SUBSCRIPTION_FEE)} {t.kwd}</p>
            <p className="text-sm text-gray-500 mb-6">{lang === "ar" ? "هل تؤكد الدفع عبر شام كاش؟" : "Confirm payment with Sham Cash?"}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowShamCash(false); setConfirmed(true); }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3 font-bold text-sm"
              >
                {lang === "ar" ? "ادفع" : "Pay"}
              </button>
              <button
                onClick={() => { setShowShamCash(false); setPayFailed(true); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl py-3 font-bold text-sm"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: SUBSCRIPTION DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function SubscriptionDashboardPage({ lang }: { lang: Lang }) {
  const t = T[lang]; const { goTo } = useNav();
  const [subs, setSubs] = useState<MockSubscription[]>(MOCK_SUBS);

  const toggleStatus = (id: number, newStatus: SubStatus) =>
    setSubs(ss => ss.map(s => s.id === id ? { ...s, status: newStatus } : s));

  const upcoming = subs.filter(s => s.status === "active").flatMap(s => [
    { sub: s, dateEn: s.nextEn, dateAr: s.nextAr },
  ]).sort();

  return (
    <AccountLayout lang={lang} activePage="sub-dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-black text-gray-900">{t.subDashTitle}</h1>
          <button onClick={() => goTo("listing")} className="flex items-center gap-2 bg-[#0b7a6e] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#09655b] transition-colors"><Plus className="w-4 h-4" />{t.createSubscription}</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: lang === "ar" ? "نشطة" : "Active",  val: subs.filter(s => s.status === "active").length,   color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: lang === "ar" ? "موقوفة" : "Paused", val: subs.filter(s => s.status === "paused").length,   color: "text-amber-600",  bg: "bg-amber-50"  },
            { label: lang === "ar" ? "المنتجات" : "Products",val: subs.length,  color: "text-[#0b7a6e]",         bg: "bg-teal-50"   },
          ].map(({ label, val, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
              <p className={`text-3xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Subscriptions */}
        {subs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Repeat className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-bold text-gray-500 mb-2">{t.noSubscriptions}</p>
            <button onClick={() => goTo("listing")} className="text-sm text-[#0b7a6e] font-semibold hover:underline">{t.createSubscription}</button>
          </div>
        ) : (
          <div className="space-y-4">
            {subs.map(sub => (
              <div key={sub.id} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${sub.status === "active" ? "border-gray-100" : sub.status === "paused" ? "border-amber-200" : "border-rose-100 opacity-70"}`}>
                <div className="p-5 flex gap-4">
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-none cursor-pointer" onClick={() => goTo("product", sub.product)}>
                    <img src={sub.product.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm line-clamp-2 cursor-pointer hover:text-[#0b7a6e]" onClick={() => goTo("product", sub.product)}>
                        {lang === "ar" ? sub.product.nameAr : sub.product.nameEn}
                      </p>
                      <StatusBadge status={sub.status} lang={lang} />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{sub.product.brand}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5 text-[#0b7a6e]" />{lang === "ar" ? sub.freqAr : sub.freq}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#0b7a6e]" />{t.nextDelivery}: {lang === "ar" ? sub.nextAr : sub.nextEn}</span>
                      <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5 text-[#0b7a6e]" />{t.qty}: {sub.qty}</span>
                    </div>
                  </div>
                  <div className="flex-none text-end">
                    <p className="text-base font-black text-[#0b7a6e]">{T[lang].kwd} {fmt(sub.product.price * sub.qty)}</p>
                    <p className="text-xs text-gray-400">{lang === "ar" ? "لكل دورة" : "per cycle"}</p>
                  </div>
                </div>
                {/* Actions */}
                <div className={`border-t px-5 py-3 flex items-center gap-2 flex-wrap ${sub.status === "paused" ? "border-amber-100 bg-amber-50/50" : "border-gray-100 bg-gray-50/50"}`}>
                  {sub.status === "active" ? (
                    <>
                      <button onClick={() => toggleStatus(sub.id, "paused")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50 bg-white transition-colors"><Pause className="w-3.5 h-3.5" />{t.pauseSub}</button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 bg-white transition-colors"><SkipForward className="w-3.5 h-3.5" />{t.skipNext}</button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-100 bg-white transition-colors"><Pencil className="w-3.5 h-3.5" />{lang === "ar" ? "تعديل" : "Edit"}</button>
                      <button onClick={() => toggleStatus(sub.id, "cancelled")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 bg-white transition-colors ms-auto"><XCircle className="w-3.5 h-3.5" />{t.cancelSub}</button>
                    </>
                  ) : sub.status === "paused" ? (
                    <>
                      <button onClick={() => toggleStatus(sub.id, "active")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-700 text-xs font-bold hover:bg-emerald-50 bg-white transition-colors"><PlayCircle className="w-3.5 h-3.5" />{t.resumeSub}</button>
                      <button onClick={() => toggleStatus(sub.id, "cancelled")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 bg-white transition-colors ms-auto"><XCircle className="w-3.5 h-3.5" />{t.cancelSub}</button>
                    </>
                  ) : (
                    <p className="text-xs text-rose-500 font-semibold">{lang === "ar" ? "تم إلغاء هذا الاشتراك" : "This subscription has been cancelled"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming deliveries */}
        {upcoming.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">{t.upcomingDeliveries}</h3>
            <div className="space-y-3">
              {upcoming.map(({ sub, dateEn, dateAr }) => (
                <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0b7a6e]/5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-none bg-gray-100"><img src={sub.product.img} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{lang === "ar" ? sub.product.nameAr : sub.product.nameEn}</p>
                    <p className="text-xs text-gray-400">{lang === "ar" ? sub.freqAr : sub.freq}</p>
                  </div>
                  <div className="text-end flex-none">
                    <p className="text-xs font-bold text-[#0b7a6e]">{lang === "ar" ? dateAr : dateEn}</p>
                    <p className="text-[10px] text-gray-400">{T[lang].kwd} {fmt(sub.product.price * sub.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER + MOBILE NAV
// ═══════════════════════════════════════════════════════════════════════════════
function Footer({ lang }: { lang: Lang }) {
  const { goTo } = useNav();
  const isAr = lang === "ar";
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const categories = [
    { en: "Rice & Grains", ar: "الرز والحبوب", page: "listing" as Page },
    { en: "Cooking Oils", ar: "زيوت الطبخ", page: "listing" as Page },
    { en: "Sugar & Tea", ar: "السكر والشاي", page: "listing" as Page },
    { en: "Ghee & Dairy", ar: "السمن والألبان", page: "listing" as Page },
    { en: "Canned Goods", ar: "المعلبات", page: "listing" as Page },
  ];

  const quickLinks = [
    { en: "Home",           ar: "الرئيسية",     page: "home" as Page },
    { en: "About Us",       ar: "من نحن",        page: "home" as Page },
    { en: "Shop",           ar: "المتجر",        page: "listing" as Page },
    { en: "Order Tracking", ar: "تتبع الطلب",   page: "orders" as Page },
    { en: "Brands",         ar: "العلامات التجارية", page: "listing" as Page },
  ];

  const customerCare = [
    { en: "Refund and Returns Policy", ar: "سياسة الاسترداد والإرجاع" },
    { en: "Shipping and Delivery",     ar: "الشحن والتوصيل" },
    { en: "Terms And Conditions",      ar: "الشروط والأحكام" },
    { en: "Privacy Policy",            ar: "سياسة الخصوصية" },
    { en: "Contact Us",                ar: "تواصل معنا" },
  ];

  return (
    <>
      {/* Back to top button */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed bottom-20 sm:bottom-8 end-5 z-40 w-11 h-11 rounded-full bg-[#0b7a6e] text-white shadow-lg flex items-center justify-center hover:bg-[#09655b] transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ChevronLeft className="w-5 h-5 rotate-90" />
      </button>

      <footer className="bg-white border-t border-gray-200">
        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-10 ${isAr ? "text-right" : ""}`}>

            {/* Brand column */}
            <div className={isAr ? "text-right" : ""}>
              <BrandLogo className="h-16 w-auto object-contain mb-5" />
              <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-[260px]">
                {isAr
                  ? "حصري — اشتراك بقالة سورية بأسعار المصنع. توصيل في دمشق: المزة وباب توما وكفر سوسة."
                  : "حصري — Syrian grocery subscription at factory prices. Delivery in Damascus."}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                {isAr ? "جميع الحقوق محفوظة لـ " : "All rights reserved By "}
                <span className="font-bold text-gray-800">حصري.</span>
              </p>
              <p className="text-sm text-gray-500">
                {isAr ? "للمساعدة راسلنا: " : "For any help email us at: "}
                <a href="mailto:Support@haseri.sy" className="font-bold text-gray-800 hover:text-[#0b7a6e] transition-colors">
                  Support@haseri.sy
                </a>
              </p>
            </div>

            {/* Categories */}
            <div className={isAr ? "text-right" : ""}>
              <h4 className="font-bold text-gray-900 text-base mb-5">{isAr ? "الفئات" : "Categories"}</h4>
              <ul className="space-y-3">
                {categories.map(c => (
                  <li key={c.en}>
                    <button
                      onClick={() => goTo(c.page)}
                      className="text-sm text-gray-500 hover:text-[#0b7a6e] transition-colors"
                    >
                      {isAr ? c.ar : c.en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className={isAr ? "text-right" : ""}>
              <h4 className="font-bold text-gray-900 text-base mb-5">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
              <ul className="space-y-3">
                {quickLinks.map(l => (
                  <li key={l.en}>
                    <button
                      onClick={() => goTo(l.page)}
                      className="text-sm text-gray-500 hover:text-[#0b7a6e] transition-colors"
                    >
                      {isAr ? l.ar : l.en}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className={isAr ? "text-right" : ""}>
              <h4 className="font-bold text-gray-900 text-base mb-5">{isAr ? "خدمة العملاء" : "Customer care"}</h4>
              <ul className="space-y-3">
                {customerCare.map(c => (
                  <li key={c.en}>
                    <a href="#" className="text-sm text-gray-500 hover:text-[#0b7a6e] transition-colors">
                      {isAr ? c.ar : c.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
            <p className={`text-xs text-gray-400 text-center ${isAr ? "sm:text-right" : "sm:text-left"}`}>
              {isAr ? "© 2026 حصري. جميع الحقوق محفوظة." : "© 2026 حصري. All rights reserved."}
            </p>
            <div className="flex justify-center items-center">
              <ShamCashLogo className="h-7 w-auto object-contain" />
            </div>
            <div className={`flex items-center justify-center gap-5 ${isAr ? "sm:justify-start" : "sm:justify-end"}`}>
              <div className="flex gap-2.5">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0b7a6e] hover:text-[#0b7a6e] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
              <div className="flex gap-3 text-xs text-gray-400">
                <a href="#" className="hover:text-[#0b7a6e] transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a>
                <span>·</span>
                <a href="#" className="hover:text-[#0b7a6e] transition-colors">{isAr ? "الشروط والأحكام" : "Terms"}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function MobileNav({ lang }: { lang: Lang }) {
  const t = T[lang]; const { cartCount, wishCount, page, goTo } = useNav();
  const items: [Page | "wish", ElementType, string, number][] = [
    ["home", Package, t.home, 0], ["listing", Search, lang === "ar" ? "بحث" : "Search", 0],
    ["wish" as Page, Heart, t.wishlist, wishCount], ["cart", ShoppingCart, t.cart, cartCount],
  ];
  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around h-16">
        {items.map(([id, Icon, label, badge]) => (
          <button key={id} onClick={() => id !== "wish" && goTo(id)}
            className={`relative flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${page === id ? "text-[#0b7a6e]" : "text-gray-400"}`}>
            {page === id && <span className="absolute top-0 inset-x-3 h-0.5 rounded-full bg-[#0b7a6e]" />}
            <div className="relative">
              <Icon className="w-5 h-5" strokeWidth={page === id ? 2.5 : 1.8} />
              {badge > 0 && <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-[#0b7a6e] text-white text-[9px] font-black rounded-full flex items-center justify-center">{badge}</span>}
            </div>
            <span className="text-[10px] font-semibold leading-none">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const lang: Lang = "ar";
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(PRODUCTS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], qty: 2 },
    { product: PRODUCTS[2], qty: 1 },
  ]);
  const [wishIds, setWishIds] = useState<Set<number>>(new Set([3, 7]));
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocationState] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem("haseri-delivery-location");
      if (saved) {
        const parsed = JSON.parse(saved) as DeliveryLocation;
        if (SYRIA_LOCATIONS.some((l) => l.id === parsed.id)) return parsed;
      }
    } catch { /* ignore */ }
    return SYRIA_LOCATIONS[0];
  });

  const setDeliveryLocation = (loc: DeliveryLocation) => {
    setDeliveryLocationState(loc);
    localStorage.setItem("haseri-delivery-location", JSON.stringify(loc));
  };
  const accountPages: Page[] = ["dashboard", "orders", "order-detail", "addresses", "wishlist-page", "notifications", "loyalty", "subscription", "sub-dashboard"];
  const openLocationModal = () => setLocationModalOpen(true);
  const closeLocationModal = () => setLocationModalOpen(false);
  const logout = () => {
    setIsLoggedIn(false);
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (p: Page, product?: Product) => {
    if (product) setCurrentProduct(product);
    if (accountPages.includes(p)) setIsLoggedIn(true);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (p: Product, qty = 1) => setCartItems(prev => {
    const ex = prev.find(i => i.product.id === p.id);
    return ex ? prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i) : [...prev, { product: p, qty }];
  });
  const removeFromCart = (id: number) => setCartItems(p => p.filter(i => i.product.id !== id));
  const updateQty = (id: number, qty: number) => { if (qty <= 0) { removeFromCart(id); return; } setCartItems(p => p.map(i => i.product.id === id ? { ...i, qty } : i)); };
  const toggleWish = (id: number) => setWishIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const wishCount = wishIds.size;

  const ctx: NavCtx = {
    page, goTo, isLoggedIn, logout, currentProduct, cartItems, addToCart, removeFromCart, updateQty,
    wishIds, toggleWish, cartCount, wishCount, lang,
    deliveryLocation, setDeliveryLocation, locationModalOpen, openLocationModal, closeLocationModal,
  };

  const isAuthPage = page === "login" || page === "register" || page === "forgot";

  return (
    <NavContext.Provider value={ctx}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-white text-gray-900"
        style={{ fontFamily: "'Cairo', sans-serif" }}>
        {!isAuthPage && <SiteHeader lang={lang} page={page} />}
        <main className={isAuthPage ? "" : "pb-16 sm:pb-0"}>
          {page === "home"          && <HomePage lang={lang} />}
          {page === "listing"       && <ProductsListingPage lang={lang} />}
          {page === "product"       && <ProductDetailPage lang={lang} />}
          {page === "cart"          && <CartPage lang={lang} />}
          {page === "checkout"      && <CheckoutPage lang={lang} />}
          {/* Auth */}
          {page === "login"         && <LoginPage lang={lang} />}
          {page === "register"      && <RegisterPage lang={lang} />}
          {page === "forgot"        && <ForgotPasswordPage lang={lang} />}
          {/* Account */}
          {page === "dashboard"     && <DashboardPage lang={lang} />}
          {page === "orders"        && <OrderHistoryPage lang={lang} />}
          {page === "order-detail"  && <OrderDetailPage2 lang={lang} />}
          {page === "addresses"     && <SavedAddressesPage lang={lang} />}
          {page === "wishlist-page" && <WishlistPageAccount lang={lang} />}
          {page === "notifications" && <NotificationsPage lang={lang} />}
          {page === "loyalty"       && <LoyaltyPage lang={lang} />}
          {page === "subscription"  && <SubscriptionSetupPage lang={lang} />}
          {page === "sub-dashboard" && <SubscriptionDashboardPage lang={lang} />}
          {page === "upload-rx"     && <UploadCreamRxPage lang={lang} />}
        </main>
        {!isAuthPage && <FAQSection lang={lang} />}
        {!isAuthPage && <Footer lang={lang} />}
        {!isAuthPage && <MobileNav lang={lang} />}
        <LocationPickerModal />
      </div>
    </NavContext.Provider>
  );
}
