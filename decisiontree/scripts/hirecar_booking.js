const decisionTreeDiv = document.getElementById("decision-tree1");

// Start button click event
document.getElementById("start").onclick = function () {
    const radioSelected = document.querySelector('input[name="tree"]:checked');

    if (radioSelected && radioSelected.value === "insured") {
        decisionTreeDiv.innerHTML = `
            <p>Is IO responsible for the accident/incident?</p>
            <button class="yes" onclick="ioResponsible('yes')">Yes</button>
            <button class="no" onclick="ioResponsible('no')">No</button>
        `;
    } else if (radioSelected && radioSelected.value === "mtp") {
        decisionTreeDiv.innerHTML = `
            <p>Is the liability clear that IO is at fault?</p>
            <button class="yes" onclick="mtpLiability('yes')">Yes</button>
            <button class="no" onclick="mtpLiability('no')">No</button>
        `;
    } else if (radioSelected && radioSelected.value === "rectificationHC2") {
        rectificationQualityIssue(); // Activate Rectification Hire Car Logic
    } else if (radioSelected && radioSelected.value === "wpClaims") {
        wpClaimsLogic(); // Activate WP Claims Logic
    }
}

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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
    if (answer === 'yes') {
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
function mtpLiability(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Is there a possibility they may use a Credit Hire Car company?</p>
            <button class="yes" onclick="creditHireCar('yes')">Yes</button>
            <button class="no" onclick="creditHireCar('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Is there a note from Rec&Set that IO is at fault?</p>
            <button class="yes" onclick="recSetNote('yes')">Yes</button>
            <button class="no" onclick="recSetNote('no')">No</button>
        `;
    }
}

function recSetNote(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210095601?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>End process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Is the Third Party vehicle insured?</p>
            <button class="yes" onclick="vehicleInsuredRecSet('yes')">Yes</button>
            <button class="no" onclick="vehicleInsuredRecSet('no')">No</button>
        `;
    }
}

function vehicleInsuredRecSet(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Advise the Third Party that our Rec & Set has not given the liability outcome. Explain that they may lodge a claim to their Insurance to cover the cost of repairs of their car.</p>
            <p>End process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Explain to the Third Party that we need to wait for the Rec&Set's Liability Decision before we can proceed with the TPV repairs.</p>
            <p>End process.</p>
        `;
    }
}

function creditHireCar(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Advise we can arrange a Hire Car and will reimburse transport costs if the Third Party wishes to return the credit hire car and go straight to our provider to collect a replacement.</p>
            <p>Did the Third Party agree to return the Credit Hire Car?</p>
            <button class="yes" onclick="returnHireCar('yes')">Yes</button>
            <button class="no" onclick="returnHireCar('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Is the Third Party requesting to claim an out of scope vehicle? (i.e. caravans, boats, taxis, buses, ride share, emergency vehicles, machinery or trucks etc)</p>
            <button class="yes" onclick="outOfScope('yes')">Yes</button>
            <button class="no" onclick="outOfScope('no')">No</button>
        `;
    }
}

function returnHireCar(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210095601?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>End process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Has the Third Party signed any paperwork for the Hire/Loan Car?</p>
            <button class="yes" onclick="paperworkSigned('yes')">Yes</button>
            <button class="no" onclick="paperworkSigned('no')">No</button>
        `;
    }
}

function paperworkSigned(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p class="bold">Advised: MTP - Hire Car Script</p>
            </p>By signing any documents at the repairer, you may have entered into a formal agreement and authorised the repairs to your car without the authority, assessment or involvement of an insurance company.
            That means that you may not be entitled to recover all of the costs associated with your car repairs or hire car and it is possible that the repairer may seek to recover any shortfall from you directly. 
            In addition, the repairer may even require you to attend court to assist them in recovering their costs. The document that was signed should have all of the details included.</p>
            <p>Have the repairs to your vehicle commenced?</p>
            <button class="yes" onclick="repairsCommenced('yes')">Yes</button>
            <button class="no" onclick="repairsCommenced('no')">No</button>
        `;
    } else {
        endProcess();
    }
}

