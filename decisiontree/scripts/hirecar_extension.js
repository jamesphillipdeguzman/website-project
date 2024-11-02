const radioSelected1 = document.querySelector("#ecd");
const radioSelected2 = document.querySelector("#total_loss");
const radioSelected3 = document.querySelector("#investigation");
const radioSelected4 = document.querySelector("#rectification");

document.getElementById("start").onclick = function () {
    if (radioSelected1.checked) {
        displayEcdDecision();
    } else if (radioSelected2.checked) {
        displayTotalLossDecision();
    } else if (radioSelected3.checked) {
        displayClaimsInvestigationDecision();
    } else if (radioSelected4.checked) {
        displayRectificationDecision();
    }
};

function displayEcdDecision() {
    document.getElementById("decision-tree1").innerHTML = `
        <p>Is the ECD available on the CC10?</p>
        <button onclick="nextStep('ecd_yes')">Yes</button>
        <button onclick="nextStep('ecd_no')">No</button>
    `;
}

function displayTotalLossDecision() {
    document.getElementById("decision-tree1").innerHTML = `
        <p>Is the vehicle's status a Total Loss?</p>
        <button onclick="totalLossStep('total_loss_yes')">Yes</button>
        <button onclick="followEcdProcess()">No</button>
    `;
}

function displayClaimsInvestigationDecision() {
    document.getElementById("decision-tree1").innerHTML = `
        <p>Do we have a review outcome?</p>
        <button onclick="reviewOutcome('yes')">Yes</button>
        <button onclick="reviewOutcome('no')">No</button>
    `;
}

function displayRectificationDecision() {
    document.getElementById("decision-tree1").innerHTML = `
        <p>Is the QI repairs in progress?</p>
        <button onclick="qiRepairsInProgress('yes')">Yes</button>
        <button onclick="qiRepairsInProgress('no')">No</button>
    `;
}

function nextStep(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "ecd_yes") {
        resultDiv.innerHTML = `
            <p>Does the Customer have an unlimited Hire Car Option?</p>
            <button onclick="nextStep('unlimited_hc_yes')">Yes</button>
            <button onclick="nextStep('unlimited_hc_no')">No</button>
        `;
    } else if (answer === "ecd_no") {
        resultDiv.innerHTML = `
            <p>Does the customer know the ECD of the repairs?</p>
            <button onclick="nextStep('know_yes')">Yes</button>
            <button onclick="nextStep('know_no')">No</button>
        `;
    } else if (answer === "unlimited_hc_yes") {
        resultDiv.innerHTML = `
            <p>Is the Total Number of Days of the Hire Car usage going to reach 99 days?</p>
            <button onclick="finalStep('usage_reached_yes')">Yes</button>
            <button onclick="finalStep('usage_reached_no')">No</button>
        `;
    } else if (answer === "unlimited_hc_no") {
        resultDiv.innerHTML = `
            <p>What type of repairer is the vehicle booked?</p>
            <button onclick="finalStep('smart_care')">SMART/cAre</button>
            <button onclick="finalStep('contract_rep_direct')">Contract Repairer/ Repairer Direct</button>
        `;
    } else if (answer === "know_yes") {
        resultDiv.innerHTML = `
            <p>Does the Customer have an unlimited Hire Car Option?</p>
            <button onclick="nextStep('unlimited_yes_know')">Yes</button>
            <button onclick="nextStep('unlimited_no_know')">No</button>
        `;
    } else if (answer === "know_no") {
        resultDiv.innerHTML = `
            <p>Does the Customer have an unlimited Hire Car Option?</p>
            <button onclick="nextStep('unlimited_yes_know_no')">Yes</button>
            <button onclick="nextStep('unlimited_no_know_no')">No</button>
        `;
    } else if (answer === "unlimited_yes_know") {
        resultDiv.innerHTML = `
            <p>Is the Total Number of Days of the Hire Car usage going to reach 99 days?</p>
            <button onclick="finalStep('yes_days_know')">Yes</button>
            <button onclick="finalStep('no_days_know')">No</button>
        `;
    } else if (answer === "unlimited_no_know") {
        resultDiv.innerHTML = `
            <p>What type of repairer is the vehicle booked?</p>
            <button onclick="finalStep('smart_repairer_yes')">SMART/cAre</button>
            <button onclick="finalStep('contract_repairer_no')">Contract Repairer/Repairer Direct</button>
        `;
    } else if (answer === "unlimited_yes_know_no") {
        resultDiv.innerHTML = `
            <p>EXTEND FOR ADDITIONAL 7 DAYS
            "If the customer is unsure of the Estimated Completion Date (ECD), consider the customers circumstances and provide a fair hire car extension." 

            Is the Total Number of Days of the Hire Car usage will reach 99 days?</p>
            <button onclick="finalStep('yes_days_know_no')">Yes</button>
            <button onclick="finalStep('no_days_know_no')">No</button>
        `;
    } else if (answer === "unlimited_no_know_no") {
        resultDiv.innerHTML = `
            <p>What type of repairer is the vehicle booked?</p>
            <button onclick="finalStep('smart_care')">SMART/cAre</button>
            <button onclick="finalStep('contract_rep_direct')">Contract Repairer/ Repairer Direct</button>
        `;
    }
}

