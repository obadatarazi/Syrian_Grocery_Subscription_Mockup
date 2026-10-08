/**
 * Extracts categories & brands from App.tsx and generates a reference PDF
 * for backend database seeding.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP_TSX = path.join(ROOT, "src", "App.tsx");
const OUT_DIR = path.join(ROOT, "docs");
const OUT_JSON = path.join(OUT_DIR, "seed-data.json");
const OUT_HTML = path.join(OUT_DIR, "aroma-care-categories-and-brands.html");

const src = fs.readFileSync(APP_TSX, "utf8");

// ─── Parse translation object for en/ar pairs ───────────────────────────────
function parseTranslations() {
  const enBlock = src.match(/en:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*ar:\s*\{/);
  const arBlock = src.match(/ar:\s*\{([\s\S]*?)\n\s*\},\s*\n\};/);
  if (!enBlock || !arBlock) return {};

  const parseKeys = (block) => {
    const map = {};
    const re = /(\w+):\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(block[1])) !== null) {
      map[m[1]] = m[2];
    }
    return map;
  };
  return { en: parseKeys(enBlock), ar: parseKeys(arBlock) };
}

const T = parseTranslations();

// ─── Parse { en: "...", ar: "..." } arrays ──────────────────────────────────
function parseEnArArray(constName) {
  const re = new RegExp(
    `const ${constName}[\\s\\S]*?=\\s*\\[([\\s\\S]*?)\\];`
  );
  const m = src.match(re);
  if (!m) return [];
  const items = [];
  const itemRe = /\{\s*en:\s*"([^"]+)"\s*,\s*ar:\s*"([^"]+)"/g;
  let im;
  while ((im = itemRe.exec(m[1])) !== null) {
    items.push({ en: im[1], ar: im[2] });
  }
  return items;
}

// ─── Parse SHOP_MEGA_MENU ───────────────────────────────────────────────────
function parseShopMegaMenu() {
  const re = /const SHOP_MEGA_MENU:\s*MegaCategory\[\]\s*=\s*\[([\s\S]*?)\n\];/;
  const m = src.match(re);
  if (!m) return [];

  const body = m[1];
  const categories = [];
  const catRe =
    /\{\s*id:\s*"([^"]+)"\s*,\s*en:\s*"([^"]+)"\s*,\s*ar:\s*"([^"]+)"\s*,\s*type:\s*"([^"]+)"(?:\s*,\s*subs:\s*\[([\s\S]*?)\])?\s*\}/g;

  let cm;
  while ((cm = catRe.exec(body)) !== null) {
    const [, id, en, ar, type, subsBlock] = cm;
    const subs = [];
    if (subsBlock) {
      const subRe = /\{\s*en:\s*"([^"]+)"\s*,\s*ar:\s*"([^"]+)"\s*\}/g;
      let sm;
      while ((sm = subRe.exec(subsBlock)) !== null) {
        subs.push({ en: sm[1], ar: sm[2] });
      }
    }
    categories.push({ id, en, ar, type, subs });
  }
  return categories;
}

// ─── Parse string arrays (MEGA_BRANDS, TOP_BRANDS) ──────────────────────────
function parseStringArray(constName) {
  const re = new RegExp(`const ${constName}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
  const m = src.match(re);
  if (!m) return [];
  const items = [];
  const strRe = /"([^"]+)"/g;
  let sm;
  while ((sm = strRe.exec(m[1])) !== null) items.push(sm[1]);
  return items;
}

function parseTopBrands() {
  const re = /const TOP_BRANDS[\s\S]*?=\s*\[([\s\S]*?)\];/;
  const m = src.match(re);
  if (!m) return [];
  const brands = [];
  const itemRe = /\{\s*name:\s*"([^"]+)"/g;
  let im;
  while ((im = itemRe.exec(m[1])) !== null) brands.push(im[1]);
  return brands;
}

function parseProductBrands() {
  const brands = new Set();
  for (const constName of ["PRODUCTS", "CREAM_RX_PRODUCTS"]) {
    const re = new RegExp(`const ${constName}:\\s*Product\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`);
    const m = src.match(re);
    if (!m) continue;
    const brandRe = /brand:\s*"([^"]+)"/g;
    let bm;
    while ((bm = brandRe.exec(m[1])) !== null) brands.add(bm[1]);
  }
  return [...brands];
}

function parseTopCategories() {
  const re = /const TOP_CATEGORIES[\s\S]*?=\s*\[([\s\S]*?)\];/;
  const m = src.match(re);
  if (!m) return [];
  const cats = [];
  const itemRe = /labelKey:\s*"([^"]+)"/g;
  let im;
  while ((im = itemRe.exec(m[1])) !== null) {
    const key = im[1];
    cats.push({ key, en: T.en[key] || key, ar: T.ar[key] || key });
  }
  return cats;
}

function parseFooterCategories() {
  const re = /const categories = \[([\s\S]*?)\];\s*\n\s*const quickLinks/;
  const m = src.match(re);
  if (!m) return [];
  const cats = [];
  const itemRe = /\{\s*en:\s*"([^"]+)"\s*,\s*ar:\s*"([^"]+)"/g;
  let im;
  while ((im = itemRe.exec(m[1])) !== null) {
    cats.push({ en: im[1], ar: im[2] });
  }
  return cats;
}

function parseArabicBrandsFromBanner() {
  const m = src.match(
    /const SECTION_ONE_STATIC_BANNER[\s\S]*?subtitleAr:\s*"([^"]+)"/
  );
  if (!m) return [];
  return m[1]
    .split(/[·•]/)
    .map((b) => b.trim())
    .filter(Boolean);
}

function extractArabicBrandFromProductName(nameAr, nameEn, brandEn) {
  // Product Arabic names often embed brand transliterations at the start
  const patterns = [
    { en: "Cetaphil", ar: "سيتافيل" },
    { en: "La Roche-Posay", ar: "لاروش بوزيه" },
    { en: "Maybelline", ar: "ميبيلين" },
    { en: "Neutrogena", ar: "نيوتروجينا" },
    { en: "COSRX", ar: "كوسركس" },
    { en: "Cosrx", ar: "كوسركس" },
    { en: "Bioderma", ar: "بيوديرما" },
    { en: "Eucerin", ar: "يوسرين" },
    { en: "Differin", ar: "ديفرين" },
    { en: "Solgar", ar: "سولجار" },
  ];
  for (const p of patterns) {
    if (brandEn === p.en && nameAr.includes(p.ar)) return p.ar;
  }
  return null;
}

function parseProductArabicBrands() {
  const re =
    /\{\s*id:\s*\d+[\s\S]*?nameEn:\s*"([^"]+)"[\s\S]*?nameAr:\s*"([^"]+)"[\s\S]*?brand:\s*"([^"]+)"/g;
  const brands = new Set();
  let m;
  while ((m = re.exec(src)) !== null) {
    const arBrand = extractArabicBrandFromProductName(m[2], m[1], m[3]);
    if (arBrand) brands.add(arBrand);
  }
  return [...brands];
}

function dedupeSorted(arr, keyFn = (x) => x) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out.sort((a, b) => keyFn(a).localeCompare(keyFn(b), "en"));
}

// ─── Collect all data ───────────────────────────────────────────────────────
const shopMegaMenu = parseShopMegaMenu();
const wellnessSubs = parseEnArArray("WELLNESS_MEGA_SUBS");
const beautySubs = parseEnArArray("BEAUTY_MEGA_SUBS");
const supplementsSubs = parseEnArArray("SUPPLEMENTS_MEGA_SUBS");
const exploreBeauty = parseEnArArray("EXPLORE_BEAUTY_CATEGORIES");
const nutritionGuide = parseEnArArray("NUTRITION_GUIDE_CATEGORIES");
const momBaby = parseEnArArray("MOM_BABY_CATEGORIES");
const topCategories = parseTopCategories();
const footerCategories = parseFooterCategories();

const navCategories = [
  { en: T.en.wellness || "Wellness", ar: T.ar.wellness || "العافية" },
  { en: T.en.beauty || "Beauty", ar: T.ar.beauty || "الجمال" },
  { en: T.en.supplements || "Supplements", ar: T.ar.supplements || "المكملات" },
  { en: T.en.personalCare || "Personal Care", ar: T.ar.personalCare || "العناية الشخصية" },
  { en: T.en.motherBaby || "Mother & Baby", ar: T.ar.motherBaby || "الأم والطفل" },
  { en: T.en.medicalDevices || "Medical Devices", ar: T.ar.medicalDevices || "الأجهزة الطبية" },
];

const productFilterCategories = [
  { key: "beauty", en: T.en.beauty, ar: T.ar.beauty },
  { key: "supplements", en: T.en.supplements, ar: T.ar.supplements },
];

const promoCategories = [
  { key: "catSkincareBeauty", en: T.en.catSkincareBeauty, ar: T.ar.catSkincareBeauty },
  { key: "catVitaminsSupps", en: T.en.catVitaminsSupps, ar: T.ar.catVitaminsSupps },
  { key: "catPersonalCare", en: T.en.catPersonalCare, ar: T.ar.catPersonalCare },
  { key: "catWellnessBundle", en: T.en.catWellnessBundle, ar: T.ar.catWellnessBundle },
  { key: "catEnergyBoost", en: T.en.catEnergyBoost, ar: T.ar.catEnergyBoost },
];

const megaBrands = dedupeSorted(parseStringArray("MEGA_BRANDS"));
const topBrands = parseTopBrands();
const productBrands = parseProductBrands();

const englishBrands = dedupeSorted([
  ...megaBrands,
  ...topBrands,
  ...productBrands,
]);

// Arabic brands: only names that exist in Arabic in the project source
const arabicBrands = dedupeSorted([
  ...parseArabicBrandsFromBanner(),
  ...parseProductArabicBrands(),
]);

function treeLine(depth, text, isLast = true) {
  const indent = "    ".repeat(depth);
  const branch = depth === 0 ? "" : isLast ? "└── " : "├── ";
  return `${indent}${branch}${text}`;
}

function renderTreeEn(parent, children) {
  const lines = [treeLine(0, parent)];
  children.forEach((c, i) => {
    lines.push(treeLine(1, c, i === children.length - 1));
  });
  return lines.join("\n");
}

function renderTreeAr(parent, children) {
  const lines = [treeLine(0, parent)];
  children.forEach((c, i) => {
    lines.push(treeLine(1, c, i === children.length - 1));
  });
  return lines.join("\n");
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sectionHtml(title, treesEn, treesAr) {
  return `
    <div class="section">
      <h3>${esc(title)}</h3>
      <h4>English</h4>
      <pre class="tree en">${treesEn.map(esc).join("\n\n")}</pre>
      <h4>Arabic</h4>
      <pre class="tree ar" dir="rtl">${treesAr.map(esc).join("\n\n")}</pre>
    </div>`;
}

function buildTrees(parent, children) {
  return { parent, children };
}

// Build category sections for JSON export
const categorySections = [];

// 1. Shop Mega Menu
categorySections.push({
  title: "Shop Mega Menu (SHOP_MEGA_MENU)",
  type: "trees",
  english: shopMegaMenu
    .filter((c) => c.type === "subs" && c.subs.length)
    .map((c) => buildTrees(c.en, c.subs.map((s) => s.en))),
  arabic: shopMegaMenu
    .filter((c) => c.type === "subs" && c.subs.length)
    .map((c) => buildTrees(c.ar, c.subs.map((s) => s.ar))),
});

categorySections.push({
  title: "Shop Mega Menu — Brands Entry",
  type: "single",
  english: "Brands",
  arabic: "العلامات التجارية",
});

categorySections.push({
  title: "Wellness Hub Navigation (WELLNESS_MEGA_SUBS)",
  type: "trees",
  english: [buildTrees(T.en.navWellness || "Wellness Hub", wellnessSubs.map((s) => s.en))],
  arabic: [buildTrees(T.ar.navWellness || "مركز العافية", wellnessSubs.map((s) => s.ar))],
});

categorySections.push({
  title: "Beauty Navigation (BEAUTY_MEGA_SUBS)",
  type: "trees",
  english: [buildTrees(T.en.beauty || "Beauty", beautySubs.map((s) => s.en))],
  arabic: [buildTrees(T.ar.beauty || "الجمال", beautySubs.map((s) => s.ar))],
});

categorySections.push({
  title: "Supplements Navigation (SUPPLEMENTS_MEGA_SUBS)",
  type: "trees",
  english: [buildTrees(T.en.supplements || "Supplements", supplementsSubs.map((s) => s.en))],
  arabic: [buildTrees(T.ar.supplements || "المكملات", supplementsSubs.map((s) => s.ar))],
});

categorySections.push({
  title: "Top Categories — Homepage (TOP_CATEGORIES)",
  type: "flat",
  english: topCategories.map((c) => c.en),
  arabic: topCategories.map((c) => c.ar),
});

categorySections.push({
  title: "Explore Beauty Categories (EXPLORE_BEAUTY_CATEGORIES)",
  type: "trees",
  english: [buildTrees(T.en.exploreBeautyCategories || "Explore Beauty Categories", exploreBeauty.map((c) => c.en))],
  arabic: [buildTrees(T.ar.exploreBeautyCategories || "استكشف فئات الجمال", exploreBeauty.map((c) => c.ar))],
});

categorySections.push({
  title: "Nutrition Guide Categories (NUTRITION_GUIDE_CATEGORIES)",
  type: "trees",
  english: [buildTrees(T.en.yourNutritionGuide || "Your Nutrition Guide", nutritionGuide.map((c) => c.en))],
  arabic: [buildTrees(T.ar.yourNutritionGuide || "دليلك الغذائي", nutritionGuide.map((c) => c.ar))],
});

categorySections.push({
  title: "Mom & Baby Categories (MOM_BABY_CATEGORIES)",
  type: "trees",
  english: [buildTrees(T.en.momBabyStoreTitle || "Mom & Baby", momBaby.map((c) => c.en))],
  arabic: [buildTrees(T.ar.momBabyStoreTitle || "الأم والطفل", momBaby.map((c) => c.ar))],
});

categorySections.push({
  title: "Footer Categories",
  type: "flat",
  english: footerCategories.map((c) => c.en),
  arabic: footerCategories.map((c) => c.ar),
});

categorySections.push({
  title: "Main Navigation Category Labels",
  type: "flat",
  english: navCategories.map((c) => c.en),
  arabic: navCategories.map((c) => c.ar),
});

categorySections.push({
  title: "Product Filter Categories (from product data)",
  type: "flat",
  english: productFilterCategories.map((c) => `${c.en} (key: ${c.key})`),
  arabic: productFilterCategories.map((c) => `${c.ar} (key: ${c.key})`),
});

categorySections.push({
  title: "Promotional / Deal Categories",
  type: "flat",
  english: promoCategories.map((c) => `${c.en} (key: ${c.key})`),
  arabic: promoCategories.map((c) => `${c.ar} (key: ${c.key})`),
});

const seedData = {
  meta: {
    generated: new Date().toISOString().slice(0, 10),
    shopHierarchyCount: shopMegaMenu.filter((c) => c.subs?.length).length,
    englishBrandCount: englishBrands.length,
    arabicBrandCount: arabicBrands.length,
  },
  categorySections,
  englishBrands,
  arabicBrands,
  sources: [
    "SHOP_MEGA_MENU — primary shop navigation category hierarchy",
    "WELLNESS_MEGA_SUBS, BEAUTY_MEGA_SUBS, SUPPLEMENTS_MEGA_SUBS — header nav mega menus",
    "TOP_CATEGORIES — homepage top category tiles",
    "EXPLORE_BEAUTY_CATEGORIES, NUTRITION_GUIDE_CATEGORIES, MOM_BABY_CATEGORIES — homepage section tiles",
    "MEGA_BRANDS, TOP_BRANDS — brand listings",
    "PRODUCTS, CREAM_RX_PRODUCTS — product category and brand fields",
    "T — localization strings for category labels",
    "Footer inline categories array",
  ],
};

// Keep HTML generation for browser preview (optional)
const categorySectionsHtml = [];

// 1. Shop Mega Menu
const shopEn = shopMegaMenu
  .filter((c) => c.type === "subs" && c.subs.length)
  .map((c) => renderTreeEn(c.en, c.subs.map((s) => s.en)));
const shopAr = shopMegaMenu
  .filter((c) => c.type === "subs" && c.subs.length)
  .map((c) => renderTreeAr(c.ar, c.subs.map((s) => s.ar)));
categorySectionsHtml.push(sectionHtml("Shop Mega Menu (SHOP_MEGA_MENU)", shopEn, shopAr));

// Brands entry (no subs)
categorySectionsHtml.push(`
  <div class="section">
    <h3>Shop Mega Menu — Brands Entry</h3>
    <h4>English</h4>
    <pre class="tree en">Brands</pre>
    <h4>Arabic</h4>
    <pre class="tree ar" dir="rtl">العلامات التجارية</pre>
  </div>`);

// 2. Wellness Hub nav
categorySectionsHtml.push(
  sectionHtml(
    "Wellness Hub Navigation (WELLNESS_MEGA_SUBS)",
    [renderTreeEn(T.en.navWellness || "Wellness Hub", wellnessSubs.map((s) => s.en))],
    [renderTreeAr(T.ar.navWellness || "مركز العافية", wellnessSubs.map((s) => s.ar))]
  )
);

// 3. Beauty nav
categorySectionsHtml.push(
  sectionHtml(
    "Beauty Navigation (BEAUTY_MEGA_SUBS)",
    [renderTreeEn(T.en.beauty || "Beauty", beautySubs.map((s) => s.en))],
    [renderTreeAr(T.ar.beauty || "الجمال", beautySubs.map((s) => s.ar))]
  )
);

// 4. Supplements nav
categorySectionsHtml.push(
  sectionHtml(
    "Supplements Navigation (SUPPLEMENTS_MEGA_SUBS)",
    [renderTreeEn(T.en.supplements || "Supplements", supplementsSubs.map((s) => s.en))],
    [renderTreeAr(T.ar.supplements || "المكملات", supplementsSubs.map((s) => s.ar))]
  )
);

// 5. Top Categories (flat)
categorySectionsHtml.push(`
  <div class="section">
    <h3>Top Categories — Homepage (TOP_CATEGORIES)</h3>
    <h4>English</h4>
    <ul class="flat">${topCategories.map((c) => `<li>${esc(c.en)}</li>`).join("")}</ul>
    <h4>Arabic</h4>
    <ul class="flat ar" dir="rtl">${topCategories.map((c) => `<li>${esc(c.ar)}</li>`).join("")}</ul>
  </div>`);

// 6. Explore Beauty
const exploreEn = [renderTreeEn(T.en.exploreBeautyCategories || "Explore Beauty Categories", exploreBeauty.map((c) => c.en))];
const exploreAr = [renderTreeAr(T.ar.exploreBeautyCategories || "استكشف فئات الجمال", exploreBeauty.map((c) => c.ar))];
categorySectionsHtml.push(sectionHtml("Explore Beauty Categories (EXPLORE_BEAUTY_CATEGORIES)", exploreEn, exploreAr));

// 7. Nutrition Guide
const nutrEn = [renderTreeEn(T.en.yourNutritionGuide || "Your Nutrition Guide", nutritionGuide.map((c) => c.en))];
const nutrAr = [renderTreeAr(T.ar.yourNutritionGuide || "دليلك الغذائي", nutritionGuide.map((c) => c.ar))];
categorySectionsHtml.push(sectionHtml("Nutrition Guide Categories (NUTRITION_GUIDE_CATEGORIES)", nutrEn, nutrAr));

// 8. Mom & Baby
const momEn = [renderTreeEn(T.en.momBabyStoreTitle || "Mom & Baby", momBaby.map((c) => c.en))];
const momAr = [renderTreeAr(T.ar.momBabyStoreTitle || "الأم والطفل", momBaby.map((c) => c.ar))];
categorySectionsHtml.push(sectionHtml("Mom & Baby Categories (MOM_BABY_CATEGORIES)", momEn, momAr));

// 9. Footer
categorySectionsHtml.push(`
  <div class="section">
    <h3>Footer Categories</h3>
    <h4>English</h4>
    <ul class="flat">${footerCategories.map((c) => `<li>${esc(c.en)}</li>`).join("")}</ul>
    <h4>Arabic</h4>
    <ul class="flat ar" dir="rtl">${footerCategories.map((c) => `<li>${esc(c.ar)}</li>`).join("")}</ul>
  </div>`);

// 10. Main nav categories (flat)
categorySectionsHtml.push(`
  <div class="section">
    <h3>Main Navigation Category Labels</h3>
    <h4>English</h4>
    <ul class="flat">${navCategories.map((c) => `<li>${esc(c.en)}</li>`).join("")}</ul>
    <h4>Arabic</h4>
    <ul class="flat ar" dir="rtl">${navCategories.map((c) => `<li>${esc(c.ar)}</li>`).join("")}</ul>
  </div>`);

// 11. Product filter categories
categorySectionsHtml.push(`
  <div class="section">
    <h3>Product Filter Categories (from product data)</h3>
    <h4>English</h4>
    <ul class="flat">${productFilterCategories.map((c) => `<li>${esc(c.en)} <span class="meta">(key: ${esc(c.key)})</span></li>`).join("")}</ul>
    <h4>Arabic</h4>
    <ul class="flat ar" dir="rtl">${productFilterCategories.map((c) => `<li>${esc(c.ar)} <span class="meta">(key: ${esc(c.key)})</span></li>`).join("")}</ul>
  </div>`);

// 12. Promo/deal categories
categorySectionsHtml.push(`
  <div class="section">
    <h3>Promotional / Deal Categories</h3>
    <h4>English</h4>
    <ul class="flat">${promoCategories.map((c) => `<li>${esc(c.en)} <span class="meta">(key: ${esc(c.key)})</span></li>`).join("")}</ul>
    <h4>Arabic</h4>
    <ul class="flat ar" dir="rtl">${promoCategories.map((c) => `<li>${esc(c.ar)} <span class="meta">(key: ${esc(c.key)})</span></li>`).join("")}</ul>
  </div>`);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Aroma Care — Categories &amp; Brands Reference</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    @page { margin: 18mm 15mm; size: A4; }
    * { box-sizing: border-box; }
    body {
      font-family: Inter, system-ui, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #1a1a1a;
      max-width: 100%;
      margin: 0;
      padding: 24px 32px;
    }
    h1 { font-size: 20pt; color: #063e38; margin: 0 0 6px; border-bottom: 3px solid #0b7a6e; padding-bottom: 8px; }
    .subtitle { color: #555; margin-bottom: 24px; font-size: 10pt; }
    h2 { font-size: 15pt; color: #0b7a6e; margin: 28px 0 12px; page-break-after: avoid; }
    h3 { font-size: 12pt; color: #063e38; margin: 20px 0 8px; page-break-after: avoid; }
    h4 { font-size: 10.5pt; color: #333; margin: 14px 0 6px; text-transform: uppercase; page-break-after: avoid; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    pre.tree {
      font-family: "Courier New", Consolas, monospace;
      font-size: 9.5pt;
      background: #f7faf9;
      border: 1px solid #d8ebe8;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 0 0 12px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    pre.tree.ar { font-family: Cairo, "Arial Unicode MS", sans-serif; text-align: right; }
    ul.flat { margin: 0 0 14px; padding-left: 22px; }
    ul.flat.ar { font-family: Cairo, sans-serif; padding-right: 22px; padding-left: 0; list-style-position: inside; }
    ul.brands { columns: 2; column-gap: 24px; margin: 0 0 16px; padding-left: 22px; }
    ul.brands.ar { font-family: Cairo, sans-serif; direction: rtl; padding-right: 22px; padding-left: 0; }
    li { margin: 3px 0; break-inside: avoid; }
    .meta { color: #888; font-size: 9pt; }
    .note { background: #fff8e8; border-left: 4px solid #c9a85c; padding: 10px 14px; margin: 16px 0; font-size: 9.5pt; }
    .stats { display: flex; gap: 20px; flex-wrap: wrap; margin: 16px 0 24px; }
    .stat { background: #e8f5f3; padding: 10px 16px; border-radius: 8px; }
    .stat strong { display: block; font-size: 16pt; color: #0b7a6e; }
    footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 9pt; color: #777; }
  </style>
</head>
<body>
  <h1>Aroma Care Website Prototype</h1>
  <p class="subtitle">Categories &amp; Brands Reference — extracted from <code>Website-prototype/src/App.tsx</code><br/>
  Generated: ${new Date().toISOString().slice(0, 10)} · Purpose: backend database seeding</p>

  <div class="stats">
    <div class="stat"><strong>${shopMegaMenu.filter((c) => c.subs?.length).length}</strong>Shop mega-menu hierarchies</div>
    <div class="stat"><strong>${englishBrands.length}</strong>Unique English brands</div>
    <div class="stat"><strong>${arabicBrands.length}</strong>Arabic brand names in source</div>
  </div>

  <h2>Categories</h2>
  ${categorySectionsHtml.join("\n")}

  <h2>Brands</h2>

  <div class="section">
    <h3>English Brands</h3>
    <p>Sources: <code>MEGA_BRANDS</code>, <code>TOP_BRANDS</code>, product <code>brand</code> fields (<code>PRODUCTS</code>, <code>CREAM_RX_PRODUCTS</code>). Duplicates removed; names preserved exactly as in source.</p>
    <ul class="brands">
      ${englishBrands.map((b) => `<li>${esc(b)}</li>`).join("\n      ")}
    </ul>
  </div>

  <div class="section">
    <h3>Arabic Brands</h3>
    <div class="note">Arabic brand names appear only where explicitly present in the project source (banner subtitles and Arabic product name transliterations). Brands without Arabic representations in the prototype are listed only in the English section above.</div>
    <ul class="brands ar" dir="rtl">
      ${arabicBrands.map((b) => `<li>${esc(b)}</li>`).join("\n      ")}
    </ul>
  </div>

  <h2>Source Constants Reference</h2>
  <ul class="flat">
    <li><code>SHOP_MEGA_MENU</code> — primary shop navigation category hierarchy</li>
    <li><code>WELLNESS_MEGA_SUBS</code>, <code>BEAUTY_MEGA_SUBS</code>, <code>SUPPLEMENTS_MEGA_SUBS</code> — header nav mega menus</li>
    <li><code>TOP_CATEGORIES</code> — homepage top category tiles</li>
    <li><code>EXPLORE_BEAUTY_CATEGORIES</code>, <code>NUTRITION_GUIDE_CATEGORIES</code>, <code>MOM_BABY_CATEGORIES</code> — homepage section tiles</li>
    <li><code>MEGA_BRANDS</code>, <code>TOP_BRANDS</code> — brand listings</li>
    <li><code>PRODUCTS</code>, <code>CREAM_RX_PRODUCTS</code> — product <code>category</code> and <code>brand</code> fields</li>
    <li><code>T</code> — localization strings for category labels</li>
    <li>Footer inline <code>categories</code> array</li>
  </ul>

  <footer>
    Aroma Care KW · Website Prototype Data Export · All category and brand names preserved verbatim from source files.
  </footer>
</body>
</html>`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(seedData, null, 2), "utf8");
fs.writeFileSync(OUT_HTML, html, "utf8");
console.log("JSON written:", OUT_JSON);
console.log("HTML written:", OUT_HTML);
console.log(`English brands: ${englishBrands.length}`);
console.log(`Arabic brands: ${arabicBrands.length}`);
