import { getDecisionTreeText_WPClaims } from "./hc-booking/hc-booking-wp.js";
import { getDecisionTreeText_Insured } from "./hc-booking/hc-booking-insured.js";
import { getDecisionTreeText_MTP } from "./hc-booking/hc-booking-mtp.js";
import { getDecisionTreeText_RectificationHC } from "./hc-booking/hc-booking-rectify.js";


// utils.js
// Utility functions

// This file contains utility functions for handling general tasks like:
// - Setting the current year in the footer
// - Storing access info (date, time, user ID) in localStorage
// - Logging access data
// - Getting the user ID from cookies or URL parameters

// Function to set the current year in elements with class 'currentyear'
export function setCurrentYear() {

    const year = new Date().getFullYear();
    console.log(`Setting current year to: ${year}`);  // Debugging
    const yearElements = document.querySelectorAll('.currentyear');
    yearElements.forEach((element) => {
        element.textContent = year;
    });
}

// Function to set the last modified date in an element with id 'lastModified'
export function setLastModified() {
    const lastModifiedElement = document.querySelector('#lastModified');
    console.log(`Setting last modified to: ${document.lastModified}`);  // Debugging
    lastModifiedElement.innerHTML = document.lastModified;
}

export function storeAccessInfo(trackingId) {
    if (!trackingId || trackingId === "None") {
        return; // Only store access info if there's a valid tracking ID
    }

    // Check if access info has already been stored for the current session
    if (sessionStorage.getItem('accessInfoStored')) {
        console.log('Access info already stored in this session.');
        return; // If true, don't store again
    }

    const currentDateTime = new Date().toLocaleString();
    const userId = getUserId() || 'Guest';

    // Retrieve existing access times from local storage
    const accessTimes = JSON.parse(localStorage.getItem('accessTimes')) || [];
    accessTimes.push({ dateTime: currentDateTime, userId: userId });

    // Store updated access times in localStorage
    localStorage.setItem('accessTimes', JSON.stringify(accessTimes));

    // Mark that access info has been stored for this session
    sessionStorage.setItem('accessInfoStored', 'true');
}



// Function to retrieve user ID from cookies or URL query parameters
export function getUserId() {
    const cookieMatch = document.cookie.match(/userId=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

// Function to log access data from localStorage
export function logLastAccess() {
    const accessTimes = JSON.parse(localStorage.getItem('accessTimes')) || [];
    if (accessTimes.length === 0) {
        console.log('This is your first visit.');
        return;
    }

    accessTimes.forEach((entry, index) => {
        console.log(`Access #${index + 1}: ${entry.dateTime}, User ID: ${entry.userId}`);
    });
}


let trackingCode_Insured = getDecisionTreeText_Insured();

// Function to initialize tracking ID (if needed)
export function initializeTrackingId_Insured(trackingCode_Insured) {

    let trackingId = getTrackingId(); // Try to retrieve from localStorage

    if (!trackingId) {
        // If no tracking ID exists, set a default or generate one
        trackingId = "000000";  // Set a custom default value
        // storeTrackingId(trackingId, "Insured"); // Store the default value
        console.log("Tracking ID initialized: ", trackingId);
    } else {
        console.log("Tracking ID found in localStorage: ", trackingId);
    }

    return trackingId;
}

let trackingCode_MTP = getDecisionTreeText_Insured();

// Function to initialize tracking ID (if needed)
export function initializeTrackingId_MTP(trackingCode_MTP) {

    let trackingId = getTrackingId(); // Try to retrieve from localStorage

    if (!trackingId) {
        // If no tracking ID exists, set a default or generate one
        trackingId = "000000";  // Set a custom default value
        // storeTrackingId(trackingId, "MTP"); // Store the default value
        console.log("Tracking ID initialized: ", trackingId);
    } else {
        console.log("Tracking ID found in localStorage: ", trackingId);
    }

    return trackingId;
}


let trackingCode_RectificationHC = getDecisionTreeText_RectificationHC();

// Function to initialize tracking ID (if needed)
export function initializeTrackingId_RectificationHC(trackingCode_RectificationHC) {

    let trackingId = getTrackingId(); // Try to retrieve from localStorage

    if (!trackingId) {
        // If no tracking ID exists, set a default or generate one
        trackingId = "000000";  // Set a custom default value
        // storeTrackingId(trackingId, "RectificationHC"); // Store the default value
        console.log("Tracking ID initialized: ", trackingId);
    } else {
        console.log("Tracking ID found in localStorage: ", trackingId);
    }

    return trackingId;
}


let trackingCode_WP = getDecisionTreeText_WPClaims();

// Function to initialize tracking ID (if needed)
export function initializeTrackingId_WP(trackingCode_WP) {


    let trackingId = getTrackingId(); // Try to retrieve from localStorage

    if (!trackingId) {
        // If no tracking ID exists, set a default or generate one
        trackingId = "000000";  // Set a custom default value
        // storeTrackingId(trackingId, "WP"); // Store the default value
        console.log("Tracking ID initialized: ", trackingId);
    } else {
        console.log("Tracking ID found in localStorage: ", trackingId);
    }

    return trackingId;
}



export function storeTrackingId(trackingId, logicName) {

    // Only proceed if a tracking ID is available and it's not the default '000000'
    if (!trackingId || trackingId === '000000' || trackingId === '000000000Z') {
        return;
    }

    const currentDateTime = new Date().toLocaleString();
    const hcLogic = logicName;

    // Retrieve existing tracking codes from local storage
    const trackingCodes = JSON.parse(localStorage.getItem('trackingCodes')) || [];
    trackingCodes.push({ dateTime: currentDateTime, hclogic: hcLogic, trackingId: trackingId });

    // Store updated tracking codes
    localStorage.setItem('trackingCodes', JSON.stringify(trackingCodes));
}



// Function to get tracking ID from localStorage
export function getTrackingId() {
    const trackingCodes = JSON.parse(localStorage.getItem('trackingCodes')) || [];
    if (trackingCodes.length > 0) {
        // Return the most recent tracking ID
        return trackingCodes[trackingCodes.length - 1].trackingId;
    }
    return null;
}