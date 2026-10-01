import { useEffect, useState } from "react";

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
  Plus,
  X,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Lightbulb,
  Users,
  Zap,
} from "lucide-react";

import "./dashboard.css";

const API_URL = "http://127.0.0.1:5001";

function Dashboard({ onBack }) {
  const [activePage, setActivePage] = useState("Overview");

  // ==================================================
  // DATABASE DATA
  // ==================================================

  const [brand, setBrand] = useState(null);
  const [brands, setBrands] = useState([]);

  const [campaigns, setCampaigns] = useState([]);
  const [contents, setContents] = useState([]);

  const [loadingBrand, setLoadingBrand] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);

  const [brandError, setBrandError] = useState("");
  const [campaignError, setCampaignError] = useState("");
  const [contentError, setContentError] = useState("");
  const [saveError, setSaveError] = useState("");

  // ==================================================
  // GENERATION STATE
  // ==================================================

  const [generatingContent, setGeneratingContent] = useState(false);
  const [regeneratingCampaignId, setRegeneratingCampaignId] =
    useState(null);

  // ==================================================
  // CAMPAIGN FORM
  // ==================================================

  const [campaignType, setCampaignType] =
    useState("Product Launch");

  const [audience, setAudience] = useState("Creators");
  const [platform, setPlatform] = useState("All Platforms");
  const [idea, setIdea] = useState("");

  // ==================================================
  // BRAND FORM
  // ==================================================

  const [showBrandForm, setShowBrandForm] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandFormMode, setBrandFormMode] = useState("create");

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
    target_audience: "",
    tone: "",
    personality: "",
    preferred_words: "",
    words_to_avoid: "",
    primary_color: "#1677FF",
    secondary_color: "#B9DCFF",
    logo_url: "",
  });

  // ==================================================
  // CONTENT FORM
  // ==================================================

  const [showContentForm, setShowContentForm] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const [contentForm, setContentForm] = useState({
    campaign_id: "",
    platform: "Instagram",
    content_type: "Social Post",
    content: "",
  });

  // ==================================================
  // GREETING
  // ==================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";

    return "Good night";
  };

  // ==================================================
  // NAVIGATION
  // ==================================================

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

  // ==================================================
  // LOAD BRAND
  // ==================================================

  const loadBrand = async () => {
    try {
      setLoadingBrand(true);
      setBrandError("");

      const response = await fetch(`${API_URL}/api/brands`);
      const data = await response.json();

      console.log("GET /api/brands:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load brands."
        );
      }

      const loadedBrands = Array.isArray(data.brands)
        ? data.brands
        : [];

      setBrands(loadedBrands);

      if (loadedBrands.length > 0) {
        setBrand((currentBrand) => {
          if (!currentBrand) return loadedBrands[0];

          const matchingBrand = loadedBrands.find(
            (item) => item.id === currentBrand.id
          );

          return matchingBrand || loadedBrands[0];
        });
      } else {
        setBrand(null);
      }
    } catch (err) {
      console.error("Brand API error:", err);

      setBrandError(
        err.message || "Unable to load brand information."
      );

      setBrands([]);
      setBrand(null);
    } finally {
      setLoadingBrand(false);
    }
  };

  // ==================================================
  // LOAD CAMPAIGNS
  // ==================================================

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      setCampaignError("");

      const response = await fetch(
        `${API_URL}/api/campaigns`
      );

      const data = await response.json();

      console.log("GET /api/campaigns:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load campaigns."
        );
      }

      setCampaigns(
        Array.isArray(data.campaigns)
          ? data.campaigns
          : []
      );
    } catch (err) {
      console.error("Campaign API error:", err);

      setCampaignError(
        err.message || "Unable to load campaigns."
      );
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // ==================================================
  // LOAD CONTENT
  // ==================================================

  const loadContent = async () => {
    try {
      setLoadingContent(true);
      setContentError("");

      const response = await fetch(
        `${API_URL}/api/content`
      );

      const data = await response.json();

      console.log("GET /api/content:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load content."
        );
      }

      setContents(
        Array.isArray(data.content)
          ? data.content
          : []
      );
    } catch (err) {
      console.error("Content API error:", err);

      setContentError(
        err.message || "Unable to load content."
      );

      setContents([]);
    } finally {
      setLoadingContent(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadBrand();
    loadCampaigns();
    loadContent();
  }, []);

  // ==================================================
  // REFRESH
  // ==================================================

  const refreshData = () => {
    loadBrand();
    loadCampaigns();
    loadContent();
  };

  // ==================================================
  // BRAND FORM
  // ==================================================

  const resetBrandForm = () => {
    setBrandForm({
      name: "",
      description: "",
      target_audience: "",
      tone: "",
      personality: "",
      preferred_words: "",
      words_to_avoid: "",
      primary_color: "#1677FF",
      secondary_color: "#B9DCFF",
      logo_url: "",
    });
  };

  const openCreateBrandForm = () => {
    setSaveError("");
    resetBrandForm();
    setBrandFormMode("create");
    setShowBrandForm(true);
  };

  const openEditBrandForm = (selectedBrand = brand) => {
    setSaveError("");

    if (!selectedBrand) {
      openCreateBrandForm();
      return;
    }

    setBrandForm({
      name: selectedBrand.name || "",
      description: selectedBrand.description || "",
      target_audience:
        selectedBrand.target_audience || "",
      tone: selectedBrand.tone || "",
      personality: selectedBrand.personality || "",
      preferred_words:
        selectedBrand.preferred_words || "",
      words_to_avoid:
        selectedBrand.words_to_avoid || "",
      primary_color:
        selectedBrand.primary_color || "#1677FF",
      secondary_color:
        selectedBrand.secondary_color || "#B9DCFF",
      logo_url: selectedBrand.logo_url || "",
    });

    setBrand(selectedBrand);
    setBrandFormMode("edit");
    setShowBrandForm(true);
  };

  const handleBrandChange = (event) => {
    const { name, value } = event.target;

    setBrandForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // CREATE / UPDATE BRAND
  // ==================================================

  const handleCreateBrand = async (event) => {
    event.preventDefault();

    setSaveError("");

    const cleanName = brandForm.name.trim();

    if (!cleanName) {
      setSaveError("Brand name is required.");
      return;
    }

    try {
      setSavingBrand(true);

      const payload = {
        name: cleanName,
        description: brandForm.description.trim(),
        target_audience:
          brandForm.target_audience.trim(),
        tone: brandForm.tone.trim(),
        personality: brandForm.personality.trim(),
        preferred_words:
          brandForm.preferred_words.trim(),
        words_to_avoid:
          brandForm.words_to_avoid.trim(),
        primary_color: brandForm.primary_color,
        secondary_color: brandForm.secondary_color,
        logo_url: brandForm.logo_url.trim(),
      };

      let response;

      if (
        brandFormMode === "edit" &&
        brand &&
        brand.id
      ) {
        response = await fetch(
          `${API_URL}/api/brands/${brand.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/api/brands`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save brand."
        );
      }

      await loadBrand();

      setShowBrandForm(false);
      resetBrandForm();
      setSaveError("");
      setBrandError("");
      setActivePage("Brand DNA");
    } catch (err) {
      console.error("SAVE BRAND ERROR:", err);

      setSaveError(
        err.message || "Unable to save brand."
      );
    } finally {
      setSavingBrand(false);
    }
  };

  const selectBrand = (selectedBrand) => {
    setBrand(selectedBrand);
  };

  // ==================================================
  // GENERATE CAMPAIGN
  // ==================================================

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setCampaignError(
        "Please enter a campaign idea first."
      );
      return;
    }

    if (!brand) {
      setCampaignError(
        "Please create a brand first."
      );
      return;
    }

    try {
      setCampaignError("");
      setGeneratingContent(true);

      const campaignResponse = await fetch(
        `${API_URL}/api/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand_id: brand.id,
            name: `${campaignType} Campaign`,
            idea: idea.trim(),
            objective:
              `Create a ${campaignType.toLowerCase()} campaign`,
            target_audience: audience,
            key_message: idea.trim(),
            platforms: platform,
            status: "draft",
          }),
        }
      );

      const campaignData =
        await campaignResponse.json();

      if (!campaignResponse.ok) {
        throw new Error(
          campaignData.message ||
            "Campaign creation failed."
        );
      }

      const campaignId =
        campaignData.campaign?.id;

      if (!campaignId) {
        throw new Error(
          "Campaign was created, but campaign ID was not returned."
        );
      }

      const contentResponse = await fetch(
        `${API_URL}/api/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignId,
          }),
        }
      );

      const contentData =
        await contentResponse.json();

      if (!contentResponse.ok) {
        throw new Error(
          contentData.message ||
            "AI content generation failed."
        );
      }

      setIdea("");

      await loadCampaigns();
      await loadContent();

      setActivePage("Content");
    } catch (err) {
      console.error(
        "Campaign generation error:",
        err
      );

      setCampaignError(
        err.message ||
          "Unable to generate campaign content."
      );
    } finally {
      setGeneratingContent(false);
    }
  };

  // ==================================================
  // CONTENT FORM
  // ==================================================

  const openCreateContentForm = () => {
    setContentError("");

    setContentForm({
      campaign_id:
        campaigns.length > 0
          ? String(campaigns[0].id)
          : "",
      platform: "Instagram",
      content_type: "Social Post",
      content: "",
    });

    setShowContentForm(true);
  };

  const handleContentChange = (event) => {
    const { name, value } = event.target;

    setContentForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateContent = async (event) => {
    event.preventDefault();

    setContentError("");

    if (!contentForm.campaign_id) {
      setContentError(
        "Please select a campaign."
      );
      return;
    }

    if (!contentForm.content.trim()) {
      setContentError(
        "Please enter some content."
      );
      return;
    }

    try {
      setSavingContent(true);

      const response = await fetch(
        `${API_URL}/api/content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: Number(
              contentForm.campaign_id
            ),
            platform: contentForm.platform,
            content_type:
              contentForm.content_type,
            content:
              contentForm.content.trim(),
            status: "draft",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create content."
        );
      }

      setShowContentForm(false);

      setContentForm({
        campaign_id: "",
        platform: "Instagram",
        content_type: "Social Post",
        content: "",
      });

      await loadContent();
    } catch (err) {
      console.error(
        "CREATE CONTENT ERROR:",
        err
      );

      setContentError(
        err.message ||
          "Unable to create content."
      );
    } finally {
      setSavingContent(false);
    }
  };

  // ==================================================
  // REGENERATE
  // ==================================================

  const regenerateContent = async (
    campaignId
  ) => {
    if (!campaignId) return;

    try {
      setContentError("");
      setRegeneratingCampaignId(campaignId);

      const response = await fetch(
        `${API_URL}/api/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: campaignId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to regenerate content."
        );
      }

      await loadContent();
    } catch (err) {
      console.error(
        "REGENERATE CONTENT ERROR:",
        err
      );

      setContentError(
        err.message ||
          "Unable to regenerate content."
      );
    } finally {
      setRegeneratingCampaignId(null);
    }
  };

  // ==================================================
  // OVERVIEW
  // ==================================================

  const renderOverview = () => (
    <>
      <div className="hero-heading">
        <div>
          <p className="eyebrow blue-eyebrow">
            {getGreeting().toUpperCase()},
          </p>

          <h1>
            Create. Innovate. Grow.
          </h1>

          <p className="hero-description">
            Your AI-powered creative studio for
            brand-aligned campaigns and content.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setActivePage("Campaigns")
          }
        >
          <WandSparkles size={18} />
          Create Campaign
          <ArrowRight size={17} />
        </button>
      </div>

      {brandError && (
        <div className="error-message">
          Brand: {brandError}
        </div>
      )}

      {campaignError && (
        <div className="error-message">
          Campaigns: {campaignError}
        </div>
      )}

      {contentError && (
        <div className="error-message">
          Content: {contentError}
        </div>
      )}

      {/* ================================================
          STATS
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            <Megaphone size={20} />
          </div>

          <div className="stat-content">
            <span>Campaigns</span>

            <strong>
              {loadingCampaigns
                ? "..."
                : campaigns.length}
            </strong>

            <small>
              <TrendingUp size={13} />
              25% vs last month
            </small>
          </div>

          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <LayoutGrid size={20} />
          </div>

          <div className="stat-content">
            <span>Assets Generated</span>

            <strong>
              {loadingContent
                ? "..."
                : contents.length}
            </strong>

            <small>
              <TrendingUp size={13} />
              42% vs last month
            </small>
          </div>

          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Brain size={20} />
          </div>

          <div className="stat-content">
            <span>Brand Fit</span>
            <strong>94%</strong>

            <small>
              <TrendingUp size={13} />
              6% vs last month
            </small>
          </div>

          <div className="stat-ring">
            <div>
              94
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Target size={20} />
          </div>

          <div className="stat-content">
            <span>Platforms</span>
            <strong>06</strong>

            <small>
              <TrendingUp size={13} />
              20% connected channels
            </small>
          </div>

          <div className="platform-dots">
            <span />
            <span />
            <span />
          </div>
        </div>

      </div>

      {/* ================================================
          MAIN GRID
      ================================================= */}

      <div className="dashboard-grid">

        {/* AI ENGINE */}

        <section className="ai-engine-card">

          <div className="ai-engine-content">

            <div className="ai-label">
              <Sparkles size={15} />
              AI CAMPAIGN ENGINE
            </div>

            <h2>
              Turn your ideas into
              <br />
              powerful brand campaigns
            </h2>

            <p>
              Describe your campaign idea,
              choose your audience, select
              platforms and let AI generate
              the perfect content for your brand.
            </p>

            <div className="idea-input-wrapper">

              <Sparkles size={17} />

              <textarea
                value={idea}
                onChange={(event) =>
                  setIdea(event.target.value)
                }
                placeholder="What's your campaign idea?"
              />

            </div>

            <div className="campaign-options">

              <div className="field">
                <label>
                  Campaign Type
                </label>

                <select
                  value={campaignType}
                  onChange={(event) =>
                    setCampaignType(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Product Launch
                  </option>
                  <option>
                    Brand Awareness
                  </option>
                  <option>
                    Seasonal Campaign
                  </option>
                  <option>
                    Social Media Campaign
                  </option>
                  <option>
                    Event Promotion
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Audience
                </label>

                <select
                  value={audience}
                  onChange={(event) =>
                    setAudience(
                      event.target.value
                    )
                  }
                >
                  <option>Creators</option>
                  <option>Gen Z</option>
                  <option>
                    Marketing Teams
                  </option>
                  <option>Startups</option>
                  <option>Enterprise</option>
                </select>
              </div>

              <div className="field">
                <label>
                  Platforms
                </label>

                <select
                  value={platform}
                  onChange={(event) =>
                    setPlatform(
                      event.target.value
                    )
                  }
                >
                  <option>
                    All Platforms
                  </option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>X</option>
                  <option>
                    Instagram + LinkedIn
                  </option>
                </select>
              </div>

            </div>

            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={generatingContent}
            >
              {generatingContent ? (
                <>
                  <Sparkles size={18} />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Campaign
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </div>

          <div className="ai-visual">

            <div className="floating-icon icon-instagram">
              ◎
            </div>

            <div className="floating-icon icon-linkedin">
              in
            </div>

            <div className="floating-icon icon-x">
              𝕏
            </div>

            <div className="ai-paper">

              <div className="paper-top">
                <Sparkles size={17} />
                <span>AI</span>
              </div>

              <div className="paper-line large" />
              <div className="paper-line" />
              <div className="paper-line short" />

              <div className="paper-button">
                Creating your
                <br />
                campaign...
              </div>

            </div>

          </div>

        </section>

        {/* RECENT CAMPAIGNS */}

        <section className="white-panel recent-panel">

          <div className="panel-heading">

            <div>
              <h3>Recent Campaigns</h3>
            </div>

            <button
              className="view-link"
              onClick={() =>
                setActivePage("Campaigns")
              }
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          {loadingCampaigns ? (
            <div className="empty-small">
              Loading campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-small">
              No campaigns yet.
            </div>
          ) : (
            <div className="recent-list">

              {campaigns
                .slice(0, 5)
                .map((campaign, index) => (

                  <div
                    className="recent-campaign"
                    key={campaign.id}
                  >

                    <div
                      className={`campaign-avatar avatar-${index % 4}`}
                    >
                      {index === 0 ? (
                        <Sparkles size={18} />
                      ) : index === 1 ? (
                        <Palette size={18} />
                      ) : index === 2 ? (
                        <Megaphone size={18} />
                      ) : (
                        <Target size={18} />
                      )}
                    </div>

                    <div className="recent-info">

                      <strong>
                        {campaign.name}
                      </strong>

                      <span>
                        {campaign.platforms ||
                          "All Platforms"}
                      </span>

                    </div>

                    <span
                      className={`status-pill ${
                        campaign.status ===
                        "active"
                          ? "green"
                          : campaign.status ===
                            "completed"
                          ? "purple"
                          : "blue"
                      }`}
                    >
                      {campaign.status ||
                        "draft"}
                    </span>

                    <ChevronRight
                      size={16}
                      className="recent-arrow"
                    />

                  </div>

                ))}

            </div>
          )}

        </section>

        {/* BRAND */}

        <section className="white-panel brand-summary">

          <div className="panel-heading">

            <h3>Your Brand</h3>

            <button
              className="view-link"
              onClick={() =>
                setActivePage("Brand DNA")
              }
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          {loadingBrand ? (
            <div className="empty-small">
              Loading brand...
            </div>
          ) : !brand ? (
            <div className="brand-empty">

              <Sparkles size={26} />

              <p>
                Create your first brand.
              </p>

              <button
                className="small-blue-button"
                onClick={openCreateBrandForm}
              >
                <Plus size={15} />
                Create Brand
              </button>

            </div>
          ) : (
            <>
              <div className="brand-profile">

                <div className="brand-avatar">
                  {brand.name
                    ?.charAt(0)
                    ?.toUpperCase() || "B"}
                </div>

                <div>
                  <h3>{brand.name}</h3>

                  <p>
                    {brand.description ||
                      "Your brand identity"}
                  </p>
                </div>

              </div>

              <div className="color-dots">

                <span
                  style={{
                    background:
                      brand.primary_color ||
                      "#1677FF",
                  }}
                />

                <span
                  style={{
                    background:
                      brand.secondary_color ||
                      "#B9DCFF",
                  }}
                />

                <span className="dot-white" />
                <span className="dot-dark" />
                <span className="dot-green" />

              </div>

              <div className="brand-fit">

                <div className="brand-fit-top">

                  <span>
                    Brand Fit
                  </span>

                  <strong>
                    94%
                  </strong>

                </div>

                <div className="fit-progress">
                  <div />
                </div>

              </div>

              <button
                className="edit-brand-button"
                onClick={() =>
                  openEditBrandForm(brand)
                }
              >
                <Sparkles size={15} />
                Edit Brand
              </button>
            </>
          )}

        </section>

      </div>

      {/* ================================================
          IDEAS CARD
      ================================================= */}

      <div className="suggestion-card">

        <div className="suggestion-icon">
          <Sparkles size={21} />
        </div>

        <div>
          <strong>
            Need fresh ideas?
          </strong>

          <p>
            Explore AI suggestions tailored
            to your brand and audience.
          </p>
        </div>

        <button
          onClick={() =>
            setActivePage("Intelligence")
          }
        >
          Get Suggestions
          <ArrowRight size={15} />
        </button>

      </div>

      {/* ================================================
          BRAND INTELLIGENCE
      ================================================= */}

      <section className="intelligence-panel">

        <div className="panel-heading">

          <div>
            <h2>
              Brand Intelligence
            </h2>

            <p>
              Real insights. Better decisions.
            </p>
          </div>

          <button
            className="view-link"
            onClick={() =>
              setActivePage("Intelligence")
            }
          >
            View insights
            <ArrowRight size={15} />
          </button>

        </div>

        <div className="intelligence-grid">

          <div className="intelligence-card">

            <div className="intelligence-icon">
              <Sparkles size={18} />
            </div>

            <div className="intelligence-card-body">

              <span>
                Brand Voice
              </span>

              <strong>
                92%
              </strong>

              <div className="progress">
                <div style={{ width: "92%" }} />
              </div>

              <small>
                Consistent across all channels
              </small>

            </div>

          </div>

          <div className="intelligence-card">

            <div className="intelligence-icon">
              <CheckCircle2 size={18} />
            </div>

            <div className="intelligence-card-body">

              <span>
                Content Consistency
              </span>

              <strong>
                88%
              </strong>

              <div className="progress">
                <div style={{ width: "88%" }} />
              </div>

              <small>
                Strong brand alignment
              </small>

            </div>

          </div>

          <div className="intelligence-card">

            <div className="intelligence-icon">
              <TrendingUp size={18} />
            </div>

            <div className="intelligence-card-body">

              <span>
                Audience Growth
              </span>

              <strong>
                +32%
              </strong>

              <div className="progress">
                <div style={{ width: "82%" }} />
              </div>

              <small>
                Compared to last month
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="quick-actions">

        <div className="panel-heading">

          <h3>Quick Actions</h3>

        </div>

        <div className="quick-action-grid">

          <button
            onClick={openCreateBrandForm}
          >
            <div>
              <Plus size={19} />
            </div>
            Create Brand
          </button>

          <button
            onClick={() =>
              setActivePage("Campaigns")
            }
          >
            <div>
              <Megaphone size={19} />
            </div>
            New Campaign
          </button>

          <button
            onClick={openCreateContentForm}
          >
            <div>
              <LayoutGrid size={19} />
            </div>
            Create Content
          </button>

          <button
            onClick={refreshData}
          >
            <div>
              <RefreshCw size={19} />
            </div>
            Refresh Data
          </button>

        </div>

      </section>
    </>
  );

  // ==================================================
  // BRAND DNA
  // ==================================================

  const renderBrandDNA = () => (
    <>
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            BRAND SYSTEM
          </p>

          <h1>Brand DNA</h1>

          <p className="heading-description">
            Your brand's identity, voice and
            visual language.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            brand
              ? openEditBrandForm(brand)
              : openCreateBrandForm()
          }
        >
          {brand ? (
            <>
              <Sparkles size={18} />
              Edit Brand
            </>
          ) : (
            <>
              <Plus size={18} />
              Create Brand
            </>
          )}
        </button>

      </div>

      {brandError && (
        <div className="error-message">
          {brandError}
        </div>
      )}

      {saveError && (
        <div className="error-message">
          {saveError}
        </div>
      )}

      {!loadingBrand &&
        brands.length > 0 && (
          <div className="brand-selector-panel">

            <div>
              <p className="eyebrow">
                YOUR BRANDS
              </p>

              <h3>Select a brand</h3>
            </div>

            <div className="brand-selector-list">

              {brands.map((item) => (
                <button
                  key={item.id}
                  className={`brand-selector-item ${
                    brand?.id === item.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    selectBrand(item)
                  }
                >
                  <div className="brand-selector-icon">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.target_audience ||
                        "Brand profile"}
                    </span>
                  </div>
                </button>
              ))}

            </div>
          </div>
        )}

      {loadingBrand ? (
        <div className="large-panel">
          <h2>
            Loading brand information...
          </h2>

          <p>
            Connecting to BrandForge backend.
          </p>
        </div>
      ) : !brand ? (
        <div className="large-panel empty-state">
          <div className="panel-icon">
            <Sparkles size={21} />
          </div>

          <h2>No brand found</h2>

          <p>
            Create your first brand to start
            using BrandForge.
          </p>

          <button
            className="primary-button"
            onClick={openCreateBrandForm}
          >
            <Plus size={18} />
            Create Your Brand
          </button>
        </div>
      ) : (
        <>
          <div className="large-panel brand-header-panel">

            <div className="brand-large-avatar">
              {brand.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <p className="eyebrow">
                ACTIVE BRAND
              </p>

              <h2>{brand.name}</h2>

              <p>
                {brand.description ||
                  "No brand description available."}
              </p>
            </div>

          </div>

          <div className="dna-grid">

            <div className="large-panel">
              <div className="panel-icon">
                <Sparkles size={21} />
              </div>

              <h2>Brand Voice</h2>

              <p>
                {brand.tone ||
                  "No tone information available."}
              </p>

              <div className="tag-list">
                {brand.tone && (
                  <span>{brand.tone}</span>
                )}

                {brand.personality && (
                  <span>
                    {brand.personality}
                  </span>
                )}
              </div>
            </div>

            <div className="large-panel">
              <div className="panel-icon">
                <Target size={21} />
              </div>

              <h2>Target Audience</h2>

              <p>
                {brand.target_audience ||
                  "No target audience information available."}
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
                Your brand colors and visual preferences.
              </p>

              <div className="visual-palette">
                <span
                  style={{
                    backgroundColor:
                      brand.primary_color ||
                      "#1677FF",
                  }}
                />

                <span
                  style={{
                    backgroundColor:
                      brand.secondary_color ||
                      "#B9DCFF",
                  }}
                />

                <span
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                />

                <span
                  style={{
                    backgroundColor: "#0f172a",
                  }}
                />
              </div>
            </div>

            <div className="large-panel">
              <div className="panel-icon">
                <CheckCircle2 size={21} />
              </div>

              <h2>Brand Consistency</h2>

              <p>
                Brand information is connected
                directly to the BrandForge database.
              </p>

              <div className="consistency-score">
                <strong>94%</strong>
                <span>Excellent</span>
              </div>
            </div>

            <div className="large-panel">
              <div className="panel-icon">
                <Sparkles size={21} />
              </div>

              <h2>Preferred Words</h2>

              <p>
                {brand.preferred_words ||
                  "No preferred words configured."}
              </p>
            </div>

            <div className="large-panel">
              <div className="panel-icon">
                <Brain size={21} />
              </div>

              <h2>Words to Avoid</h2>

              <p>
                {brand.words_to_avoid ||
                  "No restricted words configured."}
              </p>
            </div>

          </div>
        </>
      )}

      {/* BRAND MODAL */}

      {showBrandForm && (
        <div className="brand-modal-overlay">

          <div className="brand-modal">

            <div className="brand-modal-header">

              <div>
                <p className="eyebrow">
                  BRAND SETUP
                </p>

                <h2>
                  {brandFormMode === "edit"
                    ? "Edit Your Brand"
                    : "Create Your Brand"}
                </h2>

                <p>
                  {brandFormMode === "edit"
                    ? "Update your brand identity."
                    : "Add a new brand identity to BrandForge."}
                </p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={() => {
                  setShowBrandForm(false);
                  setSaveError("");
                }}
              >
                <X size={20} />
              </button>

            </div>

            {saveError && (
              <div className="error-message">
                {saveError}
              </div>
            )}

            <form
              onSubmit={handleCreateBrand}
              className="brand-form"
            >

              <div className="form-row">

                <div className="field">
                  <label>Brand Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={brandForm.name}
                    onChange={handleBrandChange}
                    placeholder="Example: EcoSip"
                    required
                  />
                </div>

                <div className="field">
                  <label>
                    Target Audience
                  </label>

                  <input
                    type="text"
                    name="target_audience"
                    value={
                      brandForm.target_audience
                    }
                    onChange={handleBrandChange}
                    placeholder="Example: College students"
                  />
                </div>

              </div>

              <div className="field">
                <label>Brand Description</label>

                <textarea
                  name="description"
                  value={
                    brandForm.description
                  }
                  onChange={handleBrandChange}
                  placeholder="Describe your brand..."
                  rows="3"
                />
              </div>

              <div className="form-row">

                <div className="field">
                  <label>Brand Tone</label>

                  <input
                    type="text"
                    name="tone"
                    value={brandForm.tone}
                    onChange={handleBrandChange}
                    placeholder="Friendly, inspiring..."
                  />
                </div>

                <div className="field">
                  <label>Personality</label>

                  <input
                    type="text"
                    name="personality"
                    value={
                      brandForm.personality
                    }
                    onChange={handleBrandChange}
                    placeholder="Modern, energetic..."
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="field">
                  <label>
                    Preferred Words
                  </label>

                  <input
                    type="text"
                    name="preferred_words"
                    value={
                      brandForm.preferred_words
                    }
                    onChange={handleBrandChange}
                    placeholder="sustainable, reusable..."
                  />
                </div>

                <div className="field">
                  <label>
                    Words to Avoid
                  </label>

                  <input
                    type="text"
                    name="words_to_avoid"
                    value={
                      brandForm.words_to_avoid
                    }
                    onChange={handleBrandChange}
                    placeholder="wasteful, disposable..."
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="field">
                  <label>
                    Primary Color
                  </label>

                  <div className="color-input">
                    <input
                      type="color"
                      name="primary_color"
                      value={
                        brandForm.primary_color
                      }
                      onChange={handleBrandChange}
                    />

                    <span>
                      {brandForm.primary_color}
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label>
                    Secondary Color
                  </label>

                  <div className="color-input">
                    <input
                      type="color"
                      name="secondary_color"
                      value={
                        brandForm.secondary_color
                      }
                      onChange={handleBrandChange}
                    />

                    <span>
                      {brandForm.secondary_color}
                    </span>
                  </div>
                </div>

              </div>

              <div className="field">
                <label>Logo URL</label>

                <input
                  type="text"
                  name="logo_url"
                  value={brandForm.logo_url}
                  onChange={handleBrandChange}
                  placeholder="https://..."
                />
              </div>

              <div className="brand-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowBrandForm(false);
                    setSaveError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingBrand}
                >
                  {savingBrand ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} />

                      {brandFormMode === "edit"
                        ? "Update Brand"
                        : "Create Brand"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );

  // ==================================================
  // CAMPAIGNS
  // ==================================================

  const renderCampaigns = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            CAMPAIGN STUDIO
          </p>

          <h1>Campaigns</h1>

          <p className="heading-description">
            Create, manage and monitor your
            AI-powered campaigns.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setActivePage("Overview")
          }
        >
          <WandSparkles size={18} />
          New Campaign
        </button>
      </div>

      {campaignError && (
        <div className="error-message">
          {campaignError}
        </div>
      )}

      <div className="campaign-list">

        {loadingCampaigns ? (
          <div className="large-panel">
            <h2>Loading campaigns...</h2>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="large-panel empty-state">
            <h2>No campaigns yet</h2>

            <p>
              Create your first campaign from
              the Campaign Engine.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage("Overview")
              }
            >
              <WandSparkles size={18} />
              Create Campaign
            </button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              className="campaign-row"
              key={campaign.id}
            >
              <div className="campaign-row-icon">
                <Megaphone size={21} />
              </div>

              <div className="campaign-row-content">
                <h3>{campaign.name}</h3>

                <p>
                  {campaign.platforms ||
                    "Platform not specified"}
                </p>
              </div>

              <span
                className={`status ${
                  campaign.status ===
                  "active"
                    ? "active"
                    : campaign.status ===
                      "completed"
                    ? "completed"
                    : "draft"
                }`}
              >
                {campaign.status || "draft"}
              </span>

              <span className="campaign-date">
                {campaign.created_at
                  ? new Date(
                      campaign.created_at
                    ).toLocaleDateString()
                  : ""}
              </span>

              <ArrowRight size={18} />
            </div>
          ))
        )}

      </div>
    </>
  );

  // ==================================================
  // CONTENT
  // ==================================================

  const renderContent = () => (
    <>
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            CONTENT STUDIO
          </p>

          <h1>Content</h1>

          <p className="heading-description">
            Brand-aligned content generated for
            every channel.
          </p>
        </div>

        <div className="brand-actions">

          <button
            className="secondary-button"
            onClick={openCreateContentForm}
          >
            <Plus size={18} />
            Create Content
          </button>

          <button
            className="primary-button"
            onClick={() =>
              setActivePage("Overview")
            }
          >
            <WandSparkles size={18} />
            Generate Content
          </button>

        </div>
      </div>

      {contentError && (
        <div className="error-message">
          Content API: {contentError}
        </div>
      )}

      {loadingContent ? (
        <div className="large-panel">
          <h2>Loading content...</h2>
        </div>
      ) : contents.length === 0 ? (
        <div className="large-panel empty-state">

          <div className="panel-icon">
            <LayoutGrid size={21} />
          </div>

          <h2>No content available</h2>

          <p>
            Create content manually or generate
            AI content from a campaign.
          </p>

          <button
            className="primary-button"
            onClick={openCreateContentForm}
          >
            <Plus size={18} />
            Create Content
          </button>

        </div>
      ) : (
        <div className="content-grid">

          {contents.map((item) => (
            <div
              className="content-card"
              key={item.id}
            >

              <div className="content-card-top">
                <LayoutGrid size={21} />

                <span>
                  {item.platform || "General"}
                </span>
              </div>

              <h3>{item.content}</h3>

              <p>{item.content_type}</p>

              <div className="content-footer">
                <span>
                  {item.status || "draft"}
                </span>

                <span>
                  Brand aligned
                </span>
              </div>

              {item.campaign_id && (
                <button
                  className="text-button"
                  onClick={() =>
                    regenerateContent(
                      item.campaign_id
                    )
                  }
                  disabled={
                    regeneratingCampaignId ===
                    item.campaign_id
                  }
                >
                  <RefreshCw size={15} />

                  {regeneratingCampaignId ===
                  item.campaign_id
                    ? "Regenerating..."
                    : "Regenerate"}
                </button>
              )}

            </div>
          ))}

        </div>
      )}

      {/* CONTENT MODAL */}

      {showContentForm && (
        <div className="brand-modal-overlay">

          <div className="brand-modal">

            <div className="brand-modal-header">

              <div>
                <p className="eyebrow">
                  CONTENT STUDIO
                </p>

                <h2>Create Content</h2>

                <p>
                  Create a brand-aligned
                  content asset.
                </p>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={() => {
                  setShowContentForm(false);
                  setContentError("");
                }}
              >
                <X size={20} />
              </button>

            </div>

            {contentError && (
              <div className="error-message">
                {contentError}
              </div>
            )}

            <form
              onSubmit={handleCreateContent}
              className="brand-form"
            >

              <div className="field">
                <label>Campaign *</label>

                <select
                  name="campaign_id"
                  value={
                    contentForm.campaign_id
                  }
                  onChange={
                    handleContentChange
                  }
                  required
                >
                  <option value="">
                    Select a campaign
                  </option>

                  {campaigns.map(
                    (campaign) => (
                      <option
                        key={campaign.id}
                        value={campaign.id}
                      >
                        {campaign.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-row">

                <div className="field">
                  <label>Platform</label>

                  <select
                    name="platform"
                    value={
                      contentForm.platform
                    }
                    onChange={
                      handleContentChange
                    }
                  >
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>X</option>
                    <option>Facebook</option>
                    <option>Website</option>
                  </select>
                </div>

                <div className="field">
                  <label>Content Type</label>

                  <select
                    name="content_type"
                    value={
                      contentForm.content_type
                    }
                    onChange={
                      handleContentChange
                    }
                  >
                    <option>
                      Social Post
                    </option>
                    <option>Caption</option>
                    <option>Ad Copy</option>
                    <option>Blog Content</option>
                    <option>Email</option>
                    <option>
                      Product Description
                    </option>
                  </select>
                </div>

              </div>

              <div className="field">
                <label>Content *</label>

                <textarea
                  name="content"
                  value={
                    contentForm.content
                  }
                  onChange={
                    handleContentChange
                  }
                  placeholder="Write your brand-aligned content..."
                  rows="7"
                  required
                />
              </div>

              <div className="brand-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowContentForm(false);
                    setContentError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingContent}
                >
                  {savingContent ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Save Content
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );

  // ==================================================
  // INTELLIGENCE
  // ==================================================

  const renderIntelligence = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            AI ANALYTICS
          </p>

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
          <p>Based on campaign activity</p>
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

        {[
          "Your visual identity is highly consistent.",
          "Short-form campaign messaging is performing strongly.",
          "Audience alignment has increased this month.",
          "Your strongest content uses concise messaging.",
        ].map((text) => (
          <div
            className="insight-item"
            key={text}
          >
            <CheckCircle2 size={18} />
            <span>{text}</span>
          </div>
        ))}

      </div>
    </>
  );

  // ==================================================
  // SETTINGS
  // ==================================================

  const renderSettings = () => (
    <>
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            WORKSPACE
          </p>

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
            <p>
              Instagram, LinkedIn, X
            </p>
          </div>

          <button>Manage</button>
        </div>

        <div className="settings-row">
          <div>
            <h3>Brand Intelligence</h3>
            <p>
              Automatic analysis enabled
            </p>
          </div>

          <button>Manage</button>
        </div>

      </div>
    </>
  );

  // ==================================================
  // PAGE ROUTER
  // ==================================================

  const renderPage = () => {
    switch (activePage) {
      case "Brand DNA":
        return renderBrandDNA;

      case "Campaigns":
        return renderCampaigns;

      case "Content":
        return renderContent;

      case "Intelligence":
        return renderIntelligence;

      case "Settings":
        return renderSettings;

      default:
        return renderOverview;
    }
  };

  const PageComponent = renderPage();

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-logo">
            <span>B</span>
          </div>

          <div>
            <h2>BrandForge</h2>
            <span>
              AI Brand Intelligence
            </span>
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
                  activePage === item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActivePage(item.name)
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}

        </nav>

        <div className="sidebar-promo">

          <div className="promo-icon">
            <Sparkles size={20} />
          </div>

          <strong>
            Smarter Content.
            <br />
            Stronger Brands.
          </strong>

          <p>
            Let AI do the heavy lifting
            while you focus on what
            matters.
          </p>

          <button
            onClick={() =>
              setActivePage("Campaigns")
            }
          >
            Create Campaign
            <ArrowRight size={15} />
          </button>

        </div>

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              activePage === "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Settings")
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            <span>Back to landing</span>
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        <header className="topbar">

          <div className="search-box">

            <Search size={18} />

            <input
              placeholder="Search campaigns, content, or brands..."
            />

          </div>

          <div className="topbar-actions">

            <button className="icon-button notification">
              <Bell size={19} />
              <span />
            </button>

            <div className="profile">

              <div className="profile-avatar">
                <User size={18} />
              </div>

              <div>
                <strong>Creator</strong>
                <span>Admin</span>
              </div>

              <ChevronRight
                size={15}
                className="profile-chevron"
              />

            </div>

          </div>

        </header>

        <div className="page-content">
          <PageComponent />
        </div>

      </main>

    </div>
  );
}

export default Dashboard;