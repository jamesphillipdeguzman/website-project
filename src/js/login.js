document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  const loginModal = document.getElementById("login-modal");
  const loginBackdrop = document.getElementById("login-backdrop");
  const closeLogin = document.getElementById("close-login");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("login-message");

  // Open modal
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("hidden");
    loginBackdrop.classList.add("show");
  });

  // Close modal
  const closeModal = () => {
    loginModal.classList.add("hidden");
    loginBackdrop.classList.remove("show");
  };

  closeLogin.addEventListener("click", closeModal);
  loginBackdrop.addEventListener("click", closeModal);

  // Handle login form submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    message.textContent = "Logging in...";

    try {
      const response = await fetch("/.netlify/functions/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        message.textContent = `Welcome ${data.name}! (${data.user_type})`;
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(closeModal, 1500);
      } else {
        message.textContent = data.error || "Invalid login.";
      }
    } catch (err) {
      message.textContent = "Server error. Please try again later.";
    }
  });
});
