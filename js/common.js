// Haseri (حصري) — Common utilities and shared components

// === Currency formatting ===
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// === Date formatting ===
function formatDate(dateStr) {
  const lang = getLang();
  const date = new Date(dateStr);
  if (lang === "ar") {
    return date.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
  }
  return date.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
}

// === Estimated delivery date (2 days from now) ===
function getEstimatedDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

// === Product helpers ===
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function getSupplierById(id) {
  return SUPPLIERS.find((s) => s.id === id);
}

function getCityById(id) {
  return CITIES.find((c) => c.id === id);
}

function getLocalizedField(obj, field) {
  const lang = getLang();
  const key = field + (lang === "ar" ? "Ar" : "En");
  return obj[key] || obj[field + "En"] || "";
}

function getProductName(p) {
  return getLocalizedField(p, "name");
}

function getCategoryName(c) {
  return getLocalizedField(c, "name");
}

function getCityName(c) {
  return getLocalizedField(c, "name");
}

function getSupplierName(s) {
  return getLocalizedField(s, "name");
}

// === Cart helpers ===
function addToCart(productId, qty = 1) {
  // Check subscription status
  if (window.currentUser && window.currentUser.subscriptionStatus === "expired") {
    showToast(t("catalog_renew_prompt"), "warning");
    return false;
  }
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  window.cart = cart;
  updateCartBadge();
  showToast(t("catalog_add_to_cart") + " ✓", "success");
  return true;
}

function removeFromCart(productId) {
  const idx = cart.findIndex((item) => item.productId === productId);
  if (idx >= 0) {
    cart.splice(idx, 1);
    window.cart = cart;
    updateCartBadge();
  }
}

function updateCartQty(productId, qty) {
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    window.cart = cart;
    updateCartBadge();
  }
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.factoryPrice * item.qty : 0);
  }, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

// === Toast notifications ===
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast-show");
  });

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// === Header component ===
function renderHeader(activePage) {
  const lang = getLang();
  const isRTL = lang === "ar";
  const brand = t("brand_name");

  const navItems = [
    { id: "home", href: "index.html", key: "nav_home" },
    { id: "catalog", href: "catalog.html", key: "nav_catalog" },
    { id: "orders", href: "orders.html", key: "nav_orders" },
    { id: "order-history", href: "order-history.html", key: "nav_order_history" },
    { id: "account", href: "account.html", key: "nav_account" },
  ];

  const adminItems = [
    { id: "admin", href: "admin.html", key: "nav_admin" },
    { id: "fulfilment", href: "fulfilment.html", key: "nav_fulfilment" },
    { id: "dispatch", href: "dispatch.html", key: "nav_dispatch" },
    { id: "products", href: "products.html", key: "nav_products" },
  ];

  const navHtml = navItems
    .map(
      (item) =>
        `<a href="${item.href}" class="nav-link ${activePage === item.id ? "active" : ""}" data-i18n="${item.key}">${t(item.key)}</a>`
    )
    .join("");

  const adminHtml = adminItems
    .map(
      (item) =>
        `<a href="${item.href}" class="nav-link nav-admin ${activePage === item.id ? "active" : ""}" data-i18n="${item.key}">${t(item.key)}</a>`
    )
    .join("");

  const cartCount = getCartCount();

  return `
    <header class="site-header">
      <div class="header-inner">
        <div class="header-left">
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          <a href="index.html" class="brand">
            <span class="brand-icon">🛒</span>
            <span class="brand-text">${brand}</span>
          </a>
        </div>
        <nav class="main-nav" id="main-nav">
          <div class="nav-group">
            ${navHtml}
          </div>
          <div class="nav-divider"></div>
          <div class="nav-group">
            ${adminHtml}
          </div>
        </nav>
        <div class="header-right">
          <a href="cart.html" class="cart-link" aria-label="Cart">
            <span class="cart-icon">🛍️</span>
            <span class="cart-badge" id="cart-badge" style="display:${cartCount > 0 ? "flex" : "none"}">${cartCount}</span>
          </a>
          <button class="lang-toggle" id="lang-toggle" data-i18n="lang_toggle">${t("lang_toggle")}</button>
        </div>
      </div>
    </header>
  `;
}

// === Footer component ===
function renderFooter() {
  const lang = getLang();
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-icon">🛒</span>
          <span>${t("brand_name")}</span>
        </div>
        <p class="footer-tagline" data-i18n="tagline">${t("tagline")}</p>
        <p class="footer-copy">© 2026 ${t("brand_name")} — Mock-up Demo</p>
      </div>
    </footer>
  `;
}

// === Page bootstrap ===
function initPage(activePage) {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = renderHeader(activePage);
  if (footerEl) footerEl.innerHTML = renderFooter();

  // Language toggle
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", toggleLang);
  }

  // Mobile menu
  const menuBtn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("main-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
      menuBtn.classList.toggle("menu-open");
    });
  }

  updateCartBadge();
  applyLang(getLang());
}

// Export
if (typeof window !== "undefined") {
  window.formatPrice = formatPrice;
  window.formatDate = formatDate;
  window.formatDateShort = formatDateShort;
  window.getEstimatedDeliveryDate = getEstimatedDeliveryDate;
  window.getProductById = getProductById;
  window.getCategoryById = getCategoryById;
  window.getSupplierById = getSupplierById;
  window.getCityById = getCityById;
  window.getLocalizedField = getLocalizedField;
  window.getProductName = getProductName;
  window.getCategoryName = getCategoryName;
  window.getCityName = getCityName;
  window.getSupplierName = getSupplierName;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateCartQty = updateCartQty;
  window.getCartCount = getCartCount;
  window.getCartTotal = getCartTotal;
  window.updateCartBadge = updateCartBadge;
  window.showToast = showToast;
  window.renderHeader = renderHeader;
  window.renderFooter = renderFooter;
  window.initPage = initPage;
}
