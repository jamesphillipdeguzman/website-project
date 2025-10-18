// public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) {
    console.error("❌ Login form not found!");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/.netlify/functions/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();
      console.log("🔍 Login response:", data);

      if (response.ok) {
        alert("✅ " + data.message);

        // Store minimal safe info
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userType", data.userType);

        // ✅ Ensure correct relative path
        let redirectUrl; // declare once

        if (data.userType === "Admin") {
          redirectUrl = "/pages/dashboard.html"; // adjust if needed
        } else {
          redirectUrl = "/index.html"; // adjust if needed
        }

        console.log("➡️ Redirecting to:", redirectUrl);

        // Use a short delay to ensure alert closes first
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      } else {
        alert("❌ " + (data.error || "Login failed"));
      }
    } catch (error) {
      console.error("🚨 Login error:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});
