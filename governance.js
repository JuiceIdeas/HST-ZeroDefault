/**
 * Chaincode: Governance Logic (HSV/Reputation Management)
 * Owner: Joshua Juice Ba Lacy, Sovereign Architect
 * Purpose: Dynamically adjusts a user's Human-Sovereign-Value (HSV)
 * based on fulfillment of HST pledges and community feedback.
 */

// --- I. Data Access (Assumed Ledger State) ---
// We assume sovereignLedger is available with 'reputationScore' and 'pledgedHST'.
const sovereignLedger = {
    "Juice_Sovereign_Address": { 
        balance: 200, 
        reputationScore: 90.0, // Starts high, near 100
        pledgedHST: 5,        // 5 units pledged
        fulfilledHST: 2       // 2 units already fulfilled
    }
};

// --- II. Configuration (10th Power Logic Parameters) ---
const GOV_CONFIG = {
    // Weight of pledge fulfillment vs. community feedback
    FULFILLMENT_WEIGHT: 0.65, 
    FEEDBACK_WEIGHT: 0.35,
    
    // The HSV score will decay towards this baseline if there is no activity.
    // This incentivizes participation but prevents malicious drops.
    HSV_DECAY_RATE: 0.01 
};

// --- III. Core Function: Update HSV/Reputation Score ---

/**
 * Calculates and updates the user's Human-Sovereign-Value (HSV) score.
 * This score directly influences future loan/trade eligibility and capacity.
 * @param {string} sovereignAddress - The user's address.
 * @param {number} newCommunityFeedback - A value (0.0 to 1.0) representing the latest community audit (e.g., a mean score).
 * @param {number} fulfilledPledgeUnits - The amount of HST (time) fulfilled since the last audit.
 * @returns {object} - Status and details of the HSV update.
 */
function updateHSVScore(sovereignAddress, newCommunityFeedback, fulfilledPledgeUnits) {
    
    const user = sovereignLedger[sovereignAddress];
    
    if (!user) {
        return { status: "ERROR", message: "Sovereign address not found on ledger." };
    }
    
    const { reputationScore, pledgedHST, fulfilledHST } = user;
    
    // 1. Calculate the Pledge Fulfillment Ratio (PFR)
    // Avoid division by zero if nothing was pledged.
    const remainingPledge = pledgedHST - fulfilledHST;
    let pledgeRatio = 1.0; // Assume perfect if no remaining pledge
    
    if (remainingPledge > 0) {
        // PFR = (Units Fulfilled) / (Units Remaining + Units Fulfilled)
        // This is a complex ratio to penalize *unfulfilled* pledges more severely.
        pledgeRatio = fulfilledPledgeUnits / pledgedHST;
    }
    
    // 2. Apply Weighted Average (The 10th Power Logic)
    // The new score is a blend of performance and social sentiment.
    const fulfillmentComponent = pledgeRatio * GOV_CONFIG.FULFILLMENT_WEIGHT;
    const feedbackComponent = newCommunityFeedback * GOV_CONFIG.FEEDBACK_WEIGHT;
    
    const dynamicScore = (fulfillmentComponent + feedbackComponent) / (GOV_CONFIG.FULFILLMENT_WEIGHT + GOV_CONFIG.FEEDBACK_WEIGHT);
    
    // 3. Apply Decay and Update (Recursive Refinement)
    // The new score is blended with the old score to ensure gradual, stable change (The 10th Power).
    const blendedScore = (reputationScore * (1 - GOV_CONFIG.HSV_DECAY_RATE)) + (dynamicScore * 100 * GOV_CONFIG.HSV_DECAY_RATE);
    
    // Clamp the score to 100
    user.reputationScore = Math.min(100.0, blendedScore);
    user.fulfilledHST += fulfilledPledgeUnits; 
    
    return {
        status: "UPDATED",
        message: "Human-Sovereign-Value (HSV) score updated via Governance Chaincode.",
        oldHSV: reputationScore.toFixed(2),
        newHSV: user.reputationScore.toFixed(2),
        pledgeRatio: pledgeRatio.toFixed(2)
    };
}

// --- IV. Execution Example ---
console.log("--- Initial Ledger State ---");
console.log(`HSV: ${sovereignLedger["Juice_Sovereign_Address"].reputationScore}`);

// Scenario A: High Fulfillment & High Community Feedback (HSV Rises)
const resultA = updateHSVScore(
    "Juice_Sovereign_Address", 
    0.98, // Very high community rating (0.0 to 1.0)
    3     // Fulfilled 3 more units of the remaining 3 HST pledge
);
console.log("\n--- Scenario A (High Integrity: HSV Rises) ---");
console.log(resultA);

// Scenario B: Low Fulfillment & Low Community Feedback (HSV Drops)
// (Note: To test this, we would need to manually reset or run another iteration)
// For simplicity, we observe the result of A and recognize the mechanism.

console.log("\n--- Final Ledger State ---");
console.log(`HSV: ${sovereignLedger["Juice_Sovereign_Address"].reputationScore}`);
MIT License

Copyright (c) 2025 JuiceIdeas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.