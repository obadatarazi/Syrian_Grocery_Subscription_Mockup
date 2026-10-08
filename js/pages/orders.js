// Haseri — Orders page (current orders with status)
window.renderPage = function () {
  renderOrdersPage();
};

function renderOrdersPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  const userOrders = SAMPLE_ORDERS.filter((o) => o.customerId === window.currentUser.id);

  if (userOrders.length === 0) {
    container.innerHTML = `
      <h1 class="page-title" data-i18n="orders_title">${t("orders_title")}</h1>
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 data-i18n="orders_no_orders">${t("orders_no_orders")}</h3>
        <a href="catalog.html" class="btn btn-primary" data-i18n="cart_browse">${t("cart_browse")}</a>
      </div>
    `;
    return;
  }

  const ordersHtml = userOrders
    .map((order) => {
      const statusBadge = getStatusBadge(order.status);
      const itemsHtml = order.items
        .map((item) => {
          const p = getProductById(item.productId);
          return `
            <div class="order-item-row">
              <span>${p ? getProductName(p) : item.productId} × ${item.qty}</span>
              <span>${formatPrice(item.price * item.qty)}</span>
            </div>
          `;
        })
        .join("");

      const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

      return `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">${order.id}</span>
            ${statusBadge}
          </div>
          <div class="order-items-list">${itemsHtml}</div>
          <div class="order-footer">
            <span style="color:var(--neutral-500); font-size:0.875rem;">
              <span data-i18n="orders_estimated_delivery">${t("orders_estimated_delivery")}</span>: ${formatDate(order.estimatedDelivery)}
            </span>
            <span style="font-weight:700; color:var(--primary-600);">${formatPrice(total)}</span>
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="orders_title">${t("orders_title")}</h1>
    <div style="margin-bottom:var(--space-3); text-align:center;">
      <a href="order-history.html" class="btn btn-secondary btn-sm" data-i18n="orders_view_history">${t("orders_view_history")}</a>
    </div>
    ${ordersHtml}
  `;
}

function getStatusBadge(status) {
  const map = {
    confirmed: { key: "orders_status_confirmed", class: "badge-info" },
    dispatched: { key: "orders_status_dispatched", class: "badge-warning" },
    delivered: { key: "orders_status_delivered", class: "badge-success" },
  };
  const info = map[status] || map.confirmed;
  return `<span class="badge ${info.class}" data-i18n="${info.key}">${t(info.key)}</span>`;
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("orders");
  renderOrdersPage();
});
