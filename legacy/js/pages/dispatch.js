// Haseri — Dispatch page
window.renderPage = function () {
  renderDispatchPage();
};

function renderDispatchPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  if (SAMPLE_ORDERS.length === 0) {
    container.innerHTML = `
      <h1 class="page-title" data-i18n="dispatch_title">${t("dispatch_title")}</h1>
      <div class="empty-state">
        <div class="empty-icon">🚚</div>
        <h3 data-i18n="dispatch_no_orders">${t("dispatch_no_orders")}</h3>
      </div>
    `;
    return;
  }

  const ordersHtml = SAMPLE_ORDERS.map((order) => {
    const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const itemsHtml = order.items
      .map((item) => {
        const p = getProductById(item.productId);
        return `<span style="display:inline-block; margin-inline-end:var(--space-1);">${p ? getProductName(p) : item.productId} ×${item.qty}</span>`;
      })
      .join("");

    const estimatedEnd = new Date(order.estimatedDelivery + "T23:59:59");
    const isLate =
      order.status === "delivered" &&
      order.deliveredAt &&
      new Date(order.deliveredAt) > estimatedEnd;
    const isLateDispatch = order.status === "dispatched" && new Date() > estimatedEnd;

    let statusBadge = "";
    const statusMap = {
      confirmed: { key: "orders_status_confirmed", class: "badge-info" },
      dispatched: { key: "orders_status_dispatched", class: "badge-warning" },
      delivered: { key: "orders_status_delivered", class: "badge-success" },
    };
    const s = statusMap[order.status] || statusMap.confirmed;
    statusBadge = `<span class="badge ${s.class}" data-i18n="${s.key}">${t(s.key)}</span>`;

    let lateFlag = "";
    if (isLate || isLateDispatch) {
      lateFlag = ` <span class="badge badge-error" data-i18n="dispatch_late">${t("dispatch_late")}</span>`;
    }

    let actionButton = "";
    if (order.status === "confirmed") {
      actionButton = `<button class="btn btn-primary btn-sm" onclick="markDispatched('${order.id}')" data-i18n="dispatch_mark_dispatched">${t("dispatch_mark_dispatched")}</button>`;
    } else if (order.status === "dispatched") {
      actionButton = `<button class="btn btn-success btn-sm" onclick="markDelivered('${order.id}')" data-i18n="dispatch_mark_delivered">${t("dispatch_mark_delivered")}</button>`;
    }

    let dispatchInfo = "";
    if (order.dispatchedAt) {
      dispatchInfo = `<div style="font-size:0.8rem; color:var(--neutral-500); margin-top:4px;"><span data-i18n="dispatch_dispatched_at">${t("dispatch_dispatched_at")}</span>: ${formatDateShort(order.dispatchedAt)}</div>`;
    }
    if (order.deliveredAt) {
      dispatchInfo += `<div style="font-size:0.8rem; color:var(--neutral-500); margin-top:4px;"><span data-i18n="dispatch_delivered_at">${t("dispatch_delivered_at")}</span>: ${formatDateShort(order.deliveredAt)}</div>`;
    }

    return `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">${order.id}</span>
          <div>${statusBadge}${lateFlag}</div>
        </div>
        <div style="font-size:0.9rem; color:var(--neutral-600); margin-bottom:var(--space-1);">${itemsHtml}</div>
        <div style="font-size:0.875rem; color:var(--neutral-500);">
          <span data-i18n="orders_estimated_delivery">${t("orders_estimated_delivery")}</span>: ${formatDate(order.estimatedDelivery)}
        </div>
        ${dispatchInfo}
        ${actionButton ? `<div style="margin-top:var(--space-2);">${actionButton}</div>` : ""}
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="dispatch_title">${t("dispatch_title")}</h1>
    ${ordersHtml}
  `;
}

function markDispatched(orderId) {
  const order = SAMPLE_ORDERS.find((o) => o.id === orderId);
  if (order) {
    order.status = "dispatched";
    order.dispatchedAt = new Date().toISOString();
    showToast(t("dispatch_notification") + orderId, "info");
    renderDispatchPage();
    applyLang();
  }
}

function markDelivered(orderId) {
  const order = SAMPLE_ORDERS.find((o) => o.id === orderId);
  if (order) {
    order.status = "delivered";
    order.deliveredAt = new Date().toISOString();
    showToast(t("dispatch_notification") + orderId, "success");
    renderDispatchPage();
    applyLang();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("dispatch");
  renderDispatchPage();
});
