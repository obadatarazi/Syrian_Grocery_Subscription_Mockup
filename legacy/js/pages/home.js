// Haseri — Home page
window.renderPage = function () {
  updateFeeCopy();
};

function updateFeeCopy() {
  const fee = typeof SUBSCRIPTION_FEE !== "undefined" ? SUBSCRIPTION_FEE : 500;
  const feeLabel = formatPrice(fee);
  const subtitle = document.querySelector("[data-i18n='home_hero_subtitle']");
  if (subtitle) {
    subtitle.textContent = `اشترك بـ ${feeLabel} شهرياً واحصل على أسعار المصنع`;
  }
  document.querySelectorAll("[data-i18n='home_step1_desc']").forEach((el) => {
    el.textContent = `ادفع ${feeLabel} شهرياً للاشتراك`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("home");
  updateFeeCopy();
});
