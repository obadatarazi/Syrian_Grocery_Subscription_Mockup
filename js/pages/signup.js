// Haseri — Sign Up page
window.renderPage = function () {
  renderSignUpForm();
};

function renderSignUpForm() {
  const container = document.getElementById("page-content");
  if (!container) return;

  const cityOptions = CITIES.map(
    (c) => `<option value="${c.id}">${getCityName(c)}${c.available ? "" : " — " + (getLang() === "ar" ? "غير متاح" : "Not available")}</option>`
  ).join("");

  container.innerHTML = `
    <h1 class="page-title" data-i18n="signup_title">${t("signup_title")}</h1>
    <div class="card" style="max-width: 460px; margin: 0 auto;">
      <form id="signup-form" onsubmit="return handleSignup(event)">
        <div class="form-group">
          <label class="form-label" data-i18n="signup_name">${t("signup_name")}</label>
          <input type="text" class="form-input" id="signup-name" data-i18n-placeholder="signup_name_placeholder" placeholder="${t("signup_name_placeholder")}" />
          <span class="form-error" id="error-name" data-i18n="signup_name_required">${t("signup_name_required")}</span>
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="signup_phone">${t("signup_phone")}</label>
          <input type="tel" class="form-input" id="signup-phone" data-i18n-placeholder="signup_phone_placeholder" placeholder="${t("signup_phone_placeholder")}" />
          <span class="form-error" id="error-phone" data-i18n="signup_phone_required">${t("signup_phone_required")}</span>
          <span class="form-error" id="error-phone-duplicate" data-i18n="signup_phone_duplicate">${t("signup_phone_duplicate")}</span>
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="signup_city">${t("signup_city")}</label>
          <select class="form-select" id="signup-city">
            <option value="" data-i18n="signup_select_city">${t("signup_select_city")}</option>
            ${cityOptions}
          </select>
          <span class="form-error" id="error-city" data-i18n="signup_city_required">${t("signup_city_required")}</span>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="signup_submit">${t("signup_submit")}</button>
      </form>
    </div>
  `;
}

function handleSignup(event) {
  event.preventDefault();

  // Clear errors
  ["error-name", "error-phone", "error-phone-duplicate", "error-city"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("show");
  });

  const name = document.getElementById("signup-name").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const city = document.getElementById("signup-city").value;

  let hasError = false;

  if (!name) {
    document.getElementById("error-name").classList.add("show");
    hasError = true;
  }
  if (!phone) {
    document.getElementById("error-phone").classList.add("show");
    hasError = true;
  }
  if (!city) {
    document.getElementById("error-city").classList.add("show");
    hasError = true;
  }

  if (hasError) return false;

  // Demo: phone "0000" triggers duplicate
  if (phone === "0000") {
    document.getElementById("error-phone-duplicate").classList.add("show");
    return false;
  }

  // Set current user and redirect to subscribe
  window.currentUser = { id: "c-new", nameAr: name, nameEn: name, phone, city, subscriptionStatus: "pending" };
  window.location.href = "subscribe.html";
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  initPage("signup");
  renderSignUpForm();
});
