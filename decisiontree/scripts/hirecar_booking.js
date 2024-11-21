// Sample breadcrumb history array to hold the breadcrumb trail
//FSAB - how to troubleshoot functions here...

//Flow - function flow
//Show - display question
//Action - Yes/No
//Breadcrumb - update
//Previous question is for the next function


let breadcrumbHistory = [];

var question = "";
var instruction = "";

// Function to update the breadcrumb trail with the question and answer
function updateBreadcrumb(question, answer, instruction) {
    // Combine question and answer into one string, return the instruction if answer is empty
    const breadcrumbItem =
        answer === ""
            ? `${instruction}`
            : `${question} : ${answer === "yes" ? "Yes" : "No"}`;

    // alert(breadcrumbItem);

    // Add the question-answer pair to the breadcrumb history
    breadcrumbHistory.push(breadcrumbItem);

    // Update breadcrumb trail display
    const breadcrumbTrail = document.getElementById("breadcrumbTrail"); // Assuming the breadcrumb container has this ID
    breadcrumbTrail.innerHTML = breadcrumbHistory
        .map((item, index) => {
            return `<span class="breadcrumbContent">${item}</span>${index < breadcrumbHistory.length - 1 ? " &rtri; " : ""
                }`;
        })
        .join("");
}

const decisionTreeDiv = document.getElementById("decision-tree1");

// Function to uncheck the radio button
function uncheckRadioButton() {
    const radioSelected = document.querySelector('input[name="tree"]:checked');
    if (radioSelected) {
        radioSelected.checked = false; // Uncheck the selected radio button
    }
}

// Function to clear the breadcrumb and decision tree
function clearContent() {
    breadcrumbTrail.innerHTML = ""; // Clear breadcrumb trail
    decisionTreeDiv.innerHTML = ""; // Clear decision tree div
}

// Function to show the copy breadcrumb button
function showCopyBreadcrumbBtn() {
    const copyBreadcrumbBtn = document.querySelector("#copy-breadcrumb");
    copyBreadcrumbBtn.style.display = "block";

    const startBtn = document.querySelector("#start");
    startBtn.disabled = true; // Disable start button
    startBtn.classList.add("disabled"); // Add the 'disabled' class to change its appearance
}

// Function to handle the start button click
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
        rectificationQualityIssue(); // Activate Rectification Hire Car Logic
    } else if (radioSelected && radioSelected.value === "wpClaims") {
        wpClaimsLogic(); // Activate WP Claims Logic
    }

    // After starting, uncheck the radio button to prevent the same button from being selected again.
    //uncheckRadioButton();
});

// Function to handle the reset for breadcrumb


const clear = document.querySelector("#clear");
clear.addEventListener("click", () => {
    clearContent();
    window.location.href = window.document.URL;
    breadcrumbTrail.style.outline = "none";
    breadcrumbTrail.style.border = "none";
    uncheckRadioButton();
});




// Function to copy the breadcrumb content to the clipboard
function copyBreadcrumb() {
    const breadcrumbText = breadcrumbHistory.join(" > "); // Concatenate breadcrumb items as a string

    // Create a temporary input element to hold the text to be copied
    const tempInput = document.createElement("input");
    tempInput.value = breadcrumbText; // Set the value to the breadcrumb text
    document.body.appendChild(tempInput);

    // Select the text in the temporary input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Execute the "copy" command to copy the text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Optionally, you can show a notification that the text was copied

    const copyText = document.querySelector(".copytext");

    copyText.style.display = "block";
    copyText.innerHTML = "Copied text!";
}

// Attach the copy function to the "Copy Breadcrumb" button
document
    .getElementById("copy-breadcrumb")
    .addEventListener("click", copyBreadcrumb);

// START WP Claims Logic
function wpClaimsLogic() {
    decisionTreeDiv.innerHTML = `
        <p>What's the reason for the claim to be WP?</p>
        <button class="authorization" onclick="authorization()">Further Information Required</button>
        <button class="mechanical" onclick="mechanicalIssue()">Mechanical Issue</button>
        <button class="investigation" onclick="investigation()">Referred to Investigation</button>
    `;
}

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

// End of WP logic

// Rectification Hire Car Logic
function rectificationQualityIssue() {
    decisionTreeDiv.innerHTML = `
        <p>Did the customer call for a quality issue?</p>
        <button class="yes" onclick="vehicleDriveable('yes')">Yes</button>
        <button class="no" onclick="vehicleDriveable('no')">No</button>
    `;
}

