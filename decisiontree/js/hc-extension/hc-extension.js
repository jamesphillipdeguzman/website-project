// hirecar_extension.js

// Sample breadcrumb history array to hold the breadcrumb trail
//FSAB - how to troubleshoot functions here...

//Flow - function flow
//Show - display question
//Action - Yes/No
//Breadcrumb - update

//Previous question is for the next function


// ==========================
// A. Administrative Logic (Handles User Input)
// ==========================
let breadcrumbHistory = [];
let hashtagHistory = [];

// Function to update the hashtag trail
function updateHashtag(hashText, answer) {
  // alert(`hashText:  ${hashText}`);
  // alert(`answer:  ${answer}`);  
    showHashTags();
    const hashtagItem =
        answer === ""
            ? `${hashText}`
            : `${hashText}${answer === "yes" ? "Yes" : "No"}`;

    hashtagHistory.push(hashtagItem);

    const hashtagTrail = document.querySelector("#hashtagTrail");
    hashtagTrail.innerHTML = hashtagHistory
        .map((item, index) => {
            return `<span class="hashtagContent">${item}</span>
      ${index < hashtagHistory.length - 1 ? " &rtri; " : ""}`;
        })
        .join("");
}

// Function to update the breadcrumb trail
function updateBreadcrumb(question, answer, instruction) {
    showBreadcrumbs();

    const breadcrumbItem =
        answer === ""
            ? `${instruction}`
            : answer === "yes" || answer === "no"
                ? `${question} : ${answer === "yes" ? "Yes" : "No"}`
                : `${question} : ${answer === "Limited" ? "Limited" : "Unlimited"}`;

    breadcrumbHistory.push(breadcrumbItem);

    const breadcrumbTrail = document.querySelector("#breadcrumbTrail");
    breadcrumbTrail.innerHTML = breadcrumbHistory
        .map((item, index) => {
            return `<span class="breadcrumbContent">${item}</span>
      ${index < breadcrumbHistory.length - 1 ? " &rtri; " : ""}`;
        })
        .join("");
}


// ==========================
// A. END of Administrative Logic (Handles User Input)
// ==========================


// ==========================
// B. UI Manipulation (Handles User Interface Updates)
// ==========================
let breadcrumb = document.querySelector(".breadcrumb");
let hashTag = document.querySelector(".hashtag");
let copyBreadcrumbBtn = document.querySelector("#copy-breadcrumb");
let copyHashtagBtn = document.querySelector("#copy-hashtag");

function clearContent() {
    breadcrumbTrail.innerHTML = ""; // Clear breadcrumb trail
    hashtagTrail.innerHTML = ""; // Clear hashtag trail
    decisionTreeDiv.innerHTML = ""; // Clear decision tree div
    // Hide the breadcrumb and hashtags on first click of start button
    hideBreadcrumbs();
    hideHashTags();
}

function hideBreadcrumbs() {

    breadcrumb.style.opacity = "0";
    copyBreadcrumbBtn.style.display = "none";
}

function hideHashTags() {

    hashTag.style.opacity = "0";
    copyHashtagBtn.style.display = "none";

}

function showBreadcrumbs() {

    breadcrumb.style.opacity = "1";

}

function showHashTags() {

    hashTag.style.opacity = "1";

}

// Function to show the copy breadcrumb button
function showCopyBreadcrumbBtn() {

    copyBreadcrumbBtn.style.display = "block";


    const startBtn = document.querySelector("#start");
    startBtn.disabled = true; // Disable start button
    startBtn.classList.add("disabled"); // Add the 'disabled' class to change its appearance
}

// Function to show the copy hashtag button
function showCopyHashtagBtn() {

    copyHashtagBtn.style.display = "block";


    const startBtn = document.querySelector("#start");
    startBtn.disabled = true; // Disable start button
    startBtn.classList.add("disabled"); // Add the 'disabled' class to change its appearance
}

// Function to handle the reset for breadcrumb
const clear = document.querySelector("#clear");
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
function uncheckRadioButton() {
    const radioSelected = document.querySelector('input[name="tree"]:checked');
    if (radioSelected) {
        radioSelected.checked = false; // Uncheck the selected radio button
    }
}

