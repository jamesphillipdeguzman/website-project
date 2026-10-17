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

function createConfetti(num = 30) {
  const confettiWrapper = document.querySelector(".confetti-wrapper");
  const colors = [
    "#2196f3",
    "#64b5f6",
    "#42a5f5",
    "#1976d2",
    "#ffeb3b",
    "#ff5722",
  ];

  for (let i = 0; i < num; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Random start and drift positions
    confetti.style.setProperty("--x-start", `${Math.random() * 100}vw`);
    confetti.style.setProperty("--x-end", `${Math.random() * 50 - 25}vw`);

    // Random duration
    confetti.style.setProperty("--duration", `${Math.random() * 2 + 3}s`);

    // Random color
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    confettiWrapper.appendChild(confetti);

    // Remove after animation
    confetti.addEventListener("animationend", () => confetti.remove());
  }
}

/* ======================================================
   PORTFOLIOS
====================================================== */
async function loadPortfolios() {
  try {
    const res = await fetch("/api/get-portfolios");
    if (!res.ok) throw new Error("Portfolio fetch failed");

    portfolios = await res.json();

    renderPortfolioCarousel();
    renderPortfolioDropdown();
    renderPortfolioEditor();
  } catch (err) {
    console.error("❌ Portfolio load error:", err);
  }
}

/* ---------- Views Formatter & Tracker ---------- */
function formatPortfolioViews(count) {
  const n = Number(count) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k views";
  return `${n} view${n === 1 ? "" : "s"}`;
}

function trackPortfolioView(id, badgeEl) {
  if (!id) return;
  const key = `session_viewed_portfolio_${id}`;
  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, "1");

  fetch(`/api/portfolios?action=view&id=${encodeURIComponent(id)}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.views !== undefined && badgeEl) {
        const countSpan = badgeEl.querySelector(".views-count");
        if (countSpan) countSpan.textContent = formatPortfolioViews(data.views);
        badgeEl.classList.add("updated");
        setTimeout(() => badgeEl.classList.remove("updated"), 1200);
      }
    })
    .catch((err) => console.error("Failed to track portfolio view:", err));
}

/* ---------- Modern Carousel & View Tracking ---------- */
function renderPortfolioCarousel() {
  const container = document.getElementById("portfolio-carousel");
  if (!container) return;

  container.className = "carousel modern-carousel";
  container.innerHTML = "";

  const select = document.getElementById("my-portfolios");
  if (select) {
    select.innerHTML = `<option value="">Select a portfolio</option>`;
  }

  const dotsContainer = document.getElementById("carousel-dots");
  if (dotsContainer) dotsContainer.innerHTML = "";

  if (!portfolios || portfolios.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem; color: #94a3b8; text-align: center; width: 100%;">
        No portfolio projects found.
      </div>
    `;
    return;
  }

  // Impression observer for view tracking
  const viewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          const card = entry.target;
          const id = card.dataset.id;
          const badgeEl = card.querySelector(".views-badge");

          if (id && !sessionStorage.getItem(`session_viewed_portfolio_${id}`)) {
            const timer = setTimeout(() => {
              trackPortfolioView(id, badgeEl);
            }, 750);
            card._viewTimer = timer;
          }
        } else {
          if (entry.target._viewTimer) {
            clearTimeout(entry.target._viewTimer);
            entry.target._viewTimer = null;
          }
        }
      });
    },
    { threshold: 0.55 }
  );

  portfolios.forEach((p, idx) => {
    // Populate fallback select if present
    if (select) {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${p.title}">${p.title}</option>`,
      );
    }

    const card = document.createElement("article");
    card.className = "card modern-portfolio-card";
    card.setAttribute("data-id", p.id);
    card.setAttribute("data-title", p.title);
    card.setAttribute("tabindex", "0");

    const formattedViews = formatPortfolioViews(p.views ?? 0);
    const categoryBadge = p.category
      ? `<span class="category-badge" style="color: #ffffff; font-weight: 700;">${p.category}</span>`
      : "";
    const githubBtn = p.github_link
      ? `
        <a href="${p.github_link}" target="_blank" rel="noopener noreferrer" class="btn-action btn-secondary" aria-label="View source code on GitHub" style="color: #ffffff;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>Code</span>
        </a>
      `
      : "";

    card.innerHTML = `
      <div class="card-media-wrapper">
        <a href="${p.project_link || '#'}" target="_blank" rel="noopener noreferrer" class="card-image-link" aria-label="Visit ${p.title}">
          <img src="${p.image_url || PLACEHOLDER_IMAGE}" alt="${p.title}" loading="lazy" class="portfolio-card-img" />
          <div class="card-image-overlay"></div>
        </a>
        ${categoryBadge}
        <span class="views-badge" aria-label="${formattedViews}">
          <svg class="views-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span class="views-count" style="color: #ffffff; font-weight: 600;">${formattedViews}</span>
        </span>
      </div>

      <div class="databox modern-databox">
        <div class="card-info-wrap">
          <h3 class="card-title" style="color: #ffffff; font-weight: 700; font-size: 1.25rem; margin-bottom: 0.6rem;">${p.title}</h3>
          <p class="card-desc" style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.55;">${p.description || "Interactive web application crafted with modern web standards and responsive layout."}</p>
        </div>
        
        <div class="card-actions">
          <a href="${p.project_link || '#'}" target="_blank" rel="noopener noreferrer" class="btn-action btn-primary" aria-label="Live Demo for ${p.title}">
            <span>Live Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          ${githubBtn}
        </div>
      </div>
    `;

    // Click & Focus view tracking
    card.addEventListener("click", () => {
      const badge = card.querySelector(".views-badge");
      trackPortfolioView(p.id, badge);
    });

    card.addEventListener("focus", () => {
      const badge = card.querySelector(".views-badge");
      trackPortfolioView(p.id, badge);
    });

    container.appendChild(card);
    viewObserver.observe(card);

    // Create pagination dot
    if (dotsContainer) {
      const dot = document.createElement("button");
      dot.className = `carousel-dot ${idx === 0 ? "active" : ""}`;
      dot.setAttribute("data-index", idx);
      dot.setAttribute("aria-label", `Go to project ${idx + 1}: ${p.title}`);
      dot.addEventListener("click", () => {
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });
      dotsContainer.appendChild(dot);
    }
  });

  if (select) {
    select.onchange = () => {
      const targetCard = container.querySelector(`[data-title="${select.value}"]`);
      targetCard?.scrollIntoView({ behavior: "smooth", inline: "center" });
    };
  }

  setupModernCarouselControls(container, dotsContainer);
  initPortfolioViewToggle();
}

