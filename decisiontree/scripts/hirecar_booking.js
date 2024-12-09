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
    if (radioSelected && radioSelected.value === "insured") {

        selectedInsured();
    } else if (radioSelected && radioSelected.value === "mtp") {
        selectedMTP();
    } else if (radioSelected && radioSelected.value === "rectificationHC2") {
        selectedRectificationHC(); // Activate Rectification Hire Car Logic
    } else if (radioSelected && radioSelected.value === "wpClaims") {
        selectedWPClaims(); // Activate WP Claims Logic
    }

    // After starting, uncheck the radio button to prevent the same button from being selected again.
    //uncheckRadioButton();
});

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

// ==========================
// C. END of Helper Functions (Reusable Utilities)
// ==========================






// ==========================
// D. Business Logic (Handles Core Logic and Function Calls)
// ==========================



// ==========================
// 1. START of Insured Logic - (LINES 250-1158)
// ==========================

// Initialize flags for Insured; 1-Yes and 0-No
var flagCombination = "";
var question = "";
var hashText = "";
var instruction = "";

var flagIOResponsible = 0;
var flagTheftClaim = 0;
var flagIONAFOnIncidentDesc = 0;
var flagIONAFInRecSetNotes = 0;
var flagExcessWaived = 0;
var flagTPDetailsAcquired = 0;
var flagIOHasHCCover = 0;
var flagBinglePolicy = 0;
var flagHireCarOptions = 0;

var flagHireCarCoverType = "Z";

// A - #limitedHireCarCover
// B - #unlimitedHireCarCover
// C - #noHCCover
// D - #hcAfterTheftCover
// E - #nafHCCover
// F - #cannotBookNoTPDetails
// G - #cannotBookHasTPDetailsButLiabilityUnclear
// H - #cannotBookNoTPDetailsButLiabilityUnclear
// Z - #default