function vehicleDriveable(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Is the vehicle driveable?</p>
            <button class="yes" onclick="sameRepairer('yes')">Yes</button>
            <button class="no" onclick="sameRepairer('no')">No</button>
        `;
    } else {
        followInsuredMTPProcess();
    }
}

function followInsuredMTPProcess() {
    decisionTreeDiv.innerHTML = `
        <p>Follow the Insured/MTP Hire Car Booking Process</p>
        <p>End Process.</p>
    `;
}

function sameRepairer(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer want to go back to the same repairer?</p>
            <button class="yes" onclick="originalRepairer('yes')">Yes</button>
            <button class="no" onclick="originalRepairer('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
        <p>"Book the quality Issue, and book Rectification Hire Car for <span class="bold">3 Business Days</span> on the date that the customer needs the Hire Car.</p>

<p class="italics">Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. </p>
	    <p>The Assessor will then determine if the Hire Car needs to be extended.</p>
            <p>End Process.</p>
`;
    }
}

function handleDifferentRepairer() {
    decisionTreeDiv.innerHTML = `
        <p>Book the quality issue and advise the customer to wait for our Assessor's call for the reinspection process.<br>
        Once we have the confirmed start date of repairs, book Rectification Hire Car for <span class="bold">3 Business Days</span> on the same date that the customer will drop off the vehicle back to the repairer for QI.</p>
        <p class="italics">Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. </p>
	    <p>The Assessor will then determine if the Hire Car needs to be extended.</p>
            <p>End Process.</p>
    `;
}

function originalRepairer(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Is the original repairer our recommended repairer?</p>
            <button class="yes" onclick="recommendedRepairer('yes')">Yes</button>
            <button class="no" onclick="recommendedRepairer('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
	<p>Book the quality issue and advise the customer to wait for our Assessor's call for the reinspection.
</p>
	<p>End Process</p>
`;
    }
}

function recommendedRepairer(answer) {
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Book Rectification Hire Car for <span class="bold">3 Business Days</span> on the same date that the customer will drop off the vehicle back to the repairer for QI.</p>
            <p class="italics">Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. </p>
	    <p>The Assessor will then determine if the Hire Car needs to be extended.</p>
            <p>End Process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Book the quality issue and advise the customer needs to call their repairer for the reinspection process.<br>
            Once we have the confirmed start date of repairs, book Rectification Hire Car for <span class="bold">3 Business Days</span> on the same date that the customer will drop off the vehicle back to the repairer for QI.</p>
            <p class="italics">Automatic Extension must be turned off for all Integrated Hire Car bookings for Rectification Hire Cars. </p>
	    <p>The Assessor will then determine if the Hire Car needs to be extended.</p>
            <p>End Process.</p>
        `;
    }
}

// END WP Claims Logic

// The existing insured and MTP functions go here...

// START MTP Logic

function selectedMTP() {
    question =
        "Is the liability clear that IO is at fault based on the incident description?";
    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="mtpLiability('yes')">Yes</button>
            <button class="no" onclick="mtpLiability('no')">No</button>
            
        `;
}

function mtpLiability(answer) {
    updateBreadcrumb(question, answer);
    question = "Did the Third Party advise whether they currently have, have been offered, or intend to accept a hire car through a credit provider or repairer?";
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="creditHireCar('yes')">Yes</button>
            <button class="no" onclick="creditHireCar('no')">No</button>
        `;
    } else {
        question = "Is there a note from Rec&Set that IO is at fault?";
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="recSetNote('yes')">Yes</button>
            <button class="no" onclick="recSetNote('no')">No</button>
        `;
    }
}

function creditHireCar(answer) {
    updateBreadcrumb(question, answer);
    question = "Obtain as much information from the Third Party as possible (Step 5 of KM1074811). Advise the Third Party that a member of our Customer Support Team will be in contact with them.";


    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <p>Did the Third Party Accepts Call Back?</p>
            <button class="yes" onclick="acceptsCallbacks('yes')">Yes</button>
            <button class="no" onclick="acceptsCallbacks('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>

            <p>Booking Codes: 
            Consumer All Brands and All Third Party Rectification Hire Cars - ITTP2
            P Electric Vehicles (Special Adrenaline IT Code) - ITTPADR</p>
        `;

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function acceptsCallbacks(answer) {
    updateBreadcrumb(question, answer);

    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Record the answers on the claim notes to the questions asked based on Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>Advise the Third party that our Customer Support team are claim experts who are in the best position to help manage their claim with us. </p> 
            <p>Go to Actions and set an Action Customer Query and assign to the TP Settlement Owner.</p>
    `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Record the answers on the claim notes to the questions asked based on Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>Record the TP has refused a call back in Notes.</p> 
            <p>Go to Actions and set an Action Customer Query and assign to the TP Settlement Owner.</p>
    `;
    }
    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();

}

