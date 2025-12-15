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
  const navLinks = document.querySelectorAll(".nav-links li a");

  // Normalize current page (e.g. index.html, about.html)
  let currentPage = window.location.pathname.split("/").pop();

  // Default to index.html
  if (!currentPage || currentPage === "") {
    currentPage = "index.html";
  }

  const userType = localStorage.getItem("userType");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const linkPage = link.getAttribute("href")?.split("/").pop();

    /* ---------- Admin logic ---------- */
    if (userType === "Admin" && link.id === "login-link") {
      if (
        currentPage === "dashboard.html" ||
        currentPage === "new-project.html"
      ) {
        link.classList.add("active");
        return;
      }
    }

    /* ---------- Client logic ---------- */
    if (userType === "Client" && link.id === "login-link") {
      if (currentPage === "profile.html") {
        link.classList.add("active");
        return;
      }
    }

    /* ---------- Normal page match ---------- */
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
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

  // Inject header
  let headerInjected = false;
  if (headerHTML && injectHTML("#header-container", headerHTML)) {
    setupHamburgerMenu();
    setActiveNavLink();
    headerInjected = true;
  }

  // Inject footer
  let footerInjected = false;
  if (footerHTML && injectHTML("#footer-container", footerHTML)) {
    updateFooterInfo();
    footerInjected = true;
  }

  return { headerInjected, footerInjected };
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