function getDecisionTreeText_Insured(
    flagIOResponsible,
    flagTheftClaim,
    flagIONAFOnIncidentDesc,
    flagIONAFInRecSetNotes,
    flagExcessWaived,
    flagTPDetailsAcquired,
    flagIOHasHCCover,
    flagBinglePolicy,
    flagHireCarOptions,
    flagHireCarCoverType
) {
    // Concatenate all flag values into a single string
    flagCombination =
        flagIOResponsible +
        "" +
        flagTheftClaim +
        "" +
        flagIONAFOnIncidentDesc +
        "" +
        flagIONAFInRecSetNotes +
        "" +
        flagExcessWaived +
        "" +
        flagTPDetailsAcquired +
        "" +
        flagIOHasHCCover +
        "" +
        flagBinglePolicy +
        "" +
        flagHireCarOptions +
        "" +
        flagHireCarCoverType;

    //alert(flagCombination);

    let warning = `<div class="warning"><p class="bold">⚠️Warning!</p>
             <p>There may be a possible leakage because the excess was waived even when the liability is not clear or the details of the at-fault party is incomplete.</p> 
             <p>Please perform a claim health check first:</p>
             <ul>
		<li>1) Review the notes for any update about the Liability and details of the at-fault party.</li>
		<li>2) Check the documents.</li>
		<li>3) Review the at-fault party details if it is complete.</li>
	     </ul>
             <br>   
             <p>Once you have completed the above actions and the liability remains unclear or details of the at-fault party is incomplete, please warm transfer the call to Rec&Set - Settlement Owner.</p></div>`;
    let reminder = `<div class=reminder><p class="bold">🎗️Reminder: </p>
              <p>You may waive the excess.</p></div>`;

    let notfound = `<div class=notfound><p>❗Note: The process barcode was not found.</p> 
 <p>Please contact the web developer to update the barcode.</p></div>`;

    // Switch statement to handle different flag combinations
    switch (flagCombination) {

        // A - #limitedHireCarCover
        case "100000001A":
        case "010000001A":
        case "001111001A":
        case "001100100A":
        case "001011100A":
        case "001000100A":
        case "001111100A":
        case "000111100A":
        case "000100100A":
        case "000000100A":
        case "000001100A":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book a Limited Hire Car for IO</p> 
        <p>Limited HC for 21 days Only:</p>
        <p>Suncorp: 	ITSUN75</p>
        <p>GIO: 	ITGIO75</p>
        
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has a purchased a limited 21 day benefit and are entitled to a Not at Fault hire car on their policy, we are to use the Not at Fault Benefit first. NAF HC Code: ITNAF (All Brands)</p>
        
     
    `;
            break;
        // A - #limitedHireCarCover with Warning!
        case "001110100A":
        case "001010100A":
        case "000110100A":
        case "000011100A":
        case "000010100A":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book a Limited Hire Car for IO</p> 
        <p>Limited HC for 21 days Only:</p>
        <p>Suncorp: 	ITSUN75</p>
        <p>GIO: 	ITGIO75</p>
        
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has a purchased a limited 21 day benefit and are entitled to a Not at Fault hire car on their policy, we are to use the Not at Fault Benefit first. NAF HC Code: ITNAF (All Brands)</p>
        
        <p>${warning}</p>
    `;
            break;
        // A - #limitedHireCarCover with REMINDER
        case "001101100A":
        case "001001100A":
        case "000101100A":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book a Limited Hire Car for IO</p> 
        <p>Limited HC for 21 days Only:</p>
        <p>Suncorp: 	ITSUN75</p>
        <p>GIO: 	ITGIO75</p>
        
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has a purchased a limited 21 day benefit and are entitled to a Not at Fault hire car on their policy, we are to use the Not at Fault Benefit first. NAF HC Code: ITNAF (All Brands)</p>
        <p>${reminder}</p>
    `;
            break;
        // B - #unlimitedHireCarCover
        case "100000001B":
        case "010000001B":
        case "001111001B":
        case "001111100B":
        case "001100100B":
        case "001011100B":
        case "001000100B":
        case "000111100B":
        case "000100100B":
        case "000000100B":
        case "000001100B":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book an Unlimited HC for IO according to their Policy Coverage.</p>
        <ul>
            <li>AAMI - ITHCOAAMI90</li>
            <li>APIA - ITHCOAPIA90</li>
            <li>SUNCORP - ITSUNUNLI100</li>
            <li>GIO - ITGIOPLAT100</li>
            <li>Bingle - ITLLDU</li>
        </ul>
        <br>
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has purchased an Unlimited benefit and are entitled to the Not at Fault Hire Car on their policy, we are to use the Not at Fault Benefit first.</p>
        <p>Initial Booking based on the Repairer:</p>
        <p class="bold">SMART or cAre: 14 days<br>Other Repair Type: 21 days</p>
        
        
    `;
            break;
        // B - #unlimitedHireCarCover with Warning!
        case "001110100B":
        case "001010100B":
        case "000110100B":
        case "000011100B":
        case "000010100B":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book an Unlimited HC for IO according to their Policy Coverage.</p>
        <ul>
            <li>AAMI - ITHCOAAMI90</li>
            <li>APIA - ITHCOAPIA90</li>
            <li>SUNCORP - ITSUNUNLI100</li>
            <li>GIO - ITGIOPLAT100</li>
            <li>Bingle - ITLLDU</li>
        </ul>
        <br>
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has purchased an Unlimited benefit and are entitled to the Not at Fault Hire Car on their policy, we are to use the Not at Fault Benefit first.</p>
        <p>Initial Booking based on the Repairer:</p>
        <p class="bold">SMART or cAre: 14 days<br>Other Repair Type: 21 days</p>
        <p>${warning}</p>
        
    `;
            break;
        // B - #unlimitedHireCarCover with REMINDER
        case "001101100B":
        case "001001100B":
        case "000101100B":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book an Unlimited HC for IO according to their Policy Coverage.</p>
        <ul>
            <li>AAMI - ITHCOAAMI90</li>
            <li>APIA - ITHCOAPIA90</li>
            <li>SUNCORP - ITSUNUNLI100</li>
            <li>GIO - ITGIOPLAT100</li>
            <li>Bingle - ITLLDU</li>
        </ul>
        <br>
        <p class="bold red">❗IMPORTANT NOTE: </p>
        <p>Where a customer has purchased an Unlimited benefit and are entitled to the Not at Fault Hire Car on their policy, we are to use the Not at Fault Benefit first.</p>
        <p>Initial Booking based on the Repairer:</p>
        <p class="bold">SMART or cAre: 14 days<br>Other Repair Type: 21 days</p>
        <p>${reminder}</p>
    `;
            break;
        // C - #noHCCover
        case "100000000C":
        case "010000010C":
        case "001111010C":
        case "001100010C":
        case "001011010C":
        case "001000010C":
        case "000111010C":
        case "000100010C":
        case "000000010C":
        case "000001010C":
            decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> </p>
            
        `;

            break;
        // C - #noHCCover with Warning!
        case "001110010C":
        case "001010010C":
        case "000110010C":
        case "000011010C":
        case "000010010C":
            decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> </p>
       <p>${warning}</p>
            
        `;

            break;

        // C - #noHCCover with REMINDER!
        case "001101010C":
        case "001001010C":
        case "000101010C":
            decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> </p>
       <p>${reminder}</p>
            
        `;

            break;

        // D - #hcAfterTheftCover
        case "010000000D":
            decisionTreeDiv.innerHTML = `
            <p>Book a Theft HC for 21 days only.</p>

            <p>Note: If IO has a HC cover, we can extend the HC until their car is repaired or the claim is settled. If IO does not have the HC cover, they can only use the HC After Theft for 21 days.
            </p>
        `;
            break;
        // E - #nafHCCover
        case "001111000E":
        case "001011000E":
        case "000111000E":
        case "001111100E":
            decisionTreeDiv.innerHTML = `
            <p>Book a Not at Fault Hire Car for unlimited days with a car the suits our customer's needs.</p>
            <p>AAMI, APIA, Suncorp, and GIO. Follow the initial booking days <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732856454622?contentId=KM1074602&locale=en-GB" target="_blank">KM1074602</a></p>
            <p class="bold">SMART or cAre: 14 days</p>
            <p class="bold">Other Repair Type: 21 days</p>
        `;
            break;

        // E - #waiveExcess #nafHCCover
        case "001101000E":
        case "001001000E":
        case "000101000E":

            decisionTreeDiv.innerHTML = `
            <p>Waive the excess and book IO for a Not At Fault HC.
              Initial Booking base on the Repairer:
             </p>
            <p class="bold">SMART or cAre: 14 days</p>
            <p class="bold">Other Repair Type: 21 days</p>
        `;
            break;

        // F - #cannotBookNoTPDetails
        case "001100000F":
        case "001000000F":
        case "000100000F":
            decisionTreeDiv.innerHTML = `Explain to IO that we cannot book them a Hire Car because details of the at fault party is not complete. We need to have the fullname, address, and rego for us to cover them for a Not at fault hire car. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>
      `;

            break;

        // F - #cannotBookNoTPDetails with Warning!
        case "001110000F":
        case "001010000F":
        case "000110000F":
            decisionTreeDiv.innerHTML = `Explain to IO that we cannot book them a Hire Car because details of the at fault party is not complete. We need to have the fullname, address, and rego for us to cover them for a Not at fault hire car. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>
      <p>${warning}</p>`;
            break;

        // G - #cannotBookHasTPDetailsButLiabilityUnclear
        case "000001000G":

            decisionTreeDiv.innerHTML = `<p>Explain to IO that we cannot book them a Hire Car because we don't have the liability outcome.</p>
      <p>IO needs to be 100% not at fault to be eligible for the not at fault HC.</p>
      <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
    `;

            break;

        // G - #cannotBookHasTPDetailsButLiabilityUnclear with Warning!
        case "000011000G":
            decisionTreeDiv.innerHTML = `<p>Explain to IO that we cannot book them a Hire Car because we don't have the liability outcome.</p>
      <p>IO needs to be 100% not at fault to be eligible for the not at fault HC.</p>
      <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
      <p>${warning}</p>`;

            break;

        // H - #cannotBookNoTPDetailsButLiabilityUnclear
        case "000000000H":
            decisionTreeDiv.innerHTML = `<p>Explain to IO that we cannot book them a Hire Car because we don't have the liability outcome.</p>
      <p>IO needs to be 100% not at fault to be eligible for the not at fault HC.</p>
      <p>We will also need complete details of the at fault party (fullname, address, and rego)</p>
      <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>`

            break;

        // H - #cannotBookNoTPDetailsButLiabilityUnclear with Warning!
        case "000010000H":
            decisionTreeDiv.innerHTML = `<p>Explain to IO that we cannot book them a Hire Car because we don't have the liability outcome.</p>
      <p>IO needs to be 100% not at fault to be eligible for the not at fault HC.</p>
      <p>We will also need complete details of the at fault party (fullname, address, and rego)</p>
      <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
      <p>${warning}</p>`;

            break;

        // Add more cases based on the combination of flags
        default:
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${notfound}</p>
      `;
    }
}

// Test the function
// getDecisionTreeText_Insured();

