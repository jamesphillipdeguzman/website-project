// utils.mjs
// ==============================
// utils.mjs (Exports fixed + safe loading order)
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
    console.warn(`Target ${targetSelector} not found`);
    return false;
  }

  if (target.innerHTML.trim() === (html || "").trim()) {
    console.log(
      `${targetSelector} already has same content — skipping inject.`,
    );
    return false;
  }

  target.innerHTML = html;
  return true;
}

// ---------- Hamburger Menu ----------
export function setupHamburgerMenu() {
  const menuBtn = document.querySelector("#menu");
  const navMenu = document.querySelector(".nav-links");

  if (!menuBtn || !navMenu) return;

  // remove previous listeners if any (safe re-init)
  menuBtn.replaceWith(menuBtn.cloneNode(true));
  const newMenuBtn = document.querySelector("#menu");
  const newNavMenu = document.querySelector(".nav-links");

  if (!newMenuBtn || !newNavMenu) return;

  newMenuBtn.addEventListener("click", () => {
    newMenuBtn.classList.toggle("open");
    newNavMenu.classList.toggle("open");
  });

  console.log("✅ setupHamburgerMenu()");
}

// ---------- Active Nav Highlight ----------
export function setActiveNavLink() {
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

  console.log("✅ setActiveNavLink()");
}

// ---------- Footer Info ----------
export function getFormattedLastModified() {
  const lastMod = new Date(document.lastModified || Date.now());
  const dateFmt = { year: "numeric", month: "short", day: "numeric" };
  const timeFmt = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return `${lastMod.toLocaleDateString("en-US", dateFmt)} ${lastMod.toLocaleTimeString("en-US", timeFmt)}`;
}

export function updateFooterInfo() {
  const yearEl = document.querySelector("#currentyear");
  const modEl = document.querySelector("#lastModified");

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) modEl.textContent = getFormattedLastModified();

  console.log("✅ updateFooterInfo()");
}

// ---------- Header & Footer Loader ----------
export async function updateHeaderAndFooter() {
  const isInPagesDir = window.location.pathname.includes("/pages/");
  const basePath = isInPagesDir ? "../public/partials/" : "/public/partials/";

  const [headerHTML, footerHTML] = await Promise.all([
    fetchHTML(`${basePath}header.html`),
    fetchHTML(`${basePath}footer.html`),
  ]);

  // Inject header then init header-related UI
  if (headerHTML && injectHTML("#header-container", headerHTML)) {
    // call exported helpers (they exist because we're in this module)
    try {
      setupHamburgerMenu();
      setActiveNavLink();
    } catch (err) {
      console.warn("Header init helpers error:", err);
    }
  } else {
    console.log("Header not injected or already present.");
  }

  // Inject footer then update footer info
  if (footerHTML && injectHTML("#footer-container", footerHTML)) {
    updateFooterInfo();
  } else {
    console.log("Footer not injected or already present.");
  }

  return {
    headerInjected: Boolean(headerHTML),
    footerInjected: Boolean(footerHTML),
  };
}

// ---------- Window Dimensions ----------
export function updateWindowWidthDisplay() {
  const el = document.querySelector("#windowWidth");
  if (el) el.textContent = `${window.innerWidth}px`;
}

export function updateWindowHeightDisplay() {
  const el = document.querySelector("#windowHeight");
  if (el) el.textContent = `${window.innerHeight}px`;
}
