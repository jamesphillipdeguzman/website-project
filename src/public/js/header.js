// public/js/header.js
document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const userType = localStorage.getItem("userType");
    const currentPath = window.location.pathname;

    if (!loginLink) return;

    if (userType === "Admin") {
        loginLink.textContent = "Dashboard";
        loginLink.href = "/pages/dashboard.html";
    } else if (userType === "Client") {
        loginLink.textContent = "Logout";
        loginLink.href = "/pages/logout.html";
    } else {
        loginLink.textContent = "Login";
        loginLink.href = "/pages/login.html";
        localStorage.removeItem("userType");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
    }

    // Highlight active link
    document.querySelectorAll(".nav-links a").forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});
