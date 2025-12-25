document.addEventListener("DOMContentLoaded", () => {
  fetchPortfolios();
});

async function fetchPortfolios() {
  try {
    const res = await fetch("/.netlify/functions/get-portfolios");
    if (!res.ok) throw new Error("Failed to fetch portfolios");

    const portfolios = await res.json();
    setupPortfolioCarousel(portfolios);
    populatePortfolioDropdown(portfolios); // ← correct function name
  } catch (err) {
    console.error(err);
  }
}

// existing carousel setup...
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
    container.scrollBy({ left: -200, behavior: "smooth" });
  });
  btnNext.addEventListener("click", () => {
    container.scrollBy({ left: 200, behavior: "smooth" });
  });
}

// NEW: populate any <select id="dynamic-product">
function populatePortfolioDropdown(portfolios) {
  const dropdown = document.getElementById("dynamic-product");

  // Only insert display container if it doesn't exist yet
  let displayContainer = document.getElementById("portfolio-display");
  if (!displayContainer) {
    displayContainer = document.createElement("div");
    displayContainer.id = "portfolio-display";
    displayContainer.style =
      "margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;";
    dropdown.parentNode.insertBefore(displayContainer, dropdown);
  }

  dropdown.innerHTML =
    '<option value="" disabled selected>Select a portfolio...</option>';

  portfolios.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.title;
    option.textContent = p.title;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", () => {
    const selected = portfolios.find((p) => p.title === dropdown.value);
    if (selected) showPortfolio(selected, displayContainer);
  });
}

function showPortfolio(portfolio, container) {
  container.innerHTML = `
    <h3>${portfolio.title}</h3>
    <a href="${portfolio.project_link}" target="_blank">
      <img src="${portfolio.image_url}" alt="${portfolio.title}"
        style="
          width: 100%;
          max-width: 100vw;
          height: auto;
          object-fit: cover;
          border-radius: 5px;
          display: block;
          margin: 10px auto;
        " />
    </a>
    <p>${portfolio.description}</p>
  `;
}
