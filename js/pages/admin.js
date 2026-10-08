// Haseri — Admin Dashboard
window.renderPage = function () {
  renderAdminPage();
};

function renderAdminPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  const showData = window.adminShowData;

  const activeSubs = showData ? SAMPLE_CUSTOMERS.filter((c) => c.subscriptionStatus === "active").length : 0;
  const newSubs = showData ? 2 : 0;
  const orderCount = showData ? SAMPLE_ORDERS.length : 0;
  const revenue = showData ? SAMPLE_ORDERS.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0) + SUBSCRIPTION_FEE * activeSubs : 0;

  const recentOrders = showData ? SAMPLE_ORDERS.slice(0, 5) : [];
  const ordersRows = recentOrders
    .map((order) => {
      const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const statusMap = {
        confirmed: { key: "orders_status_confirmed", class: "badge-info" },
        dispatched: { key: "orders_status_dispatched", class: "badge-warning" },
        delivered: { key: "orders_status_delivered", class: "badge-success" },
      };
      const s = statusMap[order.status] || statusMap.confirmed;
      return `
        <tr>
          <td style="font-weight:600;">${order.id}</td>
          <td>${formatDateShort(order.date)}</td>
          <td><span class="badge ${s.class}" data-i18n="${s.key}">${t(s.key)}</span></td>
          <td style="font-weight:700; color:var(--primary-600);">${formatPrice(total)}</td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="admin_title">${t("admin_title")}</h1>

    <div style="text-align:center; margin-bottom:var(--space-4);">
      <label class="toggle-switch">
        <input type="checkbox" id="data-toggle" ${showData ? "checked" : ""} onchange="toggleDataMode()" />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span id="toggle-label">${showData ? t("admin_show_empty") : t("admin_show_data")}</span>
      </label>
    </div>

    <div class="stat-grid" style="margin-bottom:var(--space-4);">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">${activeSubs}</div>
        <div class="stat-label" data-i18n="admin_active_subs">${t("admin_active_subs")}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🆕</div>
        <div class="stat-value">${newSubs}</div>
        <div class="stat-label" data-i18n="admin_new_subs">${t("admin_new_subs")}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-value">${orderCount}</div>
        <div class="stat-label" data-i18n="admin_orders">${t("admin_orders")}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-value">${formatPrice(revenue)}</div>
        <div class="stat-label" data-i18n="admin_revenue">${t("admin_revenue")}</div>
      </div>
    </div>

    <h2 style="margin-bottom:var(--space-2);" data-i18n="admin_recent_orders">${t("admin_recent_orders")}</h2>
    ${recentOrders.length > 0 ? `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th data-i18n="cart_order_number">${t("cart_order_number")}</th>
              <th data-i18n="orders_date">${t("orders_date")}</th>
              <th data-i18n="account_subscription">${t("account_subscription")}</th>
              <th data-i18n="order_total">${t("order_total")}</th>
            </tr>
          </thead>
          <tbody>${ordersRows}</tbody>
        </table>
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-icon">📊</div>
        <h3 data-i18n="admin_orders">${t("admin_orders")}</h3>
      </div>
    `}
  `;
}

function toggleDataMode() {
  window.adminShowData = !window.adminShowData;
  renderAdminPage();
  applyLang();
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("admin");
  renderAdminPage();
});
