document.addEventListener("DOMContentLoaded", async () => {
    await loadHeaderAndFooter();
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
});

export async function loadHeaderAndFooter() {
    const basePath = window.location.pathname.includes("/pages/") ? "../partials/" : "partials/";

    await loadTemplate(`${basePath}header.html`, "#header-container");
    setupHamburgerMenu(); // moved here after content loads
    setActiveNavLink();

    await loadTemplate(`${basePath}footer.html`, "#footer-container");
    updateFooterInfo();
}

async function loadTemplate(url, containerSelector) {
    try {
        const container = document.querySelector(containerSelector);
        if (!container || container.hasChildNodes()) return;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        container.innerHTML = await response.text();
    } catch (error) {
        console.error(`Error loading template: ${error.message}`);
    }
}

export function setupHamburgerMenu() {
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

export function setActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;

        if (linkPath === currentPath || (linkPath.endsWith("index.html") && currentPath === "/")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

export function updateFooterInfo() {
    const yearElement = document.querySelector(".currentyear");
    const modifiedElement = document.querySelector("#lastModified");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (modifiedElement) {
        modifiedElement.textContent = getFormattedLastModified();
    }
}

export function getFormattedLastModified() {
    const lastModified = new Date(document.lastModified);
    const dateFormat = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = lastModified.toLocaleDateString("en-US", dateFormat);
    const formattedTime = lastModified.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return `${formattedDate} ${formattedTime}`;
}
