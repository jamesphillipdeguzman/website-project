import {
    updateHashtag,
    updateBreadcrumb,
    initStartButton,
    showCopyBreadcrumbBtn,
    showCopyHashtagBtn,
    decisionTreeDiv,
    notfound,
} from "./utils-hc-booking.js";

import {
    storeTrackingId,
    initializeTrackingId_WP
} from '../utils.mjs';


document.addEventListener("DOMContentLoaded", () => {
    storeTrackingId(); // Store tracking ID for HCDT
    initStartButton(); // Initialize the start button
});


// ==========================
// 4. Start of WP Claims Logic - (LINES 450)
// ==========================

// Flag variables
let flags = {
    claimReferredToInvestigation: 0,
    IROAssigned: 0,
    IRONoteClaimAccepted: 0,
    IRONoteClaimRejected: 0,
    rentalCarOptionOnThePolicy: 0,
    entitledToNAFHC: 0
};

let question = "";
let hashText = "";
let instruction = "";
let EOF = false;

// Helper function to update both breadcrumb and hashtag
function updateBreadcrumbAndHashtag(question, answer, hashText, instruction) {
    updateBreadcrumb(question, answer, instruction);
    if (hashText.length > 0) {
        updateHashtag(hashText, answer)
    } else {
        return;
    };
}


// Event Handler for Decision Tree Questions
function handleDecisionTree(question, options, nextStep) {
    debugger;
    decisionTreeDiv.innerHTML = `<p>${question}</p>`;
    options.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add(option.class);
        button.innerText = option.label;
        // answer = option.label;
        decisionTreeDiv.appendChild(button);
    });

    decisionTreeDiv.addEventListener(
        "click",
        (event) => {
            debugger;
            if (event.target.tagName === "BUTTON") {
                // Check for 'Limited' or 'Unlimited' class
                let answer = event.target.classList.contains("yes")
                    ? "yes"
                    : event.target.classList.contains("no")
                        ? "no" : "";

                debugger;
                if (answer === "") { answer = event.target.innerText };

                // Proceed with the next step (if not EOF or End-Of-File)
                if (EOF === false) { nextStep(answer) };
            }
        },
        { once: true }
    );

}



export let trackingId = "";


// Decision Tree for WP Claims
export function getDecisionTreeText_WPClaims() {
    // Logic for the entire WP Claims decision tree using flags

    let flagCombination = Object.values(flags).join("");
    trackingId = document.querySelector("#tracking-id");
    trackingId.textContent = "Tracking Code: " + flagCombination;
    console.log("flagCombination: ", flagCombination);

    trackingId = flagCombination;
    storeTrackingId(trackingId, "WP");  // Store tracking ID with timestamp
    // storeAccessInfo(trackingId);  // Store access info with timestamp

    initializeTrackingId_WP(trackingId);


    let reminder = `<div class="reminder"><p class="bold">🎗️Reminder: </p>
  <p><span class="bold">Warm Transfer the call to the Investigations Review Officer (IRO) allocated on the claim.</p>
        <p>If the officer is unavailable, please leave a voice message and advise the insured someone will return their call within 1 business day </p>
        <p>These calls will be returned by the IRO within 1 bus day . If the matter is escalated, please contact the IRO's Team Leader.</p></div>`;

    let reminder2 = `<div class="reminder"><p class="bold">🎗️Reminder: </p>
  <p><span class="bold">Please email a request to fraudtriage@suncorp.com.au to assign an IRO on the claim. </p>
        <p>These calls will be returned by the IRO within 1 bus day . If the matter is escalated, please contact the IRO's Team Leader.</p></div>`;



    // Switch statement to handle different flag combinations
    switch (flagCombination) {

        //     Scenario 1:
        case "111010":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO based on their Hire Car Coverage.</p>
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
          `;
            break;

        //     Scenario 5:
        case "110010":


            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO based on their Hire Car Coverage.</p>
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
        <p>${reminder}</p>
          `;

            break;


        //   Scenario 2:    
        case "111001":


            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO for a NAF HC.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
        
         
          `;
            break;

        //   Scenario 6:    
        case "110001":


            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO for a NAF HC.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
<p>${reminder}</p>
        
         
          `;
            break;

        //  Scenario 3, 4: 
        case "111000":
        case "110100":


            decisionTreeDiv.innerHTML = `
        <p><span class="bold">No HC Booking Required - Offer CDP Code.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
         
          `;
            break;

        //  Scenario 7: 
        case "110000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">No HC Booking Required - Offer CDP Code.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
         <p>${reminder}</p>
          `;
            break;


        //  Scenario 8: 
        case "100010":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO based on their Hire Car Coverage.</p>
        <p>If an IRO has not yet been assigned to the claim (there is no note in ClaimCenter with IRO details), please email <a href="mailto:fraudtriage@suncorp.com.au">fraudtriage@suncorp.com.au</a> and request customer contact.</p>
        <p>${reminder2}</p>
        
      `;
            break;

        //  Scenario 9: 
        case "100001":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Book IO for a NAF HC.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
        <p>${reminder2}</p>
        
    `;
            break;

        //  Scenario 10: 
        case "100000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">No HC Booking Required - Offer CDP Code.</p> 
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1736476666706?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a> - MC – Hire Car Vehicle Types, Booking Codes and Rates
</p>
        <p>${reminder2}</p>
        
    `;
            break;


        //  Scenario 11: 
        case "000000":

            decisionTreeDiv.innerHTML = `
        <p><span class="bold">Please select the appropriate path for your claim. You have currently selected the HCDT path for claims under investigation.</p> 
                 
          `;
            break;

        default:
            decisionTreeDiv.innerHTML = `<div class="mtp"><p>${notfound}</p>
       `;
    }

    return flagCombination;
}


