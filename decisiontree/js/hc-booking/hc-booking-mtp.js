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
    initializeTrackingId_MTP
} from '../utils.mjs';


document.addEventListener("DOMContentLoaded", () => {
    storeTrackingId(); // Store tracking ID for HCDT
    initStartButton(); // Initialize the start button
});


// ==========================
// 2. MTP Logic - LINES (360)
// ==========================

// Flag variables
let flags = {
    ioResponsible2: 0,
    tpvOutofScopeForMTP: 0,
    tpAdvWillUseCreditHireCar: 0,
    tpAcceptsCallBack: 0,
    ioAFinRecSetNotes: 0,
    tpvInsured: 0
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


// Decision Tree for MTP
export function getDecisionTreeText_MTP() {
    // Logic for the entire MTP decision tree using flags

    let flagCombination = Object.values(flags).join("");
    trackingId = document.querySelector("#tracking-id");
    trackingId.textContent = "Tracking Code: " + flagCombination;
    console.log("flagCombination: ", flagCombination);

    trackingId = flagCombination;
    storeTrackingId(trackingId, "MTP");  // Store tracking ID with timestamp
    // storeAccessInfo(trackingId);  // Store access info with timestamp

    initializeTrackingId_MTP(trackingId);

    // Add the logic here to display other instructions if needed

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

// ==========================
// Checkpoints (1 - 6)
// ==========================

// Start of MTP Logic
export function selectedMTP() {
    question =
        "Is the liability clear that IO is at fault based on the incident description?";
    hashText = "#ioResponsible2";
    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" },
        ],
        ioResponsible2
    );
}


// Checkpoint 1
function ioResponsible2(answer) {
    // Update breadcrumb and hashtag tracking with current question, answer, and relevant hashtag
    updateBreadcrumbAndHashtag(question, answer, hashText);

    // Set the ioResponsible2 flag based on the user's answer ("yes" = 1, anything else = 0)
    flags.ioResponsible2 = answer === "yes" ? 1 : 0;

    // Determine the next question based on the value of ioResponsible2 flag
    question = flags.ioResponsible2
        ? "Is the Third Party vehicle NOT covered under the Mission Third Party process (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks)?"
        : "Is there a note from Rec&Set that IO is at fault?";  // If ioResponsible2 is 1, ask about third party vehicles
    // If ioResponsible2 is 0, ask about Rec&Set note

    // Set the appropriate hashtag based on the value of ioResponsible2 flag
    hashText = flags.ioResponsible2 ? "#tpvOutofScopeForMTP" : "#ioAFinRecSetNotes";

    // Call the handleDecisionTree function with the next question, choices, and the corresponding handler function
    handleDecisionTree(
        question,  // The next question to ask
        [
            { label: "Yes", class: "yes" },  // Option 1: "Yes"
            { label: "No", class: "no" },   // Option 2: "No"
        ],
        // Choose the handler function based on the value of ioResponsible2
        flags.ioResponsible2 ? tpvOutofScopeForMTP : ioAFinRecSetNotes
    );
}

// Checkpoint 2
function tpvOutofScopeForMTP(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.tpvOutofScopeForMTP = answer === "yes" ? 1 : 0;
    question = flags.tpvOutofScopeForMTP
        ? "Is the Third Party vehicle insured?"
        : "Did the Third Party advised they currently have, have been offered or intent on accepting a Hire Car through a Credit Provider or Repairer?";
    hashText = flags.tpvOutofScopeForMTP ? "#tpvInsured" : "#tpAdvWillUseCreditHireCar";

    handleDecisionTree(
        question,
        [
            { label: "Yes", class: "yes" },
            { label: "No", class: "no" }
        ],
        flags.tpvOutofScopeForMTP ? tpvInsured : tpAdvWillUseCreditHireCar
    );
}

// Checkpoint 3
function tpAdvWillUseCreditHireCar(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.tpAdvWillUseCreditHireCar = answer === "yes" ? 1 : 0;
    if (flags.tpAdvWillUseCreditHireCar === 1) {
        question = `
                <p>Obtain as much information from the Third Party as possible (Step 5 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1732164158773?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a>)</p>
                <p>Advise the Third Party that a member of our Customer Support Team will be in contact with them.</p>
                <p>Did the Third Party Accept Call Back?</p>
        `;
        hashText = "#tpAcceptsCallBack";

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" }
            ],
            tpAcceptsCallBack
        );
    } else {
        getDecisionTreeText_MTP(
            flags.ioResponsible2,
            flags.tpvOutofScopeForMTP,
            flags.tpAdvWillUseCreditHireCar,
            flags.tpAcceptsCallBack,
            flags.ioAFinRecSetNotes,
            flags.tpvInsured

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;

    }

}

// Checkpoint 4
function tpAcceptsCallBack(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.tpAcceptsCallBack = answer === "yes" ? 1 : 0;

    getDecisionTreeText_MTP(
        flags.ioResponsible2,
        flags.tpvOutofScopeForMTP,
        flags.tpAdvWillUseCreditHireCar,
        flags.tpAcceptsCallBack,
        flags.ioAFinRecSetNotes,
        flags.tpvInsured

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
    EOF = true;

}

// Checkpoint 5
function ioAFinRecSetNotes(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.ioAFinRecSetNotes = answer === "yes" ? 1 : 0;
    if (flags.ioAFinRecSetNotes === 1) {
        getDecisionTreeText_MTP(
            flags.ioResponsible2,
            flags.tpvOutofScopeForMTP,
            flags.tpAdvWillUseCreditHireCar,
            flags.tpAcceptsCallBack,
            flags.ioAFinRecSetNotes,
            flags.tpvInsured

        );

        instruction = decisionTreeDiv.innerText;
        updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
        showCopyBreadcrumbBtn();
        showCopyHashtagBtn();
        EOF = true;

    } else {
        question = "Is the Third Party vehicle insured?";
        hashText = "#tpvInsured";

        handleDecisionTree(
            question,
            [
                { label: "Yes", class: "yes" },
                { label: "No", class: "no" }
            ],
            tpvInsured
        );
    }


}

// Checkpoint 6
function tpvInsured(answer) {
    updateBreadcrumbAndHashtag(question, answer, hashText);
    flags.tpvInsured = answer === "yes" ? 1 : 0;

    getDecisionTreeText_MTP(
        flags.ioResponsible2,
        flags.tpvOutofScopeForMTP,
        flags.tpAdvWillUseCreditHireCar,
        flags.tpAcceptsCallBack,
        flags.ioAFinRecSetNotes,
        flags.tpvInsured

    );

    instruction = decisionTreeDiv.innerText;
    updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
    showCopyBreadcrumbBtn();
    showCopyHashtagBtn();
    EOF = true;
}

// ==========================
// 2. END of MTP Logic
// ==========================