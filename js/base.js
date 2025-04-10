// utils.mjs assumed to export these:
// - updateFooterInfo()
// - setupHamburgerMenu()
// - getFormattedLastModified()
// - loadHeaderAndFooter()

import { loadHeaderAndFooter, setupHamburgerMenu, getFormattedLastModified } from './utils.mjs';

// DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', () => {
  initDate();
  setupHamburgerMenu(); // replaces initMenuToggle
  populateProductDropdown();
  setupButtons();
  setupFormSubmission();
  loadPortfolioList(); // Load portfolio list for dropdown
  setupPortfolio();
  //handleLocalStorage();
  loadHeaderAndFooter(); // Load header and footer content
});

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
  const selector = document.getElementById('dynamic-product');

  if (selector) {
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product;
      option.textContent = product;
      selector.appendChild(option);
    });
  }
}

function handleLocalStorage() {
  const todayDisplay = document.querySelector('#today');
  const searchDisplay = document.querySelector('#search');
  let numSearch = Number(localStorage.getItem('search-ls')) || 0;

  searchDisplay.textContent = numSearch ? numSearch : `Welcome to our site!`;
  localStorage.setItem('search-ls', ++numSearch);
  if (todayDisplay) todayDisplay.textContent = Date.now();
}

function setupButtons() {
  document.querySelector('.signup-btn')?.addEventListener('click', () => {
    window.location.href = '/pages/signup.html';
  });

  document.querySelector('#review-btn')?.addEventListener('click', () => {
    window.location.href = '/pages/review.html';
  });
}

function setupFormSubmission() {
  const submit = document.querySelector('#submit');
  const firstName = document.querySelector('#firstname');
  const lastName = document.querySelector('#lastname');
  const email = document.querySelector('#email');

  if (submit) {
    submit.addEventListener('click', (event) => {
      event.preventDefault();
      if (firstName?.value && lastName?.value && email?.value) {
        window.location.href = 'thanks.html';
      }
    });
  }
}

async function loadPortfolioList () {
  const dropdown2 = document.querySelector('.form-group select');

  if(!dropdown2) return;
  try {
    const res = await fetch('/json/portfolios.json');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const portfolios = await res.json();

    // Use template literals to populate the dropdown options
    dropdown2.innerHTML = '<option value="">Select a portfolio</option>'; // Clear and add default option
    portfolios.forEach(p => {
      dropdown2.innerHTML += `<option value="${p.pTitle}">${p.pTitle}</option>`;
    });

    
  } catch (err) {
    alert('Failed to load portfolio:', err);
  }
}

async function setupPortfolio() {
  
  const dropdown = document.querySelector('.dropdown-container select');
  const loadIt = document.querySelector('.image-loader');

  if (!dropdown || !loadIt) return;

  try {
    const res = await fetch('/json/portfolios.json');
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const portfolios = await res.json();

    // Use template literals to populate the dropdown options
    
    dropdown.innerHTML = '<option value="">Select a portfolio</option>'; // Clear and add default option
    portfolios.forEach(p => {
      dropdown.innerHTML += `<option value="${p.pTitle}">${p.pTitle}</option>`;
    });

   
    dropdown.addEventListener('change', () => {
      const selected = portfolios.find(p => p.pTitle === dropdown.value);
      if (selected) loadPortfolioCard(selected, loadIt);
    });
  } catch (err) {
    alert('Failed to load portfolio:', err);
  }
}

function loadPortfolioCard(portfolio, container) {
  container.innerHTML = ''; // Clear previous content

  // Use template literals to create portfolio card
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
          <div style="font-weight: bold; margin-right: 8px; min-width: 100px;">File Name:</div>
          <div>${portfolio.fileName}</div>
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


function createDataRow(label, text) {
  const row = document.createElement('div');
  row.className = 'row';
  row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';

  const col1 = document.createElement('div');
  col1.textContent = `${label}: `;
  col1.style.cssText = 'font-weight: bold; margin-right: 8px; min-width: 100px;';

  const col2 = document.createElement('div');
  col2.textContent = text;

  row.appendChild(col1);
  row.appendChild(col2);

  return row;
}
