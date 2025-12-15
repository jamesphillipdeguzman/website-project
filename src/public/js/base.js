import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
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
// Dashboard Visit Count
// =========================
function updateVisitCount() {
  const visitEl = document.querySelector(
    ".dashboard-content .card:first-child p",
  );
  if (!visitEl) return;

  fetch("/.netlify/functions/visit-count")
    .then((res) => res.json())
    .then((data) => {
      visitEl.textContent = data.count;
    })
    .catch(() => {
      visitEl.textContent = "N/A";
    });
}

function fetchVisitCount(visitEl) {
  fetch("/.netlify/functions/visit-count")
    .then((res) => res.json())
    .then((data) => {
      visitEl.textContent = data.count;
      localStorage.setItem("visitCount", data.count);
    })
    .catch(() => {
      // fallback to localStorage
      visitEl.textContent = localStorage.getItem("visitCount") || "N/A";
    });
}

// =========================
// Site Visit Counter (Global)
// =========================
async function updateSiteVisitCount() {
  // Try to get from localStorage first
  const cachedCount = localStorage.getItem("siteVisitCount");
  const visitEl = document.querySelector(".site-visit-count");

  if (visitEl && cachedCount) {
    visitEl.textContent = cachedCount;
  }

  try {
    // Always call serverless function to increment
    const res = await fetch("/.netlify/functions/visit-count");
    if (!res.ok) throw new Error("Failed to fetch visit count");

    const data = await res.json();
    if (visitEl) visitEl.textContent = data.count;

    // Save in localStorage
    localStorage.setItem("siteVisitCount", data.count);
  } catch (err) {
    console.error("Error fetching visit count:", err);
    if (visitEl && !cachedCount) visitEl.textContent = "N/A";
  }
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
  // await updateHeaderAndFooter();
  setupHamburgerMenu();
  updateUserUI();
  setupLogout();
  initDate();
  populateProductDropdown?.();
  setupButtons?.();
  updateVisitCount();
  updateSiteVisitCount();
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", initAfterPageLoad);
