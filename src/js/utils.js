// Function to load HTML templates
async function loadTemplate(url, targetId) {
  try {
    console.log(`Attempting to load template from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Create a temporary container
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Replace content only when new content is ready
      requestAnimationFrame(() => {
        targetElement.innerHTML = html;
      });

      console.log(`Successfully loaded template into ${targetId}`);
    } else {
      console.error(`Target element ${targetId} not found`);
    }
  } catch (error) {
    console.error("Error loading template:", error);
  }
}

// Preload templates
async function preloadTemplates() {
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";

  try {
    const [headerResponse, footerResponse] = await Promise.all([
      fetch(`${basePath}header.html`),
      fetch(`${basePath}footer.html`)
    ]);

    return {
      header: await headerResponse.text(),
      footer: await footerResponse.text()
    };
  } catch (error) {
    console.error("Error preloading templates:", error);
    return null;
  }
}

// Function to update content
async function updateContent(url, targetId) {
  try {
    console.log(`Attempting to update content from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Only update if content is different
      if (targetElement.innerHTML.trim() !== html.trim()) {
        targetElement.innerHTML = html;
        console.log(`Successfully updated content in ${targetId}`);
      }
    } else {
      console.error(`Target element ${targetId} not found`);
    }
  } catch (error) {
    console.error("Error updating content:", error);
  }
}

async function updateHeaderAndFooter() {
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";

  // Update header and footer in parallel
  await Promise.all([
    updateContent(`${basePath}header.html`, "#header-container"),
    updateContent(`${basePath}footer.html`, "#footer-container")
  ]);

  // Setup functionality
  setupHamburgerMenu();
  setActiveNavLink();
  updateFooterInfo();
}

// Start updating after page load
window.addEventListener('load', updateHeaderAndFooter);

// Function to update footer info
function updateFooterInfo() {
  const yearElement = document.querySelector("#currentyear");
  const modifiedElement = document.querySelector("#lastModified");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (modifiedElement) {
    modifiedElement.textContent = getFormattedLastModified();
  }
}

// Format "Last Modified" timestamp
function getFormattedLastModified() {
  const lastModified = new Date(document.lastModified);
  const dateFormat = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = lastModified.toLocaleDateString("en-US", dateFormat);
  const formattedTime = lastModified.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return `${formattedDate} ${formattedTime}`;
}

// Setup hamburger toggle functionality
function setupHamburgerMenu() {
  const hamburgerBtn = document.querySelector("#menu");
  const navigationMenu = document.querySelector(".nav-links");

  if (!hamburgerBtn || !navigationMenu) {
    console.warn("Hamburger menu elements not found.");
    return;
  }

  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("open");
    navigationMenu.classList.toggle("open");
  });
}

// Highlight the current nav link
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
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

function updateWindowWidthDisplay() {
  const width = getCurrentWindowWidth();
  const displayElement = document.querySelector("#windowWidth");

  if (displayElement) {
    displayElement.textContent = `${width}px`;
  } else {
    // console.warn("Element with ID 'windowWidth' not found.");
  }
}

function updateWindowHeightDisplay() {
  const height = getCurrentWindowHeight();
  const displayElement = document.querySelector("#windowHeight");

  if (displayElement) {
    displayElement.textContent = `${height}px`;
  } else {
    // console.warn("Element with ID 'windowHeight' not found.");
  }
}

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

window.addEventListener("load", updateWindowWidthDisplay);
window.addEventListener("resize", updateWindowWidthDisplay);

window.addEventListener("load", updateWindowHeightDisplay);
window.addEventListener("resize", updateWindowHeightDisplay);
