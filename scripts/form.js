document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("lastModified").innerHTML = document.lastModified;

  // use the date object
  const today = new Date();
  const year = document.querySelector("#currentyear");
  if (year) {
    year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;
  }

  const products = [
    {
      id: "fc-1888",
      name: "flux capacitor",
      averagerating: 4.5
    },
    {
      id: "fc-2050",
      name: "power laces",
      averagerating: 4.7
    },
    {
      id: "fs-1987",
      name: "time circuits",
      averagerating: 3.5
    },
    {
      id: "ac-2000",
      name: "low voltage reactor",
      averagerating: 3.9
    },
    {
      id: "jj-1969",
      name: "warp equalizer",
      averagerating: 5.0
    }
  ];

  const dynamicProduct = document.querySelector('#dynamic-product');

  // Populate the dropdown list with product values
  function populateDropdown(dynamicProduct, products) {
    dynamicProduct.innerHTML = '<option value="" disabled selected>Select a product...</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      dynamicProduct.appendChild(option);
    });
  }

  // Populate the dropdown immediately when the DOM is loaded
  populateDropdown(dynamicProduct, products);

  // Define local storage here
  function lsSubmitCount() {
    // initialize display elements
    const submitDisplay = document.querySelector('#submit-count');

    // get the stored value in localStorage
    let numSubmit = Number(window.localStorage.getItem('submit-ls')) || 0;

    // determine if this is the first submission
    if (numSubmit !== 0) {
      submitDisplay.textContent = numSubmit;
    } else {
      submitDisplay.textContent = `0`;
    }

    // store new number of submissions
    localStorage.setItem('submit-ls', numSubmit);
  }

  lsSubmitCount();

  const reviewForm = document.querySelector('#review-form');
  const reviewBtn = document.querySelector('#review-btn');



  // Disable submit button on refresh or DOM onload...
  reviewBtn.disabled = true;


  function checkFormValidity() {

    // target each element on the form (e.g., select, checkbox and date)
    const productSelected = dynamicProduct.value !== '';
    const starsSelected = document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector('#date-installed').value !== '';

    //Disable review button or enable it

    if (productSelected) {
      reviewBtn.disabled = false;
      const status = 'present';
      checkFormEntry("select", status);
    } else {
      reviewBtn.disabled = true;
      const status = 'missing';
      checkFormEntry("select", status);

    }

    if (starsSelected) {
      reviewBtn.disabled = false;
      const status = 'present';
      checkFormEntry("radio", status);
    } else {
      reviewBtn.disabled = true;
      const status = 'missing';
      checkFormEntry("radio", status);
    }

    if (dateSelected) {
      reviewBtn.disabled = false;
      const status = 'present';
      checkFormEntry("date", status);
    } else {
      reviewBtn.disabled = true;
      const status = 'missing';
      checkFormEntry("date", status);

    }
  }


  // Check if any mandatory fields have been left empty by the user...
  function checkFormEntry(requiredField, flag) {

    const errorContainer = document.querySelector(`#${requiredField}-error-message`);
      errorContainer.innerHTML = '';
      errorMessage = document.createElement('p');
      errorMessage.className = 'errMsg';
      errorMessage.textContent = `Please complete the form prior to submission`;
    errorContainer.appendChild(errorMessage);

    const elemStatus = requiredField + '_' + flag

    // Check any matching element status here (i.e., whether present of missing)
    switch (elemStatus) {
      case "select_present":
        errorMessage.textContent = ``;
        break;
      case "select_missing":
        errorMessage.textContent = `Product is missing.`;
        break;
      case "radio_present":
        errorMessage.textContent = ``;
        break;
      case "radio_missing":
        errorMessage.textContent = `Star rating is missing.`;
        break;
      case "date_present":
        errorMessage.textContent = ``;
        break;
      case "date_missing":
        errorMessage.textContent = `Date is missing.`;
        break;
      default:
        errorMessage.textContent = `Incomplete form.`;

        break;

    }


  }


  // ======== Add event listeners to check form validity... ========

  // Change event listener for select or dropdown
  dynamicProduct.addEventListener('change', checkFormValidity);

  // Change event listener for checkbox
  document.querySelectorAll('input[name="stars"]').forEach(star => {
    star.addEventListener('change', checkFormValidity);

  });
  // Input event listener for date
  document.querySelector('#date-installed').addEventListener('input', checkFormValidity);

  reviewForm.addEventListener('submit', (event) => {
    const productSelected = dynamicProduct.value !== '';
    const starsSelected = document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector('#date-installed').value !== '';

    if (productSelected && starsSelected && dateSelected) {

      event.preventDefault();

      // Update the submission count in local storage
      let numSubmit = Number(window.localStorage.getItem('submit-ls'));
      numSubmit++;
      localStorage.setItem('submit-ls', numSubmit);
      lsSubmitCount(); // Update the display



    } else {

      checkFormValidity();
      // reviewBtn.disabled = true;

    }

    checkFormValidity();

      // Open the review page when user clicks on review button
      // window.location.href = 'project/review.html';


  });

      const signupBtn = document.querySelector('.signup-btn');
      // const reviewBtn = document.querySelector('#review-btn');

      if (signupBtn) {

          signupBtn.addEventListener('click', () => {
              // open the contacts page when user clicks on signup button
              window.location.href = 'signup.html';

          });

      }

      if (reviewBtn) {

            reviewBtn.addEventListener('click', () => {


                // open the review page when user clicks on review button
                window.location.href = 'review.html';

            });
      }




});
