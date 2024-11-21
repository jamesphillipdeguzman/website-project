
document.addEventListener('DOMContentLoaded', () => {


    // Hamburger menu click event

    const hamburgerBtn = document.querySelector('#menu');
    const navigationBtn = document.querySelector('.toplinks');


    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navigationBtn.classList.toggle('open');
    });


    // Get the year
    const todaysDate = new Date();
    const dateFormat = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeFormat = todaysDate.toLocaleTimeString();
    const formattedDate = todaysDate.toLocaleDateString('en-US', dateFormat);
    const formattedDateTime = formattedDate + " " + timeFormat;

    const timestamp = document.querySelector('#timestamp');



    const year = document.querySelector('#currentyear');
    year.innerHTML = `<span class="highlight">${todaysDate.getFullYear()}</span>`;


    const lastModified = document.querySelector('#lastModified');
    lastModified.innerHTML = document.lastModified;

    // Function to store the current local date, time, and username based on User Agent
    function storeAccessInfo() {
        const currentDateTime = new Date().toLocaleString(); // Get current local date and time
        const username = navigator.userAgent; // Get the User Agent string

        // Retrieve existing access times from local storage
        const accessTimes = JSON.parse(localStorage.getItem('accessTimes')) || [];

        // Add the current date and time to the array
        accessTimes.push({ dateTime: currentDateTime, username: username });

        // Store the updated array back in local storage
        localStorage.setItem('accessTimes', JSON.stringify(accessTimes));
    }

    // Call the function when the page loads
    window.onload = function () {
        storeAccessInfo();
        logLastAccess();
    };

    // Function to log all access times and usernames
    function logLastAccess() {
        const accessTimes = JSON.parse(localStorage.getItem('accessTimes')) || [];

        if (accessTimes.length > 0) {
            accessTimes.forEach((entry, index) => {
                console.log(`Access #${index + 1}: ${entry.dateTime}, Username (User Agent): ${entry.username}`);
            });
        } else {
            console.log('This is your first visit.');
        }
    };

    const sosApp = document.querySelector('.sos-app');
    sosApp.addEventListener('click', () => {
        window.location.href = 'https://apps.powerapps.com/play/e/default-43f93f8a-55a8-4263-bd84-e03688a2ab2d/a/7f81a035-8f70-464b-844f-34cb91e8d21e?tenantId=43f93f8a-55a8-4263-bd84-e03688a2ab2d&hint=5653abc4-556e-4c76-a02c-8261be95544f&sourcetime=1727750583995&source=portal';
    });


});