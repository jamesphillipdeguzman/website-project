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
  initializeTrackingId_Insured
} from '../utils.mjs';


document.addEventListener("DOMContentLoaded", () => {
  storeTrackingId(); // Store tracking ID for HCDT
  initStartButton(); // Initialize the start button
});

// ==========================
// 1. Insured Logic - LINES (990)
// ==========================

// Flag Variables
let flags = {
  ioResponsible: 0,
  theftClaim: 0,
  ioNAFOnIncidentDesc: 0,
  ioNAFInRecSetNotes: 0,
  excessWaived: 0,
  fullTPDetailsAcquired: 0,
  ioHasHCCover: 0,
  binglePolicy: 0,
  hireCarOptions: 0,
  hireCarCoverType: "Z",
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
            ? "no"
            : event.target.classList.contains("Limited")
              ? "Limited"
              : event.target.classList.contains("Unlimited")
                ? "Unlimited"
                : "";

        debugger;
        if (answer === "") { answer = event.target.innerText };

        // Set the hireCarCoverType based on the answer
        if (answer === "Limited") {
          limitedOption(answer);  // This function will handle the setting of flags
        } else if (answer === "Unlimited") {
          unlimitedOption(answer);
        }

        // Proceed with the next step (if not EOF or End-Of-File)
        if (EOF === false) { nextStep(answer) };
      }
    },
    { once: true }
  );

}

export let trackingId = "";


