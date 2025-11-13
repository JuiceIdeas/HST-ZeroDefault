/**
 * Chaincode: A-L-F (Adaptation-Limit-Filter) Veto Logic
 * Owner: Joshua Juice Ba Lacy, Sovereign Architect
 * Purpose: Calculates the Systemic Risk Factor (SRF) and generates a 
 * Pledge Requirement Multiplier (PRM) to prevent sovereign burnout.
 */

// --- I. Data Access (Assumed Ledger and Risk Factors) ---
const sovereignLedger = {
    "Juice_Sovereign_Address": { 
        reputationScore: 90.0, // HSV Score from Governance
        pledgedHST: 5,
        fulfilledHST: 2
    }
};

// --- II. Configuration (A-L-F Stressors) ---
const ALF_CONFIG = {
    // Factors weighted by importance (Sum of weights equals 1.0)
    STRESS_FACTORS: {
        SEASONAL_HARDSHIP_LEVEL: 0.5, // External stress (e.g., pre-harvest lean season)
        HEALTH_VULNERABILITY: 0.3,    // Internal stress (e.g., recent illness log)
        HSV_DECAY_RATE: 0.2           // Internal pressure (how close they are to a reputation drop)
    },
    // The maximum possible reduction in pledge requirement (Max PRM = 1.0)
    MAX_VETO_REDUCTION: 0.30 // System can reduce required effort by up to 30%
};

// --- III. Core Function: Calculate and Apply A-L-F Veto ---

/**
 * Calculates the A-L-F Veto Multiplier based on systemic stressors.
 * This multiplier is used by the Minting/Governance Chaincode to *reduce* the required fulfillment amount.
 * @param {string} sovereignAddress - The user's address.
 * @param {number} seasonalHardship - Input: 0.0 (low stress) to 1.0 (max stress).
 * @param {number} healthVulnerability - Input: 0.0 (healthy) to 1.0 (vulnerable).
 * @returns {object} - Status and the new Pledge Requirement Multiplier (PRM).
 */
function calculateALFVeto(sovereignAddress, seasonalHardship, healthVulnerability) {
    
    const user = sovereignLedger[sovereignAddress];
    if (!user) {
        return { status: "ERROR", message: "Sovereign address not found on ledger." };
    }

    // 1. Calculate Individual Pressure from HSV Decay
    // How much pressure is the user under due to their score? (Max pressure when HSV is low)
    const hsvPressure = 1.0 - (user.reputationScore / 100);

    // 2. Calculate the Systemic Risk Factor (SRF) - The weighted average of all stressors
    const srf = (
        (seasonalHardship * ALF_CONFIG.STRESS_FACTORS.SEASONAL_HARDSHIP_LEVEL) +
        (healthVulnerability * ALF_CONFIG.STRESS_FACTORS.HEALTH_VULNERABILITY) +
        (hsvPressure * ALF_CONFIG.STRESS_FACTORS.HSV_DECAY_RATE)
    );
    
    // 3. Apply the A-L-F Veto (PRM)
    // The SRF determines *how much* of the max reduction is applied.
    // PRM = 1.0 - (SRF * MAX_VETO_REDUCTION)
    const pledgeMultiplier = 1.0 - (srf * ALF_CONFIG.MAX_VETO_REDUCTION);

    // Clamp the multiplier (e.g., minimum is 0.70)
    const finalPRM = Math.max(1.0 - ALF_CONFIG.MAX_VETO_REDUCTION, pledgeMultiplier);
    
    return {
        status: "VETO_ACTIVE",
        message: "A-L-F Veto calculated and ready for application.",
        SystemicRiskFactor: srf.toFixed(3),
        PledgeRequirementMultiplier: finalPRM.toFixed(3) // The key output
    };
}

// --- IV. Execution Example ---

// Scenario A: Low Stress (Normal Operating Conditions)
const resultA = calculateALFVeto(
    "Juice_Sovereign_Address", 
    0.1,  // Low Seasonal Hardship
    0.0   // No Health Vulnerability
);
console.log("\n--- Scenario A (Low Stress) ---");
console.log(resultA);
// Expected PRM: Close to 1.0 (No reduction in required pledge)

// Scenario B: High Stress (Burnout Veto Triggered)
const resultB = calculateALFVeto(
    "Juice_Sovereign_Address", 
    0.9,  // High Seasonal Hardship (e.g., drought)
    0.8   // High Health Vulnerability
);
console.log("\n--- Scenario B (High Stress: Veto Triggered) ---");
console.log(resultB);
// Expected PRM: Significantly lower (near the max reduction of 0.70), easing the burden.
