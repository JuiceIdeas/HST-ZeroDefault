/**
 * Chaincode: Core Logic for SCAF-HST Adaptation (HST-ZeroDefault)
 * Owner: Joshua Juice Ba Lacy, Sovereign Architect
 * Purpose: Simulates the minting of LHC/HST tokens based on time pledge
 * and community vouch, enforcing the Zero-Default principle.
 */

// --- I. Ledger Simulation (Hyperledger Fabric State) ---
const sovereignLedger = {
    // Stores user addresses and their current LHC/HST balance
    "Juice_Sovereign_Address": { balance: 0, reputationScore: 99.9, pledgedHST: 0 }
};

// --- II. Configuration (The Mutual NPC Code Parameters) ---
const CONFIG = {
    // Defines the minimum required community support (as a decimal percentage)
    // for a Time Pledge to be considered valid and non-predatory.
    COMMUNITY_VOUCH_THRESHOLD: 0.70, // 70% of the community must "vouch"
    
    // Defines the conversion rate: 1 unit of verified HST = 100 LHC/HST Tokens
    HST_TO_LHC_RATE: 100, 
    
    // Defines the risk factor applied to the base pledge amount.
    // In a Zero-Default system, this starts near 1 (100% issuance).
    HSV_RISK_FACTOR: 0.98
};

// --- III. Core Function: Minting & Validation ---

/**
 * 1. Accepts a Time Pledge and 2. Checks Community Vouch.
 * 3. Calculates HSV and 4. Mints the LHC/HST Tokens.
 * @param {string} sovereignAddress - The unique address of the Sovereign user.
 * @param {number} timePledgeUnits - The verified unit of Human-Sovereign-Time (HST) pledged (e.g., 3 seasons of farming).
 * @param {number} communityVouchPercentage - The percentage of the local community that validates the pledge (e.g., 0.95 for 95%).
 * @returns {object} - Status and details of the transaction.
 */
function processSovereignPledge(sovereignAddress, timePledgeUnits, communityVouchPercentage) {
    
    const user = sovereignLedger[sovereignAddress];
    
    if (!user) {
        return { status: "ERROR", message: "Sovereign address not found on ledger." };
    }

    // --- Step 1: Enforce the Mutual NPC Code (Community Vouch) ---
    if (communityVouchPercentage < CONFIG.COMMUNITY_VOUCH_THRESHOLD) {
        return { 
            status: "REJECTED", 
            message: `Pledge failed: Vouch percentage (${communityVouchPercentage * 100}%) is below the Mutual NPC Code Threshold (${CONFIG.COMMUNITY_VOUCH_THRESHOLD * 100}%).` 
        };
    }
    
    // --- Step 2: Calculate HSV (Human-Sovereign-Value) ---
    // The HSV is a factor of the time pledged, the community's confidence, 
    // and the system's Zero-Default risk factor.
    const effectiveHST = timePledgeUnits * communityVouchPercentage;
    const finalHSVValue = effectiveHST * CONFIG.HSV_RISK_FACTOR;

    // --- Step 3: Mint LHC/HST Tokens ---
    const tokensToMint = Math.floor(finalHSVValue * CONFIG.HST_TO_LHC_RATE);
    
    // --- Step 4: Update Ledger State ---
    user.balance += tokensToMint;
    user.pledgedHST += timePledgeUnits; // Log the debt (time-debt)

    // --- Step 5: Successful Transaction Output ---
    return {
        status: "MINTED",
        message: "Sovereign Time Pledge successfully processed.",
        pledgedHST: timePledgeUnits,
        tokensMinted: tokensToMint,
        newBalance: user.balance,
        communityConfidence: communityVouchPercentage
    };
}

// --- IV. Execution Example ---
console.log("--- Initial Ledger State ---");
console.log(sovereignLedger);

// Scenario A: High Integrity Pledge (Success)
const resultA = processSovereignPledge(
    "Juice_Sovereign_Address", 
    5,                      // 5 Units of HST (e.g., 5 moons of farming)
    0.95                    // 95% Community Vouch
);
console.log("\n--- Scenario A (Success: Minting) ---");
console.log(resultA);

// Scenario B: Low Vouch Pledge (REJECTED: Enforcing Mutual NPC Code)
const resultB = processSovereignPledge(
    "Juice_Sovereign_Address", 
    2,                      // 2 Units of HST
    0.60                    // 60% Community Vouch (Below 70% threshold)
);
console.log("\n--- Scenario B (Rejected: NPC Code Veto) ---");
console.log(resultB);

console.log("\n--- Final Ledger State ---");
console.log(sovereignLedger);
