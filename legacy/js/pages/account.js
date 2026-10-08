// Haseri — Account page
window.renderPage = function () {
  renderAccountPage();
};

function renderAccountPage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  const user = window.currentUser;
  const city = getCityById(user.city);

  const statusMap = {
    active: { key: "account_status_active", class: "badge-success" },
    expired: { key: "account_status_expired", class: "badge-error" },
    cancelled: { key: "account_status_cancelled", class: "badge-warning" },
    pending: { key: "account_status_cancelled", class: "badge-neutral" },
  };
  const s = statusMap[user.subscriptionStatus] || statusMap.active;

  let cancelSection = "";
  if (user.subscriptionStatus === "active") {
    cancelSection = `
      <div style="margin-top:var(--space-3); padding-top:var(--space-3); border-top:1px solid var(--neutral-200);">
        <button class="btn btn-danger" onclick="handleCancelSub()" data-i18n="account_cancel_sub">${t("account_cancel_sub")}</button>
      </div>
    `;
  } else if (user.subscriptionStatus === "expired") {
    cancelSection = `
      <div style="margin-top:var(--space-3); padding-top:var(--space-3); border-top:1px solid var(--neutral-200);">
        <a href="subscribe.html" class="btn btn-primary" data-i18n="account_renew">${t("account_renew")}</a>
      </div>
    `;
  }

  let cancelledMsg = "";
  if (user.subscriptionStatus === "cancelled") {
    cancelledMsg = `
      <div class="card" style="background: var(--warning-bg); border-color: var(--warning-border); margin-top:var(--space-2);">
        <p style="color:var(--warning); font-weight:500; margin:0;" data-i18n="account_cancelled_msg">${t("account_cancelled_msg")}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <h1 class="page-title" data-i18n="account_title">${t("account_title")}</h1>
    <div class="card account-card">
      <div class="info-row">
        <span class="info-label" data-i18n="account_name">${t("account_name")}</span>
        <span class="info-value">${user.nameAr || ""}</span>
      </div>
      <div class="info-row">
        <span class="info-label" data-i18n="account_phone">${t("account_phone")}</span>
        <span class="info-value">${user.phone}</span>
      </div>
      <div class="info-row">
        <span class="info-label" data-i18n="account_city">${t("account_city")}</span>
        <span class="info-value">${city ? getCityName(city) : "—"}</span>
      </div>
      <div class="info-row">
        <span class="info-label" data-i18n="account_subscription">${t("account_subscription")}</span>
        <span class="badge ${s.class}" data-i18n="${s.key}">${t(s.key)}</span>
      </div>
      ${user.subscriptionEndDate ? `
        <div class="info-row">
          <span class="info-label" data-i18n="subscribe_plan">${t("subscribe_plan")}</span>
          <span class="info-value">${formatDate(user.subscriptionEndDate)}</span>
        </div>
      ` : ""}
      ${cancelledMsg}
      ${cancelSection}
    </div>

    <div class="card" style="max-width:480px; margin: var(--space-3) auto 0;">
      <h3 style="margin-bottom:var(--space-2);" data-i18n="account_demo_states">${t("account_demo_states")}</h3>
      <div style="display:flex; gap:var(--space-1); flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm ${user.subscriptionStatus === "active" ? "" : ""}" onclick="setDemoSubscription('active')" data-i18n="account_demo_active">${t("account_demo_active")}</button>
        <button class="btn btn-secondary btn-sm" onclick="setDemoSubscription('expired')" data-i18n="account_demo_expired">${t("account_demo_expired")}</button>
        <button class="btn btn-secondary btn-sm" onclick="setDemoSubscription('cancelled')" data-i18n="account_demo_cancelled">${t("account_demo_cancelled")}</button>
      </div>
    </div>
  `;
}

function handleCancelSub() {
  if (confirm(t("account_cancel_confirm"))) {
    window.currentUser.subscriptionStatus = "cancelled";
    // End of a mock current period (~end of month from today)
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    window.currentUser.subscriptionEndDate = end.toISOString().split("T")[0];
    showToast(t("account_cancelled_msg"), "warning");
    renderAccountPage();
    applyLang();
  }
}

function setDemoSubscription(status) {
  const sample = SAMPLE_CUSTOMERS.find((c) => c.subscriptionStatus === status);
  if (sample) {
    window.currentUser = {
      id: sample.id,
      nameAr: sample.nameAr,
      nameEn: sample.nameEn,
      phone: sample.phone,
      city: sample.city,
      subscriptionStatus: sample.subscriptionStatus,
      subscriptionEndDate: sample.subscriptionEndDate,
    };
  } else {
    window.currentUser.subscriptionStatus = status;
  }
  renderAccountPage();
  applyLang();
  if (status === "expired") {
    showToast(t("catalog_renew_prompt"), "warning");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("account");
  renderAccountPage();
});
