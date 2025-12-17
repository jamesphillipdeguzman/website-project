import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
} from "./utils.mjs";

/* ======================================================
   GLOBAL STATE
====================================================== */
let portfolios = [];

/* ======================================================
   SESSION / USER UI
====================================================== */
function getUser() {
  return {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName") || "Guest",
    email: localStorage.getItem("userEmail") || "Not available",
    type: localStorage.getItem("userType") || "Client",
  };
}

function updateUserUI() {
  const { id, name, email, type } = getUser();

  const userNameEl = document.getElementById("user-name");
  const userEmailEl = document.getElementById("user-email");
  const userTypeEl = document.getElementById("user-type");

  if (userNameEl) userNameEl.textContent = name;
  if (userEmailEl) userEmailEl.textContent = email;
  if (userTypeEl) userTypeEl.textContent = type;

  updateLoginLinks(id, type);
  setActiveNavLink();
}

function updateLoginLinks(userId, userType) {
  const links = document.querySelectorAll("#login-link, .mobile-login-link");

  links.forEach((link) => {
    if (!userId) {
      link.textContent = "Login";
      link.href = "/pages/login.html";
    } else if (userType === "Admin") {
      link.textContent = "Dashboard";
      link.href = "/pages/dashboard.html";
    } else {
      link.textContent = "Profile";
      link.href = "/pages/profile.html";
    }
  });
}

/* ======================================================
   LOGOUT
====================================================== */
function setupLogout() {
  document.querySelectorAll("#logout-btn, #logout-btn-main").forEach((btn) =>
    btn.addEventListener("click", () => {
      ["userId", "userName", "userEmail", "userType"].forEach((k) =>
        localStorage.removeItem(k),
      );
      window.location.href = "/pages/login.html";
    }),
  );
}

/* ======================================================
   PORTFOLIOS (Single Source of Truth)
====================================================== */
async function loadPortfolios() {
  try {
    const res = await fetch("/.netlify/functions/get-portfolios");
    if (!res.ok) throw new Error("Portfolio fetch failed");

    portfolios = await res.json();

    console.log("Loaded portfolios:", portfolios); // <<-- check this
    renderPortfolioCarousel();
    renderPortfolioDropdown();
    renderPortfolioEditor();
  } catch (err) {
    console.error("❌ Portfolio load error:", err);
  }
}

/* ---------- Carousel ---------- */
function renderPortfolioCarousel() {
  const container = document.getElementById("portfolio-carousel");
  const select = document.getElementById("my-portfolios");
  if (!container || !select) return;

  // Make container horizontal
  container.style.display = "flex";
  container.style.gap = "16px";
  container.style.overflowX = "auto";
  container.style.scrollBehavior = "smooth";
  container.style.paddingBottom = "10px";

  container.innerHTML = "";
  select.innerHTML = `<option value="">Select a portfolio</option>`;

  portfolios.forEach((p) => {
    // Populate dropdown
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${p.title}">${p.title}</option>`,
    );

    // Add card
    const cardHTML = `
      <div class="card" data-title="${p.title}" style="
        flex: 0 0 300px; 
        min-width: 300px; 
        max-width: 300px; 
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        overflow: hidden;
      ">
        <a href="${p.project_link}" target="_blank">
          <img src="${p.image_url}" alt="${p.title}" loading="lazy" style="width:100%; display:block;">
        </a>
        <div class="databox" style="padding:10px;">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });

  // Scroll into view on dropdown change
  select.onchange = () => {
    container
      .querySelector(`[data-title="${select.value}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center" });
  };

  setupCarouselButtons();
}

function setupCarouselButtons() {
  const container = document.getElementById("portfolio-carousel");
  document
    .querySelector(".carousel-btn.prev")
    ?.addEventListener("click", () =>
      container.scrollBy({ left: -300, behavior: "smooth" }),
    );

  document
    .querySelector(".carousel-btn.next")
    ?.addEventListener("click", () =>
      container.scrollBy({ left: 300, behavior: "smooth" }),
    );
}

/* ---------- Dynamic Dropdown ---------- */
function renderPortfolioDropdown() {
  const dropdown = document.getElementById("dynamic-product");
  if (!dropdown) return;

  dropdown.innerHTML =
    `<option disabled selected>Select a portfolio...</option>` +
    portfolios
      .map((p) => `<option value="${p.id}">${p.title}</option>`)
      .join("");

  dropdown.onchange = () => {
    const selected = portfolios.find((p) => String(p.id) === dropdown.value);
    if (selected) loadPortfolioIntoForm(selected); // Use the same form loader
  };
}