// ==========================
// Checkpoints (1 - 6)
// ==========================

// Start of WP Claims Logic
export function selectedWPClaims() {
    //   Check if WP Claims Under Investigations
    question = "Has the claim been referred to Investigations?"
    hashText = "#claimReferredToInvestigation"

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],
        claimReferredToInvestigation
    );
}

// Checkpoint 1
function claimReferredToInvestigation(answer) {
    // Update breadcrumb and hashtag tracking with current question, answer, and relevant hashtag
    updateBreadcrumbAndHashtag(question, answer, hashText);
    // Set the repairQualityIssue flag based on the user's answer ("yes" = 1, anything else = 0)
    flags.claimReferredToInvestigation = answer === "yes" ? 1 : 0;
    if (flags.claimReferredToInvestigation === 0) {

        getDecisionTreeText_WPClaims(
            flags.claimReferredToInvestigation,
            flags.IROAssigned,
            flags.IRONoteClaimAccepted,
            flags.IRONoteClaimRejected,
            flags.rentalCarOptionOnThePolicy,
            flags.entitledToNAFHC
        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;
    } else {
        //     Jump to Checkpoint 2
        question = "Has an IRO been assigned to the claim?";
        hashText = "#IROAssigned";
        // Call the handleDecisionTree function with the next question, choices, and the corresponding handler function
        handleDecisionTree(
            question,  // The next question to ask
            [
                { label: "Yes", class: "yes" },  // Option 1: "Yes"
                { label: "No", class: "no" },   // Option 2: "No"
            ],
            // Go to next handler function
            IROAssigned
        );

    }
}

// Checkpoint 2
function IROAssigned(answer) {
    debugger;
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.IROAssigned = answer === "yes" ? 1 : 0;
    question = flags.IROAssigned
        ? "Is there a note from the IRO indicating that the claim has been accepted?"
        : "Does the customer have a rental car option added to their policy?"; // Jump to Checkpoint 5

    hashText = flags.IROAssigned ? "#IRONoteClaimAccepted" : "#rentalCarOptionOnThePolicy";

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],

        flags.IROAssigned ? IRONoteClaimAccepted : rentalCarOptionOnThePolicy
    );

}

// Checkpoint 3
function IRONoteClaimAccepted(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.IRONoteClaimAccepted = answer === "yes" ? 1 : 0;

    if (flags.IRONoteClaimAccepted === 0) {
        //     Jump to Checkpoint 4
        question = "Is there a note from the IRO indicating that the claim has been rejected?";
        hashText = "#IRONoteClaimRejected";

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            IRONoteClaimRejected
        );
    } else {

        // Jump to Checkpoint 5
        question = "Does the customer have a rental car option added to their policy?"
        hashText = "#rentalCarOptionOnThePolicy"

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            rentalCarOptionOnThePolicy
        );
    }

}



// Checkpoint 4
function IRONoteClaimRejected(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.IRONoteClaimRejected = answer === "yes" ? 1 : 0;

    if (flags.IRONoteClaimRejected === 1) {
        getDecisionTreeText_WPClaims(
            flags.claimReferredToInvestigation,
            flags.IROAssigned,
            flags.IRONoteClaimAccepted,
            flags.IRONoteClaimRejected,
            flags.rentalCarOptionOnThePolicy,
            flags.entitledToNAFHC
        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;
    } else {
        //     Jump to Checkpoint 5
        question = "Does the customer have a rental car option added to their policy?"
        hashText = "#rentalCarOptionOnThePolicy"

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            rentalCarOptionOnThePolicy
        );
    }

}


// Checkpoint 5
function rentalCarOptionOnThePolicy(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.rentalCarOptionOnThePolicy = answer === "yes" ? 1 : 0;

    if (flags.rentalCarOptionOnThePolicy === 1) {
        getDecisionTreeText_WPClaims(
            flags.claimReferredToInvestigation,
            flags.IROAssigned,
            flags.IRONoteClaimAccepted,
            flags.IRONoteClaimRejected,
            flags.rentalCarOptionOnThePolicy,
            flags.entitledToNAFHC
        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;
    } else {
        //     Jump to Checkpoint 6
        question = "Is the IO entitled to a NAF HC?"
        hashText = "#entitledToNAFHC"

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            entitledToNAFHC
        );
    }

}


// Checkpoint 6
function entitledToNAFHC(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.entitledToNAFHC = answer === "yes" ? 1 : 0;

    getDecisionTreeText_WPClaims(
        flags.claimReferredToInvestigation,
        flags.IROAssigned,
        flags.IRONoteClaimAccepted,
        flags.IRONoteClaimRejected,
        flags.rentalCarOptionOnThePolicy,
        flags.entitledToNAFHC
    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
    EOF = true;
}
// ==========================
// 4. End of WP Claims Logic
// ==========================