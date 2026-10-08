// Haseri — Subscribe page
window.renderPage = function () {
  renderSubscribePage();
};

function renderSubscribePage() {
  const container = document.getElementById("page-content");
  if (!container) return;

  container.innerHTML = `
    <h1 class="page-title" data-i18n="subscribe_title">${t("subscribe_title")}</h1>
    <div class="card subscribe-card">
      <div class="shamcash-logo">🛒</div>
      <div class="plan-price">$${SUBSCRIPTION_FEE}</div>
      <div class="plan-period" data-i18n="subscribe_fee">$5/month</div>
      <ul class="benefits-list">
        <li data-i18n="subscribe_benefit1">${t("subscribe_benefit1")}</li>
        <li data-i18n="subscribe_benefit2">${t("subscribe_benefit2")}</li>
        <li data-i18n="subscribe_benefit3">${t("subscribe_benefit3")}</li>
      </ul>
      <button class="btn btn-primary btn-block btn-lg" onclick="openShamCash()" data-i18n="subscribe_confirm">${t("subscribe_confirm")}</button>
    </div>
  `;
}

function openShamCash() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal">
      <h3 class="modal-title" data-i18n="shamcash_title">${t("shamcash_title")}</h3>
      <div class="modal-body">
        <div class="shamcash-logo">💳</div>
        <div class="shamcash-amount">
          <span data-i18n="shamcash_amount">${t("shamcash_amount")}</span>: $${SUBSCRIPTION_FEE}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeShamCash(false)" data-i18n="shamcash_cancel">${t("shamcash_cancel")}</button>
        <button class="btn btn-primary" onclick="closeShamCash(true)" data-i18n="shamcash_pay">${t("shamcash_pay")}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
}

function closeShamCash(success) {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 250);
  }

  if (success) {
    showToast(t("shamcash_success"), "success");
    window.currentUser.subscriptionStatus = "active";
    setTimeout(() => {
      window.location.href = "catalog.html";
    }, 1500);
  } else {
    showToast(t("shamcash_failed"), "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("subscribe");
  renderSubscribePage();
});