function totalLossStep(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "total_loss_yes") {
        resultDiv.innerHTML = `
            <p>Has it been Fulfilled?</p>
            <button onclick="finalStep('fulfilled_yes')">Yes</button>
            <button onclick="finalStep('fulfilled_no')">No</button>
        `;
    }
}

function finalStep(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "fulfilled_yes") {
        resultDiv.innerHTML = `
            <p>NO Further Extensions Required.</p>
            <p>Explain to IO/TP that we cannot extend the Hire Car because we have already issued the payment. Advise IO/TP to return the hire car to avoid paying the Daily Hire Car cost out of their own pocket.</p>
        `;
    } else if (answer === "fulfilled_no") {
        resultDiv.innerHTML = `
            <p>Does the customer have a Hire Car Unlimited Coverage?</p>
            <button onclick="finalStep('unlimited_coverage_yes')">Yes</button>
            <button onclick="finalStep('unlimited_coverage_no')">No</button>
        `;
    } else if (answer === "unlimited_coverage_yes") {
        resultDiv.innerHTML = "Extend up to 21 days only.";
    } else if (answer === "unlimited_coverage_no") {
        resultDiv.innerHTML = "Extend up to the policy limit only.";
    } else if (answer === "usage_reached_yes") {
        resultDiv.innerHTML = `
            Book a new Hire Car booking manually until the ECD. Mirror the Original Hire Car Booking, then you MUST send an email to <a href="mailto:aurentalextensions@hertz.com.au">aurentalextensions@hertz.com.au</a> to advise of the extension.`;
    } else if (answer === "usage_reached_no") {
        resultDiv.innerHTML = "Extend until ECD.";
    } else if (answer === "smart_care") {
        resultDiv.innerHTML = "HC was initially booked for 14 days; it can be extended for an additional 7 days.";
    } else if (answer === "contract_rep_direct") {
        resultDiv.innerHTML = "If the Hire Car was initially booked for 21 days - NO ADDITIONAL EXTENSION. Offer CDP Code.";
    } else if (answer === "yes_days_know") {
        resultDiv.innerHTML = `
            Book a new Hire Car booking manually until the ECD. Mirror the Original Hire Car Booking, then you MUST send an email to <a href="mailto:aurentalextensions@hertz.com.au">aurentalextensions@hertz.com.au</a> to advise of the extension.`;
    } else if (answer === "no_days_know") {
        resultDiv.innerHTML = "Extend until ECD.";
    } else if (answer === "smart_repairer_yes") {
        resultDiv.innerHTML = "HC was initially booked for 14 days; it can be extended for an additional 7 days.";
    } else if (answer === "contract_repairer_no") {
        resultDiv.innerHTML = "If the Hire Car was initially booked for 21 days - NO ADDITIONAL EXTENSION. Offer CDP Code.";
    } else if (answer === "yes_days_know_no") {
        resultDiv.innerHTML = `
            Book a new Hire Car booking manually until the ECD. Mirror the Original Hire Car Booking, then you MUST send an email to <a href="mailto:aurentalextensions@hertz.com.au">aurentalextensions@hertz.com.au</a> to advise of the extension.`;
    } else if (answer === "no_days_know_no") {
        resultDiv.innerHTML = `
            <p>What type of repairer is the vehicle booked?</p>
            <button onclick="finalStep('smart_care')">SMART/cAre</button>
            <button onclick="finalStep('contract_rep_direct')">Contract Repairer/ Repairer Direct</button>
        `;
    }
}

