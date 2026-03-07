import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Initialize animation after script loads
    if (typeof window !== 'undefined' && window.BulletTimeBackground) {
      window.BulletTimeBackground.init('hero-bg');
    }

    // Scroll-based animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.demo-text, .demo-window, .benchmark-chart, .benchmarks-mini, .trusted-logos, .demo-output, .principle').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Glock - One Shot Your Code</title>
        <meta name="description" content="AI coding agent for serious developers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <img src="/glock-logo.png" alt="Glock" className="logo-icon" />
            <span className="logo-text">Glock</span>
          </div>
          <div className="nav-links">
            <a href="#demo">Demo</a>
            <a href="#benchmarks">Benchmarks</a>
            <a href="#cta" className="nav-cta">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-bg" className="hero">
        <div className="hero-split">
          <div className="hero-left">
            <div className="hero-badges">
              <span className="hero-badge">#1 on HumanEval</span>
              <span className="hero-badge">#1 on SWE-bench</span>
            </div>
            <h1 className="hero-title">One Shot Your Code</h1>
            <p className="hero-subtitle">
              For developers who don&apos;t have time for back and forth
            </p>
            <div className="hero-install">
              <code className="install-cmd">
                <span className="install-prompt">$</span>
                <span className="install-text">curl -sSL https://glock.dev/install | sh</span>
                <button className="install-copy" onClick={(e) => {navigator.clipboard.writeText('curl -sSL https://glock.dev/install | sh'); e.target.textContent = 'Copied!'; setTimeout(() => e.target.textContent = 'Copy', 1500);}}>Copy</button>
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted">
        <div className="trusted-container">
          <p className="trusted-label">Trusted by engineers from</p>
          <div className="trusted-logos">
            <div className="trusted-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor">
                <path d="M13.88 9.515c0-1.37 1.14-1.9 2.982-1.9A19.661 19.661 0 0 1 25.6 9.876v-8.27A23.184 23.184 0 0 0 16.862.001C9.762.001 5 3.72 5 9.93c0 9.716 13.342 8.138 13.342 12.326 0 1.638-1.4 2.146-3.37 2.146-2.905 0-6.657-1.202-9.6-2.802v8.378A24.353 24.353 0 0 0 14.973 32C22.27 32 27.3 28.395 27.3 22.077c0-10.486-13.42-8.613-13.42-12.56z" fillRule="evenodd"/>
              </svg>
              <span>Stripe</span>
            </div>
            <div className="trusted-logo yc-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                <rect width="512" height="512" rx="15%" fill="currentColor"/>
                <path d="M126 113h49l81 164 81-165h49L274 314v134h-42V314z" fill="#0a0a0a"/>
              </svg>
              <span>Y Combinator</span>
            </div>
            <div className="trusted-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5Zm2.382 6.022a3.478 3.478 0 0 1 5.58-2.125l-.008.005L8.82 7.288a.5.5 0 0 0-.25.435l.022 5.106-1.263-.722V7.625c0-.206.018-.408.052-.603Zm10.822.019a3.46 3.46 0 0 1 .43 2.241l-.01-.005-4.133-2.387a.5.5 0 0 0-.502.002l-4.41 2.572-.007-1.455 3.882-2.241a3.478 3.478 0 0 1 4.75 1.273Zm-8.62 3.578.012 2.783 2.417 1.381 2.404-1.402-.013-2.784-2.416-1.38-2.404 1.402Zm3.401-1.984 1.257-.733 3.882 2.24a3.478 3.478 0 0 1-.454 6.243l0-.01v-4.773a.5.5 0 0 0-.252-.434l-4.433-2.533Zm3.686 3.257-1.264-.722.023 5.106a.5.5 0 0 1-.25.436l-4.133 2.386-.01.005a3.478 3.478 0 0 0 5.633-2.728v-4.483Zm-2.249 2.644.006 1.455-3.881 2.24a3.478 3.478 0 0 1-5.18-3.514l.01.006 4.132 2.387a.5.5 0 0 0 .502-.002l4.411-2.572Zm-4.664 1.562 1.257-.733-4.433-2.533a.5.5 0 0 1-.252-.434V7.625l0-.01a3.478 3.478 0 0 0-.454 6.243l3.882 2.24Z" clipRule="evenodd"/>
              </svg>
              <span>OpenAI</span>
            </div>
            <div className="trusted-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" fillRule="evenodd">
                <path d="M28.312 28.26C25.003 30.7 20.208 32 16.08 32c-5.8 0-11.002-2.14-14.945-5.703-.3-.28-.032-.662.34-.444C5.73 28.33 11 29.82 16.426 29.82a29.73 29.73 0 0 0 11.406-2.332c.56-.238 1.03.367.48.773m1.376-1.575c-.42-.54-2.796-.255-3.86-.13-.325.04-.374-.243-.082-.446 1.9-1.33 4.994-.947 5.356-.5s-.094 3.56-1.87 5.044c-.273.228-.533.107-.4-.196.4-.996 1.294-3.23.87-3.772"/>
                <path d="M18.43 13.864c0 1.692.043 3.103-.812 4.605-.7 1.22-1.8 1.973-3.005 1.973-1.667 0-2.644-1.27-2.644-3.145 0-3.7 3.316-4.373 6.462-4.373v.94m4.38 10.584c-.287.257-.702.275-1.026.104-1.44-1.197-1.704-1.753-2.492-2.895-2.382 2.43-4.074 3.157-7.158 3.157-3.658 0-6.498-2.254-6.498-6.767 0-3.524 1.905-5.924 4.63-7.097 2.357-1.038 5.65-1.22 8.165-1.5V8.9c0-1.032.08-2.254-.53-3.145-.525-.8-1.54-1.13-2.437-1.13-1.655 0-3.127.85-3.487 2.608-.073.4-.36.776-.757.794L7 7.555c-.354-.08-.75-.366-.647-.9C7.328 1.54 11.945 0 16.074 0c2.113 0 4.874.562 6.54 2.162 2.113 1.973 1.912 4.605 1.912 7.47V16.4c0 2.034.843 2.925 1.637 4.025.275.4.336.86-.018 1.154a184.26 184.26 0 0 0-3.328 2.883l-.006-.012"/>
              </svg>
              <span>AWS</span>
            </div>
            <div className="trusted-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.2 65" fill="currentColor">
                <path d="M66.5,0H52.4l25.7,65h14.1L66.5,0z M25.7,0L0,65h14.4l5.3-13.6h26.9L51.8,65h14.4L40.5,0C40.5,0,25.7,0,25.7,0z M24.3,39.3l8.8-22.8l8.8,22.8H24.3z"/>
              </svg>
              <span>Anthropic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tool in Action Section */}
      <section id="demo" className="demo">
        <div className="demo-container">
          <div className="demo-layout">
            <div className="demo-text">
              <h2 className="section-title demo-section-title"><span className="demo-eyebrow">Install Glock</span>Available in<br/>the terminal</h2>
            </div>
            <div className="demo-window">
              <div className="demo-header">
                <div className="demo-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="demo-title">glock</span>
              </div>
              <div className="demo-content">
                <div className="demo-line">
                  <span className="prompt">$</span>
                  <span className="command">glock do &quot;Add authentication with OAuth, session management, and protected routes&quot;</span>
                </div>
                <div className="demo-output">
                  <div className="output-line analyzing">
                    <span className="icon">&#9654;</span> Analyzing task... <span className="tag">auth, security, fullstack</span>
                  </div>
                  <div className="output-line routing">
                    <span className="icon">&#9654;</span> Routing to specialists... <span className="tag">Python + Frontend</span>
                  </div>
                  <div className="output-line council">
                    <span className="icon">&#9654;</span> Council deliberation... <span className="tag">3 proposals reviewed</span>
                  </div>
                  <div className="output-line applying">
                    <span className="icon">&#9654;</span> Applying changes... <span className="tag">7 files modified</span>
                  </div>
                  <div className="output-line success">
                    <span className="icon">&#10003;</span> Complete. Checkpoint created for instant undo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SWE Benchmarks Section */}
      <section id="benchmarks" className="benchmarks">
        <div className="benchmarks-container">
          <h2 className="section-title">Top of the SWE benchmarks</h2>
          <p className="section-subtitle">Glock is the most accurate coding agent</p>
          <div className="benchmark-chart">
            <div className="benchmark-item glock">
              <div className="benchmark-bar" style={{"--width": "100%"}}>
                <span className="benchmark-name">
                  <img src="/glock-logo.png" alt="Glock" className="benchmark-logo benchmark-logo-img" />
                  Glock
                </span>
                <span className="benchmark-score">76.4%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "94%"}}>
                <span className="benchmark-name">
                  <svg className="benchmark-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" fill="currentColor"><path d="M233.96 800.21L468.64 668.54l3.95-11.44-3.95-6.36H457.2l-39.22-2.42-134.09-3.62-116.3-4.83-112.67-6.04L26.58 627.79 0 592.75l2.74-17.48 23.84-16.03 34.15 2.98 75.46 5.15 113.24 7.81 82.15 4.83 121.69 12.65 19.33 0 2.74-7.81-6.6-4.83-5.16-4.83L346.39 495.79 219.54 411.87l-66.44-48.32-35.92-24.48-18.12-22.95-7.81-50.09 32.62-35.92 43.81 2.98 11.19 2.98 44.38 34.15 94.79 73.37 123.79 91.17 18.12 15.06 7.25-5.15.89-3.62-8.13-13.62-67.46-121.69-71.84-123.79-31.97-51.3-8.46-30.76c-2.98-12.64-5.15-23.27-5.15-36.24l37.13-50.42 20.54-6.6 49.53 6.6 20.86 18.12 30.76 70.39 49.85 110.82 77.32 150.68 22.63 44.7 12.08 41.4 4.51 12.64h7.81v-7.25l6.36-84.89 11.76-104.21 11.44-134.09 3.95-37.77 18.68-45.26 37.13-24.48 29.03 13.85 23.83 34.15-3.3 22.07-14.17 92.13-27.79 144.32-18.12 96.64h10.55l12.08-12.08 48.89-64.91 82.15-102.68 36.24-40.75 42.28-45.02 27.14-21.42h51.3l37.77 56.13-16.91 57.99-52.83 67.01-43.81 56.78-62.82 84.56-39.22 67.65 3.62 5.4 9.34-0.89 141.91-30.2 76.67-13.85 91.49-15.7 41.4 19.33 4.51 19.65-16.27 40.19-97.85 24.16-114.77 22.95-170.9 40.43-2.09 1.53 2.42 2.98 76.99 7.25 32.94 1.77 80.62 0 150.12 11.19 39.22 25.93 23.52 31.73-3.95 24.16-60.4 30.76-81.5-19.33-190.23-45.26-65.46-16.27-8.97 0v5.4l54.36 53.15 99.62 89.96 124.75 115.97 6.36 28.67-16.03 22.63-16.91-2.42-109.61-82.47-42.28-37.13-95.76-80.62h-6.36v8.46l22.07 32.3 116.54 175.17 6.04 53.72-8.46 17.48-30.2 10.55-33.18-6.04-68.21-95.76-70.39-107.84-56.78-96.64-6.92 3.95-33.48 360.89-15.7 18.44-36.24 13.85-30.2-22.95-16.03-37.13 16.03-73.37 19.33-95.76 15.7-76.09 14.17-94.55 8.46-31.41-.56-2.09-6.93.89-71.28 97.85-108.72 146.5-85.77 91.81-20.54 8.13-35.6-18.44 3.3-36.93 20.14-29.76 94.79-66.47 7.68-0.68z"/></svg>
                  Claude Code
                </span>
                <span className="benchmark-score">72.0%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "85%"}}>
                <span className="benchmark-name">
                  <svg className="benchmark-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.18 7.5 12 10.82 4.82 7.5 12 4.18zM4 8.82l7 3.5V19l-7-3.5V8.82zm9 10.18v-6.68l7-3.5V15.5l-7 3.5z"/></svg>
                  Cursor
                </span>
                <span className="benchmark-score">65.2%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "70%"}}>
                <span className="benchmark-name">
                  <svg className="benchmark-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5Zm2.382 6.022a3.478 3.478 0 0 1 5.58-2.125l-.008.005L8.82 7.288a.5.5 0 0 0-.25.435l.022 5.106-1.263-.722V7.625c0-.206.018-.408.052-.603Zm10.822.019a3.46 3.46 0 0 1 .43 2.241l-.01-.005-4.133-2.387a.5.5 0 0 0-.502.002l-4.41 2.572-.007-1.455 3.882-2.241a3.478 3.478 0 0 1 4.75 1.273Zm-8.62 3.578.012 2.783 2.417 1.381 2.404-1.402-.013-2.784-2.416-1.38-2.404 1.402Zm3.401-1.984 1.257-.733 3.882 2.24a3.478 3.478 0 0 1-.454 6.243l0-.01v-4.773a.5.5 0 0 0-.252-.434l-4.433-2.533Zm3.686 3.257-1.264-.722.023 5.106a.5.5 0 0 1-.25.436l-4.133 2.386-.01.005a3.478 3.478 0 0 0 5.633-2.728v-4.483Zm-2.249 2.644.006 1.455-3.881 2.24a3.478 3.478 0 0 1-5.18-3.514l.01.006 4.132 2.387a.5.5 0 0 0 .502-.002l4.411-2.572Zm-4.664 1.562 1.257-.733-4.433-2.533a.5.5 0 0 1-.252-.434V7.625l0-.01a3.478 3.478 0 0 0-.454 6.243l3.882 2.24Z" clipRule="evenodd"/></svg>
                  Codex
                </span>
                <span className="benchmark-score">48.1%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "63%"}}>
                <span className="benchmark-name">
                  <svg className="benchmark-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  Copilot
                </span>
                <span className="benchmark-score">53.6%</span>
              </div>
            </div>
          </div>
          <p className="benchmark-note">* SWE-bench verified. Full methodology available on request.</p>
          <div className="section-cta" style={{justifyContent: 'flex-start'}}>
            <a href="https://www.swebench.com/#lite" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-swe">View SWE-bench Results →</a>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="principles">
        <div className="principles-container">
          <div className="principle">
            <span className="fig-label">FIG 0.1</span>
            <div className="principle-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <style>{`
                  @keyframes fig1Float { 0%, 100% { transform: translateY(3px); } 50% { transform: translateY(-3px); } }
                `}</style>
                <g style={{animation: 'fig1Float 4s ease-in-out infinite'}}>
                {/* Bottom cube */}
                <polygon points="45,149 95,174 95,196 45,171" stroke="#4a4a4a" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="145,149 95,174 95,196 145,171" stroke="#4a4a4a" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="95,124 145,149 95,174 45,149" stroke="#4a4a4a" strokeWidth="0.5" fill="#0a0a0a"/>
                {/* Middle cube */}
                <polygon points="45,107 95,132 95,154 45,129" stroke="#555" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="145,107 95,132 95,154 145,129" stroke="#555" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="95,82 145,107 95,132 45,107" stroke="#555" strokeWidth="0.5" fill="#0a0a0a"/>
                {/* Top cube */}
                <polygon points="45,65 95,90 95,112 45,87" stroke="#666" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="145,65 95,90 95,112 145,87" stroke="#666" strokeWidth="0.5" fill="#0a0a0a"/>
                <polygon points="95,40 145,65 95,90 45,65" stroke="#666" strokeWidth="0.7" fill="#0a0a0a"/>
                {/* Four colored diamonds in 2x2 grid on top face */}
                <polygon points="107,63 111,61 115,63 111,65" fill="#4ade80"/>
                <polygon points="115,63 119,61 123,63 119,65" fill="#60a5fa"/>
                <polygon points="111,66 115,64 119,66 115,68" fill="#c084fc"/>
                <polygon points="119,66 123,64 127,66 123,68" fill="#fbbf24"/>
                </g>
              </svg>
            </div>
            <h3 className="principle-title">Built to finish the task</h3>
            <p className="principle-desc"> Coding agents are designed to build not finish. 
              Glock produces production level code that actually finishes the task.</p>
          </div>
          <div className="principle">
            <span className="fig-label">FIG 0.2</span>
            <div className="principle-illustration">
              <svg viewBox="0 -20 200 200" fill="none">
                <style>{`
                  @keyframes fig2Wave { 0% { transform: scaleY(0.4); } 50% { transform: scaleY(1.2); } 100% { transform: scaleY(0.4); } }
                `}</style>
                <defs>
                  <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0"/>
                    <stop offset="20%" stopColor="white" stopOpacity="1"/>
                    <stop offset="80%" stopColor="white" stopOpacity="1"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <mask id="fadeMask">
                    <rect x="0" y="10" width="200" height="170" fill="url(#lineFade)"/>
                  </mask>
                </defs>
                {/* X axis baseline at bottom */}
                <line x1="10" y1="175" x2="195" y2="175" stroke="#555" strokeWidth="0.5" opacity="0.3"/>
                {/* Static drop lines — faded at top and bottom */}
                <g mask="url(#fadeMask)">
                {(() => {
                  const lines = [];
                  for (let i = 0; i < 40; i++) {
                    const x = 10 + i * 4.7;
                    lines.push(<line key={`l${i}`} x1={x} y1={10} x2={x} y2={175} stroke="#666" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.4"/>);
                  }
                  return lines;
                })()}
                </g>
                {/* Shockwave ellipses — wave flows through left to right */}
                <g mask="url(#fadeMask)">
                {(() => {
                  const elements = [];
                  const centerY = 95;
                  const count = 16;
                  for (let i = 0; i < count; i++) {
                    const x = 12 + i * 11.5;
                    const phase = -(i / count) * 4;
                    elements.push(
                      <ellipse key={`r_${i}`} cx={x} cy={centerY} rx="2" ry="55"
                        stroke="#fff" strokeWidth="0.8" fill="none"
                        opacity="0.22"
                        style={{transformOrigin: `${x}px ${centerY}px`, animation: `fig2Wave 4s ease-in-out infinite ${phase}s`}}
                      />
                    );
                  }
                  return elements;
                })()}
                </g>
              </svg>
            </div>
            <h3 className="principle-title">Multiple models, one system</h3>
            <p className="principle-desc">Glock sends each task to 8 of the best coding agents,<br/> weighs the responses, and iterates until the code passes checks.</p>
          </div>
          <div className="principle">
            <span className="fig-label">FIG 0.3</span>
            <div className="principle-illustration">
              <svg viewBox="0 0 200 200" fill="none">
                <style>{`
                  @keyframes fig3Breathe { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
                  @keyframes fig3Glow { 0%, 100% { opacity: 0.6; r: 3; } 50% { opacity: 1; r: 4; } }
                `}</style>
                {/* Lines radiating from center point, fanning upward and to sides */}
                {(() => {
                  const angles = [-85, -75, -62, -48, -35, -20, -8, 5, 18, 32, 45, 58, 72, 82, 150, 170, 195, 210];
                  const lengths = [95, 80, 100, 88, 75, 95, 80, 88, 100, 80, 95, 75, 88, 80, 55, 48, 55, 48];
                  return angles.map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    const len = lengths[i];
                    const x2 = 100 + Math.cos(rad) * len;
                    const y2 = 115 + Math.sin(rad) * len;
                    return <line key={i} x1="100" y1="115" x2={x2} y2={y2} stroke="#666" strokeWidth="0.7" style={{animation: `fig3Breathe ${2 + (i % 4) * 0.5}s ease-in-out infinite ${i * 0.15}s`}}/>;
                  });
                })()}
                {/* Center point — pulsing */}
                <circle cx="100" cy="115" r="3" fill="#fff" style={{animation: 'fig3Glow 2s ease-in-out infinite'}}/>
              </svg>
            </div>
            <h3 className="principle-title">Built for accuracy</h3>
            <p className="principle-desc">Record scores on SWE-bench and HumanEval. Better code than Amp, Claude Code, and Codex. Guaranteed.</p>
          </div>
          <div className="section-cta" style={{gridColumn: "1 / -1", justifyContent: "center"}}>
            <a href="https://cal.com/aiden-lee-9wlz0o/glock-onboarding" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-bright">Book a Meeting</a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="pricing-container">
          <h2 className="section-title pricing-title">Pricing</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <span className="pricing-tier">Individual</span>
              <div className="pricing-price">
                <span className="pricing-amount">$300</span>
                <span className="pricing-period">/mo</span>
              </div>
              <ul className="pricing-features">
                <li>8-agent parallel execution</li>
                <li>Unlimited tasks</li>
                <li>All model access</li>
                <li>Priority support</li>
              </ul>
              <a href="https://cal.com/aiden-lee-9wlz0o/glock-onboarding" target="_blank" rel="noopener noreferrer" className="btn btn-primary pricing-btn">Get Started</a>
            </div>
            <div className="pricing-card">
              <span className="pricing-tier">Enterprise</span>
              <div className="pricing-price">
                <span className="pricing-amount">Custom</span>
              </div>
              <ul className="pricing-features">
                <li>Everything in Individual</li>
                <li>Team management</li>
                <li>SSO &amp; audit logs</li>
                <li>Dedicated support</li>
              </ul>
              <a href="https://cal.com/aiden-lee-9wlz0o/glock-onboarding" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-bright pricing-btn">Get a Quote</a>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img src="/glock-logo.png" alt="Glock" className="footer-logo-icon" />
          </div>
          <div className="footer-links">
            <a href="#">Documentation</a>
            <a href="#">GitHub</a>
            <a href="#">Twitter</a>
            <a href="mailto:team@glock.dev">Contact</a>
          </div>
          <p className="footer-copyright">&copy; 2025 Glock. Built with Glock.</p>
        </div>
      </footer>

      {/* Bullet Time Background Animation */}
      <Script
        src="/bullet-time-bg.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.BulletTimeBackground) {
            window.BulletTimeBackground.init('hero-bg');
          }
        }}
      />
    </>
  );
}
