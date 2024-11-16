document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("lastModified").innerHTML = document.lastModified;

  // use the date object
  const today = new Date();
  const year = document.querySelector("#currentyear");
  if (year) {
    year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;
  }

  const products = [
    { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
    { id: "fc-2050", name: "power laces", averagerating: 4.7 },
    { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
    { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
    { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
  ];

  const dynamicProduct = document.querySelector('#dynamic-product');
  const reviewForm = document.querySelector('#review-form');
  const reviewBtn = document.querySelector('#review-btn');
  const submitDisplay = document.querySelector('#submit-count');

  // Populate the dropdown list with product values
  function populateDropdown() {
    dynamicProduct.innerHTML = '<option value="" disabled selected>Select a product...</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      dynamicProduct.appendChild(option);
    });
  }

  // Initialize localStorage for submission count
  function lsSubmitCount() {
    let numSubmit = Number(window.localStorage.getItem('submit-ls')) || 0;
    submitDisplay.textContent = numSubmit || '0';
    localStorage.setItem('submit-ls', numSubmit);
  }

  lsSubmitCount(); // Update the submission count on page load

  // Disable submit button initially
  reviewBtn.disabled = true;

  // Check form validity (enable/disable submit button)
  function checkFormValidity() {
    const productSelected = dynamicProduct.value !== '';
    const starsSelected = document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector('#date-installed').value !== '';

    // Initially disable the button
    reviewBtn.disabled = !(productSelected && starsSelected && dateSelected);

    // Validate fields and show error messages
    checkFormEntry('select', productSelected ? 'present' : 'missing');
    checkFormEntry('radio', starsSelected ? 'present' : 'missing');
    checkFormEntry('date', dateSelected ? 'present' : 'missing');
  }

  // Check each form entry for validity and display error messages
  function checkFormEntry(field, status) {
    const errorContainer = document.querySelector(`#${field}-error-message`);
    errorContainer.innerHTML = ''; // Clear previous error messages

    const errorMessage = document.createElement('p');
    errorMessage.className = 'errMsg';

    switch (`${field}_${status}`) {
      case "select_present":
        break; // No error
      case "select_missing":
        errorMessage.textContent = 'Product is missing.';
        break;
      case "radio_present":
        break; // No error
      case "radio_missing":
        errorMessage.textContent = 'Star rating is missing.';
        break;
      case "date_present":
        break; // No error
      case "date_missing":
        errorMessage.textContent = 'Date is missing.';
        break;
      default:
        errorMessage.textContent = 'Incomplete form.';
        break;
    }

    if (errorMessage.textContent) {
      errorContainer.appendChild(errorMessage); // Only append if there is an error message
    }
  }

  // Event listeners for form fields
  dynamicProduct.addEventListener('change', checkFormValidity);
  document.querySelectorAll('input[name="stars"]').forEach(star => {
    star.addEventListener('change', checkFormValidity);
  });
  document.querySelector('#date-installed').addEventListener('input', checkFormValidity);

  // Form submit handler
  reviewForm.addEventListener('submit', (event) => {
    const productSelected = dynamicProduct.value !== '';
    const starsSelected = document.querySelector('input[name="stars"]:checked') !== null;
    const dateSelected = document.querySelector('#date-installed').value !== '';


    // If form is valid, submit the form and update submission count
    if (productSelected && starsSelected && dateSelected) {
      let numSubmit = Number(window.localStorage.getItem('submit-ls'));
      numSubmit++;
      localStorage.setItem('submit-ls', numSubmit);
      lsSubmitCount(); // Update the display
    } else {
      // If form is invalid, prevent submission and show errors
      event.preventDefault();
      checkFormValidity();
    }
  });

  // Event listener for the signup button
  const signupBtn = document.querySelector('.signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      window.location.href = 'signup.html';
    });
  }

  // Event listener for the review button
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      window.location.href = 'review.html';
    });
  }

  // Populate the dropdown on DOM load
  populateDropdown();
});
