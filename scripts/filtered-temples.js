document.getElementById("lastModified").innerHTML = document.lastModified;
// use the date object
const today = new Date();
const year = document.querySelector("#currentyear");
year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;




const hamburgerBtn = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navigation.classList.toggle('open');

});

document.addEventListener('DOMContentLoaded', () => {

    const imageContainer = document.getElementById('imageContainer');
    // const cardContainer = document.getElementById('cardContainer');
    const mainContainer = document.getElementById('mainContainer');

    var temples = [
        {
            templeName: "Aba Nigeria",
            location: "Aba, Nigeria",
            dedicated: "2005, August, 7",
            year: "2005",
            area: 11500,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
        },
        {
            templeName: "Manti Utah",
            location: "Manti, Utah, USA",
            dedicated: "1888, May, 21",
            year: "1888",
            area: 74792,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
        },
        {
            templeName: "Draper Utah",
            location: "Draper, Utah, USA",
            dedicated: "2009, March, 20",
            year: "2009",
            area: 58300,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/draper-utah/400x250/draper-temple-lds-685672-wallpaper.jpg"
        },
        {
            templeName: "Yigo Guam",
            location: "Yigo, Guam",
            dedicated: "2020, May, 2",
            year: "2020",
            area: 6861,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
        },
        {
            templeName: "Washington D.C.",
            location: "Kensington, Maryland, USA",
            dedicated: "1974, November, 19",
            year: "1974",
            area: 156558,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
        },
        {
            templeName: "Lima Perú",
            location: "Lima, Perú",
            dedicated: "1986, January, 10",
            year: "1986",
            area: 9600,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
        },
        {
            templeName: "Mexico City Mexico",

            location: "Mexico City, Mexico",
            dedicated: "1983, December, 2",
            year: "1983",
            area: 116642,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
        },

        {
            templeName: "Cebu Philippines",
            location: "Lahug, Cebu City, Philippines",
            dedicated: "2010, June, 10",
            year: "2010",
            area: 29556,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/cebu-city-philippines/400x250/cebu-philippines-temple-lds-852643-wallpaper.jpg"
        },
        {
            templeName: "Manila Philippines",
            location: "Quezon City, Philippines",
            dedicated: "1984, September, 25",
            year: "1984",
            area: 26683,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manila-philippines/400x250/manila-philippines-temple-lds-993617-wallpaper.jpg"
        },
        {
            templeName: "Syndey Australia",
            location: "Carlingford, NSW, Australia",
            dedicated: "1984, September, 20",
            year: "1984",
            area: 30677,
            imageUrl:
                "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/sydney-australia/400x250/sydney-australia-temple-lds-christmas-1070459-wallpaper.jpg"
        },

    ];


    // Create function to create rows
    function createRows(col1Text, col2Text) {

        var row = document.createElement('div');
        row.className = 'row';
        // row.style.backgroundColor = '#bed';
        row.style.display = 'flex';
        row.style.flex = '0 0 100px';
        row.style.flexDirection = 'row';
        row.style.maxWidth = '500px';



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

    // Load images and databoxes...
    function loadImages(temples) {
        temples.forEach(temple => {


            const img = document.createElement('img');
            img.src = temple.imageUrl;
            img.alt = temple.templeName;
            img.loading = 'lazy';
            img.style.width = '250px';
            img.style.height = 'auto';

            // Add some simple opacity hover animation on each image...
            img.addEventListener('mouseover', () => {
                img.style.opacity = '0.7';

            });

            img.addEventListener('mouseout', () => {
                img.style.opacity = '1';
            });

            // img.classList.add = 'grid-item';
            img.style.justifyContent = 'center';
            img.style.boxShadow = '0 10px 50px rgba(0,0,0,0.9)';

            // const label = document.createElement('div');
            // label.classList.add('label');
            // label.style.border = '1px solid #eee';
            // label.style.padding = '10px';
            // label.style.maxWidth = '200px';
            // label.style.fontFamily = 'Arial, Helvetica, sans-serif';
            // label.style.margin = '0 auto';
            // // label.style.position = 'absolute';
            // // label.style.right = '100px';
            // label.textContent =
            //     'Name: ' + temple.templeName + ' ' +
            //     'Location: ' + temple.location + ' ' +
            //     'Dedicated: ' + temple.dedicated + ' ' +
            //     'Area: ' + temple.area;

            const dataBox = document.createElement('div');
            dataBox.className = 'databox';
            dataBox.appendChild(createRows('Name: ', temple.templeName));
            dataBox.appendChild(createRows('Location: ', temple.location));
            dataBox.appendChild(createRows('Dedicated: ', temple.dedicated));
            dataBox.appendChild(createRows('Area: ', temple.area));


            const card = document.createElement('div');
            card.className = 'card';



            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.margin = '0 30px';
            card.style.height = 'auto';
            card.style.marginBottom = '20px';
            card.style.fontFamily = 'Arial, Helvetica, sans-serif';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.style.marginTop = '100px';

            card.style.maxWidth = '50vw';
            card.style.gap = '10px';
            card.style.fontSize = '0.7rem';
            card.style.backgroundColor = 'rgba(0,0,0,0.1)';
            card.style.borderRadius = '6px';


            card.appendChild(dataBox);
            card.appendChild(img);

            imageContainer.appendChild(card);
            imageContainer.style.display = 'grid';
            imageContainer.style.maxWidth = '100%';
            // imageContainer.style.overflow = 'hidden';
            imageContainer.style.height = 'auto';

            if (window.innerWidth >= 940) {
                imageContainer.style.gridTemplateColumns = 'repeat(auto-fill, minMax(250px, 1fr))';
            }
            else {
                imageContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }


            // imageContainer.style.gridTemplateRows = 'repeat(2, auto)';
            imageContainer.style.maxWidth = '100vw';
            imageContainer.style.justifyContent = 'space-between';


        });


    }

    window.addEventListener('resize', () => {
        window.innerHTML = '';


    });
    //Call the function to load images
    loadImages(temples);


    //handle events when navigation links are clicked
    // Home
    const homeLink = document.getElementById('home');
    homeLink.addEventListener('click', () => {
        document.getElementById('filter-title').innerText = 'Home';
        document.querySelector('#imageContainer').innerHTML = '';
        loadImages(temples);
        let babygender = 'boy';
        const reveal = document.getElementById('reveal');
        // reveal.textContent = `🎉 Congratulations! You are having a <strong>${babygender}</strong>!`;
        reveal.innerHTML = `🎉 Congratulations! You are having a <strong>${babygender}</strong>!`;
    });

    // Old link
    const oldLink = document.getElementById('old');
    oldLink.addEventListener('click', () => {
        document.getElementById('filter-title').innerText = 'Old';
        document.querySelector('#imageContainer').innerHTML = '';
        loadImages(temples.filter(temple => parseInt(temple.year) < 1900));

    });

    // New link
    const newLink = document.getElementById('new');
    newLink.addEventListener('click', () => {
        document.getElementById('filter-title').innerText = 'New';
        document.querySelector('#imageContainer').innerHTML = '';
        loadImages(temples.filter(temple => parseInt(temple.year) > 2000));
    });

    // large link
    const largeLink = document.getElementById('large');
    largeLink.addEventListener('click', () => {
        document.getElementById('filter-title').innerText = 'large';
        document.querySelector('#imageContainer').innerHTML = '';
        loadImages(temples.filter(temple => temple.area > 90000));
    });

    // small link
    const smallLink = document.getElementById('small');
    smallLink.addEventListener('click', () => {
        document.getElementById('filter-title').innerText = 'small';
        document.querySelector('#imageContainer').innerHTML = '';
        loadImages(temples.filter(temple => temple.area < 10000));
    });


});
