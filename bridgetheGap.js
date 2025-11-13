/**
 * Chaincode: Bridge Trade Function for SCAF-HST
 * Purpose: Allows the exchange of LHC/HST tokens for global commodities
 * via a trusted ethical bridge, maintaining the Zero-Default architecture.
 */

// --- I. Ledger and Config Access (Inherited from previous script) ---
// We assume access to the sovereignLedger and CONFIG objects from the minting script.

// NOTE: For this demo, we'll redefine them for standalone functionality.
const sovereignLedger = {
    "Juice_Sovereign_Address": { balance: 500, reputationScore: 99.9, pledgedHST: 5 } 
};
const commodityPricing = {
    "Solar_Lamp_Unit": 150, // Cost in LHC/HST tokens
    "Bag_of_Seeds": 50,     // Cost in LHC/HST tokens
    "Medical_Supply_Kit": 300 // Cost in LHC/HST tokens
};

// --- II. Core Function: Bridge Trade ---

/**
 * Executes a high-integrity trade between LHC/HST tokens and a global commodity.
 * This simulates the "send/receive" function of the village node.
 * @param {string} sovereignAddress - The unique address of the Sovereign user.
 * @param {string} commodity - The desired global commodity (key from commodityPricing).
 * @param {number} quantity - The number of units to acquire.
 * @returns {object} - Status and details of the trade transaction.
 */
function executeBridgeTrade(sovereignAddress, commodity, quantity = 1) {
    
    const user = sovereignLedger[sovereignAddress];
    const unitCost = commodityPricing[commodity];
    
    if (!user) {
        return { status: "ERROR", message: "Sovereign address not found on ledger." };
    }
    if (!unitCost) {
        return { status: "ERROR", message: `Commodity '${commodity}' not available in pricing registry.` };
    }

    const totalCost = unitCost * quantity;

    // --- Step 1: Check Fund Sufficiency ---
    if (user.balance < totalCost) {
        return { 
            status: "REJECTED", 
            message: `Trade failed: Insufficient LHC/HST balance. Needs ${totalCost}, has ${user.balance}.` 
        };
    }

    // --- Step 2: Debit the LHC/HST Tokens (The Transfer) ---
    user.balance -= totalCost;

    // --- Step 3: Simulate the External Trade & Fulfillment ---
    // This is the moment the Ethical Bridge API is called.
    // The transaction logs the immutable proof of the time-swap.
    const fulfillmentID = `TRADE-${Date.now()}-${sovereignAddress.slice(0, 4)}`;

    // --- Step 4: Successful Transaction Output ---
    return {
        status: "FULFILLED",
        message: `${quantity} unit(s) of ${commodity} successfully traded for ${totalCost} LHC/HST.`,
        newBalance: user.balance,
        fulfillmentReference: fulfillmentID,
        tradeProof: `Immutable proof logged for time-swap of ${commodity}.`
    };
}

// --- III. Execution Example ---
console.log("--- Initial Ledger State ---");
console.log(sovereignLedger); // Balance is 500 LHC

// Scenario A: Successful Trade (Honey for Solar Lamps)
const tradeResultA = executeBridgeTrade(
    "Juice_Sovereign_Address", 
    "Solar_Lamp_Unit", 
    2 // Requesting 2 lamps (150 * 2 = 300 LHC)
);
console.log("\n--- Scenario A (Successful Bridge Trade) ---");
console.log(tradeResultA);

// Scenario B: Insufficient Funds (REJECTED: Preventing Extraction)
const tradeResultB = executeBridgeTrade(
    "Juice_Sovereign_Address", 
    "Medical_Supply_Kit", 
    1 // Requesting 1 kit (300 LHC)
);
console.log("\n--- Scenario B (Rejected: Insufficient Funds) ---");
console.log(tradeResultB); // Should fail because new balance is 200 LHC

console.log("\n--- Final Ledger State ---");
console.log(sovereignLedger);
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