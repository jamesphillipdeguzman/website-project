// public/js/header.js
document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");

    if (!loginLink) return;

    const userType = localStorage.getItem("userType");

    if (userType === "Admin") {
        loginLink.textContent = "Dashboard";
        loginLink.href = "/pages/dashboard.html";
    } else if (userType) {
        // Optional: logged-in non-admin users could have a profile page
        loginLink.textContent = "Profile";
        loginLink.href = "/pages/profile.html";
    } else {
        // Default: not logged in
        loginLink.textContent = "Login";
        loginLink.href = "/pages/login.html";
    }
});
