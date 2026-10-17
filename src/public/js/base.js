import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
} from "./utils.mjs";
import staticPortfolios from "./portfolios-data.mjs";

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
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        portfolios = data;
      }
    } else {
      console.warn("Portfolio fetch returned status:", res.status);
    }
  } catch (err) {
    console.error("❌ Portfolio load error:", err);
  } finally {
    if ((!portfolios || portfolios.length === 0) && Array.isArray(staticPortfolios) && staticPortfolios.length > 0) {
      portfolios = staticPortfolios.map((item, idx) => ({
        id: item.id || idx + 1,
        title: item.pTitle || item.title || "Project",
        description: item.description || "",
        category: item.category || "PROJECT",
        image_url: item.sourceImg || item.image_url || PLACEHOLDER_IMAGE,
        project_link: item.imageURL || item.project_link || "#",
        github_link: item.github_link || "",
        views: item.views || 0,
      }));
    }
    renderPortfolioCarousel();
    renderPortfolioDropdown();
    renderPortfolioEditor();
  }
}

/* ---------- Views Formatter & Tracker ---------- */
function formatPortfolioViews(count) {
  const n = Number(count) || 0;
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k views";
  return `${n} view${n === 1 ? "" : "s"}`;
}

async function incrementPortfolioView(id, badgeEl) {
  if (!id) return;
  try {
    const res = await fetch("/api/increment-portfolio-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id) || id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.views !== undefined && badgeEl) {
        const countSpan =
          badgeEl.querySelector(".count") ||
          badgeEl.querySelector(".views-count") ||
          badgeEl;
        if (countSpan) {
          countSpan.textContent = `${data.views || 0} views`;
        }
        badgeEl.classList.add("updated");
        setTimeout(() => badgeEl.classList.remove("updated"), 1200);
      }
    }
  } catch (err) {
    console.warn("Portfolio view increment error:", err);
  }
}

