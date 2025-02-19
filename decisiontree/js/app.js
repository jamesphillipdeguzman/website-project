// app.js
// Main entry file for the app logic

// This file handles the initialization of UI components and interactive features:
// - Hamburger menu toggle
// - SOS app navigation
// It imports utility functions from base.js to manage non-UI related tasks like setting the year and logging access.

import { setCurrentYear, setLastModified, storeAccessInfo, logLastAccess } from './utils.mjs';

// Function to initialize the hamburger menu
function initHamburgerMenu() {
    const hamburgerBtn = document.querySelector('#menu');
    const navigationBtn = document.querySelector('.toplinks');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navigationBtn.classList.toggle('open');
    });
}

// Function to initialize the SOS app link

function initSOSApp() {
    const sosApp = document.querySelector('.sos-app');

    if (sosApp) { // Only add event listener if the element exists
        sosApp.addEventListener('click', () => {
            window.location.href = 'https://apps.powerapps.com/play/e/default-43f93f8a-55a8-4263-bd84-e03688a2ab2d/a/7f81a035-8f70-464b-844f-34cb91e8d21e?tenantId=43f93f8a-55a8-4263-bd84-e03688a2ab2d&hint=5653abc4-556e-4c76-a02c-8261be95544f&sourcetime=1727750583995&source=portal';
        });
    } else {
        console.warn('SOS App button not found');
    }
}

// Function to save tracking ID to localStorage
function saveTrackingId(trackingId) {
    localStorage.setItem('trackingId', trackingId);
}

// Function to get tracking ID from localStorage
function getTrackingId() {
    return localStorage.getItem('trackingId');
}

// Function to initialize tracking logic (if you need a default value)
function initializeTracking() {
    let trackingId = getTrackingId(); // Retrieve from localStorage

    if (!trackingId) {
        // If no tracking ID exists in localStorage, initialize with a default value
        trackingId = "defaultTrackingId";  // You can set this to any default or initial value
        saveTrackingId(trackingId); // Save the default value to localStorage
        console.log("Tracking ID initialized: ", trackingId);
    } else {
        console.log("Tracking ID found in localStorage: ", trackingId);
    }

    // Optionally, display it in your UI or handle it
    const trackingDisplayElement = document.querySelector('#tracking-id');
    if (trackingDisplayElement) {
        trackingDisplayElement.textContent = `Tracking ID: ${trackingId}`;
    }
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initHamburgerMenu();
    initSOSApp();

    // Set current year and last modified
    setCurrentYear();
    setLastModified();

    // Store access info and log last access
    // storeAccessInfo();
    // logLastAccess();

    // Initialize tracking ID
    // initializeTracking();

});
