// Haseri — Cart & Checkout page
let checkoutDone = false;

window.renderPage = function () {
  renderCartPage();
};

function renderCartPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  if (checkoutDone) {
    renderCheckoutConfirmation(container);
    return;
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <h1 class="page-title" data-i18n="cart_title">${t("cart_title")}</h1>
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3 data-i18n="cart_empty">${t("cart_empty")}</h3>
        <a href="catalog.html" class="btn btn-primary" data-i18n="cart_browse">${t("cart_browse")}</a>
      </div>
    `;
    return;
  }

  const cityOptions = CITIES.map(
    (c) => `<option value="${c.id}" ${window.currentUser && window.currentUser.city === c.id ? "selected" : ""}>${getCityName(c)}${c.available ? "" : " — " + t("city_unavailable")}</option>`
  ).join("");

  const rows = cart.map((item) => {
    const p = getProductById(item.productId);
    if (!p) return "";
    const category = getCategoryById(p.categoryId);
    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:var(--space-1);">
            <span style="font-size:1.5rem;">${category ? category.icon : "📦"}</span>
            <div>
              <div style="font-weight:600;">${getProductName(p)}</div>
              <div style="font-size:0.8rem; color:var(--neutral-500);">${getProductSize(p)}</div>
            </div>
          </div>
        </td>
        <td style="font-weight:600; color:var(--primary-600);">${formatPrice(p.factoryPrice)}</td>
        <td>
          <input type="number" class="form-input" style="width:70px; text-align:center;" value="${item.qty}" min="1" onchange="handleQtyChange('${p.id}', this.value)" />
        </td>
        <td style="font-weight:700;">${formatPrice(p.factoryPrice * item.qty)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="handleRemove('${p.id}')" data-i18n="cart_remove">${t("cart_remove")}</button>
        </td>
      </tr>
    `;
  }).join("");

  const total = getCartTotal();

  container.innerHTML = `
    <h1 class="page-title" data-i18n="cart_title">${t("cart_title")}</h1>
    <div style="display:grid; grid-template-columns: 1fr 320px; gap: var(--space-3); align-items: start;" class="cart-layout">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th data-i18n="cart_product">${t("cart_product")}</th>
              <th data-i18n="cart_price">${t("cart_price")}</th>
              <th data-i18n="cart_qty">${t("cart_qty")}</th>
              <th data-i18n="cart_subtotal">${t("cart_subtotal")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="card" id="checkout-panel">
        <h3 style="margin-bottom:var(--space-2);" data-i18n="cart_total">${t("cart_total")}</h3>
        <div style="font-size:1.8rem; font-weight:700; color:var(--primary-600); margin-bottom:var(--space-3);">${formatPrice(total)}</div>
        <div class="form-group">
          <label class="form-label" data-i18n="signup_city">${t("signup_city")}</label>
          <select class="form-select" id="checkout-city" onchange="handleCityChange()">
            <option value="" data-i18n="signup_select_city">${t("signup_select_city")}</option>
            ${cityOptions}
          </select>
        </div>
        <div class="form-group" id="address-group" style="display:none;">
          <label class="form-label" data-i18n="cart_address">${t("cart_address")}</label>
          <input type="text" class="form-input" id="checkout-address" data-i18n-placeholder="cart_address_placeholder" placeholder="${t("cart_address_placeholder")}" />
        </div>
        <div id="delivery-warning" style="display:none; color:var(--error); font-size:0.875rem; font-weight:500; margin-bottom:var(--space-2);" data-i18n="cart_delivery_unavailable">
          ${t("cart_delivery_unavailable")}
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="checkout-btn" onclick="handleCheckout()" disabled data-i18n="cart_checkout">${t("cart_checkout")}</button>
      </div>
    </div>
  `;

  // Apply responsive grid
  const layout = container.querySelector(".cart-layout");
  if (layout) {
    const applyResponsive = () => {
      if (window.innerWidth <= 768) {
        layout.style.gridTemplateColumns = "1fr";
      } else {
        layout.style.gridTemplateColumns = "1fr 320px";
      }
    };
    applyResponsive();
    window.addEventListener("resize", applyResponsive);
  }
}

function handleCityChange() {
  const cityId = document.getElementById("checkout-city").value;
  const addressGroup = document.getElementById("address-group");
  const warning = document.getElementById("delivery-warning");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cityId) {
    addressGroup.style.display = "none";
    warning.style.display = "none";
    checkoutBtn.disabled = true;
    return;
  }

  const city = getCityById(cityId);
  if (!city.available) {
    addressGroup.style.display = "none";
    warning.style.display = "block";
    checkoutBtn.disabled = true;
  } else {
    addressGroup.style.display = "flex";
    warning.style.display = "none";
    checkoutBtn.disabled = false;
  }
}

function handleQtyChange(productId, qty) {
  updateCartQty(productId, parseInt(qty) || 1);
  renderCartPage();
  applyLang();
}

function handleRemove(productId) {
  if (confirm(t("cart_remove_confirm"))) {
    removeFromCart(productId);
    renderCartPage();
    applyLang();
  }
}

function handleCheckout() {
  const address = document.getElementById("checkout-address")?.value.trim();
  if (!address) {
    showToast(t("cart_address"), "warning");
    return;
  }

  const deliveryDate = getEstimatedDeliveryDate();
  const orderId = "ORD-" + String(SAMPLE_ORDERS.length + 1).padStart(3, "0");

  const newOrder = {
    id: orderId,
    customerId: window.currentUser.id,
    date: new Date().toISOString().split("T")[0],
    status: "confirmed",
    estimatedDelivery: deliveryDate,
    city: document.getElementById("checkout-city").value,
    address,
    items: cart.map((item) => {
      const p = getProductById(item.productId);
      return { productId: item.productId, qty: item.qty, price: p ? p.factoryPrice : 0 };
    }),
    paid: true,
  };

  SAMPLE_ORDERS.unshift(newOrder);
  cart.length = 0;
  window.cart = cart;
  window.currentOrder = newOrder;
  checkoutDone = true;
  updateCartBadge();
  renderCartPage();
  applyLang();
}

function renderCheckoutConfirmation(container) {
  const order = window.currentOrder;
  container.innerHTML = `
    <h1 class="page-title" data-i18n="cart_order_confirmed">${t("cart_order_confirmed")}</h1>
    <div class="card" style="max-width:480px; margin:0 auto; text-align:center;">
      <div style="font-size:3rem; margin-bottom:var(--space-2);">✅</div>
      <h3 data-i18n="cart_order_confirmed">${t("cart_order_confirmed")}</h3>
      <p style="margin: var(--space-2) 0;">
        <span data-i18n="cart_order_number">${t("cart_order_number")}</span>: 
        <strong>${order ? order.id : ""}</strong>
      </p>
      <p style="color:var(--neutral-600); margin-bottom:var(--space-3);">
        <span data-i18n="cart_delivery_estimate">${t("cart_delivery_estimate")}</span>: 
        <strong>${order ? formatDate(order.estimatedDelivery) : ""}</strong>
      </p>
      <div style="display:flex; gap:var(--space-2); justify-content:center; flex-wrap:wrap;">
        <a href="orders.html" class="btn btn-primary" data-i18n="nav_orders">${t("nav_orders")}</a>
        <a href="catalog.html" class="btn btn-secondary" data-i18n="cart_browse">${t("cart_browse")}</a>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("cart");
  renderCartPage();
});
