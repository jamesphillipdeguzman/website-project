// utils.mjs
import {
  setupHamburgerMenu,
  setActiveNavLink,
  getFormattedLastModified,
  updateHeaderAndFooter,
  updateFooterInfo,
  updateWindowWidthDisplay,
  updateWindowHeightDisplay,
} from "./utils.mjs";

import portfolios from "./portfolios-data.mjs"; // added

function checkNeonDB() {
  fetch("/.netlify/functions/query-db")
    .then((res) => res.json())
    .then((data) => {
      const div = document.createElement("div");
      // div.textContent = "✅ Connected to DB!";
      // div.style =
      //   "padding: 10px; background: #e8f5e9; color: #2e7d32; border-radius: 6px; margin: 10px;";
      // document.body.prepend(div);
    })
    .catch((err) => {
      const div = document.createElement("div");
      div.textContent =
        "❌ Failed to connect to Neon database. Check console for details.";
      div.style =
        "padding: 10px; background: #ffebee; color: #c62828; border-radius: 6px; margin: 10px;";
      document.body.prepend(div);
    });
}

function initDate() {
  const modifiedElement = document.getElementById("lastModified");
  const yearElement = document.querySelector("#currentyear");

  if (modifiedElement) modifiedElement.innerHTML = getFormattedLastModified();
  if (yearElement) {
    const year = new Date().getFullYear();
    yearElement.innerHTML = `<span class="highlight">${year}</span>`;
  }
}

function populateProductDropdown() {
  const products = ["Product 1", "Product 2", "Product 3"];
  const selector = document.getElementById("dynamic-product");

  if (selector) {
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product;
      option.textContent = product;
      selector.appendChild(option);
    });
  }
}

function handleLocalStorage() {
  const todayDisplay = document.querySelector("#today");
  const searchDisplay = document.querySelector("#search");
  let numSearch = Number(localStorage.getItem("search-ls")) || 0;

  searchDisplay.textContent = numSearch ? numSearch : `Welcome to our site!`;
  localStorage.setItem("search-ls", ++numSearch);
  if (todayDisplay) todayDisplay.textContent = Date.now();
}

function setupButtons() {
  document.querySelector("#signup-btn")?.addEventListener("click", () => {
    window.location.href = "/pages/signup.html";
  });

  document.querySelector("#review-btn")?.addEventListener("click", () => {
    window.location.href = "/pages/review.html";
  });
}

function setupFormSubmission() {
  const submit = document.querySelector("#submit");
  const firstName = document.querySelector("#firstname");
  const lastName = document.querySelector("#lastname");
  const email = document.querySelector("#email");

  if (submit) {
    submit.addEventListener("click", (event) => {
      event.preventDefault();
      if (firstName?.value && lastName?.value && email?.value) {
        window.location.href = "thanks.html";
      }
    });
  }
}

function loadPortfolioList() {
  const dropdown2 = document.querySelector(".form-group select");

  if (!dropdown2) return;

  dropdown2.innerHTML = '<option value="">Select a portfolio</option>'; // Clear and add default option
  portfolios.forEach((p) => {
    dropdown2.innerHTML += `<option value="${p.pTitle}">${p.pTitle}</option>`;
  });
}

function setupPortfolio() {
  const dropdown = document.querySelector(".dropdown-container select");
  const loadIt = document.querySelector(".image-loader");

  if (!dropdown || !loadIt) return;

  dropdown.innerHTML = '<option value="">Select a portfolio</option>'; // Clear and add default option
  portfolios.forEach((p) => {
    dropdown.innerHTML += `<option value="${p.pTitle}">${p.pTitle}</option>`;
  });

  dropdown.addEventListener("change", () => {
    const selected = portfolios.find((p) => p.pTitle === dropdown.value);
    if (selected) loadPortfolioCard(selected, loadIt);
  });
}

