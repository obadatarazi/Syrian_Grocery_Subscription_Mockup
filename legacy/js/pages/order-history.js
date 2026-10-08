// Haseri — Order History page (past orders, newest first)
window.renderPage = function () {
  renderHistoryPage();
};

function renderHistoryPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  const showEmpty = window.historyShowEmpty;
  const userOrders = showEmpty
    ? []
    : SAMPLE_ORDERS.filter((o) => o.customerId === window.currentUser.id);
  const sorted = [...userOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

  const toggleLabel = showEmpty ? t("history_show_data") : t("history_show_empty");

  if (sorted.length === 0) {
    container.innerHTML = `
      <h1 class="page-title" data-i18n="history_title">${t("history_title")}</h1>
      <div style="text-align:center; margin-bottom:var(--space-3);">
        <button class="btn btn-secondary btn-sm" onclick="toggleHistoryEmpty()">${toggleLabel}</button>
      </div>
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 data-i18n="history_empty">${t("history_empty")}</h3>
        <a href="catalog.html" class="btn btn-primary" data-i18n="history_browse">${t("history_browse")}</a>
      </div>
    `;
    return;
  }

  const rows = sorted
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
          <td>${formatDate(order.date)}</td>
          <td>${order.items.length}</td>
          <td><span class="badge ${s.class}" data-i18n="${s.key}">${t(s.key)}</span></td>
          <td style="font-weight:700; color:var(--primary-600);">${formatPrice(total)}</td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="history_title">${t("history_title")}</h1>
    <div style="text-align:center; margin-bottom:var(--space-3);">
      <button class="btn btn-secondary btn-sm" onclick="toggleHistoryEmpty()">${toggleLabel}</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th data-i18n="cart_order_number">${t("cart_order_number")}</th>
            <th data-i18n="orders_date">${t("orders_date")}</th>
            <th data-i18n="order_items">${t("order_items")}</th>
            <th data-i18n="account_subscription">${t("account_subscription")}</th>
            <th data-i18n="order_total">${t("order_total")}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function toggleHistoryEmpty() {
  window.historyShowEmpty = !window.historyShowEmpty;
  renderHistoryPage();
  applyLang();
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("order-history");
  renderHistoryPage();
});
