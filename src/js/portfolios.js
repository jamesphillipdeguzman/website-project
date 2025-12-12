document.addEventListener("DOMContentLoaded", () => {
  fetchPortfolios();
});

async function fetchPortfolios() {
  try {
    const res = await fetch("/.netlify/functions/get-portfolios");
    if (!res.ok) throw new Error("Failed to fetch portfolios");

    const portfolios = await res.json();
    setupPortfolioCarousel(portfolios);
  } catch (err) {
    console.error(err);
  }
}

function setupPortfolioCarousel(portfolios) {
  const container = document.getElementById("portfolio-carousel");
  const dropdown = document.getElementById("my-portfolios");

  if (!container || !dropdown) return;

  container.innerHTML = "";
  dropdown.innerHTML = '<option value="">Select a portfolio</option>';

  portfolios.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.title;
    opt.textContent = p.title;
    dropdown.appendChild(opt);

    const card = document.createElement("div");
    card.className = "card";
    card.style = "min-width: 300px; max-width: 300px; flex-shrink: 0;";
    card.setAttribute("data-title", p.title);
    card.innerHTML = `
      <a href="${p.project_link}" target="_blank">
        <img src="${p.image_url}" alt="${p.title}" style="width: 100%; border-radius: 5px;" loading="lazy">
      </a>
      <div class="databox" style="padding: 10px;">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    `;
    container.appendChild(card);
  });

  dropdown.addEventListener("change", () => {
    const selected = container.querySelector(`[data-title="${dropdown.value}"]`);
    if (selected) selected.scrollIntoView({ behavior: "smooth", inline: "center" });
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
