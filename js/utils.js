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
      targetElement.innerHTML = html;
      console.log(`Successfully loaded template into ${targetId}`);
    } else {
      console.error(`Target element ${targetId} not found`);
    }
  } catch (error) {
    console.error("Error loading template:", error);
  }
}

async function loadHeaderAndFooter() {
  // Use relative path based on current page location
  const basePath = window.location.pathname.includes("/pages/")
    ? "../public/partials/"
    : "/public/partials/";
  console.log("Base path for templates:", basePath);

  await loadTemplate(`${basePath}header.html`, "#header-container");
  setupHamburgerMenu(); // moved here after content loads
  setActiveNavLink();

  await loadTemplate(`${basePath}footer.html`, "#footer-container");
  updateFooterInfo();
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderAndFooter();
  document.body.classList.remove("loading");
  document.body.classList.add("loaded");
});

// Setup hamburger toggle functionality
function setupHamburgerMenu() {
  const hamburgerBtn = document.querySelector("#menu");
  const navigationMenu = document.querySelector(".nav-links");

  if (!hamburgerBtn || !navigationMenu) {
    alert("Hamburger menu elements not found.");
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

// Update footer info like year and last modified
function updateFooterInfo() {
  const yearElement = document.querySelector(".currentyear");
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
    // second: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
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
