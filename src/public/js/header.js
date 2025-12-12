document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("login-link");
    const logoutBtn = document.getElementById("logout-btn");
    const userType = localStorage.getItem("userType");

    if (!loginLink || !logoutBtn) return;

    if (userType === "Admin") {
        loginLink.textContent = "Dashboard";
        loginLink.href = "/pages/dashboard.html";
        logoutBtn.style.display = "inline"; // show logout for admin too
    } else if (userType) {
        loginLink.textContent = "Profile";
        loginLink.href = "/pages/profile.html";
        logoutBtn.style.display = "inline"; // show logout for clients
    } else {
        loginLink.textContent = "Login";
        loginLink.href = "/pages/login.html";
        logoutBtn.style.display = "none"; // hide logout if not logged in
    }

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userType"); // clear login state
        window.location.href = "/index.html"; // redirect to home
    });
});
