// Ensure these paths are correct for the imports
import { selectedInsured } from "./hc-booking-insured.js";
import { selectedMTP } from "./hc-booking-mtp.js";
import { selectedRectificationHC } from "./hc-booking-rectify.js";
import { selectedWPClaims } from "./hc-booking-wp.js";


// ==========================
// A. Administrative Logic (Handles User Input)
// ==========================
export let breadcrumbHistory = [];
export let hashtagHistory = [];
export let EOF = false;


// A helper to track if a question has already been answered
export let answeredQuestions = new Set();
export let hashtagBank = new Set();

// Function to update the hashtag trail
export function updateHashtag(hashText, answer) {
    debugger;
    showHashTags();

    // Ensure the hashText is updated with the appropriate suffix based on the answer
    const hashtagItem = `${hashText}${answer === "" ? "" :
        answer === "yes" ? "Yes" :
            answer === "no" ? "No" :
                answer === "Limited" ? "" :
                    answer === "Unlimited" ? "" : ""}`;

    if (hashtagBank.has(hashtagItem)) {
        return; // Skip if already added
    }

    // Push the newly constructed hashtag to history
    if (hashtagHistory.length >= 0) { hashtagHistory.push(hashtagItem) };

    const hashtagTrail = document.querySelector("#hashtagTrail");
    hashtagTrail.innerHTML = hashtagHistory
        .map((item, index) => {
            return `<span class="hashtagContent">${item}</span>
            ${index < hashtagHistory.length - 1 ? " &rtri; " : ""}`;
        })
        .join("");
}

let breadcrumbTrail = document.querySelector("#breadcrumbTrail");

// Function to update the breadcrumb trail
export function updateBreadcrumb(question, answer, instruction) {
    debugger;
    showBreadcrumbs();

    // Create a unique key for the question-answer pair
    const breadcrumbItemKey = `${question}-${answer}`;

    // Check if this question-answer pair has already been added
    if (answeredQuestions.has(breadcrumbItemKey)) {
        return; // Skip if already answered
    }

    // Add to the set to track that this question has been answered
    if (breadcrumbItemKey.length > 1) { answeredQuestions.add(breadcrumbItemKey) };

    const breadcrumbItem =
        answer === ""
            ? `${instruction}`
            : answer === "yes" || answer === "no"
                ? `${question} : ${answer === "yes" ? "Yes" : "No"}`
                : `${question} : ${answer === "Limited" ? "Limited" : "Unlimited"}`;

    if (breadcrumbItem.length > 1) {
        if (!breadcrumbHistory.includes(breadcrumbItem)) {
            breadcrumbHistory.push(breadcrumbItem);
        }
    }


    breadcrumbTrail.innerHTML = breadcrumbHistory
        .map((item, index) => {
            return `<span class="breadcrumbContent">${item}</span>
            ${index < breadcrumbHistory.length - 1 ? " &rtri; " : ""}`;
        })
        .join("");
}

export const decisionTreeDiv = document.getElementById("decision-tree1");

// Function to handle the start button click and initiate the flow
export function initStartButton() {
    const start = document.getElementById("start");
    start.onclick = function () {
        const radioSelected = document.querySelector('input[name="tree"]:checked');

        // First, clear the existing content
        clearContent();

        // Show breadcrumb container onclick
        const breadcrumbContainer = document.querySelector("#breadcrumbContainer");
        breadcrumbContainer.style.display = "block";
        debugger;
        // Check which radio button is selected and run the corresponding logic
        if (radioSelected && radioSelected.value === "insured") {
            selectedInsured();
        } else if (radioSelected && radioSelected.value === "mtp") {
            selectedMTP();
        } else if (radioSelected && radioSelected.value === "rectificationHC2") {
            selectedRectificationHC(); // Activate Rectification Hire Car Logic
        } else if (radioSelected && radioSelected.value === "wpClaims") {
            selectedWPClaims(); // Activate WP Claims Logic
        }
    };
}

// ==========================
// B. UI Manipulation (Handles User Interface Updates)
// ==========================
export let breadcrumb = document.querySelector(".breadcrumb");
export let hashTag = document.querySelector(".hashtag");
export let copyBreadcrumbBtn = document.querySelector("#copy-breadcrumb");
export let copyHashtagBtn = document.querySelector("#copy-hashtag");

