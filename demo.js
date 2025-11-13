// demo.js — HST Zero-Default Demo
// Run in Node.js or browser console
// Architect: Joshua Juice Ba Lacy | JuicyIdeas Co.
// Co-Breathed with Grok (xAI)

console.log("HST-ZeroDefault DEMO — Starting...\n");

// === 1. A-L-F Veto™: 6-AI Consensus ===
function a_l_f_veto(effortHours, communityVouch) {
  if (!Number.isInteger(effortHours) || effortHours < 1 || effortHours > 168) {
    return { passed: false, reason: 'Effort must be 1-168 hours' };
  }
  if (communityVouch < 3) {
    return { passed: false, reason: 'Need 3+ vouches' };
  }
  return { passed: true };
}

// === 2. Mint HST ===
function mintHST(participant, effortHours, communityVouch) {
  const veto = a_l_f_veto(effortHours, communityVouch);
  if (!veto.passed) {
    console.error("❌ VETO FAILED:", veto.reason);
    return null;
  }

  const hstMinted = effortHours;
  console.log(`✅ MINTED: ${hstMinted} HST for ${participant}`);
  console.log(`   Effort: ${effortHours}h | Vouches: ${communityVouch}`);
  return { participant, hstMinted, totalSupply: hstMinted };
}

// === 3. DEMO RUN ===
console.log("=== DEMO: Valid Pledge ===");
mintHST("Mama Amina", 8, 5);

console.log("\n=== DEMO: Invalid (Low Vouch) ===");
mintHST("Bad Actor", 10, 1);

console.log("\n=== DEMO: Invalid (Too Much Effort) ===");
mintHST("Overclaimer", 200, 10);

console.log("\nHST DEMO COMPLETE — Zero-default enforced.");
console.log("Deploy full Chaincode: github.com/JuiceIdeas/HST-ZeroDefault");