function setupModernCarouselControls(container, dotsContainer) {
  const btnPrev = document.querySelector(".carousel-btn.prev");
  const btnNext = document.querySelector(".carousel-btn.next");

  const getScrollDistance = () => {
    const firstCard = container.querySelector(".card");
    if (!firstCard) return 350;
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap) || 24;
    return firstCard.offsetWidth + gap;
  };

  btnPrev?.addEventListener("click", () => {
    container.scrollBy({ left: -getScrollDistance(), behavior: "smooth" });
  });

  btnNext?.addEventListener("click", () => {
    container.scrollBy({ left: getScrollDistance(), behavior: "smooth" });
  });

  // Kinetic active dot sync on scroll
  if (dotsContainer) {
    let isTicking = false;
    container.addEventListener(
      "scroll",
      () => {
        if (!isTicking) {
          window.requestAnimationFrame(() => {
            const cards = container.querySelectorAll(".modern-portfolio-card");
            const dots = dotsContainer.querySelectorAll(".carousel-dot");
            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;

            let closestIndex = 0;
            let minDistance = Infinity;

            cards.forEach((card, idx) => {
              const cardRect = card.getBoundingClientRect();
              const cardCenter = cardRect.left + cardRect.width / 2;
              const distance = Math.abs(containerCenter - cardCenter);
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = idx;
              }
            });

            dots.forEach((dot, idx) => {
              dot.classList.toggle("active", idx === closestIndex);
            });

            isTicking = false;
          });
          isTicking = true;
        }
      },
      { passive: true }
    );
  }
}

