import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
} from "./utils.mjs";

/* ======================================================
   CONSTANTS
====================================================== */
const PLACEHOLDER_IMAGE = "/images/project-images/no-image-placeholder.webp";
let portfolios = [];

/* ======================================================
   AUTH
====================================================== */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function updateAuthLinks() {
  const user = getCurrentUser();
  const desktop = document.getElementById("login-link");
  const mobile = document.getElementById("mobile-login-link");

  const set = (el, text, href) => {
    if (!el) return;
    el.textContent = text;
    el.href = href;
  };

  if (!user) {
    set(desktop, "Login", "/pages/login.html");
    set(mobile, "Login", "/pages/login.html");
    return;
  }

  if (user.user_type === "Admin") {
    set(desktop, "Dashboard", "/pages/dashboard.html");
    set(mobile, "Dashboard", "/pages/dashboard.html");
    return;
  }

  set(desktop, "Profile", "/pages/profile.html");
  set(mobile, "Profile", "/pages/profile.html");
}

function setupLogout() {
  document.querySelectorAll("#logout-btn, #logout-btn-main").forEach((btn) => {
    btn.onclick = () => {
      localStorage.removeItem("user");
      window.location.href = "/pages/login.html";
    };
  });
}

function renderUserHeader() {
  const user = getCurrentUser();
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  const typeEl = document.getElementById("user-type");

  if (!nameEl && !emailEl && !typeEl) return;

  if (!user) {
    if (nameEl) nameEl.textContent = "Guest";
    if (emailEl) emailEl.textContent = "";
    if (typeEl) typeEl.textContent = "";
    return;
  }

  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (typeEl) typeEl.textContent = user.user_type;
}

/* ======================================================
   PORTFOLIOS
====================================================== */
async function loadPortfolios() {
  try {
    const res = await fetch("/.netlify/functions/get-portfolios");
    if (!res.ok) throw new Error("Portfolio fetch failed");

    portfolios = await res.json();

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

  container.style.display = "flex";
  container.style.gap = "16px";
  container.style.overflowX = "auto";
  container.style.scrollBehavior = "smooth";

  container.innerHTML = "";
  select.innerHTML = `<option value="">Select a portfolio</option>`;

  portfolios.forEach((p) => {
    select.insertAdjacentHTML(
      "beforeend",
      `<option value="${p.title}">${p.title}</option>`,
    );

    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card" data-title="${p.title}">
        <a href="${p.project_link}" target="_blank">
          <img src="${p.image_url || PLACEHOLDER_IMAGE}" alt="${p.title}" loading="lazy" class="portfolio-card-img">
        </a>
        <div class="databox">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
      </div>
    `,
    );
  });

  select.onchange = () =>
    container
      .querySelector(`[data-title="${select.value}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center" });

  setupCarouselButtons(container);
}

function setupCarouselButtons(container) {
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

/* ---------- Dropdown ---------- */
function renderPortfolioDropdown() {
  const dropdown = document.getElementById("dynamic-product");
  if (!dropdown) return;

  dropdown.innerHTML =
    `<option disabled selected>Select a portfolio...</option>` +
    portfolios
      .map((p) => `<option value="${p.id}">${p.title}</option>`)
      .join("");

  dropdown.onchange = () => {
    const p = portfolios.find((x) => String(x.id) === dropdown.value);
    if (p) loadPortfolioIntoForm(p);
  };
}

/* ---------- Admin Editor ---------- */
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

    const p = portfolios.find((x) => String(x.id) === selector.value);
    if (p) loadPortfolioIntoForm(p);
  };
}

/* ---------- Load / Reset Form ---------- */
function loadPortfolioIntoForm(p) {
  const form = document.getElementById("portfolio-form");
  const preview = document.getElementById("image-preview");
  const statusEl = document.getElementById("status");
  const statusEl2 = document.getElementById("status2");
  if (!form) return;

  if (!p) {
    // New portfolio
    form.reset();
    delete form.dataset.editingId;
    delete form.dataset.existingImage;

    if (preview) {
      preview.src = PLACEHOLDER_IMAGE;
      preview.style.display = "block";
    }

    if (statusEl) statusEl.textContent = "➕ Creating a new portfolio";
    if (statusEl2) statusEl2.textContent = "➕ Creating a new portfolio";
    return;
  }

  // Editing existing portfolio
  form.dataset.editingId = p.id || "new";
  form.dataset.existingImage = p.image_url || "";

  form.name.value = p.title || "";
  form.description.value = p.description || "";
  form.category.value = p.category || "";
  form.url.value = p.project_link || "";
  form.github.value = p.github_link || "";

  if (preview) {
    preview.src = p.image_url || PLACEHOLDER_IMAGE;
    preview.style.display = "block";
  }

  if (statusEl)
    statusEl.textContent = p.id
      ? `✏️ Editing: ${p.title}`
      : "➕ Creating a new portfolio";
  if (statusEl2)
    statusEl2.textContent = p.id
      ? `✏️ Editing: ${p.title}`
      : "➕ Creating a new portfolio";
}

function resetPortfolioForm() {
  const form = document.getElementById("portfolio-form");
  if (!form) return;

  form.reset();
  delete form.dataset.editingId;
  delete form.dataset.existingImage;

  const preview = document.getElementById("image-preview");
  if (preview) {
    preview.src = "/images/project-images/no-image-placeholder.webp";
    preview.alt = "No Image";
    preview.style.display = "block";
  }

  const fileInput = document.getElementById("portfolio-image");
  if (fileInput) fileInput.value = "";

  const statusEl = document.getElementById("status");
  const statusEl2 = document.getElementById("status2");
  if (statusEl) statusEl.textContent = "➕ Creating a new portfolio";
  if (statusEl2) statusEl2.textContent = "➕ Creating a new portfolio";
}

// ----- Add New Portfolio Button -----
function setupAddNewPortfolioButton() {
  const addNewBtn = document.getElementById("add-new-project");
  addNewBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    // Redirect to new-project page with a query param
    window.location.href = "/pages/new-project.html?new=true";
  });
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
      modal.style.display = "none";
      backdrop.style.display = "none";
    };

    btn.onclick = () => {
      modal.style.display = "block";
      backdrop.style.display = "block";
    };

    close?.addEventListener("click", hide);
    backdrop.onclick = hide;
  });
}

