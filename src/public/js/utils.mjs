// ==============================
// utils.mjs (Refactored & Fixed)
// ==============================

// ---------- Helper: Fetch HTML ----------
async function fetchHTML(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`⚠️ Failed to fetch ${url}:`, err);
    return null;
  }
}

// ---------- Helper: Inject HTML into target ----------
function injectHTML(targetSelector, html) {
  const target = document.querySelector(targetSelector);
  if (!target) {
    console.error(`❌ Target ${targetSelector} not found`);
    return false;
  }

  if (target.innerHTML.trim() === html.trim()) {
    console.log(`⚠️ ${targetSelector} already has the same content, skipping.`);
    return false;
  }

  target.innerHTML = html;
  return true;
}

// ---------- Hamburger Menu ----------
function setupHamburgerMenu() {
  const menuBtn = document.querySelector("#menu");
  const navMenu = document.querySelector(".nav-links");

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  console.log("✅ Hamburger menu initialized");
}

// ---------- Active Nav Highlight ----------
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (
      linkPath === currentPath ||
      (linkPath.endsWith("index.html") && currentPath === "/")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ---------- Footer Info ----------
function updateFooterInfo() {
  const yearEl = document.querySelector("#currentyear");
  const modEl = document.querySelector("#lastModified");

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = getFormattedLastModified();
}

export function getFormattedLastModified() {
  const lastMod = new Date(document.lastModified);
  const dateFmt = { year: "numeric", month: "short", day: "numeric" };
  const timeFmt = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return `${lastMod.toLocaleDateString("en-US", dateFmt)} ${lastMod.toLocaleTimeString("en-US", timeFmt)}`;
}

// ---------- Main: Update Header & Footer ----------
export async function updateHeaderAndFooter() {
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";

  // Fetch templates
  const [headerHTML, footerHTML] = await Promise.all([
    fetchHTML(`${basePath}header.html`),
    fetchHTML(`${basePath}footer.html`),
  ]);

  // Inject header
  if (headerHTML && injectHTML("#header-container", headerHTML)) {
    setupHamburgerMenu();
    setActiveNavLink();
  }

  // Inject footer
  if (footerHTML && injectHTML("#footer-container", footerHTML)) {
    updateFooterInfo();
  }
}

// ---------- Window Dimensions ----------
function getCurrentWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

function getCurrentWindowHeight() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
}

function updateWindowWidthDisplay() {
  const el = document.querySelector("#windowWidth");
  if (el) el.textContent = `${getCurrentWindowWidth()}px`;
}

function updateWindowHeightDisplay() {
  const el = document.querySelector("#windowHeight");
  if (el) el.textContent = `${getCurrentWindowHeight()}px`;
}

// ---------- Initialize on Load ----------
window.addEventListener("load", () => {
  // updateHeaderAndFooter();
  updateWindowWidthDisplay();
  updateWindowHeightDisplay();
});

window.addEventListener("resize", () => {
  updateWindowWidthDisplay();
  updateWindowHeightDisplay();
});
