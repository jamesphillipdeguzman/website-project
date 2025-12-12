// public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const loginMessage = document.getElementById("login-message"); // optional <p> for messages

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
      const response = await fetch(`${window.location.origin}/.netlify/functions/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔍 Login response:", data);

      if (response.ok) {
        const user = data.user; // Extract nested user object

        // Store minimal safe info
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userType", user.user_type);

        alert("✅ " + data.message);

        // Redirect based on user type
        const redirectUrl = user.user_type === "Admin" ? "/pages/dashboard.html" : "/index.html";
        console.log("➡️ Redirecting to:", redirectUrl);

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);

      } else {
        alert("❌ " + (data.error || "Login failed"));
      }
    } catch (err) {
      console.error("🚨 Login error:", err);
      alert("Something went wrong. Please try again later.");
    }
  });
});
