// ----------------------------INITIALIZE DOM HERE ------------------------------- //
// Make sure everything is loaded/initialized first
document.addEventListener('DOMContentLoaded', () => {


    document.getElementById("lastModified").innerHTML = document.lastModified;
    // use the date object
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
        // initialize display elements
        const todayDisplay = document.querySelector('#today');
        const searchDisplay = document.querySelector('#search');

        // get the stored value in localStorage
        let numSearch = Number(window.localStorage.getItem('search-ls'));

        //determine if this is the first search
        if (numSearch !== 0) {
            searchDisplay.textContent = numSearch;
        } else {
            searchDisplay.textContent = `Welcome to our site!`;
        }

        numSearch++;

        // store new number of visits
        localStorage.setItem('search-ls', numSearch);

        //show today's date
        todayDisplay.textContent = Date.now();
    }

    // Target the elements first
    const selectPorftolioBtn = document.querySelector('#portfolio-btn');
    const dropdownContainer = document.querySelector('.dropdown-container select');
    const choice = document.querySelector('#choose');
    const loadIt = document.querySelector('.image-loader');
    const signupBtn = document.querySelector('.signup-btn');
    const reviewBtn = document.querySelector('#review-btn');

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



    // Initialize dropdown value to nothing
    let dropdownValue = '';

    // Listen when the user selects from the portfolio dropdown list
    dropdownContainer.addEventListener('change', () => {
        dropdownValue = dropdownContainer.value;



    });

    // Listen when h2 changes
    choice.addEventListener('change', () => {
        chosenPortfolio = choice.value;

    });




    // Declare an array object

    var portfolios = [
        {
            pNumber: 'Portfolio 1',
            pTitle: 'Place page',
            fileName: 'place.html',
            sourceImg: "images/project-images/portfolio-1.webp",
            description: 'This website portfolio uses picture and srcset in order to load different picture sizes. The site is about my dream destination, Banaue Rice Terraces in the Philippines!',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/place.html',
        },

        {
            pNumber: 'Portfolio 2',
            pTitle: 'WDD131 home page',
            fileName: "index.html",
            sourceImg: "images/project-images/portfolio-2.webp",
            description: "This is a simple HTML personal homepage I've created for my course Dynamic Web Fundamentals (WDD131) in BYU-Idaho Spring Semester 2024.",
            imageURL: "https://jamesphillipdeguzman.github.io/wdd131/index.html",
        },

        {
            pNumber: 'Portfolio 3',
            pTitle: 'Filtered temples page',
            fileName: 'filtered-temples.html',
            sourceImg: "images/project-images/portfolio-3.webp",
            description: 'This website portfolio uses filtering of array objects in JavaScript.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/filtered-temples.html',
        },

        {
            pNumber: 'Portfolio 4',
            pTitle: 'Unfiltered temples page',
            fileName: 'temples.html',
            sourceImg: "images/project-images/portfolio-4.webp",
            description: 'This website portfolio is the beta version of the Filtered Temples page.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/temples.html',
        },

        {
            pNumber: 'Portfolio 5',
            pTitle: 'Holy grail layout (practice)',
            fileName: 'holy-grail-layout-flex.html',
            sourceImg: "images/project-images/portfolio-5.webp",
            description: 'This is only a practice website to create my first holy grail layout in HTML.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd131/csspractice/holy-grail-layout-flex.html',
        },

        {
            pNumber: 'Portfolio 6',
            pTitle: 'Whitewater rafting site (WDD130)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-6.webp",
            description: 'This website portfolio is my project in Web Fundamentals (WDD130).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd130/wwr/index.html',
        },

        {
            pNumber: 'Portfolio 7',
            pTitle: 'Course Home Page (WDD231)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-7.webp",
            description: 'This is my course home page (WDD231).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/index.html',
        },
        {
            pNumber: 'Portfolio 8',
            pTitle: 'Chamber Home Page (WDD231)',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-8.webp",
            description: 'This is the Iloilo Chamber home page (WDD231).',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/chamber/index.html',
        },
        {
            pNumber: 'Portfolio 9',
            pTitle: 'Quote Vitamins',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-9.webp",
            description: 'My final project in WDD231.',
            imageURL: 'https://jamesphillipdeguzman.github.io/wdd231/web-project/index.html',
        },
        {
            pNumber: 'Portfolio 10',
            pTitle: 'Hire Car Decision Tree',
            fileName: 'index.html',
            sourceImg: "images/project-images/portfolio-10.webp",
            description: 'This is a decision tree to help agents path bookings and extensions hire car efficiently.',
            imageURL: 'https://jamesphillipdeguzman.github.io/website-project/decisiontree/index.html',
        },

    ];




    // Create function to create rows
    function createRows(col1Text, col2Text) {

        var row = document.createElement('div');
        row.className = 'row';
        // row.style.backgroundColor = '#bed';
        row.style.display = 'flex';
        row.style.flex = '1 1 auto';
        row.style.flexDirection = 'row';
        row.style.maxWidth = '330px';



        var col1 = document.createElement('div');
        col1.className = 'col1';
        col1.textContent = col1Text;


        var col2 = document.createElement('div');
        col2.className = 'col2';
        col2.textContent = col2Text;

        row.appendChild(col1);
        row.appendChild(document.createTextNode(' '));
        row.appendChild(col2);

        return row;


    }

    //let currentImages = [];

    function clearImages() {
        while (loadIt.firstChild) {
            loadIt.removeChild(loadIt.firstChild);
        }
    }

    function loadImages(portfolios) {
        portfolios.forEach(portfolio => {

            clearImages();

            // Load new images
            const img = document.createElement('img');
            img.src = portfolio.sourceImg;
            img.alt = portfolio.pTitle;
            img.loading = 'lazy';
            img.style.height = 'auto';
            img.style.width = '300px';

            const dataBox = document.createElement('div');
            dataBox.className = 'databox';
            dataBox.appendChild(createRows('Number: ', portfolio.pNumber));
            dataBox.appendChild(createRows('Title: ', portfolio.fileName));
            dataBox.appendChild(createRows('Description: ', portfolio.description));
            dataBox.appendChild(createRows('Image: ', portfolio.sourceImg));
            dataBox.style.margin = '10px 10px';
            dataBox.style.padding = '10px 10px';
            dataBox.style.maxWidth = '305px';

            // Create the anchor element for imageURL
            const a = document.createElement('a');
            a.className = 'pImageUrl';
            a.href = portfolio.imageURL;
            a.textContent = `here`;


            const imageURLRow = createRows('ImageURL:', '');
            imageURLRow.lastChild.appendChild(a);
            dataBox.appendChild(imageURLRow);

            const card = document.createElement('div');
            card.className = 'card';



            card.style.display = 'flex';
            card.style.flexDirection = 'row';
            card.style.margin = '0 auto';
            card.style.lineHeight = '25px';
            card.style.height = 'auto';
            card.style.marginBottom = '30px';
            card.style.fontFamily = 'Arial, Helvetica, sans-serif';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.marginTop = '30px';

            card.style.maxWidth = '80vw';
            card.style.gap = '5px';
            card.style.fontSize = '0.9rem';
            card.style.backgroundColor = 'rgba(0,0,0,0.1)';
            card.style.borderRadius = '6px';
            card.style.textAlign = 'left';


            card.appendChild(dataBox);
            // card.appendChild(img);
            //currentImages.push(img); //store reference to the newly loaded image

            loadIt.appendChild(card);
            loadIt.style.display = 'flex';
            loadIt.style.margin = '0 10px';
            loadIt.style.maxWidth = '100%';
            // loadIt.style.overflow = 'hidden';
            loadIt.style.height = 'auto';

            // if (window.innerWidth >= 940) {
            //     // loadIt.style.gridTemplateColumns = 'repeat(auto-fill, minMax(250px, 1fr))';
            // }
            // else {
            //     loadIt.style.gridTemplateColumns = 'repeat(auto-fill, minMax(250px, 1fr))';
            //     loadIt.style.gridTemplateColumns = '1fr';
            // }


            // loadIt.style.gridTemplateRows = 'repeat(2, auto)';
            // loadIt.style.maxWidth = '100vw';
            loadIt.style.justifyContent = 'center';
            loadIt.style.alignItems = 'center';
            loadIt.style.textAlign = 'center';




        });





    }




    // const signupForm = document.querySelector('#signup-form');
    // signupForm.addEventListener('submit', (event) => {
    //     // Prevent the default form submission behavior
    //     event.preventDefault();
    //     // Redirect to the thanks page
    //     window.location.href = 'thanks.html';
    // });




    const results = document.querySelector('#results');
    // Listen when the user clicks the select button after choosing a portfolio
    selectPorftolioBtn.addEventListener('click', () => {

        // Check if user selected anything
        if (dropdownValue == '') {
            choice.textContent = `Please choose a portfolio from the list`;
            results.textContent = ``;
            clearImages();

        }
        else {

            results.textContent = `Results`;
            choice.textContent = `You've chosen ${dropdownValue}.`;
            loadImages(portfolios.filter(portfolio => portfolio.pTitle === dropdownValue));
            lsStorage();

        }
    });



    // Call the function that loads the images
    // loadImages(portfolios);




});