function followEcdProcess() {
    const resultDiv = document.getElementById("decision-tree1");
    resultDiv.innerHTML = "Follow Extension based on ECD process.";
}

function resetTree() {
    const resultDiv = document.getElementById("decision-tree1");
    resultDiv.innerHTML = ``;
}

function reviewOutcome(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "yes") {
        resultDiv.innerHTML = `
            <p>Is this an Accepted claim?</p>
            <button onclick="finalStepClaims('accepted')">Yes</button>
            <button onclick="finalStepClaims('not_accepted')">No</button>
        `;
    } else {
        resultDiv.innerHTML = `
            <p>Is there a note from an IRO or HSO to NOT Extend the Hire Car?</p>
            <button onclick="finalStepClaims('no_extend_note')">Yes</button>
            <button onclick="finalStepClaims('check_coverage')">No</button>
        `;
    }
}

function finalStepClaims(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "accepted") {
        resultDiv.innerHTML = "Extend the Hire Car according to the ECD/Policy limit.";
    } else if (answer === "not_accepted") {
        resultDiv.innerHTML = `
            <p>Explain the claim decision to IO.<br>NO FURTHER EXTENSIONS.</p>
        `;
    } else if (answer === "no_extend_note") {
        resultDiv.innerHTML = `
            <p>Explain the claim decision to IO.<br>NO FURTHER EXTENSIONS.</p>
        `;
    } else if (answer === "check_coverage") {
        resultDiv.innerHTML = `
            <p>Has the customer exhausted his/her HC Coverage based on his/her policy limit?</p>
            <button onclick="finalStepClaims('coverage_exhausted')">Yes</button>
            <button onclick="finalStepClaims('extend_coverage')">No</button>
        `;
    } else if (answer === "coverage_exhausted") {
        resultDiv.innerHTML = `
            <p>Explain to IO that he/she has exhausted the Hire Car coverage.<br>NO FURTHER EXTENSIONS.</p>
        `;
    } else if (answer === "extend_coverage") {
        resultDiv.innerHTML = "Extend the Hire Car for 7 calendar days (1 week). KM1074602";
    }
}

function qiRepairsInProgress(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "yes") {
        resultDiv.innerHTML = `
            <p>Extend Hire Car according to ECD.<br>Follow the extension based on ECD process.</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <p>Is the vehicle driveable?</p>
            <button onclick="vehicleDriveable('yes')">Yes</button>
            <button onclick="vehicleDriveable('no')">No</button>
        `;
    }
}

function vehicleDriveable(answer) {
    const resultDiv = document.getElementById("decision-tree1");
    if (answer === "yes") {
        resultDiv.innerHTML = `
            <p>Only book the Hire Car once IV has a date when to start the QI repairs.</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <p>Ensure the quality issue has been recorded and rectification steps have been taken.<br>
            EXTEND FOR ADDITIONAL 7 DAYS.<br>
            "If the customer is unsure of the Estimated Completion Date (ECD), consider the customers circumstances and provide a fair hire car extension."</p>
        `;
    }
}