const uncheckAllRadioButton = () => {
    const radioSelected = document.querySelectorAll('input[name="tree"]:checked');
    radioSelected.forEach(radio => {
        radio.checked = false;  // uncheck the selected radio button
    });
}

// Function to copy the breadcrumb content to the clipboard
function copyBreadcrumb() {
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
function copyHashtag() {
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
var notfound = `<div class=notfound><p>❗Note: The process barcode was not found.</p> 
 <p>Please contact the web developer to update the barcode.</p></div>`;
// ==========================
// C. END of Helper Functions (Reusable Utilities)
// ==========================






// ==========================
// D. Business Logic (Handles Core Logic and Function Calls)
// ==========================



const decisionTreeDiv = document.getElementById("decision-tree1");

// Function to handle the start button click and initiate the flow
const start = (document.getElementById("start").onclick = function () {
    const radioSelected = document.querySelector('input[name="tree"]:checked');

    // First, clear the existing content
    clearContent();

    // Show breadcrumb container onclick
    const breadcrumbContainer = document.querySelector("#breadcrumbContainer");
    breadcrumbContainer.style.display = "block";

    // Check which radio button is selected and run the corresponding logic
    if (radioSelected && radioSelected.value === "ecd") {
        selectedExtensionBasedOnECD();

    } else if (radioSelected && radioSelected.value === "totalLoss") {
        selectedExtensionForATotalLossCar();

    } else if (radioSelected && radioSelected.value === "claimsInvestigation") {
        selectedClaimsUnderInvestigations(); 

    } else if (radioSelected && radioSelected.value === "rectificationHC") {
        selectedRectificationHC(); 
    }

    // After starting, uncheck the radio button to prevent the same button from being selected again.
    //uncheckRadioButton();
});


// ==========================
// 1. START of Extension Based On ECD Logic - (LINES x-x)
// ==========================

// Initialize flags for ExtensionBasedOnECD; 1-Yes and 0-No
var flagStates = "";
var question = "";
var hashText = "";
var instruction = "";

var flagRepairsOngoing = 0;
var flageAssessmentOngoing = 0;
var flagIONAFOnIncidentDesc = 0;
var flagVehicleRepairable = 0;
var flagRepairsAuthorised = 0;
var flagClaimSettled = 0;
var flagECDOnTheClaim = 0;
var flagECDFromCustomer = 0;
var flagHireCarOptions = 0;



function getDecisionTreeText_ExtensionBasedOnECD(
    flagRepairsOngoing,
    flageAssessmentOngoing,
    flagIONAFOnIncidentDesc,
    flagVehicleRepairable,
    flagRepairsAuthorised,
    flagClaimSettled,
    flagECDOnTheClaim,
    flagECDFromCustomer,
    flagHireCarOptions
) {
    // Concatenate all flag values into a single string
    flagStates =
        flagRepairsOngoing +
        "" +
        flageAssessmentOngoing +
        "" +
        flagIONAFOnIncidentDesc +
        "" +
        flagVehicleRepairable +
        "" +
        flagRepairsAuthorised +
        "" +
        flagClaimSettled +
        "" +
        flagECDOnTheClaim +
        "" +
        flagECDFromCustomer +
        "" +
        flagHireCarOptions;

    alert(flagStates);

    let reminder1 = `<div class="reminder1"><p class="bold">🎗️Reminder:</p>
             <p>Where a booking is approaching 99 days and an extension will exceed the 99 day cap, you must complete the following:</p> 
             <ol>

		<li>Create a new manual booking in the Claim Center that mirrors the original booking. Important note: The start date of the new booking should be the day after the 99-day limit (i.e., if the capped end date for 99 days is 1/1/24, ensure that the start date of the manual booking is 2/1/24 or later).
</li>
		<li>You must send an email to <a href="mailto:aurentalextensions@hertz.com">aurentalextensions@hertz.com</a> to advise them of the extension.</li>
		
	     </ol>
 </div>
    `;
             
    let reminder2 = `<div class=reminder2><p class="bold">🎗️Reminder: </p>
              <p>If the last day of the policy benefit falls on a public holiday or branch closure day, the booking may be extended until the next business day.</p>
              <p>Advise the customer that the hire car must be returned prior to collecting the insured vehicle.</p>

</div>
`;

   

    // Switch statement to handle different flag combinations
    switch (flagStates) {

        // A - #limitedHireCarCover
        case "100000111":
        

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Extend HC according to the most recent update of the ECD:</span>/p>
	<ol>
		<li>Updated ECD on the Claim Center.</li>
		<li>If the customer can provide the updated ECD, and it is deemed fair and reasonable, and within policy limits.</li>
        </ol>
        <p>Whichever is the latest.</p>
	
        <p>${reminder1}</p>

        
     
    `;
            break;
       
        

        // Add more cases based on the combination of flags
        default:
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${notfound}</p>
      `;
    }
}

// Test the function
// getDecisionTreeText_ExtensionBasedOnECD();

function selectedExtensionBasedOnECD() {
    //alert("selectedExtensionBasedOnECD");
    question =
        "Are the repairs ongoing?";

    hashText = "#repairsOngoing";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="repairsOngoing('yes')">Yes</button>
            <button class="no" onclick="repairsOngoing('no')">No</button>
   `;
}

// Checkpoint 1
function repairsOngoing(answer) {
    alert("Checkpoint 1: repairsOngoing");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Are the repairs ongoing?
    if (answer === "yes") {
        flagRepairsOngoing = 1;
        alert("flagRepairsOngoing: " + flagRepairsOngoing);
    } else {
        flagRepairsOngoing = 0;
        alert("flagRepairsOngoing: " + flagRepairsOngoing);
    }

    if (answer === "yes") {
        //     Jump to Checkpoint 6
        alert("Checkpoint 6: ecdOnTheClaim");
        question = "Is the ECD shown on the Quote Management Page, Assessment Metrics, or Notes?";
        hashText = "#ecdOnTheClaim";

        decisionTreeDiv.innerHTML = `
      <p>${question}</p>
      <button class="yes" onclick="ecdOnTheClaim('yes')">Yes</button>
      <button class="no" onclick="ecdOnTheClaim('no')">No</button>
    `;
    }  else {
			//     Jump to Checkpoint 2
        question = "Is the assessment ongoing?";
        hashText = "#assessmentOngoing";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="assessmentOngoing('yes')">Yes</button>
        <button class="no" onclick="assessmentOngoing('no')">No</button>
      `;
    }
}

// Checkpoint 2
function assessmentOngoing(answer) {
    alert("Checkpoint 2: assessmentOngoing");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is the assessment ongoing?
    if (answer === "yes") {
        flagAssessmentOngoing = 1;
        alert("flagAssessmentOngoing: " + flagAssessmentOngoing);
    } else {
        flagAssessmentOngoing = 0;
        alert("flagAssessmentOngoing: " + flagAssessmentOngoing);
    }

    if (answer === "yes") {
        //     Jump to Checkpoint 8
        alert("Checkpoint 8: hireCarOptions");
        question = "Is the customer eligible for unlimited HC coverage?";
        hashText = "#hireCarOptions";

        decisionTreeDiv.innerHTML = `
      <p>${question}</p>
      <button class="yes" onclick="hireCarOptions('yes')">Yes</button>
      <button class="no" onclick="hireCarOptions('no')">No</button>
    `;
    } else {
        question = "Is the vehicle repairable?";
        hashText = "#vehicleRepairable";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="vehicleRepairable('yes')">Yes</button>
        <button class="no" onclick="vehicleRepairable('no')">No</button>
      `;
    }
}


// Checkpoint 3
function vehicleRepairable(answer) {
    alert("Checkpoint 3: vehicleRepairable");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is the vehicle repairable?
    if (answer === "yes") {
        flagVehicleRepairable = 1;
        alert("flagVehicleRepairable: " + flagVehicleRepairable);
    } else {
        flagVehicleRepairable = 0;
        alert("flagVehicleRepairable: " + flagVehicleRepairable);
    }

    if (answer === "yes") {
        //     Jump to Checkpoint 4
        alert("Checkpoint 4: repairsAuthorised");
        question = "Are the repairs authorised?";
        hashText = "#hireCarOptions";

        decisionTreeDiv.innerHTML = `
      <p>${question}</p>
      <button class="yes" onclick="repairsAuthorised('yes')">Yes</button>
      <button class="no" onclick="repairsAuthorised('no')">No</button>
    `;
    } else {
				//     Jump to Checkpoint 5
			  let q = `<p>Was the claim settled? </p>
				<ul>
					<li>Cash settlement in lieu of repairs</li>
					<li>Cash settlement due to Total Loss</li>
					<li>RVO (Replacement Vehicle)</li>
				</ul>`;
        question = `${q}`;
        hashText = "#claimSettled";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="claimSettled('yes')">Yes</button>
        <button class="no" onclick="claimSettled('no')">No</button>
      `;
    }
}


// Checkpoint 4
function repairsAuthorised(answer) {
    //alert("Checkpoint 4: noteIOAFFromRecSet");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Are the repairs authorised?
    if (answer === "yes") {
        flagRepairsAuthorised = 1;
        alert("flagRepairsAuthorised: " + flagRepairsAuthorised);
    } else {
        flagRepairsAuthorised = 0;
        alert("flagRepairsAuthorised: " + flagRepairsAuthorised);
    }
    question = "Are the repairs authorised?";
    hashText = "#repairsAuthorised";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="excessWaived('yes')">Yes</button>
            <button class="no" onclick="excessWaived('no')">No</button>
     `;
}

// Checkpoint 6
function ecdOnTheClaim(answer) {
    alert("Checkpoint 6: ecdOnTheClaim");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is the ECD shown on the Quote Management Page, Assessment Metrics, or Notes?
    if (answer === "yes") {
        flagECDOnTheClaim = 1;
        alert("flagECDOnTheClaim: " + flagECDOnTheClaim);
    } else {
        flagIOHasHCCover = 0;
        alert("flagECDOnTheClaim: " + flagECDOnTheClaim);
    }

    //Display question: "Did the customer mention a repair completion date?"
    
    if (flagRepairsOngoing === 1 && flagECDOnTheClaim === 1) {
        question = "Did the customer mention a repair completion date?";
        hashText = "#ecdFromCustomer";

        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ecdFromCustomer('yes')">Yes</button>
            <button class="no" onclick="ecdFromCustomer('no')">No</button>
        `;
    }
    
}


