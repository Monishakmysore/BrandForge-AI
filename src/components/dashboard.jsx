import { useState } from "react";
import {
  Home,
  Sparkles,
  Megaphone,
  LayoutGrid,
  Brain,
  Settings,
  ArrowLeft,
  ArrowRight,
  WandSparkles,
  Search,
  Bell,
  User,
  CheckCircle2,
  TrendingUp,
  Target,
  Palette,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

import "./dashboard.css";

function Dashboard({ onBack }) {
  const [activePage, setActivePage] = useState("Overview");

  const [campaignType, setCampaignType] = useState("Product Launch");
  const [audience, setAudience] = useState("Creators");
  const [platform, setPlatform] = useState("All Platforms");
  const [idea, setIdea] = useState("");

  const navigation = [
    {
      name: "Overview",
      icon: Home,
    },
    {
      name: "Brand DNA",
      icon: Sparkles,
    },
    {
      name: "Campaigns",
      icon: Megaphone,
    },
    {
      name: "Content",
      icon: LayoutGrid,
    },
    {
      name: "Intelligence",
      icon: Brain,
    },
  ];

  const handleGenerate = () => {
    setActivePage("Campaigns");
  };

  const renderOverview = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI BRAND INTELLIGENCE</p>
          <h1>Good afternoon, Creator.</h1>
          <p className="heading-description">
            Your brand intelligence overview
          </p>
        </div>

        <button className="primary-button" onClick={handleGenerate}>
          <WandSparkles size={18} />
          Create Campaign
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Megaphone size={20} />
          </div>

          <div>
            <span>Campaigns</span>
            <strong>12</strong>
          </div>

          <small>+18% this month</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <LayoutGrid size={20} />
          </div>

          <div>
            <span>Assets Generated</span>
            <strong>84</strong>
          </div>

          <small>+24% this month</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Brain size={20} />
          </div>

          <div>
            <span>Brand Fit</span>
            <strong>94%</strong>
          </div>

          <small>Excellent consistency</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={20} />
          </div>

          <div>
            <span>Platforms</span>
            <strong>06</strong>
          </div>

          <small>Connected channels</small>
        </div>
      </div>

      <section className="engine-card">
        <div className="section-title">
          <div className="section-title-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <h2>AI Campaign Engine</h2>
            <p>
              Turn a simple idea into a complete, brand-aligned campaign.
            </p>
          </div>
        </div>

        <textarea
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="Describe your campaign idea..."
        />

        <div className="campaign-options">
          <div className="field">
            <label>Campaign Type</label>

            <select
              value={campaignType}
              onChange={(event) => setCampaignType(event.target.value)}
            >
              <option>Product Launch</option>
              <option>Brand Awareness</option>
              <option>Seasonal Campaign</option>
              <option>Social Media Campaign</option>
              <option>Event Promotion</option>
            </select>
          </div>

          <div className="field">
            <label>Audience</label>

            <select
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            >
              <option>Creators</option>
              <option>Gen Z</option>
              <option>Marketing Teams</option>
              <option>Startups</option>
              <option>Enterprise</option>
            </select>
          </div>

          <div className="field">
            <label>Platforms</label>

            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              <option>All Platforms</option>
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>X</option>
              <option>Instagram + LinkedIn</option>
            </select>
          </div>
        </div>

        <button className="generate-button" onClick={handleGenerate}>
          <WandSparkles size={19} />
          Generate Campaign
          <ArrowRight size={18} />
        </button>
      </section>

      <section className="intelligence-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">INTELLIGENCE</p>
            <h2>Brand Intelligence</h2>
          </div>

          <button
            className="text-button"
            onClick={() => setActivePage("Intelligence")}
          >
            View insights
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="intelligence-grid">
          <div className="intelligence-card">
            <div className="card-top">
              <span>Brand Voice</span>

              <div className="mini-icon">
                <Sparkles size={17} />
              </div>
            </div>

            <strong>94%</strong>

            <div className="progress">
              <div style={{ width: "94%" }} />
            </div>

            <p>Strong and consistent</p>
          </div>

          <div className="intelligence-card">
            <div className="card-top">
              <span>Content Consistency</span>

              <div className="mini-icon">
                <CheckCircle2 size={17} />
              </div>
            </div>

            <strong>High</strong>

            <div className="progress">
              <div style={{ width: "88%" }} />
            </div>

            <p>Across all active channels</p>
          </div>

          <div className="intelligence-card">
            <div className="card-top">
              <span>Active Campaigns</span>

              <div className="mini-icon">
                <TrendingUp size={17} />
              </div>
            </div>

            <strong>04</strong>

            <div className="campaign-status">
              <span />
              Campaigns performing well
            </div>

            <p>Last updated today</p>
          </div>
        </div>
      </section>
    </>
  );

  const renderBrandDNA = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">BRAND SYSTEM</p>
          <h1>Brand DNA</h1>
          <p className="heading-description">
            Your brand's identity, voice and visual language.
          </p>
        </div>

        <button className="primary-button">
          <Sparkles size={18} />
          Analyze Brand
        </button>
      </div>

      <div className="dna-grid">
        <div className="large-panel">
          <div className="panel-icon">
            <Sparkles size={21} />
          </div>

          <h2>Brand Voice</h2>

          <p>
            Confident, innovative and approachable. Your communication style
            focuses on clarity while maintaining a modern creative edge.
          </p>

          <div className="tag-list">
            <span>Confident</span>
            <span>Modern</span>
            <span>Creative</span>
            <span>Clear</span>
          </div>
        </div>

        <div className="large-panel">
          <div className="panel-icon">
            <Target size={21} />
          </div>

          <h2>Target Audience</h2>

          <p>
            Creators, ambitious teams and modern businesses looking for
            intelligent ways to build memorable brands.
          </p>

          <div className="audience-score">
            <strong>92%</strong>
            <span>Audience match</span>
          </div>
        </div>

        <div className="large-panel">
          <div className="panel-icon">
            <Palette size={21} />
          </div>

          <h2>Visual Identity</h2>

          <p>
            Minimal, premium and technology-driven visuals with strong
            typography and focused compositions.
          </p>

          <div className="visual-palette">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="large-panel">
          <div className="panel-icon">
            <CheckCircle2 size={21} />
          </div>

          <h2>Brand Consistency</h2>

          <p>
            Your generated content maintains the core identity across
            campaigns and platforms.
          </p>

          <div className="consistency-score">
            <strong>94%</strong>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderCampaigns = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CAMPAIGN STUDIO</p>
          <h1>Campaigns</h1>
          <p className="heading-description">
            Create, manage and monitor your AI-powered campaigns.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setActivePage("Overview")}
        >
          <WandSparkles size={18} />
          New Campaign
        </button>
      </div>

      <div className="campaign-list">
        <div className="campaign-row">
          <div className="campaign-row-icon">
            <Megaphone size={21} />
          </div>

          <div className="campaign-row-content">
            <h3>Summer Product Launch</h3>
            <p>Instagram · LinkedIn · X</p>
          </div>

          <span className="status active">Active</span>

          <span className="campaign-date">Today</span>

          <ArrowRight size={18} />
        </div>

        <div className="campaign-row">
          <div className="campaign-row-icon">
            <Sparkles size={21} />
          </div>

          <div className="campaign-row-content">
            <h3>Creator Growth Campaign</h3>
            <p>Instagram · TikTok</p>
          </div>

          <span className="status draft">Draft</span>

          <span className="campaign-date">Yesterday</span>

          <ArrowRight size={18} />
        </div>

        <div className="campaign-row">
          <div className="campaign-row-icon">
            <TrendingUp size={21} />
          </div>

          <div className="campaign-row-content">
            <h3>Brand Awareness 2026</h3>
            <p>LinkedIn · X</p>
          </div>

          <span className="status completed">Completed</span>

          <span className="campaign-date">Sep 24</span>

          <ArrowRight size={18} />
        </div>
      </div>
    </>
  );

  const renderContent = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONTENT STUDIO</p>
          <h1>Content</h1>
          <p className="heading-description">
            Brand-aligned content generated for every channel.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setActivePage("Overview")}
        >
          <WandSparkles size={18} />
          Generate Content
        </button>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <div className="content-card-top">
            <Instagram size={21} />
            <span>Instagram</span>
          </div>

          <h3>
            Your brand deserves content that moves at the speed of culture.
          </h3>

          <p>
            Discover a smarter way to build campaigns that feel consistent,
            creative and unmistakably yours.
          </p>

          <div className="content-footer">
            <span>Generated today</span>
            <span>94% brand fit</span>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-top">
            <Linkedin size={21} />
            <span>LinkedIn</span>
          </div>

          <h3>
            Build a brand system that turns every idea into an opportunity.
          </h3>

          <p>
            AI-powered intelligence helps teams create faster without losing
            their unique identity.
          </p>

          <div className="content-footer">
            <span>Generated today</span>
            <span>92% brand fit</span>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-top">
            <Twitter size={21} />
            <span>X</span>
          </div>

          <h3>
            Better ideas start with better brand intelligence.
          </h3>

          <p>
            Create campaigns, content and strategies from one intelligent
            workspace.
          </p>

          <div className="content-footer">
            <span>Generated yesterday</span>
            <span>95% brand fit</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderIntelligence = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">AI ANALYTICS</p>
          <h1>Intelligence</h1>
          <p className="heading-description">
            Understand how your brand is performing.
          </p>
        </div>
      </div>

      <div className="intelligence-summary">
        <div>
          <span>Brand Growth</span>
          <strong>+28%</strong>
          <p>Compared with last month</p>
        </div>

        <div>
          <span>Audience Match</span>
          <strong>92%</strong>
          <p>Based on recent campaign activity</p>
        </div>

        <div>
          <span>Creative Score</span>
          <strong>94%</strong>
          <p>Across generated assets</p>
        </div>
      </div>

      <div className="large-panel insights-panel">
        <div className="panel-icon">
          <Brain size={21} />
        </div>

        <h2>AI Creative Insights</h2>

        <div className="insight-item">
          <CheckCircle2 size={18} />
          <span>Your visual identity is highly consistent.</span>
        </div>

        <div className="insight-item">
          <CheckCircle2 size={18} />
          <span>Short-form campaign messaging is performing strongly.</span>
        </div>

        <div className="insight-item">
          <CheckCircle2 size={18} />
          <span>Audience alignment has increased this month.</span>
        </div>

        <div className="insight-item">
          <CheckCircle2 size={18} />
          <span>Your strongest content uses concise messaging.</span>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>Settings</h1>
          <p className="heading-description">
            Manage your BrandForge workspace.
          </p>
        </div>
      </div>

      <div className="settings-panel">
        <div className="settings-row">
          <div>
            <h3>Workspace Name</h3>
            <p>BrandForge AI</p>
          </div>

          <button>Edit</button>
        </div>

        <div className="settings-row">
          <div>
            <h3>AI Creativity</h3>
            <p>Balanced</p>
          </div>

          <button>Edit</button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Connected Platforms</h3>
            <p>Instagram, LinkedIn, X</p>
          </div>

          <button>Manage</button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Brand Intelligence</h3>
            <p>Automatic analysis enabled</p>
          </div>

          <button>Manage</button>
        </div>
      </div>
    </>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Brand DNA":
        return renderBrandDNA();

      case "Campaigns":
        return renderCampaigns();

      case "Content":
        return renderContent();

      case "Intelligence":
        return renderIntelligence();

      case "Settings":
        return renderSettings();

      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>

          <div>
            <h2>BrandForge</h2>
            <span>AI BRAND INTELLIGENCE</span>
          </div>
        </div>

        <div className="workspace-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back to landing</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span>BrandForge</span>
            <ArrowRight size={14} />
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">
              <Search size={19} />
            </button>

            <button className="icon-button notification">
              <Bell size={19} />
              <span />
            </button>

            <div className="profile">
              <div className="profile-avatar">
                <User size={17} />
              </div>

              <div>
                <strong>Creator</strong>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;