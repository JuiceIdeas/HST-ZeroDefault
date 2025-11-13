

// HST v1.0 — Human-Sovereign-Time Chaincode
// Zero-Default Lending | Mutual NPC Code | A-L-F Veto™
// Architect: Joshua Juice Ba Lacy | JuicyIdeas Co.
// Deployed: 2025-11-13

'use strict';

const { Contract } = require('fabric-contract-api');

class HSTContract extends Contract {

  // Initialize ledger with genesis pledge
  async initLedger(ctx) {
    const genesis = {
      block: 0,
      timestamp: "2025-11-13T00:00:00-10:00",
      architect: "Joshua Juice Ba Lacy",
      pledge: "I give 1 hour to the weave.",
      hst: 1,
      totalSupply: 1,
      defaultRate: 0.00
    };
    await ctx.stub.putState('GENESIS', Buffer.from(JSON.stringify(genesis)));
    return genesis;
  }

  // Mint HST: 1 verified hour = 1 HST
  async mintHST(ctx, nodeId, participant, effortHours, voiceHash, communityVouch) {
    // Parse and validate inputs
    effortHours = parseInt(effortHours, 10);
    communityVouch = parseInt(communityVouch, 10);
    
    if (isNaN(effortHours) || effortHours <= 0) throw new Error('Invalid effort hours: must be a positive integer');
    if (isNaN(communityVouch) || communityVouch < 0) throw new Error('Invalid community vouch: must be a non-negative integer');
    if (!nodeId || typeof nodeId !== 'string') throw new Error('Invalid nodeId: must be a non-empty string');
    if (!participant || typeof participant !== 'string') throw new Error('Invalid participant: must be a non-empty string');
    if (!voiceHash || typeof voiceHash !== 'string') throw new Error('Invalid voiceHash: must be a non-empty string');

    // A-L-F Veto™: 6-AI consensus (simulated)
    const veto = await this.a_l_f_veto(ctx, effortHours, communityVouch);
    if (!veto.passed) throw new Error(`Veto failed: ${veto.reason}`);

    // Mutual NPC Code: No extraction
    if (communityVouch < 3) throw new Error('Need 3+ vouches');

    const pledgeId = ctx.stub.getTxID();
    const pledge = {
      pledgeId,
      nodeId,
      participant,
      effortHours,
      voiceHash,
      communityVouch,
      timestamp: new Date().toISOString(),
      hstMinted: effortHours,
      status: 'active'
    };

    await ctx.stub.putState(pledgeId, Buffer.from(JSON.stringify(pledge)));

    // Update total supply (Note: For high concurrency, consider using a dedicated counter asset or Fabric's chaincode features for atomicity)
    const supplyKey = 'TOTAL_SUPPLY';
    let supply = 0;
    const supplyData = await ctx.stub.getState(supplyKey);
    if (supplyData && supplyData.length > 0) {
      supply = parseInt(supplyData.toString(), 10);
    }
    supply += effortHours;
    await ctx.stub.putState(supplyKey, Buffer.from(supply.toString()));

    // Emit event for monitoring
    ctx.stub.setEvent('HSTMinted', Buffer.from(JSON.stringify({ pledgeId, hstMinted: effortHours })));

    return { pledgeId, hstMinted: effortHours, totalSupply: supply };
  }

  // A-L-F Veto™ — 6 AI consensus (simulated)
  // Note: In production, this would integrate with external oracles (e.g., via Chainlink or off-chain services) to call real AI APIs,
  // as chaincode cannot make direct HTTP calls. For now, simulated based on inputs.
  async a_l_f_veto(ctx, effort, vouch) {
    if (vouch >= 3 && effort > 0 && effort <= 168) {
      return { passed: true };
    }
    return { passed: false, reason: 'Low vouch or invalid effort (must be 1-168 hours)' };
  }

  // Bridge Trade: HST → Real Resource
  async bridgeTrade(ctx, fromPledgeId, toResource, amountKg) {
    amountKg = parseInt(amountKg, 10);
    if (isNaN(amountKg) || amountKg <= 0) throw new Error('Invalid amountKg: must be a positive integer');
    if (!toResource || typeof toResource !== 'string') throw new Error('Invalid toResource: must be a non-empty string');

    const pledgeData = await ctx.stub.getState(fromPledgeId);
    if (!pledgeData || pledgeData.length === 0) throw new Error('Pledge not found');

    const pledge = JSON.parse(pledgeData.toString());
    if (pledge.hstMinted < amountKg) throw new Error('Not enough HST');

    // Deduct from pledge (assuming HST is burned/transferred upon trade; adjust if different semantics intended)
    pledge.hstMinted -= amountKg;
    await ctx.stub.putState(fromPledgeId, Buffer.from(JSON.stringify(pledge)));

    const trade = {
      tradeId: ctx.stub.getTxID(),
      fromPledgeId,
      toResource,
      amountKg,
      status: 'matched',
      timestamp: new Date().toISOString()
    };

    await ctx.stub.putState(trade.tradeId, Buffer.from(JSON.stringify(trade)));

    // Emit event for monitoring
    ctx.stub.setEvent('BridgeTrade', Buffer.from(JSON.stringify(trade)));

    return trade;
  }