/* ======================================================
   VISITS
====================================================== */
function trackVisit() {
  const KEY = "lastVisitIncrement";
  const LIMIT = 30 * 60 * 1000;
  const now = Date.now();
  const last = Number(localStorage.getItem(KEY));

  if (!last || now - last > LIMIT) {
    fetch("/.netlify/functions/increment-visit").catch(console.error);
    localStorage.setItem(KEY, now);
  }

  fetch("/.netlify/functions/get-visit-count")
    .then((r) => r.json())
    .then((d) => {
      const el = document.getElementById("visit-count");
      if (el) el.textContent = d.count ?? 0;
    })
    .catch(console.error);
}

function trackAdmin() {
  // Select the checkbox in dashboard.html
  const trackAdminCheckbox = document.getElementById("trackAdmin");
  if (!trackAdminCheckbox) return;

  // Get the current value from localStorage
  const trackAdmin = localStorage.getItem("trackAdmin") === "true";

  // Set the checkbox state
  trackAdminCheckbox.checked = trackAdmin;

  // Update localStorage whenever checkbox is toggled
  trackAdminCheckbox.addEventListener("change", (e) => {
    localStorage.setItem("trackAdmin", e.target.checked);
  });
}

/* ======================================================
   FOOTER
====================================================== */
function initDate() {
  const lastModifiedEl = document.getElementById("lastModified");
  if (lastModifiedEl) lastModifiedEl.textContent = getFormattedLastModified();

  const currentYearEl = document.getElementById("currentyear");
  if (currentYearEl)
    currentYearEl.innerHTML = `<span class="highlight">${new Date().getFullYear()}</span>`;
}

// ===== Analytics Visitor ID Management =====
function getVisitorId() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user?.email) return null;

  const storedEmail = localStorage.getItem("analytics_visitor_email");
  let visitorId = localStorage.getItem("analytics_visitor_id");

  // If no ID exists or the email has changed, generate a new visitor ID
  if (!visitorId || storedEmail !== user.email) {
    visitorId = crypto.randomUUID(); // generate new UUID
    localStorage.setItem("analytics_visitor_id", visitorId);
    localStorage.setItem("analytics_visitor_email", user.email);
    console.log("✅ New analytics visitor ID generated:", visitorId);
  }

  return visitorId;
}

// Example usage when tracking an event
function trackPageView() {
  const visitorId = getVisitorId();
  if (!visitorId) return; // no user info

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  fetch("/.netlify/functions/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitor_id: visitorId,
      name: user.name,
      email: user.email,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      page_title: document.title,
      referrer_url: document.referrer,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      event_type: "pageview",
      event_payload: null,
      trackAdmin: user.user_type === "Admin",
    }),
  }).catch(console.error);
}

/* ======================================================
   INIT
====================================================== */
async function init() {
  setupHamburgerMenu();
  updateAuthLinks();
  renderUserHeader();
  trackPageView();
  setupLogout();
  setActiveNavLink();
  initDate();
  setupModals();
  trackVisit();
  await loadPortfolios();
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") === "true") {
    resetPortfolioForm();
  }
  setupAddNewPortfolioButton(); // wire up Add New Project button
  trackAdmin();
}

document.addEventListener("DOMContentLoaded", init);
