import { useState } from "react";
import Dashboard from "./components/dashboard";
import "./App.css";

const API_URL = "http://127.0.0.1:5001";

function App() {
  const [page, setPage] = useState("landing");
  const [loggedIn, setLoggedIn] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  /* ================= AUTH FUNCTIONS ================= */

  const openRegister = () => {
    setAuthMessage("");
    setPage("register");
  };

  const openLogin = () => {
    setAuthMessage("");
    setPage("login");
  };

  const handleRegister = async (
    name,
    email,
    password,
    confirmPassword
  ) => {
    setAuthMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setAuthMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Password must contain at least 6 characters.");
      return;
    }

    try {
      setAuthLoading(true);

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(
          data.message || "Registration failed. Please try again."
        );
        return;
      }

      setRegisteredUser(data.user || null);

      setAuthMessage(
        "Registration successful! Please login with your account."
      );

      setTimeout(() => {
        setAuthMessage("");
        setPage("login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      setAuthMessage(
        "Cannot connect to the server. Make sure Flask is running on port 5001."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    setAuthMessage("");

    if (!email || !password) {
      setAuthMessage("Please enter your email and password.");
      return;
    }

    try {
      setAuthLoading(true);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthMessage(
          data.message || "Invalid email or password."
        );
        return;
      }

      setRegisteredUser(data.user || null);
      setLoggedIn(true);
      setPage("dashboard");
      setAuthMessage("");
    } catch (error) {
      console.error("Login error:", error);

      setAuthMessage(
        "Cannot connect to the server. Make sure Flask is running on port 5001."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRegisteredUser(null);
    setAuthMessage("");
    setPage("landing");
  };

  /* ================= DASHBOARD ================= */

  if (page === "dashboard" && loggedIn) {
    return <Dashboard onBack={handleLogout} />;
  }

  /* ================= REGISTER PAGE ================= */

  if (page === "register") {
    return (
      <div className="auth-page">
        <div className="auth-background"></div>

        <div className="auth-card">
          <button
            className="auth-back"
            onClick={() => {
              setAuthMessage("");
              setPage("landing");
            }}
          >
            ← Back
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>

            <div>
              <h2>BrandForge</h2>
              <span>AI BRAND INTELLIGENCE</span>
            </div>
          </div>

          <div className="auth-heading">
            <div className="auth-badge">
              <span></span>
              CREATE YOUR ACCOUNT
            </div>

            <h1>
              Build your brand
              <br />
              <span>with intelligence.</span>
            </h1>

            <p>
              Create your BrandForge account to start building,
              managing and growing your brand.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              handleRegister(
                formData.get("name"),
                formData.get("email"),
                formData.get("password"),
                formData.get("confirmPassword")
              );
            }}
          >
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
              />
            </div>

            {authMessage && (
              <div className="auth-message">
                {authMessage}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? "Creating Account..." : "Create Account"}
              {!authLoading && <span>→</span>}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <button onClick={openLogin}>
              Login
            </button>
          </div>

          <div className="auth-footer">
            <span>Secure account access</span>
            <span>•</span>
            <span>BrandForge AI</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LOGIN PAGE ================= */

  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-background"></div>

        <div className="auth-card">
          <button
            className="auth-back"
            onClick={() => {
              setAuthMessage("");
              setPage("landing");
            }}
          >
            ← Back
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>

            <div>
              <h2>BrandForge</h2>
              <span>AI BRAND INTELLIGENCE</span>
            </div>
          </div>

          <div className="auth-heading">
            <div className="auth-badge">
              <span></span>
              WELCOME BACK
            </div>

            <h1>
              Welcome back to
              <br />
              <span>BrandForge.</span>
            </h1>

            <p>
              Login to continue building and growing your
              brand with AI-powered intelligence.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              handleLogin(
                formData.get("email"),
                formData.get("password")
              );
            }}
          >
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {authMessage && (
              <div className="auth-message">
                {authMessage}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={authLoading}
            >
              {authLoading ? "Logging in..." : "Login to BrandForge"}
              {!authLoading && <span>→</span>}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <button onClick={openRegister}>
              Register
            </button>
          </div>

          <div className="auth-footer">
            <span>Secure account access</span>
            <span>•</span>
            <span>BrandForge AI</span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LANDING PAGE ================= */

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}
      <nav className="landing-nav">

        <div
          className="brand-logo"
          onClick={() => setPage("landing")}
        >
          <div className="brand-logo-icon">
            <span>✦</span>
          </div>

          <div className="brand-logo-text">
            <h2>BrandForge</h2>
            <span>AI BRAND INTELLIGENCE</span>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#intelligence">AI Intelligence</a>
          <a href="#workflow">How it works</a>
        </div>

        <div className="landing-nav-actions">
          <button
            className="nav-login"
            onClick={openLogin}
          >
            Login
          </button>

          <button
            className="nav-signup"
            onClick={openRegister}
          >
            Get Started
            <span>→</span>
          </button>
        </div>

      </nav>


      {/* ================= HERO ================= */}
      <main className="landing-main">

        <section className="hero-section">

          <div className="hero-orb hero-orb-one"></div>
          <div className="hero-orb hero-orb-two"></div>
          <div className="hero-grid"></div>

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-POWERED BRAND INTELLIGENCE
              <span className="badge-arrow">↗</span>
            </div>

            <h1>
              Your brand.
              <br />
              <span>Powered by intelligence.</span>
            </h1>

            <p className="hero-description">
              BrandForge brings your brand strategy, campaigns,
              content and insights into one intelligent workspace.
              Build faster. Stay consistent. Grow smarter.
            </p>

            <div className="hero-buttons">

              <button
                className="hero-primary"
                onClick={openRegister}
              >
                Start Creating
                <span>→</span>
              </button>

              <button
                className="hero-secondary"
                onClick={openLogin}
              >
                Explore Platform
                <span className="play-icon">▶</span>
              </button>

            </div>

            <div className="hero-trust">

              <div className="trust-avatars">
                <span>BR</span>
                <span>AI</span>
                <span>+</span>
              </div>

              <div>
                <strong>Built for ambitious brands</strong>
                <small>Strategy • Content • Growth</small>
              </div>

            </div>

          </div>


          {/* ================= RIGHT VISUAL ================= */}
          <div className="hero-visual">

            <div className="visual-shadow"></div>

            <div className="brand-intelligence-card">

              <div className="card-header">

                <div className="mini-brand">
                  <div className="mini-brand-icon">✦</div>

                  <div>
                    <strong>BrandForge</strong>
                    <small>INTELLIGENCE HUB</small>
                  </div>
                </div>

                <div className="status-pill">
                  <span></span>
                  LIVE
                </div>

              </div>

              <div className="card-heading">
                <span>BRAND OVERVIEW</span>

                <h2>
                  Your brand is
                  <br />
                  <strong>looking strong.</strong>
                </h2>
              </div>

              <div className="score-section">

                <div className="score-circle">
                  <div className="score-inner">
                    <strong>94</strong>
                    <span>%</span>
                  </div>
                </div>

                <div className="score-details">

                  <div className="score-title">
                    <strong>Brand Fit Score</strong>
                    <span>+12.8%</span>
                  </div>

                  <div className="progress-bar">
                    <span></span>
                  </div>

                  <small>
                    Excellent consistency across your brand system
                  </small>

                </div>

              </div>

              <div className="intelligence-modules">

                <div className="intelligence-module active-module">
                  <div className="module-icon">✦</div>
                  <div>
                    <strong>Brand DNA</strong>
                    <small>94% aligned</small>
                  </div>
                  <span>→</span>
                </div>

                <div className="intelligence-module">
                  <div className="module-icon campaign-icon">◈</div>
                  <div>
                    <strong>Campaigns</strong>
                    <small>12 active</small>
                  </div>
                  <span>→</span>
                </div>

                <div className="intelligence-module">
                  <div className="module-icon content-icon">▦</div>
                  <div>
                    <strong>Content</strong>
                    <small>38 generated</small>
                  </div>
                  <span>→</span>
                </div>

              </div>

            </div>

            <div className="floating-ai-card">

              <div className="floating-ai-icon">
                ✦
              </div>

              <div>
                <strong>AI Insight</strong>
                <span>Your brand voice is consistent.</span>
              </div>

              <div className="floating-check">
                ✓
              </div>

            </div>

            <div className="floating-growth-card">

              <div className="growth-top">
                <span>GROWTH</span>
                <span>↗</span>
              </div>

              <strong>+28.4%</strong>

              <div className="mini-chart">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>

          </div>

        </section>


        {/* ================= BRAND STRIP ================= */}
        <section className="brand-strip">

          <span>ONE WORKSPACE FOR YOUR ENTIRE BRAND</span>

          <div className="brand-strip-items">
            <div>STRATEGY</div>
            <div>CAMPAIGNS</div>
            <div>CONTENT</div>
            <div>INSIGHTS</div>
            <div>GROWTH</div>
          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section className="features-section" id="features">

          <div className="section-heading">

            <div className="section-label">
              <span></span>
              THE BRANDFORGE SYSTEM
            </div>

            <h2>
              Everything your brand
              <br />
              needs to <span>move forward.</span>
            </h2>

            <p>
              Replace scattered tools with one intelligent system
              designed to keep your brand moving in the right direction.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card feature-large">

              <div className="feature-number">01</div>

              <div className="feature-icon blue-icon">
                ✦
              </div>

              <h3>Brand DNA</h3>

              <p>
                Build a single source of truth for your brand voice,
                audience, positioning and visual identity.
              </p>

              <div className="feature-preview dna-preview">

                <div className="preview-label">
                  BRAND PERSONALITY
                </div>

                <div className="personality-tags">
                  <span>Bold</span>
                  <span>Modern</span>
                  <span>Confident</span>
                  <span>Human</span>
                </div>

                <div className="preview-line"></div>

              </div>

            </div>


            <div className="feature-card">

              <div className="feature-number">02</div>

              <div className="feature-icon purple-icon">
                ◈
              </div>

              <h3>AI Campaigns</h3>

              <p>
                Turn a simple idea into a structured campaign
                aligned with your brand.
              </p>

              <div className="campaign-preview">

                <div className="campaign-line"></div>
                <div className="campaign-line short"></div>

                <div className="campaign-box">
                  <span>Campaign ready</span>
                  <strong>87%</strong>
                </div>

              </div>

            </div>


            <div className="feature-card">

              <div className="feature-number">03</div>

              <div className="feature-icon cyan-icon">
                ▦
              </div>

              <h3>Smart Content</h3>

              <p>
                Generate content that sounds like your brand,
                not generic AI.
              </p>

              <div className="content-preview">

                <span className="content-avatar">B</span>

                <div>
                  <div className="content-line"></div>
                  <div className="content-line small"></div>
                  <div className="content-line smaller"></div>
                </div>

              </div>

            </div>


            <div className="feature-card feature-wide">

              <div className="wide-content">

                <div>
                  <div className="feature-number">04</div>

                  <div className="feature-icon dark-blue-icon">
                    ↗
                  </div>

                  <h3>Insights that move you forward</h3>

                  <p>
                    Understand what's working, discover opportunities
                    and make better brand decisions with AI-powered insights.
                  </p>
                </div>

                <div className="analytics-preview">

                  <div className="analytics-header">
                    <span>BRAND PERFORMANCE</span>
                    <strong>+24.8%</strong>
                  </div>

                  <div className="analytics-bars">
                    <span style={{ height: "35%" }}></span>
                    <span style={{ height: "52%" }}></span>
                    <span style={{ height: "45%" }}></span>
                    <span style={{ height: "70%" }}></span>
                    <span style={{ height: "61%" }}></span>
                    <span style={{ height: "85%" }}></span>
                    <span style={{ height: "96%" }}></span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= AI INTELLIGENCE ================= */}
        <section
          className="intelligence-section"
          id="intelligence"
        >

          <div className="intelligence-content">

            <div className="section-label">
              <span></span>
              INTELLIGENCE, BUILT IN
            </div>

            <h2>
              Your brand gets
              <br />
              <span>smarter over time.</span>
            </h2>

            <p>
              BrandForge connects your brand knowledge with AI so
              every campaign, piece of content and decision stays
              aligned with the bigger picture.
            </p>

            <div className="intelligence-points">

              <div>
                <span>✓</span>
                Brand-aware AI
              </div>

              <div>
                <span>✓</span>
                Consistent output
              </div>

              <div>
                <span>✓</span>
                Actionable insights
              </div>

            </div>

            <button
              className="intelligence-button"
              onClick={openRegister}
            >
              Explore Brand Intelligence
              <span>→</span>
            </button>

          </div>


          <div className="intelligence-visual">

            <div className="connection-line line-one"></div>
            <div className="connection-line line-two"></div>
            <div className="connection-line line-three"></div>

            <div className="central-ai">

              <div className="ai-ring ring-one"></div>
              <div className="ai-ring ring-two"></div>

              <div className="ai-core">
                ✦
              </div>

              <span>BRANDFORGE AI</span>

            </div>


            <div className="orbit-card orbit-top">
              <span>01</span>
              <strong>Brand DNA</strong>
            </div>

            <div className="orbit-card orbit-right">
              <span>02</span>
              <strong>Campaigns</strong>
            </div>

            <div className="orbit-card orbit-bottom">
              <span>03</span>
              <strong>Content</strong>
            </div>

            <div className="orbit-card orbit-left">
              <span>04</span>
              <strong>Insights</strong>
            </div>

          </div>

        </section>


        {/* ================= WORKFLOW ================= */}
        <section className="workflow-section" id="workflow">

          <div className="section-heading centered">

            <div className="section-label">
              <span></span>
              SIMPLE BY DESIGN
            </div>

            <h2>
              From idea to
              <br />
              <span>brand-ready output.</span>
            </h2>

          </div>


          <div className="workflow-grid">

            <div className="workflow-step">
              <div className="step-number">01</div>
              <h3>Define</h3>
              <p>
                Tell BrandForge about your brand and what you're trying
                to achieve.
              </p>
            </div>

            <div className="workflow-connector">→</div>

            <div className="workflow-step">
              <div className="step-number">02</div>
              <h3>Create</h3>
              <p>
                Let AI transform your ideas into campaigns and content.
              </p>
            </div>

            <div className="workflow-connector">→</div>

            <div className="workflow-step">
              <div className="step-number">03</div>
              <h3>Grow</h3>
              <p>
                Use intelligent insights to improve and grow your brand.
              </p>
            </div>

          </div>

        </section>


        {/* ================= FINAL CTA ================= */}
        <section className="final-cta">

          <div className="cta-decoration cta-decoration-one"></div>
          <div className="cta-decoration cta-decoration-two"></div>

          <div className="cta-content">

            <div className="cta-icon">✦</div>

            <h2>
              Ready to forge
              <br />
              something <span>remarkable?</span>
            </h2>

            <p>
              Start building a smarter, more consistent brand today.
            </p>

            <button
              className="cta-button"
              onClick={openRegister}
            >
              Enter BrandForge
              <span>→</span>
            </button>

          </div>

        </section>


        {/* ================= FOOTER ================= */}
        <footer className="landing-footer">

          <div className="footer-brand">

            <div className="brand-logo">

              <div className="brand-logo-icon">
                ✦
              </div>

              <div className="brand-logo-text">
                <h2>BrandForge</h2>
                <span>AI BRAND INTELLIGENCE</span>
              </div>

            </div>

            <p>
              Intelligent tools for ambitious brands.
            </p>

          </div>

          <div className="footer-right">
            <span>© 2026 BrandForge</span>
            <span>Built with intelligence.</span>
          </div>

        </footer>

      </main>

    </div>
  );
}

export default App;
