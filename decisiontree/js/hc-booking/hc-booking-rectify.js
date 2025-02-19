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
    initializeTrackingId_RectificationHC
} from '../utils.mjs';


document.addEventListener("DOMContentLoaded", () => {
    storeTrackingId(); // Store tracking ID for HCDT
    initStartButton(); // Initialize the start button
});


// ==========================
// 2. Rectification Logic - LINES (443)
// ==========================

// Flag variables
let flags = {
    repairQualityIssue: 0,
    approvedRepairer: 0,
    cashSettledRepairs: 0,
    driveableVehicle: 0,
    customerWantsOriginalRepairer: 0,
    recommendedRepairer: 0

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


// Decision Tree for Rectification HC
export function getDecisionTreeText_RectificationHC() {
    // Logic for the entire Rectification HC decision tree using flags

    let flagCombination = Object.values(flags).join("");
    trackingId = document.querySelector("#tracking-id");
    trackingId.textContent = "Tracking Code: " + flagCombination;
    console.log("flagCombination: ", flagCombination);

    trackingId = flagCombination;
    storeTrackingId(trackingId, "RectificationHC");  // Store tracking ID with timestamp
    // storeAccessInfo(trackingId);  // Store access info with timestamp

    initializeTrackingId_RectificationHC(trackingId);

    // Add the logic here to display other instructions if needed
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

// ==========================
// Checkpoints (1 - 6)
// ==========================

// Start of Rectification HC Logic
export function selectedRectificationHC() {
    //   Check if repairs is related to QI
    question = "Is the customer calling about an issue with the quality of the repairs?"
    hashText = "#repairQualityIssue"

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],
        repairQualityIssue
    );

}


// Checkpoint 1
function repairQualityIssue(answer) {
    // Update breadcrumb and hashtag tracking with current question, answer, and relevant hashtag
    updateBreadcrumbAndHashtag(question, answer, hashText);

    // Set the repairQualityIssue flag based on the user's answer ("yes" = 1, anything else = 0)
    flags.repairQualityIssue = answer === "yes" ? 1 : 0;

    if (flags.repairQualityIssue === 0) {

        getDecisionTreeText_RectificationHC(
            flags.repairQualityIssue,
            flags.approvedRepairer,
            flags.cashSettledRepairs,
            flags.driveableVehicle,
            flags.customerWantsOriginalRepairer,
            flags.recommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;
    } else {
        //     Jump to Checkpoint 2
        question = "Was the original repairer approved by our assessors?";
        hashText = "#approvedRepairer";

        // Call the handleDecisionTree function with the next question, choices, and the corresponding handler function
        handleDecisionTree(
            question,  // The next question to ask
            [
                { label: "Yes", class: "yes" },  // Option 1: "Yes"
                { label: "No", class: "no" },   // Option 2: "No"
            ],
            // Go to next handler function
            approvedRepairer
        );
    }

}

// Checkpoint 2
function approvedRepairer(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.approvedRepairer = answer === "yes" ? 1 : 0;
    if (flags.approvedRepairer === 0) {

        getDecisionTreeText_RectificationHC(
            flags.repairQualityIssue,
            flags.approvedRepairer,
            flags.cashSettledRepairs,
            flags.driveableVehicle,
            flags.customerWantsOriginalRepairer,
            flags.recommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;

    } else {
        question = "Were the repairs cash-settled?"
        hashText = "#cashSettledRepairs"

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            cashSettledRepairs
        );
    }

}

// Checkpoint 3
function cashSettledRepairs(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.cashSettledRepairs = answer === "yes" ? 1 : 0;
    if (flags.cashSettledRepairs === 1) {
        getDecisionTreeText_RectificationHC(
            flags.repairQualityIssue,
            flags.approvedRepairer,
            flags.cashSettledRepairs,
            flags.driveableVehicle,
            flags.customerWantsOriginalRepairer,
            flags.recommendedRepairer

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;

    } else {
        question = "Is the vehicle driveable?"
        hashText = "#driveableVehicle"

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" },
            ],

            driveableVehicle
        );

    }

}


//   Checkpoint 4
function driveableVehicle(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.driveableVehicle = answer === "yes" ? 1 : 0;

    question = "Does the customer want to go back to the original repairer?"
    hashText = "#customerWantsOriginalRepairer"

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],

        customerWantsOriginalRepairer
    );


}

//   Checkpoint 5
function customerWantsOriginalRepairer(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.customerWantsOriginalRepairer = answer === "yes" ? 1 : 0;

    question = "Is the original repairer one of our recommended repairers?"
    hashText = "#recommendedRepairer"

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],

        recommendedRepairer
    );

}


//   Checkpoint 6
function recommendedRepairer(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.recommendedRepairer = answer === "yes" ? 1 : 0;

    getDecisionTreeText_RectificationHC(
        flags.repairQualityIssue,
        flags.approvedRepairer,
        flags.cashSettledRepairs,
        flags.driveableVehicle,
        flags.customerWantsOriginalRepairer,
        flags.recommendedRepairer

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
    EOF = true;

}

// ==========================
// 3. END of Rectification Hire Car Logic
// ==========================