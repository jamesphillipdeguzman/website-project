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



const year = document.querySelectorAll('.currentyear');
// iterate over each span element with the class currentyear
year.forEach((element) => {
    // element.innerHTML = `<span class="highlight">${todaysDate.getFullYear()}</span>`;
    element.textContent = todaysDate.getFullYear(); // simplified approach
})



const lastModified = document.querySelector('#lastModified');
lastModified.innerHTML = `<span class="highlight">${formattedDateTime}</span>`;

// Function to retrieve user ID from cookies or query parameters
function getUserId() {
    // Check for user ID in cookies
    const cookieMatch = document.cookie.match(/userId=([^;]+)/);
    if (cookieMatch) {
        return cookieMatch[1]; // Return user ID from cookie
    }

    // Check for user ID in the query string
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId'); // Return user ID from query string, if it exists
}

// Function to store the current local date, time, user ID, and username based on User Agent
function storeAccessInfo() {
    const currentDateTime = new Date().toLocaleString(); // Get current local date and time
    // const username = navigator.userAgent; // Get the User Agent string
    const userId = getUserId() || 'Guest'; // Retrieve user ID or default to 'Guest'

    // Retrieve existing access times from local storage
    const accessTimes = JSON.parse(localStorage.getItem('accessTimes')) || [];

    // Add the current date, time, user ID, and username to the array
    // accessTimes.push({ dateTime: currentDateTime, userId: userId, username: username });
    accessTimes.push({ dateTime: currentDateTime, userId: userId });

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
            console.log(`Access #${index + 1}: ${entry.dateTime}, User ID: ${entry.userId}, Username (User Agent): ${entry.username}`);
        });
    } else {
        console.log('This is your first visit.');
    }
};
