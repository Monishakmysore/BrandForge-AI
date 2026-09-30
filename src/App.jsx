import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Play,
  Check,
} from "lucide-react";

import Dashboard from "./components/dashboard";
import "./App.css";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleStartCreating = () => {
    setShowDashboard(true);
  };

  // Show dashboard
  if (showDashboard) {
    return (
      <Dashboard
        onBack={() => setShowDashboard(false)}
      />
    );
  }

  // Landing page
  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-brand-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <div className="landing-brand-name">
              BrandForge
            </div>

            <div className="landing-brand-subtitle">
              AI BRAND INTELLIGENCE
            </div>
          </div>
        </div>

        <button
          className="landing-start-button"
          onClick={handleStartCreating}
        >
          Start Creating
          <ArrowRight size={22} />
        </button>
      </header>

      {/* HERO */}
      <main className="hero-section">

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-POWERED BRAND INTELLIGENCE
          <Sparkles size={18} />
        </div>

        <h1 className="hero-title">
          Build brands
          <br />
          <span>that think bigger.</span>
        </h1>

        <p className="hero-description">
          BrandForge is an AI-powered brand intelligence platform
          that understands your brand, generates campaigns,
          and keeps every piece of content consistent.
        </p>

        <div className="hero-actions">

          <button
            className="hero-primary-button"
            onClick={handleStartCreating}
          >
            Start Creating
            <ArrowRight size={22} />
          </button>

          <button className="hero-secondary-button">
            <Play size={20} />
            Explore the platform
          </button>

        </div>

        <div className="hero-footer">
          <div className="hero-check">
            <Check size={14} />
          </div>

          <span>
            Built for modern teams, creators, and ambitious brands.
          </span>
        </div>

      </main>
    </div>
  );
}

export default App;