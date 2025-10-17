// portfolios.js
import portfolios from "./portfolios-data.mjs";

document.addEventListener("DOMContentLoaded", () => {
  setupPortfolioCarousel();
});

function setupPortfolioCarousel() {
  const container = document.getElementById("portfolio-carousel");
  const dropdown = document.getElementById("my-portfolios");

  if (!container || !dropdown) return;

  // Clear previous content
  container.innerHTML = "";
  dropdown.innerHTML = '<option value="">Select a portfolio</option>';

  portfolios.forEach((p) => {
    // Dropdown option
    const opt = document.createElement("option");
    opt.value = p.pTitle;
    opt.textContent = p.pTitle;
    dropdown.appendChild(opt);

    // Carousel card
    const card = document.createElement("div");
    card.className = "card";
    card.style = "min-width: 300px; max-width: 300px; flex-shrink: 0;";
    card.setAttribute("data-title", p.pTitle);
    card.innerHTML = `
      <a href="${p.imageURL}" target="_blank">
        <img src="${p.sourceImg}" alt="${p.pTitle}" style="width: 100%; border-radius: 5px;" loading="lazy">
      </a>
      <div class="databox" style="padding: 10px;">
        <h3>${p.pTitle}</h3>
        <p><strong>${p.id}</strong></p>
        <p>${p.description}</p>
      </div>
    `;
    container.appendChild(card);
  });

  // Scroll to selected card
  dropdown.addEventListener("change", () => {
    const selected = container.querySelector(
      `[data-title="${dropdown.value}"]`,
    );
    if (selected)
      selected.scrollIntoView({ behavior: "smooth", inline: "center" });
  });

  setupCarouselButtons();
}

function setupCarouselButtons() {
  const container = document.getElementById("portfolio-carousel");
  const btnPrev = document.querySelector(".carousel-btn.prev");
  const btnNext = document.querySelector(".carousel-btn.next");

  if (!container || !btnPrev || !btnNext) return;

  btnPrev.addEventListener("click", () => {
    container.scrollBy({ left: -300, behavior: "smooth" });
  });
  btnNext.addEventListener("click", () => {
    container.scrollBy({ left: 300, behavior: "smooth" });
  });
}
