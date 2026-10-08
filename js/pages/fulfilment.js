// Haseri — Fulfilment page
let selectedDeliveryDate = "";

window.renderPage = function () {
  renderFulfilmentPage();
};

function renderFulfilmentPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  // Default to first order's estimated delivery
  if (!selectedDeliveryDate && SAMPLE_ORDERS.length > 0) {
    selectedDeliveryDate = SAMPLE_ORDERS[0].estimatedDelivery;
  }

  // Paid Damascus orders for selected date, grouped by product
  const damascusOrders = SAMPLE_ORDERS.filter(
    (o) => o.city === "damascus" && o.paid && o.estimatedDelivery === selectedDeliveryDate
  );

  const productMap = {};
  damascusOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = { productId: item.productId, totalQty: 0, orders: [] };
      }
      productMap[item.productId].totalQty += item.qty;
      productMap[item.productId].orders.push(order.id);
    });
  });

  const productRows = Object.values(productMap)
    .map((entry) => {
      const p = getProductById(entry.productId);
      const category = p ? getCategoryById(p.categoryId) : null;
      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:var(--space-1);">
              <span style="font-size:1.3rem;">${category ? category.icon : "📦"}</span>
              <span style="font-weight:600;">${p ? getProductName(p) : entry.productId}</span>
            </div>
          </td>
          <td style="font-weight:700; color:var(--primary-600);">${entry.totalQty}</td>
          <td style="color:var(--neutral-500); font-size:0.85rem;">${entry.orders.join(", ")}</td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="fulfilment_title">${t("fulfilment_title")}</h1>

    <div class="card" style="max-width:400px; margin: 0 auto var(--space-4);">
      <div class="form-group" style="margin:0;">
        <label class="form-label" data-i18n="fulfilment_select_date">${t("fulfilment_select_date")}</label>
        <input type="date" class="form-input" id="delivery-date" value="${selectedDeliveryDate}" onchange="handleDateChange()" />
      </div>
    </div>

    <h2 style="margin-bottom:var(--space-2);" data-i18n="fulfilment_grouped">${t("fulfilment_grouped")}</h2>
    ${productRows ? `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th data-i18n="fulfilment_product">${t("fulfilment_product")}</th>
              <th data-i18n="fulfilment_total_qty">${t("fulfilment_total_qty")}</th>
              <th data-i18n="cart_order_number">${t("cart_order_number")}</th>
            </tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 data-i18n="fulfilment_no_orders">${t("fulfilment_no_orders")}</h3>
      </div>
    `}
  `;
}

function handleDateChange() {
  selectedDeliveryDate = document.getElementById("delivery-date").value;
  renderFulfilmentPage();
  applyLang();
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("fulfilment");
  renderFulfilmentPage();
});