function loadPortfolioCard(portfolio, container) {
  container.innerHTML = ""; // Clear previous content

  const cardHTML = `
    <div class="card" style="display: flex; flex-direction: column; margin: 0 auto; line-height: 25px; border-radius: 5px;">
      <a href="${portfolio.imageURL}">
        <img src="${portfolio.sourceImg}" alt="${portfolio.pTitle}" loading="lazy" style="width: 100%; border-radius: 5px;">
      </a>
      <div class="databox" style="margin: 15px; padding: 15px; max-width: 305px; text-align: left; gap: 10px;">
        <div class="row" style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="font-weight: bold; margin-right: 8px; min-width: 100px;">Title:</div>
          <div>${portfolio.pTitle}</div>
        </div>
        <div class="row" style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="font-weight: bold; margin-right: 8px; min-width: 100px;">URL:</div>
          <div><a href="${portfolio.imageURL}" alt="${portfolio.pTitle}">${portfolio.imageURL}</a></div>
        </div>
        <div class="row" style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="font-weight: bold; margin-right: 8px; min-width: 100px;">Description:</div>
          <div>${portfolio.description}</div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = cardHTML; // Append the generated HTML to the container
}

function setupPortfolioCarousel() {
  const container = document.getElementById("portfolio-carousel");
  const dropdown = document.getElementById("my-portfolios");

  if (!container || !dropdown) return;

  // Populate the dropdown
  dropdown.innerHTML = '<option value="">Select a portfolio</option>';
  portfolios.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.pTitle;
    opt.textContent = p.pTitle;
    dropdown.appendChild(opt);
  });

  // Render the carousel cards
  portfolios.forEach((p) => {
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
  dropdown.addEventListener("change", function () {
    const selected = container.querySelector(
      `[data-title="${dropdown.value}"]`,
    );
    if (selected) {
      selected.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
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
function loadQuoteModal() {
  const quoteModal = document.querySelector("#quote-modal");
  const closeBtn = document.querySelector("#close-btn");
  const getQuoteBtn = document.querySelector("#get-quote-btn");
  const quoteBackdrop = document.querySelector("#quote-backdrop");

  if (!quoteModal || !closeBtn || !getQuoteBtn || !quoteBackdrop) return;

  // Open modal
  getQuoteBtn.addEventListener("click", () => {
    quoteModal.style.display = "block";
    getQuoteBtn.style.display = "none";
    quoteBackdrop.style.display = "block";
  });

  // Close with close button
  closeBtn.addEventListener("click", () => {
    quoteModal.style.display = "none";
    getQuoteBtn.style.display = "block";
    quoteBackdrop.style.display = "none";
  });

  // Close with backdrop click
  quoteBackdrop.addEventListener("click", () => {
    quoteModal.style.display = "none";
    getQuoteBtn.style.display = "block";
    quoteBackdrop.style.display = "none";
  });
}

// DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", () => {
  setupHamburgerMenu(); // hamburger toggle
  setActiveNavLink(); // highlight active page
  initDate(); // update footer date/last modified
  checkNeonDB();
  populateProductDropdown();
  setupButtons();
  loadPortfolioList();
  setupPortfolio();
  setupPortfolioCarousel();
  loadQuoteModal();
});

// ============================
// Robust Quote & Signup Handling
// ============================

// Delegated click listener for dynamically added buttons
document.addEventListener("click", (e) => {
  const quoteBtn = e.target.closest("#get-quote-btn");
  const signupBtn = e.target.closest("#signup-btn");
  const quoteModal = document.querySelector("#quote-modal");
  const quoteBackdrop = document.querySelector("#quote-backdrop");

  // --- Quote Button ---
  if (quoteBtn && quoteModal && quoteBackdrop) {
    quoteModal.style.display = "block";
    quoteBtn.style.display = "none";
    quoteBackdrop.style.display = "block";
  }

  // --- Signup Button ---
  if (signupBtn) {
    window.location.href = "/pages/signup.html";
  }

  // --- Close Quote Modal ---
  if (e.target.closest("#close-btn") || e.target.closest("#quote-backdrop")) {
    if (
      quoteModal &&
      quoteBackdrop &&
      document.querySelector("#get-quote-btn")
    ) {
      quoteModal.style.display = "none";
      document.querySelector("#get-quote-btn").style.display = "inline-block";
      quoteBackdrop.style.display = "none";
    }
  }
});
