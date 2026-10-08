// Haseri — Catalog page
let selectedCategory = "all";

window.renderPage = function () {
  renderCatalog();
};

function renderCatalog() {
  const container = document.getElementById("page-content");
  if (!container) return;

  // Category chips
  const chips = [`<button class="category-chip ${selectedCategory === "all" ? "active" : ""}" onclick="selectCategory('all')" data-i18n="catalog_all">${t("catalog_all")}</button>`];
  CATEGORIES.forEach((cat) => {
    chips.push(
      `<button class="category-chip ${selectedCategory === cat.id ? "active" : ""}" onclick="selectCategory('${cat.id}')">${getCategoryName(cat)}</button>`
    );
  });

  // Check expired subscription
  const isExpired = window.currentUser && window.currentUser.subscriptionStatus === "expired";
  let renewalBanner = "";
  if (isExpired) {
    renewalBanner = `
      <div class="card" style="background: var(--warning-bg); border-color: var(--warning-border); margin-bottom: var(--space-3); display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); flex-wrap: wrap;">
        <p style="color: var(--warning); font-weight: 600; margin: 0;" data-i18n="catalog_renew_prompt">${t("catalog_renew_prompt")}</p>
        <a href="subscribe.html" class="btn btn-primary btn-sm" data-i18n="catalog_renew_button">${t("catalog_renew_button")}</a>
      </div>
    `;
  }

  // Products
  let productsHtml = "";
  if (selectedCategory === "frozen") {
    // Empty category
    productsHtml = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 data-i18n="catalog_category_unavailable">${t("catalog_category_unavailable")}</h3>
      </div>
    `;
  } else {
    let filtered = PRODUCTS.filter((p) => !p.hidden);
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    if (filtered.length === 0) {
      productsHtml = `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3 data-i18n="catalog_no_products">${t("catalog_no_products")}</h3>
        </div>
      `;
    } else {
      productsHtml = `<div class="product-grid">`;
      filtered.forEach((p) => {
        const category = getCategoryById(p.categoryId);
        const supplier = getSupplierById(p.supplierId);
        const isExclusive = supplier && supplier.tier === "exclusive";

        const saving = p.retailPrice ? p.retailPrice - p.factoryPrice : 0;
        const savingPct = p.retailPrice ? Math.round((saving / p.retailPrice) * 100) : 0;

        productsHtml += `
          <div class="product-card">
            ${isExclusive ? `<span class="exclusive-tag" data-i18n="products_tier_exclusive">${t("products_tier_exclusive")}</span>` : ""}
            <div class="product-icon">${category ? category.icon : "📦"}</div>
            <div class="product-name">${getProductName(p)}</div>
            <div class="product-size">${p.sizeAr} · ${getSupplierName(supplier)}</div>
            <div class="price-row">
              <span class="factory-price">${formatPrice(p.factoryPrice)}</span>
              ${p.retailPrice ? `<span class="retail-price">${formatPrice(p.retailPrice)}</span>` : ""}
            </div>
            ${p.retailPrice ? `<span class="saving-badge" data-i18n="catalog_save">${t("catalog_save")} ${formatPrice(saving)} (${savingPct}%)</span>` : ""}
            <button class="btn btn-primary btn-sm btn-block" onclick="handleAddToCart('${p.id}')" data-i18n="catalog_add_to_cart">${t("catalog_add_to_cart")}</button>
          </div>
        `;
      });
      productsHtml += `</div>`;
    }
  }

  container.innerHTML = `
    <h1 class="page-title" data-i18n="catalog_title">${t("catalog_title")}</h1>
    ${renewalBanner}
    <div class="category-chips">${chips.join("")}</div>
    ${productsHtml}
  `;
}

function selectCategory(catId) {
  selectedCategory = catId;
  renderCatalog();
  // Re-apply translations for static elements
  applyLang(getLang());
}

function handleAddToCart(productId) {
  addToCart(productId);
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("catalog");
  renderCatalog();
});
