// public/js/login.js
function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) {
    console.warn("Login form not found yet.");
    return;
  }

  // Prevent duplicate listeners if the observer re-triggers
  if (loginForm.dataset.bound === "true") return;
  loginForm.dataset.bound = "true";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
      const response = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("✅ " + data.message);
        // Optional redirect:
        // window.location.href = "/dashboard.html";
      } else {
        alert("❌ " + (data.error || "Login failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
  });
}

// Run after window load
window.addEventListener("load", () => {
  initLoginForm();

  // Watch for dynamic content (like your header/footer loading)
  const observer = new MutationObserver(() => {
    initLoginForm();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
