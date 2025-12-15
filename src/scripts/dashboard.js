document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Load username
  const nameEl = document.getElementById("user-name");
  const storedName = localStorage.getItem("userName");
  if (nameEl) nameEl.textContent = storedName || "Guest";

  // 2️⃣ Fetch and display site visit count
  const visitEl = document.querySelector(
    ".dashboard-content .card:first-child p",
  );
  if (visitEl) {
    fetch("/.netlify/functions/visit-count")
      .then((res) => res.json())
      .then((data) => {
        visitEl.textContent = data.count;
      })
      .catch((err) => {
        console.error("Failed to load site visit count:", err);
        visitEl.textContent = "N/A";
      });
  }

  // 3️⃣ Logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
      window.location.href = "/pages/login.html";
    });
  }

  // 4️⃣ Add new project redirect (optional)
  const addProjectBtn = document.getElementById("add-project-btn");
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", () => {
      window.location.href = "/pages/new-project.html";
    });
  }

  // TODO: add more dashboard-related logic here (e.g., analytics, cards)
});
