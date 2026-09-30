import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Megaphone,
  Palette,
  BarChart3,
  Play,
  Check,
} from "lucide-react";

import "./App.css";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleStartCreating = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-sidebar">
          <div className="dashboard-brand">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <div className="brand-name">BrandForge</div>
              <div className="brand-subtitle">AI BRAND INTELLIGENCE</div>
            </div>
          </div>

          <nav className="dashboard-nav">
            <button className="nav-item active">
              <BarChart3 size={18} />
              Overview
            </button>

            <button className="nav-item">
              <Brain size={18} />
              Brand DNA
            </button>

            <button className="nav-item">
              <Megaphone size={18} />
              Campaigns
            </button>

            <button className="nav-item">
              <Palette size={18} />
              Content
            </button>
          </nav>

          <button
            className="back-button"
            onClick={() => setShowDashboard(false)}
          >
            ← Back to landing
          </button>
        </div>

        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <div>
              <div className="dashboard-label">BRANDFORGE INTELLIGENCE</div>
              <h1>Good afternoon, Creator.</h1>
              <p>Your brand intelligence overview.</p>
            </div>

            <div className="online-status">
              <span></span>
              AI Online
            </div>
          </div>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Megaphone size={20} />
              </div>

              <div className="stat-number">12</div>
              <div className="stat-label">Campaigns</div>
              <div className="stat-change">+24% this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Sparkles size={20} />
              </div>

              <div className="stat-number">84</div>
              <div className="stat-label">Assets Generated</div>
              <div className="stat-change">+18% this month</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Brain size={20} />
              </div>

              <div className="stat-number">94%</div>
              <div className="stat-label">Brand Fit</div>
              <div className="stat-change">Excellent</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BarChart3 size={20} />
              </div>

              <div className="stat-number">06</div>
              <div className="stat-label">Platforms</div>
              <div className="stat-change">Connected</div>
            </div>
          </section>

          <section className="campaign-engine">
            <div className="section-header">
              <div>
                <div className="section-kicker">
                  <Sparkles size={16} />
                  AI CAMPAIGN ENGINE
                </div>

                <h2>Create your next campaign</h2>

                <p>
                  Describe your idea and let BrandForge turn it into a
                  complete campaign.
                </p>
              </div>
            </div>

            <textarea
              className="campaign-input"
              placeholder="Example: Launch a new sustainable sneaker collection for Gen Z creators..."
            />

            <div className="campaign-controls">
              <select>
                <option>Product Launch</option>
                <option>Brand Awareness</option>
                <option>Social Campaign</option>
                <option>Seasonal Campaign</option>
              </select>

              <select>
                <option>Creators</option>
                <option>Gen Z</option>
                <option>Professionals</option>
                <option>Business Owners</option>
              </select>

              <select>
                <option>All Platforms</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>X</option>
              </select>

              <button className="generate-button">
                Generate Campaign
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          <section className="intelligence-section">
            <div className="section-header">
              <div>
                <div className="section-kicker">
                  <Brain size={16} />
                  BRAND INTELLIGENCE
                </div>

                <h2>Your brand at a glance</h2>
              </div>
            </div>

            <div className="intelligence-grid">
              <div className="intelligence-card">
                <div className="intelligence-top">
                  <span>Brand Voice</span>
                  <strong>94%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "94%" }}></div>
                </div>

                <p>
                  Clear, confident and modern. Your communication style is
                  highly consistent.
                </p>
              </div>

              <div className="intelligence-card">
                <div className="intelligence-top">
                  <span>Content Consistency</span>
                  <strong>High</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "88%" }}></div>
                </div>

                <p>
                  Your recent content strongly matches your defined brand
                  identity.
                </p>
              </div>

              <div className="intelligence-card">
                <div className="intelligence-top">
                  <span>Active Campaigns</span>
                  <strong>04</strong>
                </div>

                <div className="campaign-mini-list">
                  <div>
                    <span className="dot"></span>
                    Summer Launch
                  </div>

                  <div>
                    <span className="dot"></span>
                    Creator Series
                  </div>

                  <div>
                    <span className="dot"></span>
                    Brand Refresh
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <Sparkles size={24} />
          </div>

          <div className="brand-info">
            <div className="brand-title">BrandForge</div>
            <div className="brand-tagline">AI BRAND INTELLIGENCE</div>
          </div>
        </div>

        <button className="nav-cta" onClick={handleStartCreating}>
          Start Creating
          <ArrowRight size={20} />
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow"></div>

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              AI-POWERED BRAND INTELLIGENCE
              <Sparkles size={17} />
            </div>

            <h1>
              Build brands
              <br />
              <span>that think bigger.</span>
            </h1>

            <p className="hero-description">
              BrandForge is an AI-powered brand intelligence platform that
              understands your brand, generates campaigns, and keeps every
              piece of content consistent.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={handleStartCreating}>
                Start Creating
                <ArrowRight size={20} />
              </button>

              <button className="secondary-button">
                <Play size={18} />
                Explore the platform
              </button>
            </div>

            <div className="hero-note">
              <span className="check-circle">
                <Check size={13} />
              </span>

              Built for modern teams, creators, and ambitious brands.
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-intro">
            <div className="eyebrow small">THE BRANDFORGE ENGINE</div>

            <h2>
              One intelligence layer
              <br />
              for your entire brand.
            </h2>

            <p>
              From strategy to execution, BrandForge keeps your brand
              intelligent, consistent, and ready to grow.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={24} />
              </div>

              <h3>Brand Intelligence</h3>

              <p>
                Build a living understanding of your brand voice, audience,
                visual identity and positioning.
              </p>

              <span className="feature-number">01</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Megaphone size={24} />
              </div>

              <h3>Campaign Generation</h3>

              <p>
                Turn a simple idea into campaign concepts, messaging and
                platform-ready creative direction.
              </p>

              <span className="feature-number">02</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Palette size={24} />
              </div>

              <h3>Content Consistency</h3>

              <p>
                Keep every piece of content aligned with the identity your
                brand has worked hard to build.
              </p>

              <span className="feature-number">03</span>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-glow"></div>

          <div className="cta-content">
            <div className="eyebrow small">
              <Sparkles size={16} />
              START BUILDING
            </div>

            <h2>
              Your next great
              <br />
              <span>brand starts here.</span>
            </h2>

            <p>
              Bring your brand into one intelligent workspace and start
              creating with AI.
            </p>

            <button className="primary-button" onClick={handleStartCreating}>
              Enter BrandForge
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <div className="brand-logo small-logo">
            <Sparkles size={18} />
          </div>

          <span>BrandForge</span>
        </div>

        <span>AI BRAND INTELLIGENCE</span>

        <span>© 2026 BrandForge</span>
      </footer>
    </div>
  );
}

export default App;