function selectedInsured() {
    //alert("selectedInsured");
    question =
        "Is IO responsible for the accident/incident based on the incident description?";

    hashText = "#ioResponsible";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ioResponsible('yes')">Yes</button>
            <button class="no" onclick="ioResponsible('no')">No</button>
   `;
}

// Checkpoint 1
function ioResponsible(answer) {
    //alert("Checkpoint 1: ioResponsible");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is IO responsible for the accident/incident based on the incident description?
    if (answer === "yes") {
        flagIOResponsible = 1;
        //alert("flagIOResponsible: " + flagIOResponsible);
    } else {
        flagIOResponsible = 0;
        //alert("flagIOResponsible: " + flagIOResponsible);
    }

    if (answer === "yes") {
        //     Jump to Checkpoint 7
        //alert("Checkpoint 7: ioHasHCCoverOnPolicy");
        question = "Did the customer add a Hire Car Option on their Policy?";
        hashText = "#ioHasHCCover";

        decisionTreeDiv.innerHTML = `
      <p>${question}</p>
      <button class="yes" onclick="hireCarOption('yes')">Yes</button>
      <button class="no" onclick="hireCarOption('no')">No</button>
    `;
    } else {
        question = "Is this a Theft Claim?";
        hashText = "#theftClaim";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="theftClaim('yes')">Yes</button>
        <button class="no" onclick="theftClaim('no')">No</button>
      `;
    }
}
// Checkpoint 2
function theftClaim(answer) {
    //alert("Checkpoint 2: theftClaim");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is this a Theft Claim?
    if (answer === "yes") {
        flagTheftClaim = 1;
        //alert("flagTheftClaim: " + flagTheftClaim);
    } else {
        flagTheftClaim = 0;
        //alert("flagTheftClaim: " + flagTheftClaim);
    }

    if (flagIOResponsible === 0 && flagTheftClaim === 1) {
        question = "Did the customer add a Hire Car Option on their Policy?";
        hashText = "#ioHasHCCover";

        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="hireCarOption('yes')">Yes</button>
            <button class="no" onclick="hireCarOption('no')">No</button>
    `;
    } else {
        question = "Is the incident description clear that IO is NOT at fault?";
        hashText = "#ioNAFOnIncidentDesc";

        decisionTreeDiv.innerHTML = `
              <p>${question}</p>
              <button class="yes" onclick="ioAtFaultOnIncidentDesc('yes')">Yes</button>
              <button class="no" onclick="ioAtFaultOnIncidentDesc('no')">No</button>
          `;
    }
}
// Checkpoint 3
function ioAtFaultOnIncidentDesc(answer) {
    //alert("Checkpoint 3: ioAtFaultOnIncidentDesc");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is the incident description clear that IO is NOT at fault?
    if (answer === "yes") {
        flagIONAFOnIncidentDesc = 1;
        //alert("flagIONAFOnIncidentDesc: " + flagIONAFOnIncidentDesc);
    } else {
        flagIONAFOnIncidentDesc = 0;
        //alert("flagIONAFOnIncidentDesc: " + flagIONAFOnIncidentDesc);
    }

    question = "Is there a note from Rec&Set that IO is NOT at fault?";
    hashText = "#ioNAFInRecSetNotes";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="noteIOAFFromRecSet('yes')">Yes</button>
            <button class="no" onclick="noteIOAFFromRecSet('no')">No</button>
    `;
}
// Checkpoint 4
function noteIOAFFromRecSet(answer) {
    //alert("Checkpoint 4: noteIOAFFromRecSet");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is there a note from Rec&Set that IO is NOT at fault?
    if (answer === "yes") {
        flagIONAFInRecSetNotes = 1;
        //alert("flagIONAFInRecSetNotes: " + flagIONAFInRecSetNotes);
    } else {
        flagIONAFInRecSetNotes = 0;
        //alert("flagIONAFInRecSetNotes: " + flagIONAFInRecSetNotes);
    }
    question = "Is the excess waived?";
    hashText = "#excessWaived";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="excessWaived('yes')">Yes</button>
            <button class="no" onclick="excessWaived('no')">No</button>
     `;
}
// Checkpoint 5
function excessWaived(answer) {
    //alert("Checkpoint 5: excessWaived");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Was excess waived?
    if (answer === "yes") {
        flagExcessWaived = 1;
        //alert("flagExcessWaived: " + flagExcessWaived);
    } else {
        flagExcessWaived = 0;
        //alert("flagExcessWaived: " + flagExcessWaived);
    }

    question =
        "Did IO provide the complete details of the at fault-party? Fullname, address, and rego?";
    hashText = "#fullTPDetailsAcquired";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="fullTPDetailsAcquired('yes')">Yes</button>
            <button class="no" onclick="fullTPDetailsAcquired('no')">No</button>
     `;
}

// Checkpoint 6
function fullTPDetailsAcquired(answer) {
    //alert("Checkpoint 6: fullTPDetailsAcquired");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Did IO provide the complete details of the at fault-party? Fullname, address, and rego?
    if (answer === "yes") {
        flagTPDetailsAcquired = 1;
        //alert("flagTPDetailsAcquired: " + flagTPDetailsAcquired);
    } else {
        flagTPDetailsAcquired = 0;
        //alert("flagTPDetailsAcquired: " + flagTPDetailsAcquired);
    }

    question = "Did the customer add a Hire Car Option on their Policy?";
    hashText = "#ioHasHCCover";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ioHasHCCoverOnPolicy('yes')">Yes</button>
            <button class="no" onclick="ioHasHCCoverOnPolicy('no')">No</button>
    `;
}
// Checkpoint 7
function ioHasHCCoverOnPolicy(answer) {
    //alert("ioHasHCCoverOnPolicy");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Did the customer add a Hire Car Option on their Policy?
    if (answer === "yes") {
        flagIOHasHCCover = 1;
        //alert("flagIOHasHCCover: " + flagIOHasHCCover);
    } else {
        flagIOHasHCCover = 0;
        //alert("flagIOHasHCCover: " + flagIOHasHCCover);
    }

    //Display question: "Is this a Bingle policy?"
    // Condition: IO is not at fault and IO doesn't have the HC cover.
    if (flagIOResponsible === 0 && flagIOHasHCCover === 0) {
        question = "Is this a Bingle policy?";
        hashText = "#binglePolicy";

        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="binglePolicy('no')">No</button>
        `;
    }
    //Display question: "What kind of HC Coverage does the customer have?"
    else {
        question = "What kind of HC Coverage does the customer have?";
        hashText = "#hireCarOptions";

        if (answer === "yes") {
            decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="limited" onclick="limitedOption('Limited')">Limited</button>
            <button class="unlimited" onclick="unlimitedOption('Unlimited')">Unlimited</button>
    `;
        }
    }
}
// Checkpoint 8
function binglePolicy(answer) {
    //alert("Checkpoint 8: binglePolicy");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    //   Is this a Bingle policy?
    if (answer === "yes") {
        flagBinglePolicy = 1;
        //alert("flagBinglePolicy: " + flagBinglePolicy);
    } else {
        flagBinglePolicy = 0;
        //alert("flagBinglePolicy: " + flagBinglePolicy);

    }

    // C - #noHCCover
    if (
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 1
    ) {
        //alert("flagHireCarCoverType: C");
        hashText = "#noHCCover > #cdpCode";
        flagHireCarCoverType = "C";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }

    // D - #hcAfterTheftCover
    if (
        flagIOResponsible === 0 &&
        flagTheftClaim === 1 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: D");
        hashText = "#hcAfterTheftCover";
        flagHireCarCoverType = "D";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }

    // E - #nafHCCover
    if (
        flagExcessWaived === 1 &&
        flagTPDetailsAcquired === 1 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: E");
        hashText = "#nafHCCover";
        flagHireCarCoverType = "E";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }


    // E - #waiveExcess #nafHCCover
    if (
        flagIOResponsible === 0 &&
        flagTheftClaim === 0 &&
        flagExcessWaived === 0 &&
        flagTPDetailsAcquired === 1 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: E");
        hashText = "#waiveExcess #nafHCCover";
        flagHireCarCoverType = "E";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }


    // F - #cannotBookNoTPDetails
    if (
        flagIOResponsible === 0 &&
        flagTheftClaim === 0 &&
        flagTPDetailsAcquired === 0 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: F");
        hashText = "#cannotBookNoTPDetails";
        flagHireCarCoverType = "F";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }


    // G - #cannotBookHasTPDetailsButLiabilityUnclear
    if (
        flagIOResponsible === 0 &&
        flagTheftClaim === 0 &&
        flagIONAFOnIncidentDesc === 0 &&
        flagIONAFInRecSetNotes === 0 &&
        flagTPDetailsAcquired === 1 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: G");
        hashText = "#cannotBookHasTPDetailsButLiabilityUnclear";
        flagHireCarCoverType = "G";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }

    // G - #cannotBookHasTPDetailsButLiabilityUnclear
    if (
        flagIOResponsible === 0 &&
        flagTheftClaim === 0 &&
        flagIONAFOnIncidentDesc === 0 &&
        flagIONAFInRecSetNotes === 0 &&
        flagTPDetailsAcquired === 0 &&
        flagIOHasHCCover === 0 &&
        flagBinglePolicy === 0
    ) {
        //alert("flagHireCarCoverType: H");
        hashText = "#cannotBookNoTPDetailsButLiabilityUnclear";
        flagHireCarCoverType = "H";
        getDecisionTreeText_Insured(
            flagIOResponsible,
            flagTheftClaim,
            flagIONAFOnIncidentDesc,
            flagIONAFInRecSetNotes,
            flagExcessWaived,
            flagTPDetailsAcquired,
            flagIOHasHCCover,
            flagBinglePolicy,
            flagHireCarOptions,
            flagHireCarCoverType
        );
    }

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    updateHashtag(hashText, "");
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
}

// Checkpoint 9
function hireCarOption(answer) {
    //alert("Checkpoint 9: hireCarOptions");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    if (answer === "yes") {
        flagHireCarOptions = 1;
        //alert("flagHireCarOptions: " + flagHireCarOptions);
    } else {
        flagHireCarOptions = 0;
        //alert("flagHireCarOptions: " + flagHireCarOptions);
    }

    question = "What kind of HC Coverage does the customer have?";
    hashText = "#hireCarOptions";

    //   What kind of HC Coverage does the customer have?
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="limited" onclick="limitedOption('Limited')">Limited</button>
            <button class="unlimited" onclick="unlimitedOption('Unlimited')">Unlimited</button>
        `;
    } else {
        if (flagIOResponsible === 1 && flagHireCarOptions === 0) {
            //alert("flagHireCarCoverType: C");
            hashText = "#noHCCover > #cdpCode";
            updateHashtag(hashText, "");
            flagHireCarCoverType = "C";

            getDecisionTreeText_Insured(
                flagIOResponsible,
                flagTheftClaim,
                flagIONAFOnIncidentDesc,
                flagIONAFInRecSetNotes,
                flagExcessWaived,
                flagTPDetailsAcquired,
                flagIOHasHCCover,
                flagBinglePolicy,
                flagHireCarOptions,
                flagHireCarCoverType
            );

            instruction = decisionTreeDiv.innerText;
            updateBreadcrumb(question, "", instruction);
            showCopyBreadcrumbBtn();
            showCopyHashtagBtn();
        } else {
            question = "Is this a Bingle policy?";
            hashText = "#binglePolicy";

            decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="binglePolicy('no')">No</button>
        `;
        }
    }
}
// A - #limitedHireCarCover
function limitedOption(answer) {
    //alert("flagHireCarCoverType: A");
    hashText = "#limitedHireCarCover";
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, "");

    flagHireCarCoverType = "A";

    getDecisionTreeText_Insured(
        flagIOResponsible,
        flagTheftClaim,
        flagIONAFOnIncidentDesc,
        flagIONAFInRecSetNotes,
        flagExcessWaived,
        flagTPDetailsAcquired,
        flagIOHasHCCover,
        flagBinglePolicy,
        flagHireCarOptions,
        flagHireCarCoverType
    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
}
// B - #unlimitedHireCarCover
function unlimitedOption(answer) {
    //alert("flagHireCarCoverType: B");
    hashText = "#unlimitedHireCarCover";
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, "");

    flagHireCarCoverType = "B";

    getDecisionTreeText_Insured(
        flagIOResponsible,
        flagTheftClaim,
        flagIONAFOnIncidentDesc,
        flagIONAFInRecSetNotes,
        flagExcessWaived,
        flagTPDetailsAcquired,
        flagIOHasHCCover,
        flagBinglePolicy,
        flagHireCarOptions,
        flagHireCarCoverType
    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
}

// ==========================
// END of Insured Logic
// ==========================









// ==========================
// 2. START of MTP Logic - LINES (1168-1535)
// ==========================

// Initialize flags for Insured; 1-Yes and 0-No
var flagCombination = "";
var question = "";
var hashText = "";
var instruction = "";

var flagIOResponsible2 = 0;
var flagTPVOutofScopeForMTP = 0;
var flagTPAdvWillUseCreditHireCar = 0;
var flagTPAcceptsCallBack = 0;
var flagIOAFinRecSetNotes = 0;
var flagTPVInsured = 0;


function getDecisionTreeText_MTP(
    flagIOResponsible2,
    flagTPVOutofScopeForMTP,
    flagTPAdvWillUseCreditHireCar,
    flagTPAcceptsCallBack,
    flagIOAFinRecSetNotes,
    flagTPVInsured

) {
    // Concatenate all flag values into a single string
    flagCombination =
        flagIOResponsible2 +
        "" +
        flagTPVOutofScopeForMTP +
        "" +
        flagTPAdvWillUseCreditHireCar +
        "" +
        flagTPAcceptsCallBack +
        "" +
        flagIOAFinRecSetNotes +
        "" +
        flagTPVInsured;

    //alert(flagCombination);

    let mtpOOSMsg1 = `<div class="reminder">
        <p class="bold">🎗️For MTP out of Scope Vehicle (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks):</p>
        <p>Advise TP to lodge a claim to their Insurance and provide the claim number for the settlement process.</p></div>`;
    let liabilityMsg1 = `<div class=reminder><p class="bold">🎗️For Unclear Liability: </p>
              <p>Advise the Third Party that our Rec & Set has not given the liability outcome. Explain that they may lodge a claim to their Insurance to cover the cost of repairs of their car.</p>
              <p>If they decline to lodge the claim through their car's insurance, explain to IO that we need to wait until Rec & Set give us the liability outcome and our insured needs to be 100% at fault for them to be eligible for a hire car.</p></div>`;

    let mtpOOSMsg2 = `<div class="reminder">
        <p class="bold">🎗️For MTP out of Scope Vehicle (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks):</p>
        <p>Advise TP to submit 2 quotes and images to the Recoveries and Settlements team for review.  The Third Party should submit their documents to myclaim@[brand].com.au.</p></div>`;

    let liabilityMsg2 = `<div class=reminder><p class="bold">🎗️For Unclear Liability: </p>
              <p>Explain to IO that we need to wait until Rec & Set give us the liability outcome and our insured needs to be 100% at fault for them to be eligible for a hire car.</p></div>`;

    let notfound = `<div class=notfound><p>❗Note: The process barcode was not found.</p> 
 <p>Please contact the web developer to update the barcode.</p></div>`;
    // Switch statement to handle different flag combinations
    switch (flagCombination) {

        //     Scenario 1:
        case "101100":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record the answers on the claim notes to the questions asked based on Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p> 
        <p>Advise the Third party that our Customer Support team are claim experts who are in the best position to help manage their claim with us.</p>
        <p>Go to Actions and set an Action Customer Query and assign to the TP Settlement Owner.</p>
           
    `;
            break;
        //   Scenario 2:    
        case "101000":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record the answers on the claim notes to the questions asked based on Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p> 
        <p>Record the TP has refused a call back in Notes.</p>
        <p>Go to Actions and set an Action Customer Query and assign to the TP Settlement Owner.</p>
         
        `;
            break;


        //  Scenario 3 & 5: 
        case "000010":
        case "100000":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Continue to arrange the MTP Hire Car for the Third Party - <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p> 
        <p>Booking Codes:</p>
        <p>Consumer All Brands and All Third Party Rectification Hire Cars - ITTP2</p>
        <p>P Electric Vehicles (Special Adrenaline IT Code) - ITTPADR</p>
        
          `;
            break;
        //    Scenario 4 & 6:
        case "110001":
        case "000001":

            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${mtpOOSMsg1}</p>
                                <p>${liabilityMsg1}</p></div>
          `;
            break;
        //    Scenario 7
        case "000000":
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${mtpOOSMsg2}</p>
                                <p>${liabilityMsg2}</p></div>
          `;
            break;

        default:
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${notfound}</p>
       `;
    }
}

function selectedMTP() {
    // Check if the liability is clear
    question = "Is the liability clear that IO is at fault based on the incident description?";
    hashText = "#ioResponsible";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ioResponsible2('yes')">Yes</button>
            <button class="no" onclick="ioResponsible2('no')">No</button>
        `;
}

// Checkpoint 1
function ioResponsible2(answer) {
    //alert("Checkpoint 1: ioResponsible");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the liability clear that IO is at fault based on the incident description?
    if (answer === "yes") {
        flagIOResponsible2 = 1;
        //alert("flagIOResponsible2: " + flagIOResponsible2);
    } else {
        flagIOResponsible2 = 0;
        //alert("flagIOResponsible2: " + flagIOResponsible2);
    }


    if (answer === "no") {
        //     Jump to Checkpoint 5
        //alert("Checkpoint 5: ioAFinRecSetNotes");
        question = "Is there a note from Rec&Set that IO is at fault?";
        hashText = "#ioAFinRecSetNotes";

        decisionTreeDiv.innerHTML = `
      <p>${question}</p>
      <button class="yes" onclick="ioAFinRecSetNotes('yes')">Yes</button>
      <button class="no" onclick="ioAFinRecSetNotes('no')">No</button>
    `;
    } else {
        //     Jump to Checkpoint 2
        question = "Is the Third Party vehicle NOT covered under the Mission Third Party process (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks)?";
        hashText = "#tpvOutofScopeForMTP";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="tpvOutofScopeForMTP('yes')">Yes</button>
        <button class="no" onclick="tpvOutofScopeForMTP('no')">No</button>
      `;
    }

}

// Checkpoint 2
function tpvOutofScopeForMTP(answer) {
    //alert("Checkpoint 2: tpvOutofScopeForMTP");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the Third Party vehicle NOT covered under the Mission Third Party process (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks)?
    if (answer === "yes") {
        flagTPVOutofScopeForMTP = 1;
        //alert("flagTPVOutofScopeForMTP: " + flagTPVOutofScopeForMTP);
    } else {
        flagTPVOutofScopeForMTP = 0;
        //alert("flagTPVOutofScopeForMTP: " + flagTPVOutofScopeForMTP);
    }

    if (answer === "yes") {

        question = "Is the Third Party vehicle insured?";
        hashText = "#tpvInsured";
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="tpvInsured('yes')">Yes</button>
            <button class="no" onclick="tpvInsured('no')">No</button>
    `;
    } else {

        question = "Did the Third Party advised they currently have, have been offered or intent on accepting a Hire Car through a Credit Provider or Repairer?";
        hashText = "#tpAdvWillUseCreditHireCar";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="tpAdvWillUseCreditHireCar('yes')">Yes</button>
        <button class="no" onclick="tpAdvWillUseCreditHireCar('no')">No</button>
      `;

    }


}

// Checkpoint 3
function tpAdvWillUseCreditHireCar(answer) {
    //alert("Checkpoint 3: tpAdvWillUseCreditHireCar");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);
    // Did the Third Party advised they currently have, have been offered or intent on accepting a Hire Car through a Credit Provider or Repairer??
    if (answer === "yes") {
        flagTPAdvWillUseCreditHireCar = 1;
        //alert("flagTPAdvWillUseCreditHireCar: " + flagTPAdvWillUseCreditHireCar);
    } else {
        flagTPAdvWillUseCreditHireCar = 0;
        //alert("flagTPAdvWillUseCreditHireCar: " + flagTPAdvWillUseCreditHireCar);
    }

    if (answer === "yes") {
        question = "Did the Third Party Accepts Call Back?";
        hashText = "#tpAcceptsCallBack";
        decisionTreeDiv.innerHTML = `
            <p>Obtain as much information from the Third Party as possible (Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a>)</p>
            <p>Advise the Third Party that a member of our Customer Support Team will be in contact with them.</p>
            <p>${question}</p>
            <button class="yes" onclick="tpAcceptsCallBack('yes')">Yes</button>
            <button class="no" onclick="tpAcceptsCallBack('no')">No</button>
        `;
    } else {


        getDecisionTreeText_MTP(
            flagIOResponsible2,
            flagTPVOutofScopeForMTP,
            flagTPAdvWillUseCreditHireCar,
            flagTPAcceptsCallBack,
            flagIOAFinRecSetNotes,
            flagTPVInsured

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();


    }

}

// Checkpoint 4
function tpAcceptsCallBack(answer) {
    //alert("Checkpoint 4: tpAcceptsCallBack");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the Third Party vehicle NOT covered under the Mission Third Party process (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks)?
    if (answer === "yes") {
        flagTPAcceptsCallBack = 1;
        //alert("flagTPAcceptsCallBack: " + flagTPAcceptsCallBack);
    } else {
        tpAcceptsCallBack = 0;
        //alert("flagTPAcceptsCallBack: " + flagTPAcceptsCallBack);
    }
    getDecisionTreeText_MTP(
        flagIOResponsible2,
        flagTPVOutofScopeForMTP,
        flagTPAdvWillUseCreditHireCar,
        flagTPAcceptsCallBack,
        flagIOAFinRecSetNotes,
        flagTPVInsured

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();


}

// Checkpoint 5
function ioAFinRecSetNotes(answer) {
    //alert("Checkpoint 5: ioAFinRecSetNotes");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the Third Party vehicle NOT covered under the Mission Third Party process (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks)?
    if (answer === "yes") {
        flagIOAFinRecSetNotes = 1;
        //alert("flagIOAFinRecSetNotes: " + flagIOAFinRecSetNotes);
    } else {
        ioAFinRecSetNotes = 0;
        //alert("flagIOAFinRecSetNotes: " + flagIOAFinRecSetNotes);
    }


    if (answer === "yes") {

        getDecisionTreeText_MTP(
            flagIOResponsible2,
            flagTPVOutofScopeForMTP,
            flagTPAdvWillUseCreditHireCar,
            flagTPAcceptsCallBack,
            flagIOAFinRecSetNotes,
            flagTPVInsured

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();


    } else {

        question = "Is the Third Party vehicle insured?";
        hashText = "#tpvInsured";
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="tpvInsured('yes')">Yes</button>
            <button class="no" onclick="tpvInsured('no')">No</button>
        `;

    }

}

function tpvInsured(answer) {
    //alert("Checkpoint 6: tpvInsured");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    if (answer === "yes") {
        flagTPVInsured = 1;
        //alert("flagTPVInsured: " + flagTPVInsured);
    } else {
        flagTPVInsured = 0;
        //alert("flagTPVInsured: " + flagTPVInsured);
    }


    getDecisionTreeText_MTP(
        flagIOResponsible2,
        flagTPVOutofScopeForMTP,
        flagTPAdvWillUseCreditHireCar,
        flagTPAcceptsCallBack,
        flagIOAFinRecSetNotes,
        flagTPVInsured

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();


}

// ==========================
// 2. END of MTP Logic
// ==========================










// ==========================
// 3. Rectification HC Logic - LINES(1548-1969)
// ==========================

// Initialize flags for Insured; 1-Yes and 0-No
var flagCombination = "";
var question = "";
var hashText = "";
var instruction = "";

var flagRepairQualityIssue = 0;
var flagApprovedRepairer = 0;
var flagCashSettledRepairs = 0;
var flagDriveableVehicle = 0;
var flagCustomerWantsOriginalRepairer = 0;
var flagRecommendedRepairer = 0;


function getDecisionTreeText_RectificationHC(
    flagRepairQualityIssue,
    flagApprovedRepairer,
    flagCashSettledRepairs,
    flagDriveableVehicle,
    flagCustomerWantsOriginalRepairer,
    flagRecommendedRepairer

) {
    // Concatenate all flag values into a single string
    flagCombination =
        flagRepairQualityIssue +
        "" +
        flagApprovedRepairer +
        "" +
        flagCashSettledRepairs +
        "" +
        flagDriveableVehicle +
        "" +
        flagCustomerWantsOriginalRepairer +
        "" +
        flagRecommendedRepairer;

    //alert(flagCombination);

    let reminder = `<div class="reminder"><p class="bold">🎗️Reminder: </p>
  <p>Do not book the rectification HC until we have the confirmed start date of repairs.</p>
  <p>Advise IO/TP that they may use their car while waiting for the date of repairs.</p></div>`;

    // Switch statement to handle different flag combinations
    switch (flagCombination) {

        //     Scenario 1:
        case "000000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">This path is only for QI-related scenarios.</p>
        <p>You may clear the HCDT tool and choose the correct path based on your customer's needs.</p>
          `;
            break;

        //   Scenario 2:    
        case "100000":
            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Advise IO/TP that the original repairer was not authorized by us; therefore, they are not eligible for the lifetime repair guarantee.</p> 
        <p>Explain in a friendly tone that they may need to raise this issue directly back to the repairer.</p>
        <p>If IO or TP wish to complain, follow complaint process <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704283341?contentId=KM1129605&locale=en-GB" target="_blank">KM1129605</a></p>
        <p>Assign the complaint to the correct Team/queue <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704331985?contentId=KM1134602&locale=en-GB" target="_blank">KM1134602</a></p>
         
          `;
            break;


        //  Scenario 3: 
        case "111000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Advise IO/TP that the damage to their vehicle was not repaired but was cash-settled instead.</p> 
        <p>Explain in a friendly tone that they may need to raise this issue directly back to the repairer.</p>
        <p>If IO or TP wish to complain, follow complaint process <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704283341?contentId=KM1129605&locale=en-GB" target="_blank">KM1129605</a></p>
        <p>Assign the complaint to the correct Team/queue <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704331985?contentId=KM1134602&locale=en-GB" target="_blank">KM1134602</a></p>
         
          `;
            break;

        //  Scenario 4: 
        case "110111":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record QI and book a Rectification Hire Car for 3 Business Days on the same date that the customer will drop off the vehicle back to the repairer for repairs.</p> 
        <p>Follow Step 10 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. The Assessor will then determine if the Hire Car needs to be extended.</p>
        <p>${reminder}</p>
                 
          `;
            break;

        //  Scenario 5: 
        case "110110":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record the quality issue and advise the customer needs to call his repairer for the reinspection process.</p>
        <p>Once we have the confimed start date of repairs, book Rectification Hire Car for 3 Business Days on the same date that the customer will drop off the vehicle back to the repairer for QI.</p>
        <p>Follow Step 7 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>${reminder}</p>
        
      `;
            break;

        //  Scenario 6: 
        case "110101":

            decisionTreeDiv.innerHTML = `
        <p>Follow Step 9 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>No booking of the Rectification HC until ASCO or Assessor approves the reinspection.</p>
        
    `;
            break;

        //  Scenario 7: 
        case "110100":

            decisionTreeDiv.innerHTML = `
        <p>Follow Step 8 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>No booking of the Rectification HC until ASCO or Assessor approves the reinspection.</p>
        
    `;
            break;

        //  Scenario 8: 
        case "110011":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record QI and book Rectification Hire Car for 3 Business Days on the date the customer wishes to pick it up.</p> 
        <p>Follow Step 10 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. The Assessor will then determine if the Hire Car needs to be extended.</p>
                 
          `;
            break;

        //  Scenario 9: 
        case "110010":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record QI and book Rectification Hire Car for 3 Business Days on the date the customer wishes to pick it up.</p> 
        <p>Follow Step 7 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. The Assessor will then determine if the Hire Car needs to be extended.</p>
                 
          `;
            break;


        //  Scenario 10: 
        case "110000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record QI and book Rectification Hire Car for 3 Business Days on the date the customer wishes to pick it up.</p> 
        <p>Follow Step 8 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. The Assessor will then determine if the Hire Car needs to be extended.</p>
                 
          `;
            break;


        //  Scenario 11: 
        case "110001":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Record QI and book Rectification Hire Car for 3 Business Days on the date the customer wishes to pick it up.</p> 
        <p>Follow Step 9 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1733704756245?contentId=KM1141250&locale=en-GB" target="_blank">KM1141250</a></p>
        <p>Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. The Assessor will then determine if the Hire Car needs to be extended.</p>
                 
          `;
            break;

        default:
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${notfound}</p>
       `;
    }
}


function selectedRectificationHC() {
    //   Check if repairs is related to QI
    question = "Is the customer calling about an issue with the quality of the repairs?"
    hashText = "#repairQualityIssue"

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="repairQualityIssue('yes')">Yes</button>
        <button class="no" onclick="repairQualityIssue('no')">No</button>
    `;
}

// Checkpoint 1
function repairQualityIssue(answer) {
    //alert("Checkpoint 1: repairQualityIssue");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the customer calling about an issue with the quality of the repairs?
    if (answer === "yes") {
        flagRepairQualityIssue = 1;
        //alert("flagRepairQualityIssue: " + flagRepairQualityIssue);
    } else {
        flagRepairQualityIssue = 0;
        //alert("flagRepairQualityIssue: " + flagRepairQualityIssue);
    }


    if (answer === "no") {
        getDecisionTreeText_RectificationHC(
            flagRepairQualityIssue,
            flagApprovedRepairer,
            flagCashSettledRepairs,
            flagDriveableVehicle,
            flagCustomerWantsOriginalRepairer,
            flagRecommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
    } else {
        //     Jump to Checkpoint 2
        question = "Was the original repairer approved by our assessors?";
        hashText = "#approvedRepairer";

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="approvedRepairer('yes')">Yes</button>
        <button class="no" onclick="approvedRepairer('no')">No</button>
      `;
    }
}

// Checkpoint 2
function approvedRepairer(answer) {
    //alert("Checkpoint 2: approvedRepairer");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Was the original repairer approved by our assessors?
    if (answer === "yes") {
        flagApprovedRepairer = 1;
        //alert("flagApprovedRepairer: " + flagApprovedRepairer);
    } else {
        flagApprovedRepairer = 0;
        //alert("flagApprovedRepairer: " + flagApprovedRepairer);
    }

    if (answer === "no") {

        getDecisionTreeText_RectificationHC(
            flagRepairQualityIssue,
            flagApprovedRepairer,
            flagCashSettledRepairs,
            flagDriveableVehicle,
            flagCustomerWantsOriginalRepairer,
            flagRecommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();

    } else {

        question = "Were the repairs cash-settled?"
        hashText = "#cashSettledRepairs"

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="cashSettledRepairs('yes')">Yes</button>
        <button class="no" onclick="cashSettledRepairs('no')">No</button>
    `;

    }

}

// Checkpoint 3
function cashSettledRepairs(answer) {
    //alert("Checkpoint 3: cashSettledRepairs");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Were the repairs cash-settled?
    if (answer === "yes") {
        flagCashSettledRepairs = 1;
        //alert("flagCashSettledRepairs: " + flagCashSettledRepairs);
    } else {
        flagCashSettledRepairs = 0;
        //alert("flagCashSettledRepairs: " + flagCashSettledRepairs);
    }

    if (answer === "yes") {

        getDecisionTreeText_RectificationHC(
            flagRepairQualityIssue,
            flagApprovedRepairer,
            flagCashSettledRepairs,
            flagDriveableVehicle,
            flagCustomerWantsOriginalRepairer,
            flagRecommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();

    } else {

        question = "Is the vehicle driveable?"
        hashText = "#driveableVehicle"

        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="driveableVehicle('yes')">Yes</button>
        <button class="no" onclick="driveableVehicle('no')">No</button>
    `;
    }
}

//   Checkpoint 4
function driveableVehicle(answer) {

    //alert("Checkpoint 4: driveableVehicle");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Is the vehicle driveable?
    if (answer === "yes") {
        flagDriveableVehicle = 1;
        //alert("flagDriveableVehicle: " + flagDriveableVehicle);
    } else {
        flagDriveableVehicle = 0;
        //alert("flagDriveableVehicle: " + flagDriveableVehicle);
    }

    question = "Does the customer want to go back to the original repairer?"
    hashText = "#customerWantsOriginalRepairer"

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="customerWantsOriginalRepairer('yes')">Yes</button>
        <button class="no" onclick="customerWantsOriginalRepairer('no')">No</button>
    `;

}

//   Checkpoint 5
function customerWantsOriginalRepairer(answer) {

    //alert("Checkpoint 5: customerWantsOriginalRepairer");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Does the customer want to go back to the original repairer?
    if (answer === "yes") {
        flagCustomerWantsOriginalRepairer = 1;
        //alert("flagCustomerWantsOriginalRepairer: " + flagCustomerWantsOriginalRepairer);
    } else {
        flagCustomerWantsOriginalRepairer = 0;
        //alert("flagCustomerWantsOriginalRepairer: " + flagCustomerWantsOriginalRepairer);
    }

    question = "Is the original repairer one of our recommended repairers?"
    hashText = "#recommendedRepairer"

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="recommendedRepairer('yes')">Yes</button>
        <button class="no" onclick="recommendedRepairer('no')">No</button>
    `;

}

//   Checkpoint 6
function recommendedRepairer(answer) {

    //alert("Checkpoint 6: recommendedRepairer");
    updateBreadcrumb(question, answer);
    updateHashtag(hashText, answer);

    // Does the customer want to go back to the original repairer?
    if (answer === "yes") {
        flagRecommendedRepairer = 1;
        //alert("flagRecommendedRepairer: " + flagRecommendedRepairer);
    } else {
        flagRecommendedRepairer = 0;
        //alert("flagRecommendedRepairer: " + flagRecommendedRepairer);
    }


    getDecisionTreeText_RectificationHC(
        flagRepairQualityIssue,
        flagApprovedRepairer,
        flagCashSettledRepairs,
        flagDriveableVehicle,
        flagCustomerWantsOriginalRepairer,
        flagRecommendedRepairer

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();


}



// ==========================
// 3. END of Rectification Hire Car Logic
// ==========================









// ==========================
// 4. Start of WP Claims Logic - (LINES 1376-1538)
// ==========================
function selectedWPClaims() {
    decisionTreeDiv.innerHTML = `
        <p>What's the reason for the claim to be WP?</p>
        <button class="authorization" onclick="authorization()">Further Information Required</button>
        <button class="mechanical" onclick="mechanicalIssue()">Mechanical Issue</button>
        <button class="investigation" onclick="investigation()">Referred to Investigation</button>
    `;
}

// ==========================
// 4.1. Authorization Logic (Handling Policy Holder Authorization)
// ==========================
function authorization() {
    decisionTreeDiv.innerHTML = `
        <p>Have you secured authorization from the Policy Holder and accepted the claim?</p>
        <button class="yes" onclick="policyHolderAuthorization('yes')">Yes</button>
        <button class="no" onclick="policyHolderAuthorization('no')">No</button>
    `;
}

function policyHolderAuthorization(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer have a rental car option added on the policy?</p>
            <button class="yes" onclick="rentalCarOption('yes')">Yes</button>
            <button class="no" onclick="rentalCarOption('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to our customer that we need to secure authorization from the Policy Holder before we can proceed with the claim.</p>
            <p class="bold">No Hire Car Booking is required.</p>
            <p>End Process.</p>
        `;
    }
}

// ==========================
// 4.2. Rental Car Option Logic (Handling Rental Car Eligibility)
// ==========================
function rentalCarOption(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p class="bold">Book IO according to the type of HC Cover.</p>
		<p class="italics">A customer must not be refused a policy benefit due to their claim being in a WP status due to Investigation</p>
            <p>End Process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Is the customer entitled to a NAF HC?</p>
            <button class="yes" onclick="nafEligibility('yes')">Yes</button>
            <button class="no" onclick="nafEligibility('no')">No</button>
        `;
    }
}

function nafEligibility(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Book IO according to the NAF HC Process.</p>
            <p>End Process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy.<br>
            Offer the CDP Code - Step 1 of 
<a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
            <p>End Process.</p>
        `;
    }
}

// ==========================
// 4.3. Mechanical Issue Logic (Handling Mechanical Report and ASCO Approval)
// ==========================
function mechanicalIssue() {
    decisionTreeDiv.innerHTML = `
        <p>Did IO send a Mechanical Report?</p>
        <button class="yes" onclick="mechanicalReport('yes')">Yes</button>
        <button class="no" onclick="mechanicalReport('no')">No</button>
    `;
}

function mechanicalReport(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Did ASCO give approval for the Mechanical Report and accept the claim?</p>
            <button class="yes" onclick="ascoApproval('yes')">Yes</button>
            <button class="no" onclick="ascoApproval('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that we need to have the mechanical report for ASCO Team to review.</p>
            <p class="bold">No Hire Car Booking is required.</p>
            <p>End Process.</p>
        `;
    }
}

function ascoApproval(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer have a rental car option added on the policy?</p>
            <button class="yes" onclick="rentalCarOption('yes')">Yes</button>
            <button class="no" onclick="rentalCarOption('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that the claim is under review.</p>
            <p class="bold">No Hire Car Booking is required.</p>
            <p>End Process.</p>
        `;
    }
}

// ==========================
// 4.4. Investigation Logic (Handling the Investigation Outcome)
// ==========================
function investigation() {
    decisionTreeDiv.innerHTML = `
        <p>Do we have a review outcome?</p>
        <button class="yes" onclick="reviewOutcome('yes')">Yes</button>
        <button class="no" onclick="reviewOutcome('no')">No</button>
    `;
}

function reviewOutcome(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Is the claim rejected?</p>
            <button class="yes" onclick="claimRejected('yes')">Yes</button>
            <button class="no" onclick="claimRejected('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer have a rental car option added on the policy?</p>
            <button class="yes" onclick="rentalCarOption('yes')">Yes</button>
            <button class="no" onclick="rentalCarOption('no')">No</button>
        `;
    }
}

function claimRejected(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Explain the claim outcome to IO.</p>
            <p class="bold">No Hire Car Booking Required.</p>
            <p>End Process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer have a rental car option added on the policy?</p>
            <button class="yes" onclick="rentalCarOption('yes')">Yes</button>
            <button class="no" onclick="rentalCarOption('no')">No</button>
        `;
    }
}

// ==========================
// 4. End of WP Claims Logic
// ==========================