function recSetNote(answer) {
    updateBreadcrumb(question, answer);
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>

            <p>Booking Codes: 
            Consumer All Brands and All Third Party Rectification Hire Cars - ITTP2
            P Electric Vehicles (Special Adrenaline IT Code) - ITTPADR</p>
        `;

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();

    } else {
        question = "Is the Third Party vehicle insured?";
        decisionTreeDiv.innerHTML = `
          <p>${question}</p>
            <button class="yes" onclick="isTPVInsured('yes')">Yes</button>
            <button class="no" onclick="isTPVInsured('no')">No</button>
        `;
    }
}


function isTPVInsured(answer) {
    updateBreadcrumb(question, answer);
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
       <p>Advise the Third Party that our Rec & Set has not given the liability outcome. Explain that they may lodge a claim to their Inurance to cover the cost of repairs of their car.</p>
       <p>If they decline to lodge the claim through their car's insurance, explain to IO that we need to wait until Rec & Set give us the liability outcome and our insured needs to be 100% at fault for them to be eligible for a hire car.</p>
    
    `;
    } else {
        decisionTreeDiv.innerHTML = `
      <p>Explain to IO that we need to wait until Rec & Set give us the liability outcome and our insured needs to be 100% at fault for them to be eligible for a hire car.</p>

    `;
    }
    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();

}
// END MTP Logic

// The existing insured functions go here...

// START Insured Logic

function selectedInsured() {
    question =
        "Is IO responsible for the accident/incident based on the incident description?";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ioResponsible('yes')">Yes</button>
            <button class="no" onclick="ioResponsible('no')">No</button>
   `;
}

function ioResponsible(answer) {
    updateBreadcrumb(question, answer);
    if (answer === "yes") {
        question = "Did the customer add a Hire Car Option on their Policy?";

        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="hireCarOption('yes')">Yes</button>
            <button class="no" onclick="hireCarOption('no')">No</button>
        `;
    } else {
        tpResponsible();
    }
}

function tpResponsible() {
    question = "Is the incident description clear that TP is responsible?";

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="tpAtFaultOnIncidentDesc('yes')">Yes</button>
        <button class="no" onclick="tpAtFaultOnIncidentDesc('no')">No</button>
    `;
}

function tpAtFaultOnIncidentDesc(answer) {
    updateBreadcrumb(question, answer);
    question =
        "Is there a note from Rec&Set that confirms TP is 100% responsible?";
    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="noteFromRecSet('yes')">Yes</button>
            <button class="no" onclick="noteFromRecSet('no')">No</button>
        `;
}

function noteFromRecSet(answer) {
    updateBreadcrumb(question, answer);
    question =
        "Does the customer have details of the at fault Party? Fullname, Address, and Rego?";
    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="custHaveTPAFDetails('yes')">Yes</button>
        <button class="no" onclick="custHaveTPAFDetails('no')">No</button>
    `;
}

function custHaveTPAFDetails(answer) {
    updateBreadcrumb(question, answer);
    question = "Was the excess waived?";
    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="excessWaived('yes')">Yes</button>
        <button class="no" onclick="excessWaived('no')">No</button>
    `;
}

function excessWaived(answer) {
    updateBreadcrumb(question, answer);
    question = "Does IO have the HC Cover on his policy?";

    decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="ioHasHCCoverOnPolicy('yes')">Yes</button>
            <button class="no" onclick="ioHasHCCoverOnPolicy('no')">No</button>
    `;
}

function ioHasHCCoverOnPolicy(answer) {
    updateBreadcrumb(question, answer);
    question = "Is this a Theft Claim?";
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="theftClaim('yes')">Yes</button>
            <button class="no" onclick="theftClaim('no')">No</button>
    `;
    } else {
        hireCarOption2(answer);
    }
}

