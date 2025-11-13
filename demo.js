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