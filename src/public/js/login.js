// /public/js/login.js
// ===============================
// LOGIN HANDLER (SINGLE BIND)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  // Guard: page does not have login form
  if (!form) return;

  // Guard: prevent double binding
  if (form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  form.addEventListener("submit", handleLogin);
});

// ===============================
// LOGIN FUNCTION
// ===============================
async function handleLogin(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if (!email || !password) {
    alert("⚠️ Please enter email and password.");
    return;
  }

  disableForm(form, true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`❌ ${data.error || "Login failed"}`);
      disableForm(form, false);
      return;
    }

    // ✅ LOGIN SUCCESS
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.name) {
        localStorage.setItem("user_name", data.user.name);
      }
    }

    // Redirect to pages/dashboard.html
    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Network or server error.");
    disableForm(form, false);
  }
}

// ===============================
// UI HELPERS
// ===============================
function disableForm(form, disabled) {
  [...form.elements].forEach((el) => {
    el.disabled = disabled;
  });
}
