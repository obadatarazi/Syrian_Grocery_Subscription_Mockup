// Haseri — Product & Tier Management page
let showAddForm = false;
let editingProductId = null;

window.renderPage = function () {
  renderProductsPage();
};

function renderProductsPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  // Product table
  const productRows = PRODUCTS.map((p) => {
    const category = getCategoryById(p.categoryId);
    const supplier = getSupplierById(p.supplierId);
    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:var(--space-1);">
            <span style="font-size:1.3rem;">${category ? category.icon : "📦"}</span>
            <span style="font-weight:600;">${getProductName(p)}</span>
            ${p.hidden ? `<span class="badge badge-neutral" data-i18n="products_hidden">${t("products_hidden")}</span>` : ""}
          </div>
        </td>
        <td>${category ? getCategoryName(category) : "—"}</td>
        <td>${supplier ? getSupplierName(supplier) : "—"}</td>
        <td>
          <span class="badge ${supplier && supplier.tier === "exclusive" ? "badge-accent" : "badge-neutral"}">
            ${supplier && supplier.tier === "exclusive" ? t("products_tier_exclusive") : t("products_tier_standard")}
          </span>
        </td>
        <td style="font-weight:600; color:var(--primary-600);">${formatPrice(p.factoryPrice)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="startEdit('${p.id}')" data-i18n="products_edit">${t("products_edit")}</button>
          ${p.hidden
            ? `<button class="btn btn-ghost btn-sm" onclick="toggleHide('${p.id}')" data-i18n="products_show">${t("products_show")}</button>`
            : `<button class="btn btn-ghost btn-sm" onclick="toggleHide('${p.id}')" data-i18n="products_hide">${t("products_hide")}</button>`
          }
        </td>
      </tr>
    `;
  }).join("");

  // Add/Edit form
  const formHtml = (showAddForm || editingProductId) ? renderProductForm() : "";

  // Supplier tier section
  const supplierRows = SUPPLIERS.map((s) => {
    const category = getCategoryById(s.category);
    return `
      <tr>
        <td style="font-weight:600;">${getSupplierName(s)}</td>
        <td>${category ? getCategoryName(category) : "—"}</td>
        <td>
          <select class="form-select" style="width:auto; padding:4px 8px; font-size:0.85rem;" onchange="changeTier('${s.id}', this.value)">
            <option value="standard" ${s.tier === "standard" ? "selected" : ""} data-i18n="products_tier_standard">${t("products_tier_standard")}</option>
            <option value="exclusive" ${s.tier === "exclusive" ? "selected" : ""} data-i18n="products_tier_exclusive">${t("products_tier_exclusive")}</option>
          </select>
        </td>
      </tr>
    `;
  }).join("");

  // Catalog preview
  const previewHtml = renderCatalogPreview();

  container.innerHTML = `
    <h1 class="page-title" data-i18n="products_title">${t("products_title")}</h1>

    ${formHtml}

    <div style="margin-bottom:var(--space-3); text-align:end;">
      <button class="btn btn-primary btn-sm" onclick="toggleAddForm()" data-i18n="products_add">${t("products_add")}</button>
    </div>

    <div class="table-wrap" style="margin-bottom:var(--space-4);">
      <table>
        <thead>
          <tr>
            <th data-i18n="products_name">${t("products_name")}</th>
            <th data-i18n="products_category">${t("products_category")}</th>
            <th data-i18n="products_supplier">${t("products_supplier")}</th>
            <th data-i18n="products_tier">${t("products_tier")}</th>
            <th data-i18n="products_price">${t("products_price")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>
    </div>

    <h2 style="margin-bottom:var(--space-2);" data-i18n="products_tier">${t("products_tier")}</h2>
    <div class="table-wrap" style="margin-bottom:var(--space-4);">
      <table>
        <thead>
          <tr>
            <th data-i18n="products_supplier">${t("products_supplier")}</th>
            <th data-i18n="products_category">${t("products_category")}</th>
            <th data-i18n="products_tier">${t("products_tier")}</th>
          </tr>
        </thead>
        <tbody>${supplierRows}</tbody>
      </table>
    </div>

    <h2 style="margin-bottom:var(--space-2);" data-i18n="products_preview">${t("products_preview")}</h2>
    ${previewHtml}
  `;
}

function renderProductForm() {
  const editing = editingProductId ? getProductById(editingProductId) : null;
  const categoryOptions = CATEGORIES.filter((c) => c.id !== "frozen").map(
    (c) => `<option value="${c.id}" ${editing && editing.categoryId === c.id ? "selected" : ""}>${getCategoryName(c)}</option>`
  ).join("");
  const supplierOptions = SUPPLIERS.map(
    (s) => `<option value="${s.id}" ${editing && editing.supplierId === s.id ? "selected" : ""}>${getSupplierName(s)}</option>`
  ).join("");

  return `
    <div class="card" style="max-width:500px; margin: 0 auto var(--space-3);">
      <h3 style="margin-bottom:var(--space-2);">${editing ? t("products_edit") : t("products_add")}</h3>
      <div class="form-group">
        <label class="form-label" data-i18n="products_name">${t("products_name")}</label>
        <input type="text" class="form-input" id="form-name" value="${editing ? getProductName(editing) : ""}" />
      </div>
      <div class="form-group">
        <label class="form-label" data-i18n="products_category">${t("products_category")}</label>
        <select class="form-select" id="form-category">${categoryOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label" data-i18n="products_supplier">${t("products_supplier")}</label>
        <select class="form-select" id="form-supplier">${supplierOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label" data-i18n="products_price">${t("products_price")}</label>
        <input type="number" class="form-input" id="form-price" value="${editing ? editing.factoryPrice : ""}" step="0.5" min="0" />
      </div>
      <div style="display:flex; gap:var(--space-2);">
        <button class="btn btn-secondary" onclick="cancelForm()" data-i18n="products_cancel">${t("products_cancel")}</button>
        <button class="btn btn-primary" onclick="saveProduct()" data-i18n="products_save">${t("products_save")}</button>
      </div>
    </div>
  `;
}

function renderCatalogPreview() {
  // Show catalog preview reflecting tier choices
  // For exclusive suppliers, hide other brands in same category
  const exclusiveCategories = SUPPLIERS.filter((s) => s.tier === "exclusive").map((s) => s.category);
  const visibleProducts = PRODUCTS.filter((p) => {
    if (p.hidden) return false;
    if (exclusiveCategories.includes(p.categoryId)) {
      // Only show products from the exclusive supplier
      const supplier = getSupplierById(p.supplierId);
      return supplier && supplier.tier === "exclusive";
    }
    return true;
  });

  if (visibleProducts.length === 0) {
    return `<div class="empty-state"><div class="empty-icon">📦</div><h3 data-i18n="catalog_no_products">${t("catalog_no_products")}</h3></div>`;
  }

  const cards = visibleProducts.map((p) => {
    const category = getCategoryById(p.categoryId);
    const supplier = getSupplierById(p.supplierId);
    const isExclusive = supplier && supplier.tier === "exclusive";
    return `
      <div class="product-card">
        ${isExclusive ? `<span class="exclusive-tag" data-i18n="products_tier_exclusive">${t("products_tier_exclusive")}</span>` : ""}
        <div class="product-icon">${category ? category.icon : "📦"}</div>
        <div class="product-name">${getProductName(p)}</div>
        <div class="product-size">${p.sizeAr}</div>
        <div class="factory-price">${formatPrice(p.factoryPrice)}</div>
      </div>
    `;
  }).join("");

  return `<div class="product-grid">${cards}</div>`;
}

function toggleAddForm() {
  showAddForm = !showAddForm;
  editingProductId = null;
  renderProductsPage();
  applyLang(getLang());
}

function startEdit(productId) {
  editingProductId = productId;
  showAddForm = false;
  renderProductsPage();
  applyLang(getLang());
}

function cancelForm() {
  showAddForm = false;
  editingProductId = null;
  renderProductsPage();
  applyLang(getLang());
}

function saveProduct() {
  const name = document.getElementById("form-name").value.trim();
  const categoryId = document.getElementById("form-category").value;
  const supplierId = document.getElementById("form-supplier").value;
  const price = parseFloat(document.getElementById("form-price").value);

  if (!name || isNaN(price)) {
    showToast(t("signup_name_required"), "warning");
    return;
  }

  if (editingProductId) {
    const p = getProductById(editingProductId);
    if (p) {
      const lang = getLang();
      if (lang === "ar") { p.nameAr = name; } else { p.nameEn = name; }
      p.categoryId = categoryId;
      p.supplierId = supplierId;
      p.factoryPrice = price;
    }
  } else {
    const newId = "p" + (PRODUCTS.length + 1);
    PRODUCTS.push({
      id: newId, categoryId, supplierId,
      nameAr: name, nameEn: name,
      sizeAr: "1 كغ", sizeEn: "1kg",
      factoryPrice: price, retailPrice: null, hidden: false,
    });
  }

  showAddForm = false;
  editingProductId = null;
  showToast(t("products_save") + " ✓", "success");
  renderProductsPage();
  applyLang(getLang());
}

function toggleHide(productId) {
  const p = getProductById(productId);
  if (p) {
    p.hidden = !p.hidden;
    renderProductsPage();
    applyLang(getLang());
  }
}

function changeTier(supplierId, newTier) {
  const s = getSupplierById(supplierId);
  if (s) {
    s.tier = newTier;
    renderProductsPage();
    applyLang(getLang());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("products");
  renderProductsPage();
});
