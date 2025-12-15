// src/js/footer.js
const footerContainer = document.getElementById("footer-container");

async function loadFooter() {
  // 1. Render cached footer immediately
  const cached = localStorage.getItem("footerHTML");
  if (cached) {
    footerContainer.innerHTML = cached;
  }

  // 2. Fetch latest footer asynchronously
  try {
    const res = await fetch("/partials/footer.html");
    if (!res.ok) throw new Error("Failed to load footer");
    const html = await res.text();

    // Only update if different
    if (html !== cached) {
      footerContainer.innerHTML = html;
      localStorage.setItem("footerHTML", html);
    }
  } catch (err) {
    console.error(err);
  }
}

// Load footer
loadFooter();