function repairsCommenced(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Advise the Third Party we will review their demands on a fair and reasonable basis.</p>
            <p>End Process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Does the customer want to proceed with our MTP Process?</p>
            <button class="yes" onclick="proceedMTP('yes')">Yes</button>
            <button class="no" onclick="reviewDemands()">No</button>
        `;
    }
}

function reviewDemands() {
    decisionTreeDiv.innerHTML = `Advise the Third Party we will review their demands on a fair and reasonable basis.
	<p>End Process.</p>
`;
}

function proceedMTP(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Did the customer return the Credit Hire Car?</p>
            <button class="yes" onclick="creditHireCarReturned('yes')">Yes</button>
            <button class="no" onclick="creditHireCarReturned('no')">No</button>
        `;
    } else {
        endProcess();
    }
}

function creditHireCarReturned(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210095601?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>End of process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Ask the Third Party when they are going to return the Hire Car.</p>
            <p>Once the date is confirmed, continue with the MTP HC Booking using the begin date of the Credit Hire Car being returned. Advised we will reimburse the transportation cost when TP picks up the HC.</p>
            <p>End of process.</p>
        `;
    }
}

function endProcess() {
    decisionTreeDiv.innerHTML = `
        <p>End of process.</p>
    `;
}

function outOfScope(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Is the Third Party out of scope vehicle insured?</p>
            <button class="yes" onclick="outOfScopeInsured('yes')">Yes</button>
            <button class="no" onclick="outOfScopeInsured('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210095601?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>End process.</p>
        `;
    }
}

function outOfScopeInsured(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Advised the Third Party to lodge a claim through their Insurer. (
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210505152?contentId=KM1238801&locale=en-GB" target="_blank">KM1238801</a>)</p>
            <p>End process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Third Party needs to submit the repair quote or repair invoice and images to myclaim@<brand>.com.au with the claim number in the subject line for Recoveries & Settlements to complete a fair and reasonable reimbursement. (KM1238801)</p>
            <p>End process.</p>
        `;
    }
}

function vehicleInsured(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Continue to arrange the MTP Hire Car for the Third Party - 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729210095601?contentId=KM1074811&locale=en-GB" target="_blank">KM1074811</a></p>
            <p>End of process.</p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Advise the Third Party that they should lodge a claim with their insurer.</p>
            <p>End of process</p>
        `;
    }
}

// END MTP Logic

// The existing insured functions go here...


// START Insured Logic

function ioResponsible(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Did the customer add a Hire Car Option on their Policy?</p>
            <button class="yes" onclick="hireCarOption('yes')">Yes</button>
            <button class="no" onclick="hireCarOption('no')">No</button>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Did the customer identify the Driver's details of the at fault vehicle? 
            <ul>
                <li> Fullname </li>
                <li> TPV Registration </li>
                <li> TP Address </li>
            </ul></p>
            <button class="yes" onclick="driverDetails('yes')">Yes</button>
            <button class="no" onclick="nafHireCar()">No</button>
        `;
    }
}

function driverDetails(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Was the excess waived?</p>
            <button class="yes" onclick="excessWaived('yes')">Yes</button>
            <button class="no" onclick="excessWaived('no')">No</button>
        `;
    } else {
        tpAtFaultOnIncidentDesc();
    }
}

function excessWaived(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Is this a Bingle Policy?</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="binglePolicy('no')">No</button>
        `;
    } else {
        tpAtFaultOnIncidentDesc();
    }
}

function hireCarOption(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Book the Hire Car According to the Policy Option:</p>
            <button class="limited" onclick="limitedOption()">Limited</button>
            <button class="unlimited" onclick="unlimitedOption()">Unlimited</button>
        `;
    } else {
        theftClaim('no');
    }
}

function limitedOption() {
    decisionTreeDiv.innerHTML = `
        <p>Limited - An option added to Suncorp and GIO Policy Holders for 21 Calendar Days only.</p>
        <p>GIO - ITGIO75<br>SUNCORP - ITSUN75</p>
    `;
}