  // Query total HST supply
  async getTotalSupply(ctx) {
    const supplyData = await ctx.stub.getState('TOTAL_SUPPLY');
    return supplyData && supplyData.length > 0 ? parseInt(supplyData.toString(), 10) : 0;
  }

  // Query pledge by ID
  async getPledge(ctx, pledgeId) {
    const data = await ctx.stub.getState(pledgeId);
    return data && data.length > 0 ? JSON.parse(data.toString()) : null;
  }
}

module.exports = HSTContract;


/*
================================================================================
Non-Exclusive, Community-Commercial Software License Agreement
Effective Date: November 13, 2025
Licensor: JuiceIdeas Co. (91824 haiamu st, ewa beach HI, 96706)
Licensee: Any user or entity ("Licensee") that obtains a copy of this software.
Contact: JJBalacy@outlook.com
================================================================================

This Agreement governs the use of the HST Chaincode software and any associated intellectual property provided by Licensor. By using the Software, Licensee agrees to all terms herein.

### 1. DEFINITIONS

1.1 "Software" means the HST Chaincode software (HST v1.0 — Human-Sovereign-Time Chaincode) and any related materials provided by Licensor under this Agreement.

1.2 "Derivative Work" means any work based on or derived from the Software, including modifications, enhancements, translations, or adaptations.

1.3 "Net Sales" means the gross revenue received by Licensee from the sale, licensing, or any revenue-generating use of the Software or Derivative Works, less documented deductions for returns, discounts, taxes, and shipping.

1.4 "Community Development Use" means using, modifying, and distributing the Software or Derivative Works solely for non-profit research, education, personal projects, testing, or internal development and prototyping that does not generate revenue or reduce a financial liability.

1.5 "Commercial Deployment" means the first instance where the Software or any Derivative Work is used, sold, or licensed to an external party, or is internally deployed by the Licensee for any purpose that directly generates revenue or reduces a financial liability that would otherwise exist. This includes, but is not limited to, using the Software in a production environment for commercial services, selling services based on the Software, or licensing it to others.

### 2. GRANT OF LICENSE

2.1 Community License Grant: Subject to the terms of this Agreement, Licensor grants Licensee a perpetual, non-exclusive, worldwide, royalty-free license to use, modify, reproduce, distribute, and create Derivative Works of the Software solely for "Community Development Use."

2.2 Commercial License Conversion: The license granted in Section 2.1 automatically converts to a royalty-bearing commercial license, governed by the terms in Section 3, immediately upon the date of the Licensee's first "Commercial Deployment."

### 3. COMMERCIAL TERMS AND ROYALTIES

These terms (3.1 - 3.5) apply only upon "Commercial Deployment."

3.1 Royalty Trigger Notification: Licensee shall notify Licensor in writing at JJBalacy@outlook.com within thirty (30) days of the date of the first Commercial Deployment.

3.2 Royalty Rate: Licensee shall pay Licensor royalties equal to 5% (five percent) of Net Sales from any Commercial Deployment, sale, or sublicensing of the Software or Derivative Works.

3.3 Minimum Annual Royalty: A minimum annual royalty payment of $1,000.00 USD is required, commencing from the first anniversary of the Commercial Deployment. This minimum payment is creditable against sales-based royalties (3.2) paid within that same year.

3.4 Sublicensing Revenue: For any sublicensing arrangements, Licensee shall pay Licensor 25% (twenty-five percent) of any upfront fees, non-sales-based licensing revenue, or similar compensation received from sublicensees.

3.5 Reporting and Payment: Royalties are due quarterly (within 30 days of the end of each calendar quarter). All payments must be accompanied by a detailed report identifying Net Sales and all royalty calculations.

### 4. REPORTING AND AUDIT

Upon Commercial Deployment, Licensee shall maintain accurate records of sales and revenue. Licensor reserves the right, upon reasonable notice, to audit Licensee's records to verify royalty payments.

### 5. TERM AND TERMINATION

This Agreement is perpetual unless terminated. Licensor may terminate this Agreement if Licensee materially breaches its terms and fails to cure such breach within 30 days of notice. Upon termination, Licensee must cease all use and distribution of the Software and pay all outstanding royalties.

### 6. WARRANTY DISCLAIMER

The Software is provided "AS IS," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.

### 7. LIMITATION OF LIABILITY

In no event shall Licensor be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software or the use or other dealings in the Software.

### 8. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the State of Hawaii, United States, without regard to its conflict of law provisions.

*/