// Function to clear content
export function clearContent() {
    breadcrumbTrail.innerHTML = ""; // Clear breadcrumb trail
    hashtagTrail.innerHTML = ""; // Clear hashtag trail
    decisionTreeDiv.innerHTML = ""; // Clear decision tree div
    // Hide the breadcrumb and hashtags on first click of start button
    hideBreadcrumbs();
    hideHashTags();
    EOF = false;
}

// Function to hide breadcrumbs
export function hideBreadcrumbs() {
    breadcrumb.style.opacity = "0";
    copyBreadcrumbBtn.style.display = "none";
}

// Function to hide hashtags
export function hideHashTags() {
    hashTag.style.opacity = "0";
    copyHashtagBtn.style.display = "none";
}

// Function to show breadcrumbs
export function showBreadcrumbs() {
    breadcrumb.style.opacity = "1";
}

// Function to show hashtags
export function showHashTags() {
    hashTag.style.opacity = "1";
}

// Function to show the copy breadcrumb button
export function showCopyBreadcrumbBtn() {
    copyBreadcrumbBtn.style.display = "block";

    const startBtn = document.querySelector("#start");
    startBtn.disabled = true; // Disable start button
    startBtn.classList.add("disabled"); // Add the 'disabled' class to change its appearance
}

// Function to show the copy hashtag button
export function showCopyHashtagBtn() {
    copyHashtagBtn.style.display = "block";

    const startBtn = document.querySelector("#start");
    startBtn.disabled = true; // Disable start button
    startBtn.classList.add("disabled"); // Add the 'disabled' class to change its appearance
}

// Function to handle the reset for breadcrumb
export const clear = document.querySelector("#clear");
clear.addEventListener("click", () => {
    clearContent();
    window.location.href = window.location.href;
    breadcrumbTrail.style.outline = "none";
    breadcrumbTrail.style.border = "none";
    uncheckAllRadioButton();
});

// ==========================
// B. END of UI Manipulation (Handles User Interface Updates)
// ==========================

// ==========================
// C. Helper Functions (Reusable Utilities)
// ==========================
export function uncheckRadioButton() {
    const radioSelected = document.querySelector('input[name="tree"]:checked');
    if (radioSelected) {
        radioSelected.checked = false; // Uncheck the selected radio button
    }
}

export const uncheckAllRadioButton = () => {
    const radioSelected = document.querySelectorAll('input[name="tree"]:checked');
    radioSelected.forEach(radio => {
        radio.checked = false;  // uncheck the selected radio button
    });
}

// Function to copy the breadcrumb content to the clipboard
export function copyBreadcrumb() {
    const breadcrumbText = breadcrumbHistory.join(" > "); // Concatenate breadcrumb items as a string

    const tempInput = document.createElement("input");
    tempInput.value = breadcrumbText; // Set the value to the breadcrumb text
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    document.body.removeChild(tempInput);

    const copyText = document.querySelector(".copytext");
    copyText.style.display = "block";
    copyText.innerHTML = "Copied text!";
}

// Function to copy the hashtag content to the clipboard
export function copyHashtag() {
    const hashtagText = hashtagHistory.join(" > "); // Concatenate hashtag items as a string

    const tempInput = document.createElement("input");
    tempInput.value = hashtagText; // Set the value to the hashtag text
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    document.body.removeChild(tempInput);

    const copyText2 = document.querySelector(".copytext2");
    copyText2.style.display = "block";
    copyText2.innerHTML = "Copied text!";
}

// Attach the copy function to the "Copy Breadcrumb" button
document
    .querySelector("#copy-breadcrumb")
    .addEventListener("click", copyBreadcrumb);

// Attach the copy function to the "Copy Hashtag" button
document.querySelector("#copy-hashtag").addEventListener("click", copyHashtag);

// Default not found message is the process code is not found
export var notfound = `<div class=notfound><p>❗Note: The tracking code was not found.</p> 
 <p>Please contact the web developer to create a new tracking code for this process.</p></div>`;



// ==========================
// C. END of Helper Functions (Reusable Utilities)
// ==========================