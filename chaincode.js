/*
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
*/

// HST v1.0 — Human-Sovereign-Time Chaincode
// Zero-Default Lending | Mutual NPC Code | A-L-F Veto™
// Architect: Joshua Juice Ba Lacy | JuicyIdeas Co.
// Deployed: 2025-11-13 00:00 HST

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