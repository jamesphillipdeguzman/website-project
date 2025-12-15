import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
  updateHeaderAndFooter,
} from "./utils.mjs";
// import { initPortfolio } from "./portfolio.js";

// =========================
// User / Session Management
// =========================
function updateUserUI() {
  const userNameEl = document.getElementById("user-name");
  const userEmailEl = document.getElementById("user-email");
  const userTypeEl = document.getElementById("user-type");
  const loginLink = document.getElementById("login-link");

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "Not available";
  const userType = localStorage.getItem("userType") || "Client";

  if (userNameEl) userNameEl.textContent = userName;
  if (userEmailEl) userEmailEl.textContent = userEmail;
  if (userTypeEl) userTypeEl.textContent = userType;

  if (loginLink) {
    if (!userId) {
      loginLink.textContent = "Login";
      loginLink.href = "/pages/login.html";
    } else if (userType === "Admin") {
      loginLink.textContent = "Dashboard";
      loginLink.href = "/pages/dashboard.html";
    } else {
      loginLink.textContent = "Profile";
      loginLink.href = "/pages/profile.html";
    }
  }

  setActiveNavLink();
}

// =========================
// Logout
// =========================
function setupLogout() {
  const logoutButtons = document.querySelectorAll(
    "#logout-btn, #logout-btn-main",
  );
  if (!logoutButtons) return;

  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ["userId", "userName", "userEmail", "userType"].forEach((key) =>
        localStorage.removeItem(key),
      );
      window.location.href = "/pages/login.html";
    });
  });
}

// =========================
// SPA Loader
// =========================
async function loadPage(url) {
  const main = document.querySelector("main");
  if (!main) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load page");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newContent = doc.querySelector("main").innerHTML;
    main.innerHTML = newContent;

    await initAfterPageLoad(); // re-initialize dynamic UI
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener("popstate", () => loadPage(location.href));

// =========================
// Visit Count (SPA-safe)
// =========================
function updateVisitCount() {
  const visitEl = document.querySelector(
    ".dashboard-content .card:first-child p",
  );
  if (!visitEl) {
    setTimeout(updateVisitCount, 100); // retry for SPA-loaded content
    return;
  }

  fetch("/.netlify/functions/visit-count")
    .then((res) => res.json())
    .then((data) => {
      visitEl.textContent = data.count;
      localStorage.setItem("visitCount", data.count);
    })
    .catch(() => {
      visitEl.textContent = localStorage.getItem("visitCount") || "N/A";
    });
}

// =========================
// Footer / Date
// =========================
function initDate() {
  const modifiedElement = document.getElementById("lastModified");
  const yearElement = document.querySelector("#currentyear");

  if (modifiedElement) modifiedElement.textContent = getFormattedLastModified();
  if (yearElement)
    yearElement.innerHTML = `<span class="highlight">${new Date().getFullYear()}</span>`;
}

// =========================
// Main Initialization
// =========================
async function initAfterPageLoad() {
  await updateHeaderAndFooter();
  setupHamburgerMenu();
  updateUserUI();
  setupLogout();
  initDate();
  populateProductDropdown?.();
  setupButtons?.();

  // Initialize portfolios **after main content is in the DOM**
  // if (document.querySelector("#portfolio-carousel")) {
  //   await initPortfolio();
  // }

  updateVisitCount();
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", initAfterPageLoad);
