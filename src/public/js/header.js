// public/js/header.js
document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const userType = localStorage.getItem("userType");
    const currentPath = window.location.pathname; // e.g., /pages/dashboard.html

    if (loginLink) {
        if (userType === "Admin") {
            loginLink.textContent = "Dashboard";
            loginLink.href = "/pages/dashboard.html";
        } else if (userType === "Client") {
            loginLink.textContent = "Logout";
            loginLink.href = "/pages/logout.html";
        } else {
            loginLink.textContent = "Login";
            loginLink.href = "/pages/login.html";

            // Clear user info just in case
            localStorage.removeItem("userType");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
        }
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
        const linkPath = link.getAttribute("href");

        // Dashboard section includes dashboard.html and new-project.html
        const isDashboardSection = linkPath.includes("dashboard") &&
            (currentPath.includes("dashboard") || currentPath.includes("new-project"));

        const isPortfolioSection = linkPath.includes("portfolio") && currentPath.includes("portfolio");

        if (isDashboardSection || isPortfolioSection || linkPath === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });


});


