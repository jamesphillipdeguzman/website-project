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

  const dynamicPortfolio = document.querySelector("#dynamic-product"); // maybe rename this ID in HTML too
  const reviewForm = document.querySelector("#review-form");
  const reviewBtn = document.querySelector("#review-btn");
  const submitDisplay = document.querySelector("#submit-count");

  // Populate the dropdown list with portfolio values
  function populateDropdown() {
    dynamicPortfolio.innerHTML =
      '<option value="" disabled selected>Select a portfolio...</option>';
    portfolios.forEach((portfolio) => {
      const option = document.createElement("option");
      option.value = portfolio.id;
      option.textContent = portfolio.pTitle;
      dynamicPortfolio.appendChild(option);
    });
  }

  // Initialize localStorage for submission count
  function lsSubmitCount() {
    let numSubmit = Number(window.localStorage.getItem("submit-ls")) || 0;
    submitDisplay.textContent = numSubmit || "0";
    localStorage.setItem("submit-ls", numSubmit);
  }

  reviewBtn.disabled = true;

  function checkFormValidity() {
    const portfolioSelected = dynamicPortfolio.value !== "";
    const starsSelected =
      document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector("#date-installed").value !== "";

    reviewBtn.disabled = !(portfolioSelected && starsSelected && dateSelected);

    checkFormEntry("select", portfolioSelected ? "present" : "missing");
    checkFormEntry("radio", starsSelected ? "present" : "missing");
    checkFormEntry("date", dateSelected ? "present" : "missing");
  }

  function checkFormEntry(field, status) {
    const errorContainer = document.querySelector(`#${field}-error-message`);
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

  dynamicPortfolio.addEventListener("change", checkFormValidity);
  document.querySelectorAll('input[name="stars"]').forEach((star) => {
    star.addEventListener("change", checkFormValidity);
  });
  document
    .querySelector("#date-installed")
    .addEventListener("input", checkFormValidity);

  reviewForm.addEventListener("submit", (event) => {
    const portfolioSelected = dynamicPortfolio.value !== "";
    const starsSelected =
      document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector("#date-installed").value !== "";

    if (portfolioSelected && starsSelected && dateSelected) {
      let numSubmit = Number(window.localStorage.getItem("submit-ls"));
      numSubmit++;
      localStorage.setItem("submit-ls", numSubmit);
    } else {
      event.preventDefault();
      checkFormValidity();
    }
  });

  const signupBtn = document.querySelector(".signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      window.location.href = "review.html";
    });
  }

  populateDropdown();
  lsSubmitCount();

  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();

      try {
        const response = await fetch(
          `${window.location.origin}/.netlify/functions/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await response.json();

        if (!res.ok) {
          alert(`❌ ${data.error || "Login failed"}`);
          return;
        }

        // alert("✅ Login successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard.html";
      } catch (err) {
        console.error("Login error:", err);
        alert("⚠️ Network or server error.");
      }
    });
  }
});