function trackPortfolioView(id, badgeEl) {
  if (!id) return;
  const key = `session_viewed_portfolio_${id}`;
  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, "1");
  incrementPortfolioView(id, badgeEl);
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
          const badgeEl = card.querySelector(".view-count-badge") || card.querySelector(".views-badge");

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
      </div>

      <div class="databox modern-databox">
        <div class="card-info-wrap">
          <h3 class="card-title" style="color: #ffffff; font-weight: 700; font-size: 1.25rem; margin-bottom: 0.6rem;">${p.title}</h3>
          <p class="card-desc" style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.55;">${p.description || "Interactive web application crafted with modern web standards and responsive layout."}</p>
        </div>
        
        <div class="card-actions-col">
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

          <div class="card-footer-meta">
            <span class="view-count-badge">
              <svg class="eye-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="count">${p.views || 0} views</span>
            </span>
            <span class="category-tag">${p.category || 'PROJECT'}</span>
          </div>
        </div>
      </div>
    `;

    const triggerViewIncrement = () => {
      const badge = card.querySelector(".view-count-badge") || card.querySelector(".views-badge");
      incrementPortfolioView(p.id, badge);
    };

    // Live demo & action button view increments
    const liveDemoBtn = card.querySelector(".btn-primary");
    const codeBtn = card.querySelector(".btn-secondary");
    const cardImgLink = card.querySelector(".card-image-link");

    liveDemoBtn?.addEventListener("click", triggerViewIncrement);
    codeBtn?.addEventListener("click", triggerViewIncrement);
    cardImgLink?.addEventListener("click", triggerViewIncrement);

    // Card click & focus view tracking
    card.addEventListener("click", () => {
      triggerViewIncrement();
    });

    card.addEventListener("focus", () => {
      triggerViewIncrement();
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
  const modalConfigs = [
    ["get-quote-btn", "quote-modal", "quote-backdrop"],
    ["login-btn", "login-modal", "login-backdrop"],
    ["signup-btn", "signup-modal", "signup-backdrop"],
  ];

  modalConfigs.forEach(([btnId, modalId, backdropId]) => {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);
    const close = modal?.querySelector(".close");
    if (!btn || !modal || !backdrop) return;

    const hide = () => {
      modal.classList.add("hidden");
      modal.classList.remove("active", "open");
      modal.style.display = "none";
      backdrop.classList.add("hidden");
      backdrop.classList.remove("active", "open");
      backdrop.style.display = "none";
      document.body.style.overflow = "";
    };

    const show = () => {
      modal.classList.remove("hidden");
      modal.classList.add("active", "open");
      modal.style.display = "flex";
      backdrop.classList.remove("hidden");
      backdrop.classList.add("active", "open");
      backdrop.style.display = "block";
      document.body.style.overflow = "hidden";
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      show();
    });

    close?.addEventListener("click", (e) => {
      e.preventDefault();
      hide();
    });

    backdrop.addEventListener("click", hide);

    // Dismiss if clicking directly on modal background area outside modal-content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hide();
      }
    });
  });

  // Global Escape key listener to dismiss open modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active, .modal.open, .modal:not(.hidden)").forEach((m) => {
        m.classList.add("hidden");
        m.classList.remove("active", "open");
        m.style.display = "none";
      });
      document.querySelectorAll(".backdrop.active, .backdrop.open, .backdrop:not(.hidden)").forEach((b) => {
        b.classList.add("hidden");
        b.classList.remove("active", "open");
        b.style.display = "none";
      });
      document.body.style.overflow = "";
    }
  });
}

// ----- Quote Form Submission Handler -----
function setupQuoteForm() {
  const quoteForm = document.getElementById("quoteForm");
  if (!quoteForm) return;

  const errorDiv = document.getElementById("quote-error-message");
  const submitBtn =
    quoteForm.querySelector("#submit-enquiry") ||
    quoteForm.querySelector('button[type="submit"]');

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (errorDiv) {
      errorDiv.style.display = "none";
      errorDiv.textContent = "";
    }

    const nameInput = quoteForm.querySelector('[name="name"]');
    const emailInput = quoteForm.querySelector('[name="email"]');
    const phoneInput = quoteForm.querySelector('[name="phone"]');
    const messageInput =
      quoteForm.querySelector('[name="message"]') ||
      quoteForm.querySelector('[name="question"]');
    const faxInput = quoteForm.querySelector('[name="company_fax"]');
    const tokenInput = quoteForm.querySelector('[name="extra_security_token"]');
    const botInput = quoteForm.querySelector('[name="bot-field"]');

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const question = messageInput ? messageInput.value.trim() : "";
    const company_fax = faxInput ? faxInput.value.trim() : "";
    const extra_security_token = tokenInput ? tokenInput.value.trim() : "";
    const botField = botInput ? botInput.value.trim() : "";

    if (!name || !email) {
      if (errorDiv) {
        errorDiv.textContent = "Please fill in all required fields (Name and Email).";
        errorDiv.style.display = "block";
      }
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : "Submit Enquiry";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Quote...";
    }

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          question,
          message: question,
          company_fax,
          extra_security_token,
          "bot-field": botField,
        }),
      });

      if (res.ok) {
        window.location.href = "/pages/thanks.html";
      } else {
        const data = await res.json().catch(() => ({}));
        if (errorDiv) {
          errorDiv.textContent =
            data.error || "Failed to submit quote request. Please try again.";
          errorDiv.style.display = "block";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    } catch (err) {
      console.error("Error submitting quote:", err);
      if (errorDiv) {
        errorDiv.textContent =
          "Network error. Please check your connection and try again.";
        errorDiv.style.display = "block";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
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

  const visitCountEl = document.getElementById("visit-count");
  if (!visitCountEl) return;

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

// ===== Automatic Global Event Capture =====
function captureAnalyticsEvent(eventName = "pageview", eventType = "navigation") {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  let userName = localStorage.getItem("user_name");
  if (!userName) {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u && u.name) userName = u.name;
    } catch {}
  }

  const payload = {
    name: userName || "Anonymous",
    type: eventType,
    page: window.location.pathname,
    event: eventName,
    referrer: document.referrer || "Direct",
    device: isMobile ? "Mobile" : "Desktop",
  };

  fetch("/api/record-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => console.debug("Analytics log error:", err));
}

// ===== Global Page Visit Tracking =====
async function trackVisit() {
  try {
    await fetch("/api/record-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname }),
    });

    const countEl = document.getElementById("visit-count");
    if (countEl) {
      const res = await fetch("/api/get-visit-count");
      if (res.ok) {
        const data = await res.json();
        countEl.textContent = data.count;
      }
    }
  } catch (err) {
    console.warn("Visit tracking blip:", err);
  }
}

// ===== Clear Analytics =====

function clearAnalytics() {
  const clearBtn = document.getElementById("clearAnalyticsBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to clear all analytics events?"))
      return;

    try {
      const res = await fetch("/api/analytics", {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Analytics cleared successfully.");
        // Reset visit count on dashboard
        const visitCountEl = document.getElementById("visit-count");
        if (visitCountEl) visitCountEl.textContent = 0;
        const eventsCountEl = document.getElementById("events-count");
        if (eventsCountEl) eventsCountEl.textContent = 0;
        const tbody = document.getElementById("analytics-body");
        if (tbody) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No analytics data yet.</td></tr>`;
        }
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
  const container = document.getElementById("new-leads-count");
  if (!container) return; // Prevent dashboard-specific polling/fetch if not on dashboard

  try {
    const res = await fetch("/api/new-leads");
    if (!res.ok) return;
    const data = await res.json();

    const el = document.getElementById("new-leads-count");
    if (el) {
      el.textContent = data.newLeads || 0;
    }
  } catch (err) {
    console.warn("Could not load new leads:", err.message);
  }
}

// ===== Last Project =====

async function loadLastProject() {
  const titleEl = document.getElementById("last-project-title");
  const dateEl = document.getElementById("last-project-date");
  if (!titleEl && !dateEl) return; // Prevent fetch if not on dashboard

  try {
    const res = await fetch("/api/last-project");
    if (!res.ok) return;
    const data = await res.json();

    const elTitle = document.getElementById("last-project-title");
    const elDate = document.getElementById("last-project-date");

    if (!data || !data.project) {
      if (elTitle) {
        elTitle.textContent = "No projects yet";
      }
      return;
    }

    if (elTitle) {
      elTitle.textContent = data.project.title || "No projects yet";
    }

    if (data.project.created_at && elDate) {
      elDate.textContent =
        "Added on " + new Date(data.project.created_at).toLocaleDateString();
    }
  } catch (err) {
    console.warn("Could not load last project:", err.message);
  }
}

// ===== System Status =====

async function loadSystemStatus() {
  const statusEl = document.getElementById("system-status-text");
  if (!statusEl) return; // Prevent fetch if not on dashboard

  try {
    const res = await fetch("/api/system-status");
    if (!res.ok) throw new Error("Status endpoint error");
    const data = await res.json();

    const el = document.getElementById("system-status-text");
    if (el) {
      if (data.status === "operational") {
        el.textContent = "Active within the last 24 hours ✅";
        el.className = "status-ok";
      } else {
        el.textContent = "System degraded ⚠️";
        el.className = "status-warn";
      }
    }
  } catch {
    const el = document.getElementById("system-status-text");
    if (el) {
      el.textContent = "System unavailable ❌";
      el.className = "status-error";
    }
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
  setupQuoteForm();
  trackVisit();
  captureAnalyticsEvent();
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
