// ==============================
//  utils.mjs (Refactored)
// ==============================

// ---------- Helper: Load a template into target ----------
async function loadTemplate(url, targetId) {
  try {
    console.log(`🧩 Loading template from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();
    const target = document.querySelector(targetId);

    if (!target) {
      console.error(`❌ Target element ${targetId} not found.`);
      return;
    }

    // Only update if content is empty or different
    if (target.innerHTML.trim() !== html.trim()) {
      requestAnimationFrame(() => (target.innerHTML = html));
      console.log(`✅ Template injected into ${targetId}`);
    } else {
      console.log(`⚠️ Template already loaded into ${targetId}, skipping.`);
    }
  } catch (error) {
    console.error("⚠️ Error loading template:", error);
  }
}

// ---------- Helper: Preload both templates ----------
async function preloadTemplates() {
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";

  console.log(`📦 Preloading templates from: ${basePath}`);

  try {
    const [header, footer] = await Promise.all([
      fetch(`${basePath}header.html`).then((r) => r.text()),
      fetch(`${basePath}footer.html`).then((r) => r.text()),
    ]);
    return { header, footer };
  } catch (err) {
    console.error("⚠️ Error preloading templates:", err);
    return null;
  }
}

// ---------- Helper: Update a section (header/footer) ----------
async function updateContent(url, targetId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    const target = document.querySelector(targetId);
    if (!target) {
      console.error(`❌ Target element ${targetId} not found.`);
      return;
    }

    // Skip if already injected
    if (target.innerHTML.trim().length > 0) {
      console.log(
        `⏩ ${targetId} already contains content. Skipping injection.`,
      );
      return;
    }

    target.innerHTML = html;
    console.log(`✅ Updated ${targetId}`);
  } catch (error) {
    console.error("⚠️ Error updating content:", error);
  }
}

// ---------- Main: Update Header and Footer ----------
async function updateHeaderAndFooter() {
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";

  // Prevent double injection
  const headerCont = document.getElementById("header-container");
  const footerCont = document.getElementById("footer-container");

  if (
    (headerCont && headerCont.innerHTML.trim().length > 0) ||
    (footerCont && footerCont.innerHTML.trim().length > 0)
  ) {
    console.log(
      "🚫 Header/Footer already injected, skipping updateHeaderAndFooter()",
    );
    return;
  }

  console.log("🚀 Injecting header and footer from:", basePath);

  await Promise.all([
    updateContent(`${basePath}header.html`, "#header-container"),
    updateContent(`${basePath}footer.html`, "#footer-container"),
  ]);

  // Once loaded, initialize
  setupHamburgerMenu();
  setActiveNavLink();
  updateFooterInfo();
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

// ---------- Hamburger Menu ----------
function setupHamburgerMenu() {
  const menuBtn = document.querySelector("#menu");
  const navMenu = document.querySelector(".nav-links");

  if (!menuBtn || !navMenu) {
    console.warn("⚠️ Hamburger elements not found.");
    return;
  }

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
  });
}

// ---------- Highlight Active Nav ----------
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const current = window.location.pathname;

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    if (
      linkPath === current ||
      (linkPath.endsWith("index.html") && current === "/")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
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

window.addEventListener("load", () => {
  updateHeaderAndFooter();
  updateWindowWidthDisplay();
  updateWindowHeightDisplay();
});

window.addEventListener("resize", () => {
  updateWindowWidthDisplay();
  updateWindowHeightDisplay();
});

// ---------- Export ----------
export { updateHeaderAndFooter };
