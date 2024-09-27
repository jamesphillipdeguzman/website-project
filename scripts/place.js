document.getElementById("lastModified").innerHTML = document.lastModified;
// use the date object
const today = new Date();
const year = document.querySelector("#currentyear");
year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;


// Show more or less information about the Philippines
document.addEventListener('DOMContentLoaded', function () {
    const showMoreLink = document.getElementById('show-more');
    const moreContent = document.querySelector('.more-content');

// Trigger is when user clicks on the hyperlink 'More' or 'Less'
showMoreLink.addEventListener('click', function (event) {
    event.preventDefault();
    if (moreContent.style.display === 'none' || moreContent.style.display === '') {
        moreContent.style.display = 'block';
        showMoreLink.textContent = 'Less';
    } else {
        moreContent.style.display = 'none';
        showMoreLink.textContent = "More";

    }

});

});

document.addEventListener('DOMContentLoaded', function () {
    const temperature = 24; // Static temperature value in °C
    const windSpeed = 10; // Static wind speed value in km/h

    function calculateWindChill(temp, speed) {
        // Wind chill calculation formula for metric units (°C and km/h)
        return 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16);
    }

    function displayWindChill() {
        const windChillElement = document.getElementById('wind-chill');

        // Conditions for viable wind chill calculation
        if (temperature <= 10 && windSpeed > 4.8) {
            const windChill = calculateWindChill(temperature, windSpeed);
            windChillElement.textContent = `${windChill.toFixed(2)}°C`;
        } else {
            windChillElement.textContent = "N/A";
        }
    }

    // Call the displayWindChill function to update the wind chill factor on page load
    displayWindChill();
});

