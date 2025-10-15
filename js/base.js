// utils.mjs assumed to export these:
// - updateFooterInfo()
// - setupHamburgerMenu()
// - getFormattedLastModified()
// - loadHeaderAndFooter()

import { getFormattedLastModified } from "./utils.mjs";

// Portfolio data as an array literal

const portfolios = [
  {
    id: "P1",
    pTitle: "Place page",
    fileName: "place.html",
    sourceImg: "/images/project-images/portfolio-1.webp",
    description:
      "This website portfolio uses picture and srcset in order to load different picture sizes. The site is about my dream destination, Banaue Rice Terraces in the Philippines!",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/place.html",
  },
  {
    id: "P2",
    pTitle: "WDD131 home page",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-2.webp",
    description:
      "This is a simple HTML personal homepage I've created for my course Dynamic Web Fundamentals (WDD131) in BYU-Idaho Spring Semester 2024.",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/index.html",
  },
  {
    id: "P3",
    pTitle: "Filtered temples page",
    fileName: "filtered-temples.html",
    sourceImg: "/images/project-images/portfolio-3.webp",
    description:
      "This website portfolio uses filtering of array objects in JavaScript.",
    imageURL:
      "https://jamesphillipdeguzman.github.io/wdd131/filtered-temples.html",
  },
  {
    id: "P4",
    pTitle: "Unfiltered temples page",
    fileName: "temples.html",
    sourceImg: "/images/project-images/portfolio-4.webp",
    description:
      "This website portfolio is the beta version of the Filtered Temples page.",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd131/temples.html",
  },
  {
    id: "P5",
    pTitle: "Holy grail layout (practice)",
    fileName: "holy-grail-layout-flex.html",
    sourceImg: "/images/project-images/portfolio-5.webp",
    description:
      "This is only a practice website to create my first holy grail layout in HTML.",
    imageURL:
      "https://jamesphillipdeguzman.github.io/wdd131/csspractice/holy-grail-layout-flex.html",
  },
  {
    id: "P6",
    pTitle: "Whitewater rafting site (WDD130)",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-6.webp",
    description:
      "This website portfolio is my project in Web Fundamentals (WDD130).",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd130/wwr/index.html",
  },
  {
    id: "P7",
    pTitle: "Course Home Page (WDD231)",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-7.webp",
    description: "This is my course home page (WDD231).",
    imageURL: "https://jamesphillipdeguzman.github.io/wdd231/index.html",
  },
  {
    id: "P8",
    pTitle: "Chamber Home Page (WDD231)",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-8.webp",
    description: "This is the Iloilo Chamber home page (WDD231).",
    imageURL:
      "https://jamesphillipdeguzman.github.io/wdd231/chamber/index.html",
  },
  {
    id: "P9",
    pTitle: "Quote Vitamins",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-9.webp",
    description: "My final project in WDD231.",
    imageURL:
      "https://jamesphillipdeguzman.github.io/wdd231/web-project/index.html",
  },
  {
    id: "P10",
    pTitle: "SleepOutside (WDD330-Team Project)",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-10.webp",
    description:
      "SleepOutside is an e-commerce website that sells outdoor camping gears. This is our team project in WDD330.",
    imageURL: "https://sleepoutside2.netlify.app/",
  },
  {
    id: "P11",
    pTitle: "Foodexer (WDD330)",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-11.webp",
    description: "This is my final project in WDD330 - Food and Exercise API",
    imageURL: "https://foodexer.netlify.app/",
  },
  {
    id: "P12",
    pTitle: "Ralteen Fiel",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-12.webp",
    description: "A mystery game web app about Ralteen Fiel",
    imageURL: "https://ralteenfiel.netlify.app/",
  },
  {
    id: "P13",
    pTitle: "Deeday",
    fileName: "index.html",
    sourceImg: "/images/project-images/portfolio-13.webp",
    description: "Family Birthday Tracker App",
    imageURL: "https://deeday.netlify.app/",
  },
  {
    id: "P14",
    pTitle: "Simple POS API (CSE341)",
    fileName: "app.js",
    sourceImg: "/images/project-images/portfolio-14.webp",
    description: "My First API project",
    imageURL: "https://simple-pos-api.netlify.app/",
  },
  {
    id: "P15",
    pTitle: "Store POS API (CSE341-Team Project)",
    fileName: "app.js",
    sourceImg: "/images/project-images/portfolio-15.webp",
    description: "My Full Store API team project in CSE341",
    imageURL: "https://store-pos-api.netlify.app/",
  },
];

// DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", () => {
  checkNeonDB();

  initDate();
  //setupHamburgerMenu(); // replaces initMenuToggle
  populateProductDropdown();
  setupButtons();
  // setupFormSubmission();
  loadPortfolioList(); // Load portfolio list for dropdown
  setupPortfolio();
  setupPortfolioCarousel(); // Load portfolio carousel
  loadQuoteModal(); // Load quote modal)
  //handleLocalStorage();
  // loadHeaderAndFooter(); // Load header and footer content
});

function checkNeonDB() {
  fetch("/.netlify/functions/query-db")
    .then((res) => res.json())
    .then((data) => {
      const div = document.createElement("div");
      div.textContent = "✅ Neon database connected successfully!";
      div.style =
        "padding: 10px; background: #e8f5e9; color: #2e7d32; border-radius: 6px; margin: 10px;";
      document.body.prepend(div);
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