function unlimitedOption() {
    decisionTreeDiv.innerHTML = `
        <p>Unlimited - IO can use the Hire Car until the repairs are complete and if the claim has been settled.</p>
        <p>AAMI - ITHCOAAMI90<br>APIA - ITHCOAPIA90<br>SUNCORP - ITSUNUNLI100<br>GIO - ITGIOPLAT100<br>BINGLE - ITLLDU</p>
    `;
}

function theftClaim(answer) {
    decisionTreeDiv.innerHTML = `
        <p>Is this a Theft Claim?</p>
        <button class="yes" onclick="theftClaimType('yes')">Yes</button>
        <button class="no" onclick="noHireCar()">No</button>
    `;
}

function theftClaimType(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Is this a Bingle Policy?</p>
            <button class="yes" onclick="binglePolicy('yes')">Yes</button>
            <button class="no" onclick="theftBooking()">No</button>
        `;
    } else {
        noHireCar();
    }
}

function binglePolicy(answer) {
    if (answer === 'yes') {
        decisionTreeDiv.innerHTML = `
            <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
        `;
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Book a Not at Fault Hire Car for unlimited days with a car that suits our customer's needs.
            AAMI, APIA, Suncorp, and GIO. Follow the initial booking days 
<a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1074602&locale=en-GB" target="_blank">KM1074602</a>
            <ul>
                <li>SMART or cAre: 14 days</li>
                <li>Other Repair Type: 21 days</li>
            </ul> 
            </p>
        `;
    }
}

function theftBooking() {
    decisionTreeDiv.innerHTML = `
        <p>Book a Theft Hire Car for 21 days only.</p>
        <p>AAMI - ITTHEAAMI<br>APIA - ITTHEAPIA<br>SUNCORP - ITTHESUN<br>GIO - ITTHEGIO</p>
    `;
}

function tpAtFaultOnIncidentDesc() {
    decisionTreeDiv.innerHTML = `
        <p>In the incident description, is it clear that TP is responsible?</p>
        <button class="yes" onclick="noteFromRecSet('yes')">Yes</button>
        <button class="no" onclick="noteFromRecSet('no')">No</button>
    `;
}

function noteFromRecSet(answer) {
    if (answer === 'yes') {
        bookNAFHC();
    } else {
        decisionTreeDiv.innerHTML = `
            <p>Is there a note from Rec&Set that TP is at fault?</p>
            <button class="yes" onclick="bookNAFHC()">Yes</button>
            <button class="no" onclick="noHCAwaitLiabilityDecision()">No</button>
        `;
    }
}

function bookNAFHC() {
    decisionTreeDiv.innerHTML = `
        <p>Book a Not at Fault Hire Car for unlimited days with a car that suits our customer's needs.
        AAMI, APIA, Suncorp, and GIO. Follow the initial booking days
<a href="https://cwb.int.corp.sun/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1662359586318?contentId=KM1074602&locale=en-GB" target="_blank">KM1074602</a>        
       <ul>
            <li>SMART or cAre: 14 days</li>
            <li>Other Repair Type: 21 days</li>
        </ul> 
        </p>
    `;
}

function noHireCar() {
    decisionTreeDiv.innerHTML = `
        <p>Explain to IO that they don't have the HC Option on their policy. Offer the CDP Code - Step 1 of 

<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target="_blank">KM1143067</a></p>
    `;
}

function nafHireCar() {
    decisionTreeDiv.innerHTML = `
        <p>Explain to IO that we can only provide a Not At Fault Hire Car if we can recover the cost from the at fault party. In order to do that, we need to at least have the Driver's details of the at fault vehicle:</p>
        <ul>
            <li>Fullname</li>
            <li>TPV Registration</li>
            <li>TP Address</li>
        </ul>
    `;
}

function noHCAwaitLiabilityDecision() {
    decisionTreeDiv.innerHTML = `
        <p>Explain to IO that they don't have the HC Option on their policy, and the liability decision has not been confirmed by Rec&Set yet. Offer the CDP Code - Step 1 of 
<a href="https://cwb.int.corp.sun:443/GTConnect/UnifiedAcceptor/AddKnowContentBase.ViewContentMain/1729208836940?contentId=KM1143067&locale=en-GB" target+"_blank">KM1143067</a></p>
    `;
}

// END Insured Logic



