document.addEventListener("DOMContentLoaded", () => {
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
    {
      id: "P16",
      pTitle: "CSE Motors (CSE340-Web Backend Dev)",
      fileName: "app.js",
      sourceImg: "/images/project-images/portfolio-16.webp",
      description: "Backend web project in CSE340",
      imageURL: "https://cse340-backend-ogrs.onrender.com/",
    },
  ];

  const dynamicPortfolio =
    document.querySelector("#portfolio-select") ||
    document.querySelector("#dynamic-product");
  const reviewForm = document.querySelector("#review-form");
  const reviewBtn = document.querySelector("#review-btn");
  const submitDisplay = document.querySelector("#submit-count");
  let activePortfolios = [...portfolios];

  // Fetch real-time portfolio list if available, or fall back to static list
  async function loadPortfolioData() {
    try {
      const res = await fetch("/api/portfolios");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          activePortfolios = data.map((item) => ({
            id: item.id,
            pTitle: item.title || item.pTitle,
            title: item.title || item.pTitle,
            sourceImg: item.image_url || item.sourceImg,
            imageURL: item.project_link || item.imageURL,
            description: item.description,
          }));
        }
      }
    } catch (err) {
      console.warn("Using default portfolios data list:", err);
    }
    populateDropdown();
  }

  // Populate the dropdown list with portfolio values
  function populateDropdown() {
    if (!dynamicPortfolio) return;
    dynamicPortfolio.innerHTML =
      '<option value="" disabled selected>Select a portfolio...</option>';
    activePortfolios.forEach((portfolio) => {
      const option = document.createElement("option");
      option.value = portfolio.id;
      option.textContent = portfolio.pTitle || portfolio.title;
      dynamicPortfolio.appendChild(option);
    });
  }

  // Render selected portfolio preview card beneath or beside the dropdown
  function renderSelectedPortfolioPreview(selectedItem) {
    let displayContainer = document.getElementById("portfolio-display");
    if (!displayContainer && dynamicPortfolio) {
      displayContainer = document.createElement("div");
      displayContainer.id = "portfolio-display";
      displayContainer.className = "portfolio-preview-container";
      dynamicPortfolio.parentNode.insertBefore(
        displayContainer,
        document.querySelector(".stars-rating") || dynamicPortfolio.nextSibling
      );
    }

    if (!displayContainer) return;

    if (!selectedItem) {
      displayContainer.style.display = "none";
      displayContainer.innerHTML = "";
      return;
    }

    const title = selectedItem.pTitle || selectedItem.title || "Portfolio Project";
    const desc =
      selectedItem.description ||
      "Explore this modern web project showcase and review its design and usability.";
    const imgUrl =
      selectedItem.sourceImg ||
      selectedItem.image_url ||
      "/images/project-images/portfolio-1.webp";
    const link =
      selectedItem.imageURL || selectedItem.project_link || "#";

    displayContainer.style.display = "block";
    displayContainer.innerHTML = `
      <div class="portfolio-preview-card" style="margin: 1.25rem 0; padding: 1.25rem; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 1rem; backdrop-filter: blur(12px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h4 style="margin: 0; color: #ffffff; font-size: 1.15rem; font-weight: 700; font-family: var(--aether-font-display, inherit);">${title}</h4>
          ${link && link !== "#" ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; font-size: 0.82rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">Live Preview ↗</a>` : ""}
        </div>
        <div style="position: relative; border-radius: 0.75rem; overflow: hidden; margin-bottom: 0.75rem; aspect-ratio: 16/9; max-height: 220px; background: #070a13;">
          <img src="${imgUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'" />
        </div>
        <p style="margin: 0; color: #cbd5e1; font-size: 0.88rem; line-height: 1.55;">${desc}</p>
      </div>
    `;
  }

  // Initialize localStorage for submission count
  function lsSubmitCount() {
    let numSubmit = Number(window.localStorage.getItem("submit-ls")) || 0;
    if (submitDisplay) {
      submitDisplay.textContent = numSubmit || "0";
    }
    localStorage.setItem("submit-ls", numSubmit);
  }

  if (reviewBtn) {
    reviewBtn.disabled = true;
  }

  function checkFormValidity() {
    const portfolioSelected = dynamicPortfolio && dynamicPortfolio.value !== "";
    const selectedStar =
      document.querySelector('input[name="rating"]:checked') ||
      document.querySelector('input[name="stars"]:checked');
    const starsSelected = selectedStar !== null && selectedStar.value !== "";
    const dateInput = document.querySelector("#date-installed");
    const dateSelected = dateInput && dateInput.value !== "";

    if (reviewBtn) {
      reviewBtn.disabled = !(portfolioSelected && starsSelected && dateSelected);
    }

    checkFormEntry("select", portfolioSelected ? "present" : "missing");
    checkFormEntry("radio", starsSelected ? "present" : "missing");
    checkFormEntry("date", dateSelected ? "present" : "missing");
  }

  function checkFormEntry(field, status) {
    const errorContainer = document.querySelector(`#${field}-error-message`);
    if (!errorContainer) return;
    errorContainer.innerHTML = ""; // Clear previous error messages

    const errorMessage = document.createElement("p");
    errorMessage.className = "errMsg";

    switch (`${field}_${status}`) {
      case "select_missing":
        errorMessage.textContent = "Please select a portfolio.";
        break;
      case "radio_missing":
        errorMessage.textContent = "Please select a star rating.";
        break;
      case "date_missing":
        errorMessage.textContent = "Please enter the date.";
        break;
    }

    if (errorMessage.textContent) {
      errorContainer.appendChild(errorMessage);
    }
  }

  // Explicit star rating synchronizer
  function syncStarRating(value) {
    if (!value) return;

    // 1. Sync radio button checked state
    const radio =
      document.querySelector(`input[name="rating"][value="${value}"]`) ||
      document.querySelector(`input[name="stars"][value="${value}"]`);
    if (radio && !radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // 2. Sync hidden input if present
    const hiddenInput =
      document.querySelector('input[name="rating_value"]') ||
      document.querySelector('input[name="rating"][type="hidden"]');
    if (hiddenInput) {
      hiddenInput.value = value;
    }

    // 3. Clear the red star rating error message dynamically
    const radioError = document.querySelector("#radio-error-message");
    if (radioError) {
      radioError.innerHTML = "";
    }

    // 4. Update form validity
    checkFormValidity();
  }

  // Attach change listener to dropdown to load preview
  if (dynamicPortfolio) {
    dynamicPortfolio.addEventListener("change", () => {
      const selectedId = dynamicPortfolio.value;
      const found = activePortfolios.find(
        (p) =>
          String(p.id) === selectedId ||
          p.pTitle === selectedId ||
          p.title === selectedId
      );
      renderSelectedPortfolioPreview(found);
      checkFormValidity();
    });
  }

  // Attach click listeners to star rating labels
  document.querySelectorAll(".stars-rating label").forEach((label) => {
    label.addEventListener("click", () => {
      const forId = label.getAttribute("for");
      const targetRadio = document.getElementById(forId);
      if (targetRadio) {
        syncStarRating(targetRadio.value);
      }
    });
  });

  // Attach change and click listeners to radio inputs
  document
    .querySelectorAll('input[name="rating"], input[name="stars"]')
    .forEach((star) => {
      star.addEventListener("change", () => syncStarRating(star.value));
      star.addEventListener("click", () => syncStarRating(star.value));
    });

  const dateInput = document.querySelector("#date-installed");
  if (dateInput) {
    dateInput.addEventListener("input", checkFormValidity);
    dateInput.addEventListener("change", checkFormValidity);
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const portfolioSelected = dynamicPortfolio && dynamicPortfolio.value !== "";
      const selectedStar =
        document.querySelector('input[name="rating"]:checked') ||
        document.querySelector('input[name="stars"]:checked');
      const starsSelected = selectedStar !== null;
      const dateSelected = dateInput && dateInput.value !== "";

      if (!portfolioSelected || !starsSelected || !dateSelected) {
        checkFormValidity();
        return;
      }

      const nameInput = document.querySelector("#name") || document.querySelector("#fname");
      const commentsInput = document.querySelector("#comments") || document.querySelector("#written-review");
      const featureCheckboxes = document.querySelectorAll('input[name="features"]:checked');
      const features = Array.from(featureCheckboxes).map((cb) => cb.value);

      const payload = {
        name: nameInput ? nameInput.value.trim() : "",
        rating: selectedStar ? Number(selectedStar.value) : 5,
        portfolioId: dynamicPortfolio ? dynamicPortfolio.value : "",
        portfolioName:
          dynamicPortfolio && dynamicPortfolio.selectedIndex >= 0
            ? dynamicPortfolio.options[dynamicPortfolio.selectedIndex]?.text
            : "",
        date: dateInput ? dateInput.value : new Date().toISOString().split("T")[0],
        features,
        comments: commentsInput ? commentsInput.value.trim() : "",
      };

      if (reviewBtn) {
        reviewBtn.disabled = true;
        reviewBtn.value = "Submitting Review...";
      }

      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          let numSubmit = Number(window.localStorage.getItem("submit-ls")) || 0;
          numSubmit++;
          localStorage.setItem("submit-ls", numSubmit);

          window.location.href = "/pages/thanks.html";
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData.error || "Failed to submit review. Please try again.");
          if (reviewBtn) {
            reviewBtn.disabled = false;
            reviewBtn.value = "Post a Review";
          }
        }
      } catch (err) {
        console.error("Error submitting review:", err);
        alert("Network error submitting review. Please check your connection and try again.");
        if (reviewBtn) {
          reviewBtn.disabled = false;
          reviewBtn.value = "Post a Review";
        }
      }
    });
  }

  const signupBtn = document.querySelector(".signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

  if (dynamicPortfolio) {
    loadPortfolioData();
  }
  if (submitDisplay) {
    lsSubmitCount();
  }
});
