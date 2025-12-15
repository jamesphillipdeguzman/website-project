// src/js/header.js
const headerContainer = document.getElementById("header-container");

async function loadHeader() {
  const cached = localStorage.getItem("headerHTML");

  if (cached) {
    headerContainer.innerHTML = cached;
    activateNavLinks();
  } else {
    try {
      const res = await fetch("/partials/header.html");
      if (!res.ok) throw new Error("Failed to load header");
      const html = await res.text();
      headerContainer.innerHTML = html;
      localStorage.setItem("headerHTML", html);
      activateNavLinks();
    } catch (err) {
      console.error(err);
    }
  }
}

// Optional: highlight active nav link
function activateNavLinks() {
  const path = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href").includes(path));
  });
}

loadHeader();