// Checkpoint 7
function ecdFromCustomer(answer) {
    alert("Checkpoint 7: ecdFromCustomer");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Did the customer mention a repair completion date?
    if (answer === "yes") {
        flagECDFromCustomer = 1;
        alert("flagECDFromCustomer: " + flagECDFromCustomer);
    } else {
        flagIOHasHCCover = 0;
        alert("flagECDFromCustomer: " + flagECDFromCustomer);
    }

    //Display question: "Did the customer mention a repair completion date?"
    
   if (answer === "yes") {
        question = "Is the customer eligible for unlimited HC coverage?";
        hashText = "#hireCarOptions";

        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="hireCarOptions('yes')">Yes</button>
            <button class="no" onclick="hireCarOptions('no')">No</button>
        `;
    }
    
}

// Checkpoint 8
function hireCarOptions(answer) {
    alert("Checkpoint 8: hireCarOptions");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is the customer eligible for unlimited HC coverage?
    if (answer === "yes") {
        flagHireCarOptions = 1;
        alert("flagHireCarOptions: " + flagHireCarOptions);
    } else {
        flagHireCarOptions = 0;
        alert("flagHireCarOptions: " + flagHireCarOptions);
			
				hashText = "#hireCarOptions";
			
		}
	
		if (answer === "yes") {
        
        getDecisionTreeText_ExtensionBasedOnECD(
            flagRepairsOngoing,
						flageAssessmentOngoing,
						flagIONAFOnIncidentDesc,
						flagVehicleRepairable,
						flagRepairsAuthorised,
						flagClaimSettled,
						flagECDOnTheClaim,
						flagECDFromCustomer,
						flagHireCarOptions
            
        );

    }
	
}

    