/*
Royalty-Bearing Exclusive Software License Agreement


This Royalty-Bearing License Agreement ("Agreement") is entered into as of November 13, 2025 ("Effective Date"), between JuiceIdeas Co., with offices at 91824 haiamu st, ewa beach HI, 96706, ("Licensor"), and any user or entity ("Licensee") that obtains a copy of this software.

1. DEFINITIONS
1.1 "Derivative Work" means any work based on the Software, including modifications, enhancements, or adaptations.
1.2 "Net Sales" means the gross revenue received by Licensee from sales or licensing of the Software or Derivative Works, less documented deductions for returns, discounts, taxes, and shipping.
1.3 "Software" means the HST Chaincode software provided under this Agreement.

2. GRANT OF LICENSE
Subject to the terms of this Agreement, Licensor grants Licensee a non-exclusive, royalty-bearing license to use, modify, reproduce, distribute, and create Derivative Works of the Software for commercial purposes. For non-commercial use (e.g., personal, educational), no royalties apply.

3. ROYALTIES
3.1 Licensee shall pay Licensor royalties equal to 5% of Net Sales from any commercial use, sale, or sublicensing of the Software or Derivative Works.
3.2 Royalties are due quarterly, with reports on sales and calculations provided to Licensor at [your email].
3.3 Minimum annual royalty: $1,000 starting from the first year of commercial use, creditable against sales-based royalties.
3.4 For sublicensing, Licensee shall pay 25% of any upfront fees or non-sales revenue received from sublicensees.

4. REPORTING AND AUDIT
Licensee shall provide quarterly reports on sales and royalties. Licensor may audit records upon reasonable notice.

5. TERM AND TERMINATION
This Agreement is perpetual unless terminated for breach. Upon termination, Licensee must cease use and pay outstanding royalties.

6. WARRANTY DISCLAIMER
The Software is provided "AS IS" without warranties. Licensor is not liable for any damages.

7. GOVERNING LAW
Governed by the laws of Hawaii, US.

For custom terms or questions, contact: JJBalacy@outlook.com. 
*/

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