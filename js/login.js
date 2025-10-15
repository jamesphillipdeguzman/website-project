// login.js
function initLoginForm() {
  const loginForm = document.querySelector("#loginForm");
  if (!loginForm) {
    console.warn("Login form not found yet.");
    return;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Your login logic here
    console.log("Login submitted");
  });
}

// Run after window load
window.addEventListener("load", () => {
  // Try immediately
  initLoginForm();

  // Also observe DOM in case form is loaded dynamically later
  const observer = new MutationObserver(() => {
    initLoginForm();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
