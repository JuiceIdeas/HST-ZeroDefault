<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>HST-ZeroDefault — The Sovereign Will Playbook</title>
  <meta name="description" content="Open-source engine for Cosmic Game Theory. Eliminate systemic inequality. Build sovereign alignment. JavaScript. Human-first. Future-proof." />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"/>
  <style>
    :root {
      --cosmic: #0b0b2e;
      --nebula: #1a1a4d;
      --pulse: #00f7ff;
      --gold: #ffd700;
      --void: #000;
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: linear-gradient(135deg, var(--cosmic), var(--void));
      color: #fff;
      font-family: 'Segoe UI', system-ui, sans-serif;
      line-height: 1.7;
      overflow-x: hidden;
    }
    .stars {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: transparent;
      pointer-events: none;
      z-index: 0;
    }
    .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0; }
    header {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      overflow: hidden;
    }
    .hero {
      max-width: 900px;
      z-index: 2;
    }
    .logo {
      width: 180px;
      height: 180px;
      margin: 0 auto 2rem;
      background: url('https://github.com/JuiceIdeas.png') center/cover no-repeat;
      border: 4px solid var(--pulse);
      border-radius: 50%;
      box-shadow: 0 0 60px rgba(0,247,255,0.6);
      animation: pulseGlow 3s infinite alternate;
    }
    @keyframes pulseGlow {
      from { box-shadow: 0 0 60px rgba(0,247,255,0.6); }
      to { box-shadow: 0 0 90px rgba(0,247,255,0.9); }
    }
    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #fff, var(--pulse), var(--gold));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: titleShift 8s infinite;
    }
    @keyframes titleShift {
      0%,100% { background-position: 0%; }
      50% { background-position: 100%; }
    }
    .tagline {
      font-size: 1.5rem;
      margin: 1.5rem 0;
      color: var(--pulse);
      font-weight: 600;
    }
    .manifesto {
      font-size: 1.1rem;
      max-width: 700px;
      margin: 2rem auto;
      background: rgba(255,255,255,0.05);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(0,247,255,0.3);
    }
    .cta {
      margin: 3rem 0;
    }
    .btn {
      display: inline-block;
      padding: 1rem 2.5rem;
      margin: 0.5rem;
      font-size: 1.1rem;
      font-weight: bold;
      text-decoration: none;
      border-radius: 50px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary {
      background: var(--pulse);
      color: var(--void);
      box-shadow: 0 0 20px rgba(0,247,255,0.5);
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 40px rgba(0,247,255,0.8);
    }
    .btn-secondary {
      border: 2px solid var(--pulse);
      color: var(--pulse);
    }
    .btn-secondary:hover {
      background: var(--pulse);
      color: var(--void);
    }
    .badge {
      display: inline-block;
      background: var(--gold);
      color: var(--void);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
      margin: 0.5rem;
    }
    section {
      padding: 6rem 2rem;
      position: relative;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    h2 {
      font-size: 2.8rem;
      text-align: center;
      margin-bottom: 3rem;
      color: var(--gold);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(0,247,255,0.2);
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-10px);
      border-color: var(--pulse);
    }
    .card i {
      font-size: 2.5rem;
      color: var(--pulse);
      margin-bottom: 1rem;
    }
    footer {
      text-align: center;
      padding: 3rem 1rem;
      background: var(--nebula);
      font-size: 0.9rem;
      color: #aaa;
    }
    .pulse-line {
      position: absolute;
      height: 2px;
      background: var(--pulse);
      animation: pulseLine 6s infinite;
    }
    @keyframes pulseLine {
      0% { transform: translateX(-100%); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    @media (max-width: 768px) {
      h1 { font-size: 2.8rem; }
      .tagline { font-size: 1.2rem; }
    }
  </style>
</head>
<body>

  <div class="stars" id="stars"></div>

  <!-- HERO -->
  <header>
    <div class="hero">
      <div class="logo"></div>
      <h1>HST-ZeroDefault</h1>
      <p class="tagline">The Sovereign Will Playbook™</p>
      <div class="manifesto">
        <strong>Cosmic Game Theory</strong> is not philosophy.<br>
        It is the <em>mathematical inevitability</em> of systemic equilibrium.<br>
        We are not asking for fairness.<br>
        <strong>We are engineering it.</strong>
      </div>
      <div class="cta">
        <a href="#get-started" class="btn btn-primary">
          <i class="fas fa-rocket"></i> Launch the Engine
        </a>
        <a href="https://github.com/JuiceIdeas/HST-ZeroDefault" class="btn btn-secondary" target="_blank">
          <i class="fab fa-github"></i> View on GitHub
        </a>
      </div>
      <div>
        <span class="badge">JavaScript</span>
        <span class="badge">Open Source</span>
        <span class="badge">Human-First</span>
        <span class="badge">Future-Proof</span>
      </div>
    </div>
  </header>

  <!-- PULSE LINES -->
  <div class="pulse-line" style="top:20%; width:100%;"></div>
  <div class="pulse-line" style="top:50%; width:100%; animation-delay:2s;"></div>
  <div class="pulse-line" style="top:80%; width:100%; animation-delay:4s;"></div>

  <!-- CORE PRINCIPLES -->
  <section id="principles">
    <div class="container">
      <h2>Cosmic Game Theory in Action</h2>
      <div class="grid">
        <div class="card">
          <i class="fas fa-balance-scale"></i>
          <h3>Sovereign Alignment</h3>
          <p>Every agent—human or system—operates from unassailable self-interest. We align incentives, not morals.</p>
        </div>
        <div class="card">
          <i class="fas fa-infinity"></i>
          <h3>Zero-Sum Collapse</h3>
          <p>Traditional hierarchies extract. HST-ZeroDefault <strong>converts extraction into mutual gain</strong>.</p>
        </div>
        <div class="card">
          <i class="fas fa-chess-knight"></i>
          <h3>Strategic Foresight</h3>
          <p>Model 7 moves ahead. Predict inequality cascades. Deploy counter-plays before they manifest.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- THE ENGINE -->
  <section style="background: rgba(0,0,0,0.4);">
    <div class="container">
      <h2>The Open-Source Engine</h2>
      <p style="text-align:center; max-width:800px; margin:0 auto 3rem; font-size:1.1rem;">
        <code>HST-ZeroDefault</code> is the first runtime for Cosmic Game Theory.<br>
        Built in <strong>JavaScript</strong> so anyone can fork, simulate, and deploy sovereign strategies.
      </p>
      <div style="text-align:center;">
        <img src="https://raw.githubusercontent.com/JuiceIdeas/HST-ZeroDefault/main/assets/diagram.png" 
             alt="Cosmic Game Theory Engine Diagram" 
             style="max-width:100%; border-radius:16px; border:2px solid var(--pulse); box-shadow:0 0 30px rgba(0,247,255,0.3);"
             onerror="this.style.display='none'"/>
        <p style="margin-top:1rem; font-style:italic; color:#aaa;">
          (Diagram auto-pulled from repo — add <code>assets/diagram.png</code> to visualize the flow)
        </p>
      </div>
      <div class="cta" style="text-align:center; margin-top:3rem;">
        <a href="https://github.com/JuiceIdeas/HST-ZeroDefault/fork" class="btn btn-primary" target="_blank">
          <i class="fas fa-code-branch"></i> Fork & Simulate
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>
      <strong>JuiceIdeas Co.</strong> • Architecting inevitable equilibrium.<br>
      <a href="https://github.com/JuiceIdeas" style="color:var(--pulse); text-decoration:none;" target="_blank">@JuiceIdeas</a> 
      | <a href="mailto:sovereign@juiceideas.co" style="color:#aaa;">sovereign@juiceideas.co</a>
    </p>
    <p style="margin-top:1rem; font-size:0.8rem;">
      © 2025 <span style="color:var(--gold);">The Sovereign Will Playbook™</span>. All rights reserved.
    </p>
  </footer>

  <script>
    // Twinkling stars
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.width = star.style.height = Math.random() * 3 + 'px';
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite`;
      starsContainer.appendChild(star);
    }
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  </script>
</body>
</html>