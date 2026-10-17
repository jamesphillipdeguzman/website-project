document.addEventListener("DOMContentLoaded", () => {
  fetchPortfolios();
});

async function fetchPortfolios() {
  try {
    const res = await fetch("/api/get-portfolios");
    if (!res.ok) throw new Error("Failed to fetch portfolios");

    const portfolios = await res.json();
    setupPortfolioCarousel(portfolios);
    populatePortfolioDropdown(portfolios); // ← correct function name
  } catch (err) {
    console.error(err);
  }
}

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

// Modern carousel setup
function setupPortfolioCarousel(portfolios) {
  const container = document.getElementById("portfolio-carousel");
  if (!container) return;

  container.className = "carousel modern-carousel";
  container.innerHTML = "";

  const dropdown = document.getElementById("my-portfolios");
  if (dropdown) {
    dropdown.innerHTML = '<option value="">Select a portfolio</option>';
  }

  const dotsContainer = document.getElementById("carousel-dots");
  if (dotsContainer) dotsContainer.innerHTML = "";

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
    if (dropdown) {
      const opt = document.createElement("option");
      opt.value = p.title;
      opt.textContent = p.title;
      dropdown.appendChild(opt);
    }

    const card = document.createElement("article");
    card.className = "card modern-portfolio-card portfolio-card";
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
          <img src="${p.image_url || '/images/project-images/profile.png'}" alt="${p.title}" loading="lazy" class="portfolio-card-img">
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
        
        <div class="card-actions portfolio-actions">
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

    card.addEventListener("click", (e) => {
      const badge = card.querySelector(".views-badge");
      trackPortfolioView(p.id, badge);

      if (e.target.closest("a") || e.target.closest("button")) {
        // Do not prevent default navigation for buttons/links
        return;
      }
    });

    card.addEventListener("focus", () => {
      const badge = card.querySelector(".views-badge");
      trackPortfolioView(p.id, badge);
    });

    container.appendChild(card);
    viewObserver.observe(card);

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

  if (dropdown) {
    dropdown.addEventListener("change", () => {
      const selected = container.querySelector(
        `[data-title="${dropdown.value}"]`,
      );
      if (selected)
        selected.scrollIntoView({ behavior: "smooth", inline: "center" });
    });
  }

  setupCarouselButtons(container, dotsContainer);
  initPortfolioViewToggle();
}

function setupCarouselButtons(container, dotsContainer) {
  const btnPrev = document.querySelector(".carousel-btn.prev");
  const btnNext = document.querySelector(".carousel-btn.next");

  if (!container) return;

  function getCardWidth() {
    const card = container.querySelector(".card");
    if (!card) return 350;
    const style = window.getComputedStyle(container);
    const gap = parseInt(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  btnPrev?.addEventListener("click", () => {
    const scrollAmount = getCardWidth();
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  btnNext?.addEventListener("click", () => {
    const scrollAmount = getCardWidth();
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

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

// NEW: populate any <select id="dynamic-product">
function populatePortfolioDropdown(portfolios) {
  const dropdown = document.getElementById("dynamic-product");

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
    if (displayContainer) displayContainer.style.display = "block";
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
