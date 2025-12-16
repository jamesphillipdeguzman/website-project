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

// =========================
// Get Portfolios
// =========================

async function fetchPortfolios() {
  try {
    const res = await fetch("/.netlify/functions/get-portfolios");
    if (!res.ok) throw new Error("Failed to fetch portfolios");

    const portfolios = await res.json();
    setupPortfolioCarousel(portfolios);
    populatePortfolioDropdown(portfolios); // ← correct function name
  } catch (err) {
    console.error(err);
  }
}

// existing carousel setup...
function setupPortfolioCarousel(portfolios) {
  const container = document.getElementById("portfolio-carousel");
  const dropdown = document.getElementById("my-portfolios");
  if (!container || !dropdown) return;

  container.innerHTML = "";
  dropdown.innerHTML = '<option value="">Select a portfolio</option>';

  portfolios.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.title;
    opt.textContent = p.title;
    dropdown.appendChild(opt);

    const card = document.createElement("div");
    card.className = "card";
    card.style = "min-width: 300px; max-width: 300px; flex-shrink: 0;";
    card.setAttribute("data-title", p.title);
    card.innerHTML = `
      <a href="${p.project_link}" target="_blank">
        <img src="${p.image_url}" alt="${p.title}" style="width: 100%; border-radius: 5px;" loading="lazy">
      </a>
      <div class="databox" style="padding: 10px;">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    `;
    container.appendChild(card);
  });

  dropdown.addEventListener("change", () => {
    const selected = container.querySelector(
      `[data-title="${dropdown.value}"]`,
    );
    if (selected)
      selected.scrollIntoView({ behavior: "smooth", inline: "center" });
  });

  setupCarouselButtons();
}

function setupCarouselButtons() {
  const container = document.getElementById("portfolio-carousel");
  const btnPrev = document.querySelector(".carousel-btn.prev");
  const btnNext = document.querySelector(".carousel-btn.next");

  if (!container || !btnPrev || !btnNext) return;

  btnPrev.addEventListener("click", () => {
    container.scrollBy({ left: -300, behavior: "smooth" });
  });
  btnNext.addEventListener("click", () => {
    container.scrollBy({ left: 300, behavior: "smooth" });
  });
}

// NEW: populate any <select id="dynamic-product">
function populatePortfolioDropdown(portfolios) {
  const dropdown = document.getElementById("dynamic-product");
  if (!dropdown) return;

  // Only insert display container if it doesn't exist yet
  let displayContainer = document.getElementById("portfolio-display");
  if (!displayContainer) {
    displayContainer = document.createElement("div");
    displayContainer.id = "portfolio-display";
    displayContainer.style =
      "margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;";
    dropdown.parentNode.insertBefore(displayContainer, dropdown);
  }

  dropdown.innerHTML =
    '<option value="" disabled selected>Select a portfolio...</option>';

  portfolios.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.title;
    option.textContent = p.title;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selected = portfolios.find((p) => p.title === dropdown.value);
    if (selected) showPortfolio(selected, displayContainer);
  });
}

function showPortfolio(portfolio, container) {
  container.innerHTML = `
    <h3>${portfolio.title}</h3>
    <a href="${portfolio.project_link}" target="_blank">
      <img src="${portfolio.image_url}" alt="${portfolio.title}"
        style="
          width: 100%;
          max-width: 100vw;
          height: auto;
          object-fit: cover;
          border-radius: 5px;
          display: block;
          margin: 10px auto;
        " />
    </a>
    <p>${portfolio.description}</p>
  `;
}

// =========================
// Modal Handling
// =========================
function setupModals() {
  const modalMap = [
    {
      buttonId: "get-quote-btn",
      modalId: "quote-modal",
      backdropId: "quote-backdrop",
    },
    {
      buttonId: "login-btn", // if you have a dedicated login button
      modalId: "login-modal",
      backdropId: "login-backdrop",
    },
    {
      buttonId: "signup-btn",
      modalId: "signup-modal",
      backdropId: "signup-backdrop",
    },
  ];

  modalMap.forEach(({ buttonId, modalId, backdropId }) => {
    const btn = document.getElementById(buttonId);
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);
    const closeBtn = modal?.querySelector(".close");

    if (!btn || !modal || !backdrop) return;

    // Show modal
    btn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.style.display = "block";
      backdrop.style.display = "block";
    });

    // Close modal via close button
    closeBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.style.display = "none";
      backdrop.style.display = "none";
    });

    // Close modal via backdrop click
    backdrop.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.style.display = "none";
      backdrop.style.display = "none";
    });
  });
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
      console.log(
        "🔹 Visit count fetched from serverless function:",
        data.count,
      );
      visitEl.textContent = data.count;
      localStorage.setItem("visitCount", data.count);
    })
    .catch((err) => {
      console.error("Failed to fetch visit count:", err);
      // fallback to localStorage
      visitEl.textContent = localStorage.getItem("visitCount") || "N/A";
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
  fetchPortfolios();
  setupModals();
  updateVisitCount();
}

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", initAfterPageLoad);