function theftClaim(answer) {
    updateBreadcrumb(question, answer);
    question = "Is this a Bingle Policy?";
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="binglePolicy('no')">No</button>
    `;
    } else {
        hireCarOption2(answer);
    }
}

function hireCarOption2(answer) {
    // alert('hireCarOption');
    updateBreadcrumb(question, answer);
    question = "What kind of HC Coverage does the customer have?";
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="limited" onclick="limitedOption()">Limited</button>
            <button class="unlimited" onclick="unlimitedOption()">Unlimited</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> </p>
        `;
        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function binglePolicy(answer) {
    updateBreadcrumb(question, answer);
    if (answer === "yes") {
        question =
            "Explain to IO that they don't have the HC Option on their policy.";

        decisionTreeDiv.innerHTML = `
            <p>${question} Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
        `;
        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Book a Not at Fault Hire Car for unlimited days with a car that suits our customer's needs.
            AAMI, APIA, Suncorp, and GIO. Follow the initial booking days <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1074602&locale=en-GB" target="_blank">KM1074602</a>
            <ul>
                <li>SMART or cAre: 14 days</li>
                <li>Other Repair Type: 21 days</li>
            </ul> 
            </p>
        `;

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function hireCarOption(answer) {
    // alert('hireCarOption');
    updateBreadcrumb(question, answer);
    question = "What kind of HC Coverage does the customer have?";
    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="limited" onclick="limitedOption()">Limited</button>
            <button class="unlimited" onclick="unlimitedOption()">Unlimited</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> </p>
        `;
        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function limitedOption() {
    // alert('limitedOption');
    question =
        "Limited - An option added to Suncorp and GIO Policy Holders for 21 Calendar Days only.";

    decisionTreeDiv.innerHTML = `
        <p><span class="bold">${question}</span></p>
        <p>Initial Booking based on the Repairer:</p>
        <p class="bold">SMART or cAre: 14 days<br>Other Repair Type: 21 days</p>
        <p>GIO - ITGIO75<br>SUNCORP - ITSUN75</p>
    `;

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
}

function unlimitedOption() {
    // alert('unlimitedOption');
    question =
        "Unlimited - IO can use the Hire Car until the repairs are complete.";

    decisionTreeDiv.innerHTML = `
        <p><span class="bold">${question}</span></p>
        <p>Initial Booking based on the Repairer:</p>
        <p class="bold">SMART or cAre: 14 days<br>Other Repair Type: 21 days</p>
        <p>AAMI - ITHCOAAMI90<br>APIA - ITHCOAPIA90<br>SUNCORP - ITSUNUNLI100<br>GIO - ITGIOPLAT100<br>BINGLE - ITLLDU</p>
    `;
    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
}

function theftClaimType(answer) {
    // alert('theftClaimType');
    updateBreadcrumb(question, answer);
    question = "Is this a Bingle Policy?";

    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="theftBooking('no')">No</button>
        `;
    } else {
        noHireCar();
    }
}

function theftBooking(answer) {
    // alert('theftBooking');

    updateBreadcrumb(question, answer);
    question = "Book a Theft Hire Car for 21 days only.";

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <p>Note: If IO has a HC cover, we can extend the HC until their car is repaired or the claim is settled. If IO does not have the HC cover, they can only use the HC After Theft for 21 days.</p>
    `;
    instruction = decisionTreeDiv.innerText;
    updateBreadcrumb(question, "", instruction);
    showCopyBreadcrumbBtn();
}

function theftClaim2(answer) {
    // alert('theftClaim2');
    updateBreadcrumb(question, answer);
    question =
        "Does the customer have details of the at fault Party? Fullname, Address, and Rego?";

    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="haveTPAtFaultDetails('yes')">Yes</button>
        <button class="no" onclick="haveTPAtFaultDetails('no')">No</button>
    `;
}

function haveTPAtFaultDetails(answer) {
    // alert('haveTPAtFaultDetails');
    updateBreadcrumb(question, answer);
    question = "Does IO have the HC Cover on his policy?";

    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <button class="yes" onclick="withHCCover('yes')">Yes</button>
        <button class="no" onclick="withHCCover('no')">No</button>
    `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that the liability is clear that he/she is Not at Fault, but in order for us to 	provide a Not At Fault HC, we need to have the Fullname, Address, and Rego of the at fault party.</p>
            <p>Offer the CDP Code - Step 1 of <a 		href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
        `;
        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function withHCCover(answer) {
    // alert('withHCCover');
    updateBreadcrumb(question, answer);
    question = "What kind of HC Coverage does the customer have?";

    if (answer === "yes") {
        decisionTreeDiv.innerHTML = `
            <p>${question}:</p>
            <button class="limited" onclick="limitedOption()">Limited</button>
            <button class="unlimited" onclick="unlimitedOption()">Unlimited</button>
        `;
    } else {
        question =
            "Waive the excess and book a Not at Fault Hire Car for unlimited days.";
        decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <p>Follow the initial booking days <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1074602&locale=en-GB" target="_blank">KM1074602</a></p>
        <p class="bold">SMART or cAre: 14 days Other Repair Type: 21 days</p>
    `;

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumb(question, "", instruction);
        showCopyBreadcrumbBtn();
    }
}

function noHireCar() {
    // alert('noHireCar');
    updateBreadcrumb(question, answer);
    question =
        "Explain to IO that they don't have the HC Option on their policy.";
    decisionTreeDiv.innerHTML = `
        <p>${question}</p>
        <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
    `;
}

// END Insured Logic