/* ---------- Layout View Switcher (Carousel / Grid / List) ---------- */
function initPortfolioViewToggle() {
  const section = document.querySelector(".portfolio-showcase-section");
  const container = document.getElementById("portfolio-carousel");
  const toolbar = document.querySelector(".portfolio-view-toolbar");
  if (!section || !container || !toolbar) return;

  const buttons = toolbar.querySelectorAll(".view-toggle-btn");
  const subtext = document.querySelector(".showcase-subtext");

  const subtextMap = {
    carousel: "Swipe or scroll horizontally to explore projects and track live metrics.",
    grid: "Browse featured projects in a responsive multi-column grid layout.",
    list: "Browse detailed project records in a structured row overview.",
  };

  const applyViewMode = (mode, persist = true) => {
    const validModes = ["carousel", "grid", "list"];
    const activeMode = validModes.includes(mode) ? mode : "carousel";

    if (persist) {
      try {
        localStorage.setItem("portfolio_view_mode", activeMode);
      } catch (err) {}
    }

    buttons.forEach((btn) => {
      const isActive = btn.dataset.view === activeMode;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });

    if (subtext && subtextMap[activeMode]) {
      subtext.textContent = subtextMap[activeMode];
    }

    container.classList.add("view-transitioning");
    setTimeout(() => {
      section.classList.remove("mode-carousel", "mode-grid", "mode-list");
      section.classList.add(`mode-${activeMode}`);

      container.classList.remove("view-carousel", "view-grid", "view-list");
      container.classList.add(`view-${activeMode}`);

      container.classList.remove("view-transitioning");

      if (activeMode === "carousel") {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 120);
  };

  buttons.forEach((btn) => {
    btn.onclick = () => applyViewMode(btn.dataset.view);
  });

  let savedMode = "carousel";
  try {
    savedMode = localStorage.getItem("portfolio_view_mode") || "carousel";
  } catch (err) {}

  applyViewMode(savedMode, false);
}

/* ---------- Dropdown ---------- */
function renderPortfolioDropdown() {
  const dropdown = document.getElementById("dynamic-product");

  const portfolioDisplay = document.getElementById("portfolio-display");

  if (!dropdown) return;

  dropdown.innerHTML =
    `<option disabled selected>Select a portfolio...</option>` +
    portfolios
      .map((p) => `<option value="${p.id}">${p.title}</option>`)
      .join("");

  dropdown.onchange = () => {
    const p = portfolios.find((x) => String(x.id) === dropdown.value);
    if (portfolioDisplay) portfolioDisplay.style.display = "block";
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
    fetch("/api/increment-visit").catch(console.error);
    localStorage.setItem(KEY, now);
  }

  fetch("/api/get-visit-count")
    .then((r) => r.json())
    .then((d) => {
      const el = document.getElementById("visit-count");
      if (el) el.textContent = d.count ?? 0;
    })
    .catch(console.error);
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

/* ======================================================
   ANALYTICS
====================================================== */

// ===== Track Admin =====

function trackAdmin() {
  const trackAdminCheckbox = document.getElementById("trackAdmin");
  if (!trackAdminCheckbox) return false;

  // Initialize checkbox state from localStorage
  const trackAdmin = localStorage.getItem("trackAdmin") === "true";
  trackAdminCheckbox.checked = trackAdmin;

  // Update localStorage when user toggles
  trackAdminCheckbox.addEventListener("change", (e) => {
    localStorage.setItem("trackAdmin", e.target.checked);
  });

  return trackAdminCheckbox.checked;
}

// ===== Track Page View =====

// Example usage when tracking an event
function trackPageView() {
  const visitorId = getVisitorId();
  if (!visitorId) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.user_type?.toLowerCase() || "guest";
  const trackAdminEnabled = trackAdmin(); // checkbox value

  // Decide whether to send event
  const shouldTrack =
    (userType === "admin" && trackAdminEnabled) ||
    userType === "client" ||
    userType === "guest"; // <-- now guests are tracked

  if (!shouldTrack) return;

  fetch("/api/track-event", {
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
      trackAdmin: userType === "admin" && trackAdminEnabled,
      visitor_type: userType, // include type explicitly
    }),
  }).catch(console.error);
}

// ===== Clear Analytics =====

function clearAnalytics() {
  const clearBtn = document.getElementById("clearAnalyticsBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to clear all analytics events?"))
      return;

    try {
      const res = await fetch("/api/clear-analytics", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Analytics cleared successfully.");
        // Reset visit count on dashboard
        const visitCountEl = document.getElementById("visit-count");
        if (visitCountEl) visitCountEl.textContent = 0;
      } else {
        alert(data.error || "Failed to clear analytics.");
      }
    } catch (err) {
      console.error("Error clearing analytics:", err);
      alert("Error clearing analytics events.");
    }
  });
}

// ===== New Leads =====

async function loadNewLeads() {
  const res = await fetch("/api/new-leads");
  const data = await res.json();

  document.getElementById("new-leads-count").textContent = data.newLeads || 0;
}

// ===== Last Project =====

async function loadLastProject() {
  const res = await fetch("/api/last-project");
  const data = await res.json();

  if (!data.project) {
    document.getElementById("last-project-title").textContent =
      "No projects yet";
    return;
  }

  document.getElementById("last-project-title").textContent =
    data.project.title;

  if (data.project.created_at) {
    document.getElementById("last-project-date").textContent =
      "Added on " + new Date(data.project.created_at).toLocaleDateString();
  }
}

// ===== System Status =====

async function loadSystemStatus() {
  try {
    const res = await fetch("/api/system-status");
    const data = await res.json();

    const el = document.getElementById("system-status-text");

    if (data.status === "operational") {
      el.textContent = "Active within the last 24 hours ✅";
      el.className = "status-ok";
    } else {
      el.textContent = "System degraded ⚠️";
      el.className = "status-warn";
    }
  } catch {
    const el = document.getElementById("system-status-text");
    el.textContent = "System unavailable ❌";
    el.className = "status-error";
  }
}

/* ======================================================
   INIT
====================================================== */
async function init() {
  setupHamburgerMenu();
  updateAuthLinks();
  renderUserHeader();
  trackAdmin(); // wire checkbox listener first
  trackPageView(); // now it reads correct checkbox value
  setupLogout();
  setActiveNavLink();
  initDate();
  setupModals();
  trackVisit();
  await loadPortfolios();
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") === "true") resetPortfolioForm();
  setupAddNewPortfolioButton();
  clearAnalytics();
  const confettiWrapper = document.querySelector(".confetti-wrapper");
  if (confettiWrapper) {
    createConfetti(50);
  }
  loadNewLeads();
  loadLastProject();
  loadSystemStatus();
}

document.addEventListener("DOMContentLoaded", init);
