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
    }, { threshold: 0.2 });

    document.querySelectorAll('.demo-text, .demo-window').forEach(el => {
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
            <img src="/logo.png" alt="Glock" className="logo-icon" />
            <span className="logo-text">Glock</span>
          </div>
          <div className="nav-links">
            <a href="#demo">Demo</a>
            <a href="#benchmarks">Benchmarks</a>
            <a href="#pricing">Pricing</a>
            <a href="#cta" className="nav-cta">Get Started</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-bg" className="hero">
        <div className="hero-container">
          <h1 className="hero-title">One Shot Your Code</h1>
          <p className="hero-subtitle">
            For serious developers who don&apos;t have time for back and forth
          </p>
          <div className="hero-cta">
            <a href="#cta" className="btn btn-primary">Start Building</a>
            <a href="#demo" className="btn btn-secondary">Watch Demo</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">#1</span>
              <span className="stat-label">in HumanEval</span>
            </div>
            <div className="stat">
              <span className="stat-value">#1</span>
              <span className="stat-label">in SWE benchmarks lite</span>
            </div>
            <div className="stat">
              <span className="stat-value">8</span>
              <span className="stat-label">AI agents</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tool in Action Section */}
      <section id="demo" className="demo">
        <div className="demo-container">
          <div className="demo-layout">
            <div className="demo-text">
              <h2 className="section-title">Available in<br/>the terminal</h2>
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

      {/* Trusted By Section */}
      <section className="trusted">
        <div className="trusted-container">
          <p className="trusted-label">Trusted by engineers from</p>
          <div className="trusted-logos">
            <div className="trusted-logo">Stripe</div>
            <div className="trusted-logo">YC W25</div>
            <div className="trusted-logo">Amazon</div>
            <div className="trusted-logo">Founders</div>
          </div>
        </div>
      </section>

      {/* SWE Benchmarks Section */}
      <section id="benchmarks" className="benchmarks">
        <div className="benchmarks-container">
          <h2 className="section-title">Top of the SWE benchmarks</h2>
          <p className="section-subtitle">We don&apos;t just talk about AI coding. We prove it.</p>
          <div className="benchmark-chart">
            <div className="benchmark-item glock">
              <div className="benchmark-bar" style={{"--width": "76%"}}>
                <span className="benchmark-name">Glock</span>
                <span className="benchmark-score">76.4%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "72%"}}>
                <span className="benchmark-name">Claude Code</span>
                <span className="benchmark-score">72.0%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "65%"}}>
                <span className="benchmark-name">Cursor</span>
                <span className="benchmark-score">65.2%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "54%"}}>
                <span className="benchmark-name">GitHub Copilot</span>
                <span className="benchmark-score">53.6%</span>
              </div>
            </div>
            <div className="benchmark-item">
              <div className="benchmark-bar" style={{"--width": "48%"}}>
                <span className="benchmark-name">GPT-4</span>
                <span className="benchmark-score">48.1%</span>
              </div>
            </div>
          </div>
          <p className="benchmark-note">* SWE-bench verified. Full methodology available on request.</p>
        </div>
      </section>

      {/* Principles Section */}
      <section className="principles">
        <div className="principles-container">
          <div className="principle">
            <span className="fig-label">FIG 0.1</span>
            <div className="principle-illustration">
              <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5">
                <style>{`
                  .stack-1 { animation: float1 3s ease-in-out infinite; }
                  .stack-2 { animation: float2 3s ease-in-out infinite 0.2s; }
                  .stack-3 { animation: float3 3s ease-in-out infinite 0.4s; }
                  .stack-4 { animation: float4 3s ease-in-out infinite 0.6s; }
                  @keyframes float1 { 0%, 100% { transform: translateY(0); opacity: 0.6; } 50% { transform: translateY(-3px); opacity: 1; } }
                  @keyframes float2 { 0%, 100% { transform: translateY(0); opacity: 0.7; } 50% { transform: translateY(-4px); opacity: 1; } }
                  @keyframes float3 { 0%, 100% { transform: translateY(0); opacity: 0.8; } 50% { transform: translateY(-5px); opacity: 1; } }
                  @keyframes float4 { 0%, 100% { transform: translateY(0); opacity: 0.9; } 50% { transform: translateY(-6px); opacity: 1; } }
                `}</style>
                <g className="stack-1">
                  <path d="M40 140 L100 170 L160 140 L160 120 L100 150 L40 120 Z" fill="none"/>
                </g>
                <g className="stack-2">
                  <path d="M40 115 L100 145 L160 115 L160 95 L100 125 L40 95 Z" fill="none"/>
                </g>
                <g className="stack-3">
                  <path d="M40 90 L100 120 L160 90 L160 70 L100 100 L40 70 Z" fill="none"/>
                </g>
                <g className="stack-4">
                  <path d="M40 65 L100 95 L160 65 L160 45 L100 75 L40 45 Z" fill="none"/>
                  <path d="M40 45 L100 75 L160 45 L100 15 Z" fill="none"/>
                </g>
              </svg>
            </div>
            <h3 className="principle-title">Built for purpose</h3>
            <p className="principle-desc">Glock is shaped by the practices and principles of world-class engineering teams.</p>
          </div>
          <div className="principle">
            <span className="fig-label">FIG 0.2</span>
            <div className="principle-illustration">
              <svg viewBox="0 0 200 200" fill="none" strokeWidth="0.5">
                <style>{`
                  .wave-group { animation: waveFlow 4s ease-in-out infinite; }
                  @keyframes waveFlow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
                  .wave-dot { animation: wavePulse 3s ease-in-out infinite; }
                  @keyframes wavePulse { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-3px); opacity: 0.9; } }
                `}</style>
                <g className="wave-group">
                  <g stroke="#555555" strokeWidth="0.3" opacity="0.7">
                    <line x1="20" y1="80" x2="20" y2="140"/>
                    <line x1="28" y1="70" x2="28" y2="140"/>
                    <line x1="36" y1="62" x2="36" y2="140"/>
                    <line x1="44" y1="56" x2="44" y2="140"/>
                    <line x1="52" y1="52" x2="52" y2="140"/>
                    <line x1="60" y1="50" x2="60" y2="140"/>
                    <line x1="68" y1="50" x2="68" y2="140"/>
                    <line x1="76" y1="52" x2="76" y2="140"/>
                    <line x1="84" y1="56" x2="84" y2="140"/>
                    <line x1="92" y1="62" x2="92" y2="140"/>
                    <line x1="100" y1="70" x2="100" y2="140"/>
                    <line x1="108" y1="80" x2="108" y2="140"/>
                    <line x1="116" y1="90" x2="116" y2="140"/>
                    <line x1="124" y1="98" x2="124" y2="140"/>
                    <line x1="132" y1="104" x2="132" y2="140"/>
                    <line x1="140" y1="108" x2="140" y2="140"/>
                    <line x1="148" y1="110" x2="148" y2="140"/>
                    <line x1="156" y1="108" x2="156" y2="140"/>
                    <line x1="164" y1="104" x2="164" y2="140"/>
                    <line x1="172" y1="98" x2="172" y2="140"/>
                    <line x1="180" y1="90" x2="180" y2="140"/>
                  </g>
                  <g fill="#888888">
                    <circle className="wave-dot" cx="20" cy="80" r="2"/>
                    <circle className="wave-dot" cx="28" cy="70" r="2"/>
                    <circle className="wave-dot" cx="36" cy="62" r="2"/>
                    <circle className="wave-dot" cx="44" cy="56" r="2"/>
                    <circle className="wave-dot" cx="52" cy="52" r="2"/>
                    <circle className="wave-dot" cx="60" cy="50" r="2.5"/>
                    <circle className="wave-dot" cx="68" cy="50" r="2.5"/>
                    <circle className="wave-dot" cx="76" cy="52" r="2"/>
                    <circle className="wave-dot" cx="84" cy="56" r="2"/>
                    <circle className="wave-dot" cx="92" cy="62" r="2"/>
                    <circle className="wave-dot" cx="100" cy="70" r="2"/>
                    <circle className="wave-dot" cx="108" cy="80" r="2"/>
                    <circle className="wave-dot" cx="116" cy="90" r="2"/>
                    <circle className="wave-dot" cx="124" cy="98" r="2"/>
                    <circle className="wave-dot" cx="132" cy="104" r="2"/>
                    <circle className="wave-dot" cx="140" cy="108" r="2.5"/>
                    <circle className="wave-dot" cx="148" cy="110" r="2.5"/>
                    <circle className="wave-dot" cx="156" cy="108" r="2"/>
                    <circle className="wave-dot" cx="164" cy="104" r="2"/>
                    <circle className="wave-dot" cx="172" cy="98" r="2"/>
                    <circle className="wave-dot" cx="180" cy="90" r="2"/>
                  </g>
                  <g fill="#666666" opacity="0.5">
                    <circle cx="20" cy="140" r="1.5"/>
                    <circle cx="28" cy="140" r="1.5"/>
                    <circle cx="36" cy="140" r="1.5"/>
                    <circle cx="44" cy="140" r="1.5"/>
                    <circle cx="52" cy="140" r="1.5"/>
                    <circle cx="60" cy="140" r="1.5"/>
                    <circle cx="68" cy="140" r="1.5"/>
                    <circle cx="76" cy="140" r="1.5"/>
                    <circle cx="84" cy="140" r="1.5"/>
                    <circle cx="92" cy="140" r="1.5"/>
                    <circle cx="100" cy="140" r="1.5"/>
                    <circle cx="108" cy="140" r="1.5"/>
                    <circle cx="116" cy="140" r="1.5"/>
                    <circle cx="124" cy="140" r="1.5"/>
                    <circle cx="132" cy="140" r="1.5"/>
                    <circle cx="140" cy="140" r="1.5"/>
                    <circle cx="148" cy="140" r="1.5"/>
                    <circle cx="156" cy="140" r="1.5"/>
                    <circle cx="164" cy="140" r="1.5"/>
                    <circle cx="172" cy="140" r="1.5"/>
                    <circle cx="180" cy="140" r="1.5"/>
                  </g>
                </g>
              </svg>
            </div>
            <h3 className="principle-title">Orchestration layer</h3>
            <p className="principle-desc">Using the best AI agents in synchrony to get the job done</p>
          </div>
          <div className="principle">
            <span className="fig-label">FIG 0.3</span>
            <div className="principle-illustration">
              <svg viewBox="0 0 200 200" fill="none" stroke="#666666" strokeWidth="0.8">
                <style>{`
                  .converge-line { animation: convergeFlow 4s ease-in-out infinite; }
                  .converge-line:nth-child(1) { animation-delay: 0s; }
                  .converge-line:nth-child(2) { animation-delay: 0.15s; }
                  .converge-line:nth-child(3) { animation-delay: 0.3s; }
                  .converge-line:nth-child(4) { animation-delay: 0.45s; }
                  .converge-line:nth-child(5) { animation-delay: 0.6s; }
                  .converge-line:nth-child(6) { animation-delay: 0.75s; }
                  .converge-line:nth-child(7) { animation-delay: 0.9s; }
                  @keyframes convergeFlow { 0%, 100% { opacity: 0.4; stroke-width: 0.5; } 50% { opacity: 1; stroke-width: 1; } }
                  .center-dot { animation: centerPulse 3s ease-in-out infinite; }
                  @keyframes centerPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
                `}</style>
                <g>
                  <path className="converge-line" d="M30 45 Q65 65, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 65 Q62 78, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 85 Q60 90, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 100 Q60 100, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 115 Q60 110, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 135 Q62 122, 100 100" fill="none"/>
                  <path className="converge-line" d="M30 155 Q65 135, 100 100" fill="none"/>
                </g>
                <g>
                  <path className="converge-line" d="M170 45 Q135 65, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 65 Q138 78, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 85 Q140 90, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 100 Q140 100, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 115 Q140 110, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 135 Q138 122, 100 100" fill="none"/>
                  <path className="converge-line" d="M170 155 Q135 135, 100 100" fill="none"/>
                </g>
                <circle className="center-dot" cx="100" cy="100" r="1.5" fill="#999999"/>
              </svg>
            </div>
            <h3 className="principle-title">Designed for accuracy</h3>
            <p className="principle-desc">Zero back-and-forth, zero bugs, issues resolved before a PR exists.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Stop debugging AI output</h2>
          <p className="cta-subtitle">Join the engineers shipping faster with Glock. $300/month. Cancel anytime.</p>
          <form className="cta-form">
            <input type="email" placeholder="you@company.com" className="cta-input" required />
            <button type="submit" className="btn btn-primary btn-large">Get Early Access</button>
          </form>
          <p className="cta-note">Limited spots. Currently onboarding 3 users at a time.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img src="/logo.png" alt="Glock" className="footer-logo-icon" />
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