// Decision Tree for Insured
export function getDecisionTreeText_Insured() {
  // Logic for the entire Insured decision tree using flags

  let flagCombination = Object.values(flags).join("");
  trackingId = document.querySelector("#tracking-id");
  trackingId.textContent = "Tracking Code: " + flagCombination;
  console.log("flagCombination: ", flagCombination);

  trackingId = flagCombination;
  storeTrackingId(trackingId, "Insured");  // Store tracking ID with timestamp
  // storeAccessInfo(trackingId);  // Store access info with timestamp

  initializeTrackingId_Insured(trackingId);


  // Add the logic to display warnings/reminders if needed

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


  let important = `<p class="bold red">❗IMPORTANT NOTE: </p>
            <p>Where a customer has purchased a Limited benefit and are entitled to the Theft Hire Car on their policy, we are to use the Theft HC first for 21 days, then extend the HC for another 21 days using the Limited Cover.</p>
            `;
  let bookNAFHC = `
      <p class="bold">Book the Not At Fault HC</p>

<p>(For Bingle Policies, book HC according to their HC Optional Cover)</p>

<p>Initial Booking based on the Repairer:</p>
<p>SMART or cAre: 14 days</p>
<p>Other Repair Type: 21 days</p>

<p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
      
  `;

  let importantNote = `<p><span class="bold red">❗IMPORTANT NOTE:</span> Where a customer has purchased a Limited or Unlimited benefit and are entitled to the Not at Fault Hire Car on their policy, we are to use the Not at Fault Benefit first (except Bingle Policies)
</p> 
      <p>NAF HC Code: <span class="bold">ITNAF</span> (All Brands)</p>`;


  let reminder = `<div class=reminder><p class="bold">🎗️Reminder: </p>
  <p>You may waive the excess.</p></div>`;

  let bookNAFHCexceptBingle = `
      <p class="bold">Book the Not At Fault HC</p>

<p>(No HC Booking for Bingle Policy Holder)</p>

<p>Initial Booking based on the Repairer:</p>
<p>SMART or cAre: 14 days</p>
<p>Other Repair Type: 21 days</p>

<p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
  `;

  let bookLimitedHCFor21Days = `<p><span class="bold">Book the Limited HC for 21 days (Do not book HC to Bingle Policies)</span></p> 
            <p><span class="bold">Limited</span> - An option added to Suncorp and GIO Policy Holders for 21 Calendar Days only</p>
            <p>Initial Booking based on the Repairer:
            <p>SMART or cAre: 14 days</p>
            <p>Other Repair Type: 21 days</p>
            <p>GIO: ITGIO75</p>
            <p>Suncorp: ITSUN75</p>
            <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
  `;

  let bookUnlimitedHC = `
  
          <p class="bold">Book the Unlimited HC Cover</p> 
          <p>IO can use the Hire Car until the repairs are complete and if the claim has been settled.</p>
          <p>Initial Booking based on the Repairer:
          <p>SMART or cAre: 14 days</p>
          <p>Other Repair Type: 21 days</p>
          <p>AAMI - ITHCOAAMI90</p>
          <p>APIA - ITHCOAPIA90</p>
          <p>SUNCORP - ITSUNUNLI100</p>
          <p>GIO - ITGIOPLAT100</p>
          <p>BINGLE - ITLLDU</p>
          <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>

  `;

  let noHCCover = `<p><span class="bold">Explain to IO that they don't have the HC Option on their policy. </P>
            <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
            
  `;

  let cannotBookNoTPDetails = `<p>Explain to IO that we cannot book them a Hire Car because details of the at-fault party is not complete.</p>
  <p>We need to have the fullname, address, and rego for us to cover them for a Not at fault hire car.</p>
  <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
  
  `;

  let cannotBookNoTPDetailsButLiabilityUnclear = `<p>Explain to IO that we cannot book them a Hire Car because we don't have the liability outcome.</p>
  <p>IO needs to be 100% not at fault to be eligible for the not at fault HC.</p>
  <p>We will also need complete details of the at-fault party (fullname, address, and rego).</p>
  <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
  
  
  `;


  // Switch statement to handle different flag combinations

  switch (flagCombination) {
    // A - #limitedHireCarCover (bookLimitedHCFor21Days + importantNote)
    case "100000100A":

      decisionTreeDiv.innerHTML = `
            <p>${bookLimitedHCFor21Days}</p>
            <p>${importantNote}</p>
        `;
      break;
    // A - #limitedHireCarCover (with important)
    case "010000100A":

      decisionTreeDiv.innerHTML = `
            <p><span class="bold">Limited - Book Theft HC for 21 Calendar Days ONLY.</p> 
            <br>
            <p>Initial Booking for Theft Claims: 21 Calendar Days</p>
            <br>
            <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
            
            <p>${important}</p>
        `;
      break;

    // A - #limitedHireCarCover (bookNAFHC + importantNote)
    case "001111100A":
    case "001011100A":
    case "000111100A":

      decisionTreeDiv.innerHTML = `
      <p>${bookNAFHC}</p>
      <p>${importantNote}</p>`;
      break;

    // A - #limitedHireCarCover (bookNAFHC + importantNote + reminder)

    case "001101100A":
    case "001001100A":
    case "000101100A":

      decisionTreeDiv.innerHTML = `
        <p>${bookNAFHC}</p> 
        <p>${importantNote}</p>       
        <p>${reminder}</p>
    `;
      break;

    // A - #limitedHireCarCover (bookLimitedHCFor21Days)
    case "001000100A":
    case "000100100A":
    case "000000100A":
    case "000001100A":

      decisionTreeDiv.innerHTML = `
        <p>${bookLimitedHCFor21Days}</p>

      `;
      break;
    // A - #limitedHireCarCover (bookLimitedHCFor21Days + warning)
    case "001110100A":
    case "000110100A":
    case "000011100A":
    case "000010100A":

      decisionTreeDiv.innerHTML = `
          <p>${bookLimitedHCFor21Days}</p>
          <p>${warning}</p>

      `;
      break;



    // A - #limitedHireCarCover
    case "001100100A":

      decisionTreeDiv.innerHTML = `
<p><span class="bold">Limited</span> - An option added to Suncorp and GIO Policy Holders for 21 Calendar Days only.
</p> 
<br>
<p>Initial Booking based on the Repairer:
<p>SMART or cAre: 14 days</p>
<p>Other Repair Type: 21 days</p>

`;
      break;
    // B - #unlimitedHireCarCover (bookUnlimitedHC)
    case "001000100B":
    case "000100100B":
    case "000000100B":
    case "000001100B":

      decisionTreeDiv.innerHTML = `
          <p>${bookUnlimitedHC}</p>
     
      `;
      break;


    // B - #unlimitedHireCarCover (bookUnlimitedHC + importantNote)
    case "100000100B":

      decisionTreeDiv.innerHTML = `
          <p>${bookUnlimitedHC}</p>
          <p>${importantNote}</p>
      `;
      break;

    // B - #unlimitedHireCarCover (No Note)
    case "010000100B":

      decisionTreeDiv.innerHTML = `
        <p><span class="bold">Unlimited - IO can use the Hire Car until the repairs are complete and if the claim has been settled.</span></p> 
        <br>
        <p>Initial Booking for Theft Claims: 21 Calendar Days</p>
        
        <br>
        <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
        
          `;
      break;

    // B - #unlimitedHireCarCover (bookNAFHC + importantNote)
    case "001111100B":
    case "001011100B":
    case "000111100B":


      decisionTreeDiv.innerHTML = `
    <p>${bookNAFHC}</p>
    <p>${importantNote}</p>`;
      break;

    // B - #unlimitedHireCarCover (bookNAFHC + importantNote + reminder)
    case "001101100B":
    case "001001100B":
    case "000101100B":

      decisionTreeDiv.innerHTML = `
        <p>${bookNAFHC}</p>
        <p>${importantNote}</p>
        <p>${reminder}</p>

`;
      break;


    // B - #unlimitedHireCarCover (bookUnlimitedHC + warning)
    case "001110100B":
    case "001010100B":
    case "000110100B":
    case "000011100B":
    case "000010100B":

      decisionTreeDiv.innerHTML = `
        <p>${bookUnlimitedHC}</p>
        <p>${warning}</p>

      `;
      break;

    // B - #unlimitedHireCarCover NO WARNING
    case "001100100B":

      decisionTreeDiv.innerHTML = `
<p><span class="bold">Unlimited</span> - IO can use the Hire Car until the repairs are complete and if the claim has been settled.
</p> 
<br>
<p>Initial Booking based on the Repairer:
<p>SMART or cAre: 14 days</p>
<p>Other Repair Type: 21 days</p>


`;
      break;


    // C - #noHCCover #cdpCode (noHCCover)

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
          <p>${noHCCover}</p>          
            
      `;

      break;

    // C - #noHCCover #cdpCode (noHCCover + warning)
    case "001110010C":
    case "001010010C":
    case "000110010C":
    case "000011010C":
    case "000010010C":
      decisionTreeDiv.innerHTML = `
          <p>${noHCCover}</p>    
          <p>${warning}</p>
                
      `;

      break;

    // C - #noHCCover #cdpCode (noHCCover + reminder)

    case "001101010C":
    case "001001010C":
    case "000101010C":
      decisionTreeDiv.innerHTML = `
          <p>${noHCCover}</p>  
          <p>${reminder}</p>
                
      `;

      break;

    // D - #hcAfterTheftCover
    case "010000000D":
      decisionTreeDiv.innerHTML = `
                <p>Book a Theft HC for 21 days ONLY.</p>
                <br>
                <p>Initial Booking for Theft Claims: 21 Calendar Days</p>
                <br>
                <p><a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a>  - MC – Hire Car Vehicle Types, Booking Codes and Rates</p>
                <p>${important}</p>
            `;
      break;
    // E - #nafHCCover
    case "001111000E":
    case "001011000E":
    case "000111000E":
      decisionTreeDiv.innerHTML = `
                <p>${bookNAFHCexceptBingle}</p>
            `;
      break;

    // E - #waiveExcess #nafHCCover (bookNAFHC + reminder)
    case "001101000E":
    case "001001000E":
    case "000101000E":
      decisionTreeDiv.innerHTML = `
                <p>${bookNAFHC}</p>
                <p>${reminder}</p>
            `;
      break;

    // E - #cannotBookNoTPDetailsButLiabilityUnclear
    case "000001000E":
      decisionTreeDiv.innerHTML = `
          <p>${cannotBookNoTPDetailsButLiabilityUnclear}</p>
      `;

      break;

    // F - #cannotBookNoTPDetails
    case "001100000F":
    case "001000000F":
    case "000100000F":
      decisionTreeDiv.innerHTML = `
          <p>${cannotBookNoTPDetails}</p>
      `;

      break;

    // F - #cannotBookNoTPDetails (with warning)
    case "001110000F":
    case "001010000F":
    case "000110000F":
      decisionTreeDiv.innerHTML = `
          <p>${cannotBookNoTPDetails}</p>
          <p>${warning}</p>
      `;

      break;

    // G - #cannotBookNoLiabilityOutcomeYet
    case "000001000F":
      decisionTreeDiv.innerHTML = `
          <p>${cannotBookNoTPDetailsButLiabilityUnclear}</p>
        `;

      break;

    // G - #cannotBookIncompleteTPDetails (with warning)
    case "000011000E":
      decisionTreeDiv.innerHTML = `<p>Explain to IO that we cannot book them a Hire Car because details of the at-fault party is not complete.</p>
          <p>We need to have the fullname, address, and rego for us to cover them for a Not at fault hire car.</p>
          <p>Offer the CDP Code - Step 1 of <a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
          <p>${warning}</p>`;

      break;


    // H - #cannotBookNoTPDetailsButLiabilityUnclear (with warning)
    case "000010000F":
      decisionTreeDiv.innerHTML = `
          <p>${cannotBookNoTPDetailsButLiabilityUnclear}</p>
          <p>${warning}</p>
      `;

      break;


    // Default Case
    default:
      decisionTreeDiv.innerHTML = `
            <div class="mtp"><p>${notfound}</p></div>
        `;
      break;
  }


}

// ==========================
// Checkpoints (1 - 9)
// ==========================

// Start of Insured Logic
export function selectedInsured() {
  question =
    "Is IO responsible for the accident/incident based on the incident description?";
  hashText = "#ioResponsible";
  handleDecisionTree(
    question,
    [
      { label: "Yes", class: "yes" },
      { label: "No", class: "no" },
    ],
    ioResponsible
  );
}

// Checkpoint 1
function ioResponsible(answer) {
  // Update breadcrumb and hashtag tracking with current question, answer, and relevant hashtag
  updateBreadcrumbAndHashtag(question, answer, hashText);

  // Set the ioResponsible flag based on the user's answer ("yes" = 1, anything else = 0)
  flags.ioResponsible = answer === "yes" ? 1 : 0;

  // Determine the next question based on the value of ioResponsible flag
  question = flags.ioResponsible
    ? "Did the customer add a Hire Car Option on their Policy?"  // If ioResponsible is 1, ask about Hire Car Option
    : "Is this a Theft Claim?";  // If ioResponsible is 0, ask about Theft Claim

  // Set the appropriate hashtag based on the value of ioResponsible flag
  hashText = flags.ioResponsible ? "#ioHasHCCover" : "#theftClaim";

  // Call the handleDecisionTree function with the next question, choices, and the corresponding handler function
  handleDecisionTree(
    question,  // The next question to ask
    [
      { label: "Yes", class: "yes" },  // Option 1: "Yes"
      { label: "No", class: "no" },   // Option 2: "No"
    ],
    // Choose the handler function based on the value of ioResponsible
    flags.ioResponsible ? ioHasHCCover : theftClaim
  );
}


// Checkpoint 2
function theftClaim(answer) {
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.theftClaim = answer === "yes" ? 1 : 0;

  if (flags.ioResponsible === 0 && flags.theftClaim === 1) {
    question = "Did the customer add a Hire Car Option on their Policy?";
    hashText = "#ioHasHCCover";
    handleDecisionTree(
      question,
      [
        { label: "Yes", class: "yes" },
        { label: "No", class: "no" },
      ],
      ioHasHCCover
    );
  } else {
    question = "Is the incident description clear that IO is NOT at fault?";
    hashText = "#ioNAFOnIncidentDesc";
    handleDecisionTree(
      question,
      [
        { label: "Yes", class: "yes" },
        { label: "No", class: "no" },
      ],
      ioNAFOnIncidentDesc
    );
  }
}

// Checkpoint 3
function ioNAFOnIncidentDesc(answer) {
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.ioNAFOnIncidentDesc = answer === "yes" ? 1 : 0;

  question = "If there's a dispute in Liability, Is there a note from Rec&Set that confirms IO is NOT at fault?";
  hashText = "#ioNAFInRecSetNotes";
  handleDecisionTree(
    question,
    [
      { label: "Yes", class: "yes" },
      { label: "No", class: "no" },
    ],
    ioNAFInRecSetNotes
  );
}

// Checkpoint 4
function ioNAFInRecSetNotes(answer) {
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.ioNAFInRecSetNotes = answer === "yes" ? 1 : 0;

  question = "Is the excess waived?";
  hashText = "#excessWaived";
  handleDecisionTree(
    question,
    [
      { label: "Yes", class: "yes" },
      { label: "No", class: "no" },
    ],
    excessWaived
  );
}

// Checkpoint 5
function excessWaived(answer) {
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.excessWaived = answer === "yes" ? 1 : 0;

  question =
    "Did IO provide the complete details of the at fault-party? Fullname, address, and rego?";
  hashText = "#fullTPDetailsAcquired";
  handleDecisionTree(
    question,
    [
      { label: "Yes", class: "yes" },
      { label: "No", class: "no" },
    ],
    fullTPDetailsAcquired
  );
}

// Checkpoint 6
function fullTPDetailsAcquired(answer) {
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.fullTPDetailsAcquired = answer === "yes" ? 1 : 0;

  question = "Did the customer add a Hire Car Option on their Policy?";
  hashText = "#ioHasHCCover";
  handleDecisionTree(
    question,
    [
      { label: "Yes", class: "yes" },
      { label: "No", class: "no" },
    ],
    ioHasHCCover
  );
}

// Checkpoint 7
function ioHasHCCover(answer) {
  debugger;
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.ioHasHCCover = answer === "yes" ? 1 : 0;

  if (flags.ioResponsible === 0 && flags.ioHasHCCover === 0) {
    question = "Is this a Bingle policy?";
    hashText = "#binglePolicy";
    handleDecisionTree(
      question,
      [
        { label: "Yes", class: "yes" },
        { label: "No", class: "no" },
      ],
      binglePolicy
    );
  } else if (flags.ioResponsible === 1 && flags.ioHasHCCover === 0) {
    // ioHasHCCoverNo
    hashText = "#noHCCover > #cdpCode";
    flags.hireCarCoverType = "C";
    getDecisionTreeText_Insured(
      flags.ioResponsible,
      flags.ioHasHCCover,
      flags.hireCarCoverType
    );

  }

  else {
    debugger;
    question = "What kind of HC Coverage does the customer have?";
    hashText = "#hireCarOptions";
    handleDecisionTree(
      question,
      [
        { label: "Limited", class: "limited" },
        { label: "Unlimited", class: "unlimited" },
      ],
      hireCarOption
    );
  }


  // instruction = decisionTreeDiv.innerText;
  // updateBreadcrumbAndHashtag(question = "", answer = "", hashText, instruction);
  // showCopyBreadcrumbBtn();
  // showCopyHashtagBtn();
  // EOF = true;

}

// Checkpoint 8
function binglePolicy(answer) {
  debugger;
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.binglePolicy = answer === "yes" ? 1 : 0;


  // Set hire car options for Bingle policy
  if (flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 1) {

    // ioHasHCCoverNo
    hashText = "#noHCCover > #cdpCode";
    flags.hireCarCoverType = "C";

  } else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    flags.ioNAFOnIncidentDesc === 1 &&
    flags.ioNAFInRecSetNotes === 1 &&
    flags.excessWaived === 1 &&
    flags.fullTPDetailsAcquired === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 1

  ) {
    // #ioHasHCCoverNo
    hashText = "#noHCCover #cdpCode";
    flags.hireCarCoverType = "C";

  } else if (
    flags.theftClaim === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0
  ) {
    // #hcAfterTheftCover
    hashText = "#hcAfterTheftCover";
    flags.hireCarCoverType = "D";

  }

  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    flags.ioNAFOnIncidentDesc === 0 &&
    flags.ioNAFInRecSetNotes === 0 &&
    flags.excessWaived === 1 &&
    flags.fullTPDetailsAcquired === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #cannotBookIncompleteTPDetails
    hashText = "#cannotBookIncompleteTPDetails";
    flags.hireCarCoverType = "E";

  }

  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    (flags.ioNAFOnIncidentDesc === 1 || flags.ioNAFOnIncidentDesc === 0) &&
    (flags.ioNAFInRecSetNotes === 1 || flags.ioNAFInRecSetNotes === 0) &&
    flags.excessWaived === 1 &&
    flags.fullTPDetailsAcquired === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #nafHCCover
    hashText = "#nafHCCover";
    flags.hireCarCoverType = "E";

  }

  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    flags.ioNAFOnIncidentDesc === 0 &&
    flags.ioNAFInRecSetNotes === 0 &&
    flags.excessWaived === 0 &&
    flags.fullTPDetailsAcquired === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #cannotBookNoLiabilityOutcomeYet
    hashText = "#cannotBookNoLiabilityOutcomeYet";
    flags.hireCarCoverType = "E";

  }

  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    (flags.ioNAFOnIncidentDesc === 1 || flags.ioNAFOnIncidentDesc === 0) &&
    (flags.ioNAFInRecSetNotes === 1 || flags.ioNAFInRecSetNotes === 0) &&
    flags.excessWaived === 0 &&
    flags.fullTPDetailsAcquired === 1 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #nafHCCover
    hashText = "#waiveExcess #nafHCCover";
    flags.hireCarCoverType = "E";

  }



  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    (flags.ioNAFOnIncidentDesc === 1 || flags.ioNAFOnIncidentDesc === 0) &&
    (flags.ioNAFInRecSetNotes === 1 || flags.ioNAFInRecSetNotes === 0) &&
    (flags.excessWaived === 1 || flags.excessWaived === 0) &&
    flags.fullTPDetailsAcquired === 0 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #cannotBookNoTPDetails
    hashText = "#cannotBookNoTPDetails";
    flags.hireCarCoverType = "F";

  }

  else if (
    flags.ioResponsible === 0 &&
    flags.theftClaim === 0 &&
    (flags.ioNAFOnIncidentDesc === 1 || flags.ioNAFOnIncidentDesc === 0) &&
    (flags.ioNAFInRecSetNotes === 1 || flags.ioNAFInRecSetNotes === 0) &&
    (flags.excessWaived === 1 || flags.excessWaived === 0) &&
    flags.fullTPDetailsAcquired === 0 &&
    flags.ioHasHCCover === 0 &&
    flags.binglePolicy === 0

  ) {
    // #cannotBookNoTPDetailsButLiabilityUnclear
    hashText = "#cannotBookNoTPDetailsButLiabilityUnclear";
    flags.hireCarCoverType = "F";

  }




  getDecisionTreeText_Insured(
    flags.ioResponsible,
    flags.theftClaim,
    flags.ioNAFOnIncidentDesc,
    flags.ioNAFInRecSetNotes,
    flags.excessWaived,
    flags.fullTPDetailsAcquired,
    flags.ioHasHCCover,
    flags.binglePolicy,
    flags.hireCarOptions,
    flags.hireCarCoverType

  );

  instruction = decisionTreeDiv.innerText;
  updateBreadcrumbAndHashtag(question = "", answer = "", hashText, instruction);
  showCopyBreadcrumbBtn();
  showCopyHashtagBtn();
  EOF = true;

}

// Checkpoint 9
function hireCarOption(answer) {
  debugger;
  updateBreadcrumbAndHashtag(question, answer, hashText);
  flags.hireCarOptions = answer === "yes" ? 1 : 0;

  if (flags.hireCarOptions === 1) {
    question = "What kind of HC Coverage does the customer have?";
    hashText = "#hireCarOptions";
    handleDecisionTree(
      question,
      [
        { label: "Limited", class: "limited" },
        { label: "Unlimited", class: "unlimited" },
      ],
      hireCarCoverType
    );
  } else {
    question = "Is this a Bingle policy?";
    hashText = "#binglePolicy";
    handleDecisionTree(
      question,
      [
        { label: "Yes", class: "yes" },
        { label: "No", class: "no" },
      ],
      binglePolicy
    );
  }
}

// A - #limitedHireCarCover
function limitedOption(answer) {

  hashText = "#limitedHireCarCover";
  updateBreadcrumbAndHashtag(question, answer, hashText);


  flags.hireCarCoverType = "A";

  getDecisionTreeText_Insured(
    flags.ioResponsible,
    flags.theftClaim,
    flags.ioNAFOnIncidentDesc,
    flags.ioNAFInRecSetNotes,
    flags.excessWaived,
    flags.fullTPDetailsAcquired,
    flags.ioHasHCCover,
    flags.binglePolicy,
    flags.hireCarOptions,
    flags.hireCarCoverType

  );


  instruction = decisionTreeDiv.innerText;
  updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
  showCopyBreadcrumbBtn();
  showCopyHashtagBtn();
  EOF = true;

}
// B - #unlimitedHireCarCover
function unlimitedOption(answer) {

  hashText = "#unlimitedHireCarCover";
  updateBreadcrumbAndHashtag(question, answer, hashText);

  flags.hireCarCoverType = "B";

  getDecisionTreeText_Insured(
    flags.ioResponsible,
    flags.theftClaim,
    flags.ioNAFOnIncidentDesc,
    flags.ioNAFInRecSetNotes,
    flags.excessWaived,
    flags.fullTPDetailsAcquired,
    flags.ioHasHCCover,
    flags.binglePolicy,
    flags.hireCarOptions,
    flags.hireCarCoverType

  );

  instruction = decisionTreeDiv.innerText;
  updateBreadcrumbAndHashtag(question = "", answer = "", hashText = "", instruction);
  showCopyBreadcrumbBtn();
  showCopyHashtagBtn();
  EOF = true;

}
// ==========================
// 1. END of Insured Logic
// ==========================