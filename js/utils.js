
// async function loadHeaderAndFooter() {
//     const basePath = window.location.pathname.includes("/pages/") ? "../partials/" : "partials/";

//     await loadTemplate(`${basePath}header.html`, "#header-container");
//     setupHamburgerMenu(); // moved here after content loads
//     setActiveNavLink();

//     await loadTemplate(`${basePath}footer.html`, "#footer-container");
//     updateFooterInfo();
// }

document.addEventListener("DOMContentLoaded", () => {
    
    setupHamburgerMenu();
    setActiveNavLink();
    updateFooterInfo();

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
        second: "2-digit",
        hour12: true
    });

    return `${formattedDate} ${formattedTime}`;
}