function showPortfolio(p) {
  let box = document.getElementById("portfolio-display");
  if (!box) {
    box = document.createElement("div");
    box.id = "portfolio-display";
    document.getElementById("dynamic-product")?.before(box);
  }

  box.innerHTML = `
    <h3>${p.title}</h3>
    <a href="${p.project_link}" target="_blank">
      <img src="${p.image_url}" alt="${p.title}">
    </a>
    <p>${p.description}</p>
  `;
}

/* ---------- Admin Editor ---------- */
function loadPortfolioIntoForm(portfolio) {
  const form = document.getElementById("portfolio-form");
  if (!form) return;

  form.dataset.editingId = portfolio.id;

  form.querySelector('[name="name"]').value = portfolio.title || "";
  form.querySelector('[name="description"]').value =
    portfolio.description || "";
  form.querySelector('[name="category"]').value = portfolio.category || "";
  form.querySelector('[name="url"]').value = portfolio.project_link || "";
  form.querySelector('[name="github"]').value = portfolio.github_link || "";

  // ---- Show existing image ----
  const preview = document.getElementById("image-preview");
  if (portfolio.image_url) {
    preview.src = portfolio.image_url;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }

  // ---- Attach file input change listener ----
  const fileInput = form.querySelector('[name="image"]');
  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file); // show selected file
        preview.style.display = "block";
      }
    };
  }

  document.getElementById("status").textContent =
    `✏️ Editing: ${portfolio.title}`;
}

function resetPortfolioForm() {
  const form = document.getElementById("portfolio-form");
  if (!form) return;

  form.reset();
  delete form.dataset.editingId;

  // ---- Hide the preview image ----
  const preview = document.getElementById("image-preview");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  document.getElementById("status").textContent = "➕ Creating a new portfolio";
}

function renderPortfolioEditor() {
  const selector = document.getElementById("portfolio-selector");
  if (!selector) return;

  selector.innerHTML =
    `<option value="new">➕ Create New Portfolio</option>` +
    portfolios
      .map((p) => `<option value="${p.id}">✏️ ${p.title}</option>`)
      .join("");

  selector.onchange = () => {
    if (selector.value === "new") {
      resetPortfolioForm();
      return;
    }

    const selected = portfolios.find(
      (p) => String(p.id) === String(selector.value),
    );

    if (selected) {
      loadPortfolioIntoForm(selected);
    }
  };
}

/* ======================================================
   MODALS
====================================================== */
function setupModals() {
  [
    ["get-quote-btn", "quote-modal", "quote-backdrop"],
    ["login-btn", "login-modal", "login-backdrop"],
    ["signup-btn", "signup-modal", "signup-backdrop"],
  ].forEach(([btnId, modalId, backdropId]) => {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);
    const close = modal?.querySelector(".close");

    if (!btn || !modal || !backdrop) return;

    const hide = () => {
      modal.classList.add("hidden");
      modal.style.display = "none";
      backdrop.style.display = "none";
    };

    btn.onclick = () => {
      modal.classList.remove("hidden");
      modal.style.display = "block";
      backdrop.style.display = "block";
    };

    close?.addEventListener("click", hide);
    backdrop.addEventListener("click", hide);
  });
}

/* ======================================================
   VISIT TRACKING (30 min throttle)
====================================================== */
function trackVisit() {
  console.log("🔹 trackVisit() running");

  const KEY = "lastVisitIncrement";
  const LIMIT = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();
  const last = Number(localStorage.getItem(KEY));

  // Increment visit if more than LIMIT passed
  if (!last || now - last > LIMIT) {
    fetch("/.netlify/functions/increment-visit")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to increment visit");
      })
      .catch(console.error);

    localStorage.setItem(KEY, now);
  }

  // Always update the UI with latest count
  const updateUI = (count) => {
    const countEl = document.getElementById("visit-count");
    if (countEl) {
      countEl.textContent = count;
      localStorage.setItem("visit_count", count); // save in localStorage
    }
  };

  // Try to get from DB
  fetch("/.netlify/functions/get-visit-count")
    .then((res) => res.json())
    .then((data) => updateUI(data.count ?? 0))
    .catch((err) => {
      console.error("Visit count error:", err);
      const fallback = localStorage.getItem("visit_count") || 0;
      updateUI(fallback);
    });
}

/* ======================================================
   FOOTER
====================================================== */
function initDate() {
  document.getElementById("lastModified").textContent =
    getFormattedLastModified();
  document.getElementById("currentyear").innerHTML =
    `<span class="highlight">${new Date().getFullYear()}</span>`;
}

/* ======================================================
   INIT
====================================================== */
async function init() {
  console.log("🔹 init() running");
  setupHamburgerMenu();
  updateUserUI();
  setupLogout();
  initDate();
  setupModals();
  trackVisit();
  await loadPortfolios();
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("popstate", () => init());
