// ----------------------------INITIALIZE DOM HERE ------------------------------- //
// Make sure everything is loaded/initialized first
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("lastModified").innerHTML = document.lastModified;

    // Use the date object
    const today = new Date();
    const year = document.querySelector("#currentyear");
    year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;

    const hamburgerBtn = document.querySelector("#menu");
    const navigation = document.querySelector(".navigation ul");

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navigation.classList.toggle('open');
    });

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

    // Define local storage here
    function lsStorage() {
        const todayDisplay = document.querySelector('#today');
        const searchDisplay = document.querySelector('#search');
        let numSearch = Number(window.localStorage.getItem('search-ls'));

        if (numSearch !== 0) {
            searchDisplay.textContent = numSearch;
        } else {
            searchDisplay.textContent = `Welcome to our site!`;
        }

        numSearch++;
        localStorage.setItem('search-ls', numSearch);
        todayDisplay.textContent = Date.now();
    }



    const selectPortfolioBtn = document.querySelector('#portfolio-btn');
    const dropdownContainer = document.querySelector('.dropdown-container select');
    const choice = document.querySelector('#choose');
    const loadIt = document.querySelector('.image-loader');
    const signupBtn = document.querySelector('.signup-btn');
    const reviewBtn = document.querySelector('#review-btn');

    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            window.location.href = 'review.html';
        });
    }

    // Initialize dropdown value to nothing
    let dropdownValue = '';

    // Listen when the user selects from the portfolio dropdown list
    dropdownContainer.addEventListener('change', () => {
        dropdownValue = dropdownContainer.value;
    });

    // Declare an array of portfolio objects
    let portfolios = [
        {
            pTitle: 'Place page',
            fileName: 'place.html',
            sourceImg: "images/project-images/portfolio-1.webp",
            description: 'This website portfolio uses picture and srcset in order to load different picture sizes. The site is about my dream destination, Banaue Rice Terraces in the Philippines!',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/place.html',
        },
        {
            pTitle: 'WDD131 home page',
            fileName: "index.html",
            sourceImg: "images/project-images/portfolio-2.webp",
            description: "This is a simple HTML personal homepage I've created for my course Dynamic Web Fundamentals (WDD131) in BYU-Idaho Spring Semester 2024.",
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/index.html',
        },
        {
            pTitle: 'Filtered temples page',
            fileName: 'filtered-temples.html',
            sourceImg: "images/project-images/portfolio-3.webp",
            description: 'This website portfolio uses filtering of array objects in JavaScript.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/filtered-temples.html',
        },
        {
            pTitle: 'Unfiltered temples page',
            fileName: 'temples.html',
            sourceImg: "images/project-images/portfolio-4.webp",
            description: 'This website portfolio is the beta version of the Filtered Temples page.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/temples.html',
        },
        {
            pTitle: 'Holy grail layout (practice)',
            fileName: 'holy-grail-layout-flex.html',
            sourceImg: "images/project-images/portfolio-5.webp",
            description: 'This is only a practice website to create my first holy grail layout in HTML.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/csspractice/holy-grail-layout-flex.html',
        },
        {
            pTitle: 'Whitewater rafting site (WDD130)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-6.webp",
            description: 'This website portfolio is my project in Web Fundamentals (WDD130).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd130/wwr/index.html',
        },
        {
            pTitle: 'Course Home Page (WDD231)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-7.webp",
            description: 'This is my course home page (WDD231).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/index.html',
        },
        {
            pTitle: 'Chamber Home Page (WDD231)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-8.webp",
            description: 'This is the Iloilo Chamber home page (WDD231).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/chamber/index.html',
        },
        {
            pTitle: 'Quote Vitamins',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-9.webp",
            description: 'My final project in WDD231.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/web-project/index.html',
        },
        {
            pTitle: 'SleepOutside (WDD330-Team Project)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-10.webp",
            description: 'SleepOutside is an e-commerce website that sells outdoor camping gears. This is our team project in WDD330.',
            imageURL: 'https://comforting-rugelach-ca25e6.netlify.app/',
        },
        {
            pTitle: 'Foodexer (WDD330)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-11.webp",
            description: 'This is my final project in WDD330 - Food and Exercise API',
            imageURL: 'https://foodexer.netlify.app/',
        },
        {
            pTitle: 'Ralteen Fiel',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-12.webp",
            description: 'A mystery game web app about Ralteen Fiel',
            imageURL: 'https://ralteenfiel.netlify.app/',
        },
    ];

    function createRows(col1Text, col2Text) {
        var row = document.createElement('div');
        row.className = 'row';
        row.style.display = 'flex';
        row.style.alignItems = 'center'; // Align label and data
        row.style.marginBottom = '5px'; // Add space between rows

        var col1 = document.createElement('div');
        col1.className = 'col1';
        col1.textContent = col1Text;
        col1.style.fontWeight = 'bold'; // Make labels bold
        col1.style.marginRight = '8px'; // Add space between label and data
        col1.style.minWidth = '100px'; // Ensure consistent label width

        var col2 = document.createElement('div');
        col2.className = 'col2';
        col2.textContent = col2Text;

        row.appendChild(col1);
        row.appendChild(col2);

        return row;
    }


    function clearImages() {
        while (loadIt.firstChild) {
            loadIt.removeChild(loadIt.firstChild);
        }
    }

    function loadImages(portfolio) {
        debugger;
        clearImages(); // Clear previous images

        // Create and append the image
        const img = document.createElement('img');
        img.src = portfolio.sourceImg;

        img.alt = portfolio.pTitle;
        img.loading = 'lazy';
        img.style.height = 'auto';
        img.style.width = '100%';
        img.style.borderRadius = '5px';

        const dataBox = document.createElement('div');
        dataBox.className = 'databox';
        dataBox.appendChild(createRows('Title: ', portfolio.pTitle));  // Display portfolio title
        dataBox.appendChild(createRows('File Name: ', portfolio.fileName));
        dataBox.appendChild(createRows('Description: ', portfolio.description));
        dataBox.style.gap = '10px';
        // dataBox.appendChild(createRows('Image: ', portfolio.sourceImg));
        // dataBox.appendChild(createRows('URL: ', portfolio.imageURL));
        dataBox.style.margin = '15px';
        dataBox.style.padding = '15px';
        dataBox.style.maxWidth = '305px';
        dataBox.style.textAlign = 'left';

        const a = document.createElement('a');
        a.className = 'pImageUrl';
        a.href = portfolio.imageURL;
        // a.textContent = `here`;

        // const imageURLRow = createRows('Image URL:', '');
        // imageURLRow.lastChild.appendChild(a);
        // dataBox.appendChild(imageURLRow);

        const card = document.createElement('div');
        card.className = 'card';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.margin = '0 auto';
        card.style.lineHeight = '25px';
        card.style.borderRadius = '5px';

        a.appendChild(img);
        card.appendChild(a);
        card.appendChild(dataBox);
        loadIt.appendChild(card);
    }



    // Load images based on dropdown selection
    dropdownContainer.addEventListener('change', () => {
        const selectedPortfolio = portfolios.find(portfolio => portfolio.pTitle === dropdownContainer.value);
        if (selectedPortfolio) {
            loadImages(selectedPortfolio);
        }
    });

    lsStorage(); // Call to run local storage function


});


const firstName = document.querySelector('#firstname');
const lastName = document.querySelector('#lastname');
const email = document.querySelector('#email');
const submit = document.querySelector('#submit');

if (submit) {

    submit.addEventListener('click', (event) => {


        event.preventDefault();
        if (firstName.value && lastName.value && email.value) {
            window.location.href = 'thanks.html';
        }

    });
}
