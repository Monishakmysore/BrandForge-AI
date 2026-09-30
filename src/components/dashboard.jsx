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

  const [generatingContent, setGeneratingContent] =
    useState(false);

  // ==================================================
  // CAMPAIGN FORM
  // ==================================================

  const [campaignType, setCampaignType] =
    useState("Product Launch");

  const [audience, setAudience] =
    useState("Creators");

  const [platform, setPlatform] =
    useState("All Platforms");

  const [idea, setIdea] = useState("");

  // ==================================================
  // BRAND FORM
  // ==================================================

  const [showBrandForm, setShowBrandForm] =
    useState(false);

  const [savingBrand, setSavingBrand] =
    useState(false);

  // create = new brand
  // edit = existing brand
  const [brandFormMode, setBrandFormMode] =
    useState("create");

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
    target_audience: "",
    tone: "",
    personality: "",
    preferred_words: "",
    words_to_avoid: "",
    primary_color: "#2E7D32",
    secondary_color: "#A5D6A7",
    logo_url: "",
  });

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

      const response = await fetch(
        `${API_URL}/api/brands`
      );

      const data = await response.json();

      console.log("GET /api/brands:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load brands."
        );
      }

      const loadedBrands =
        Array.isArray(data.brands)
          ? data.brands
          : [];

      setBrands(loadedBrands);

      if (loadedBrands.length > 0) {
        setBrand(loadedBrands[0]);
      } else {
        setBrand(null);
      }
    } catch (err) {
      console.error(
        "Brand API error:",
        err
      );

      setBrandError(
        err.message ||
          "Unable to load brand information."
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

      console.log(
        "GET /api/campaigns:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load campaigns."
        );
      }

      setCampaigns(
        Array.isArray(data.campaigns)
          ? data.campaigns
          : []
      );
    } catch (err) {
      console.error(
        "Campaign API error:",
        err
      );

      setCampaignError(
        err.message ||
          "Unable to load campaigns."
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

      console.log(
        "GET /api/content:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load content."
        );
      }

      setContents(
        Array.isArray(data.content)
          ? data.content
          : []
      );
    } catch (err) {
      console.error(
        "Content API error:",
        err
      );

      setContentError(
        err.message ||
          "Unable to load content."
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
  // REFRESH DATA
  // ==================================================

  const refreshData = () => {
    loadBrand();
    loadCampaigns();
    loadContent();
  };

  // ==================================================
  // RESET BRAND FORM
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
      primary_color: "#2E7D32",
      secondary_color: "#A5D6A7",
      logo_url: "",
    });
  };

  // ==================================================
  // OPEN CREATE BRAND FORM
  // ==================================================

  const openCreateBrandForm = () => {
    setSaveError("");

    resetBrandForm();

    setBrandFormMode("create");

    setShowBrandForm(true);
  };

  // ==================================================
  // OPEN EDIT BRAND FORM
  // ==================================================

  const openEditBrandForm = (selectedBrand = brand) => {
    setSaveError("");

    if (!selectedBrand) {
      openCreateBrandForm();
      return;
    }

    setBrandForm({
      name: selectedBrand.name || "",
      description:
        selectedBrand.description || "",
      target_audience:
        selectedBrand.target_audience || "",
      tone:
        selectedBrand.tone || "",
      personality:
        selectedBrand.personality || "",
      preferred_words:
        selectedBrand.preferred_words || "",
      words_to_avoid:
        selectedBrand.words_to_avoid || "",
      primary_color:
        selectedBrand.primary_color ||
        "#2E7D32",
      secondary_color:
        selectedBrand.secondary_color ||
        "#A5D6A7",
      logo_url:
        selectedBrand.logo_url || "",
    });

    setBrand(selectedBrand);

    setBrandFormMode("edit");

    setShowBrandForm(true);
  };

  // ==================================================
  // BRAND FORM CHANGE
  // ==================================================

  const handleBrandChange = (event) => {
    const {
      name,
      value,
    } = event.target;

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

    const cleanName =
      brandForm.name.trim();

    if (!cleanName) {
      setSaveError(
        "Brand name is required."
      );
      return;
    }

    try {
      setSavingBrand(true);

      const payload = {
        name: cleanName,

        description:
          brandForm.description.trim(),

        target_audience:
          brandForm.target_audience.trim(),

        tone:
          brandForm.tone.trim(),

        personality:
          brandForm.personality.trim(),

        preferred_words:
          brandForm.preferred_words.trim(),

        words_to_avoid:
          brandForm.words_to_avoid.trim(),

        primary_color:
          brandForm.primary_color,

        secondary_color:
          brandForm.secondary_color,

        logo_url:
          brandForm.logo_url.trim(),
      };

      let response;

      // ==================================================
      // UPDATE EXISTING BRAND
      // ==================================================

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
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      // ==================================================
      // CREATE NEW BRAND
      // ==================================================

      else {
        response = await fetch(
          `${API_URL}/api/brands`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      const data =
        await response.json();

      console.log(
        "Brand response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save brand."
        );
      }

      // ==================================================
      // REFRESH BRAND DATA
      // ==================================================

      await loadBrand();

      setShowBrandForm(false);

      resetBrandForm();

      setSaveError("");

      setBrandError("");

      setActivePage("Brand DNA");

    } catch (err) {
      console.error(
        "SAVE BRAND ERROR:",
        err
      );

      setSaveError(
        err.message ||
          "Unable to save brand."
      );
    } finally {
      setSavingBrand(false);
    }
  };

  // ==================================================
  // SELECT BRAND
  // ==================================================

  const selectBrand = (selectedBrand) => {
    setBrand(selectedBrand);
  };

  // ==================================================
  // CREATE CAMPAIGN + GENERATE AI CONTENT
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

      // ==================================================
      // STEP 1: CREATE CAMPAIGN
      // ==================================================

      console.log(
        "Creating campaign..."
      );

      const campaignResponse =
        await fetch(
          `${API_URL}/api/campaigns`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              brand_id: brand.id,

              name:
                `${campaignType} Campaign`,

              idea:
                idea.trim(),

              objective:
                `Create a ${campaignType.toLowerCase()} campaign`,

              target_audience:
                audience,

              key_message:
                idea.trim(),

              platforms:
                platform,

              status:
                "draft",
            }),
          }
        );

      const campaignData =
        await campaignResponse.json();

      console.log(
        "Campaign response:",
        campaignData
      );

      if (!campaignResponse.ok) {
        throw new Error(
          campaignData.message ||
            "Campaign creation failed."
        );
      }

      // ==================================================
      // STEP 2: GET NEW CAMPAIGN ID
      // ==================================================

      const campaignId =
        campaignData.campaign?.id;

      if (!campaignId) {
        throw new Error(
          "Campaign was created, but campaign ID was not returned."
        );
      }

      console.log(
        "Campaign ID:",
        campaignId
      );

      // ==================================================
      // STEP 3: GENERATE AI CONTENT
      // ==================================================

      console.log(
        "Generating AI content..."
      );

      const contentResponse =
        await fetch(
          `${API_URL}/api/generate-content`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              campaign_id:
                campaignId,
            }),
          }
        );

      const contentData =
        await contentResponse.json();

      console.log(
        "AI content response:",
        contentData
      );

      if (!contentResponse.ok) {
        throw new Error(
          contentData.message ||
            "AI content generation failed."
        );
      }

      // ==================================================
      // STEP 4: SUCCESS
      // ==================================================

      console.log(
        "AI content generated successfully!"
      );

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
  // OVERVIEW
  // ==================================================

  const renderOverview = () => (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            AI BRAND INTELLIGENCE
          </p>

          <h1>
            Good afternoon, Creator.
          </h1>

          <p className="heading-description">
            Your brand intelligence overview.
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

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <Megaphone size={20} />
          </div>

          <div>
            <span>
              Campaigns
            </span>

            <strong>
              {loadingCampaigns
                ? "..."
                : campaigns.length}
            </strong>
          </div>

          <small>
            Connected to database
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <LayoutGrid size={20} />
          </div>

          <div>
            <span>
              Assets Generated
            </span>

            <strong>
              {loadingContent
                ? "..."
                : contents.length}
            </strong>
          </div>

          <small>
            Content assets
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Brain size={20} />
          </div>

          <div>
            <span>
              Brand Fit
            </span>

            <strong>
              94%
            </strong>
          </div>

          <small>
            Brand consistency
          </small>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={20} />
          </div>

          <div>
            <span>
              Platforms
            </span>

            <strong>
              06
            </strong>
          </div>

          <small>
            Connected channels
          </small>
        </div>

      </div>

      <section className="engine-card">

        <div className="section-title">

          <div className="section-title-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <h2>
              AI Campaign Engine
            </h2>

            <p>
              Turn a simple idea into a
              complete, brand-aligned campaign.
            </p>
          </div>

        </div>

        <textarea
          value={idea}
          onChange={(event) =>
            setIdea(event.target.value)
          }
          placeholder="Describe your campaign idea..."
        />

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
              <option>
                Creators
              </option>

              <option>
                Gen Z
              </option>

              <option>
                Marketing Teams
              </option>

              <option>
                Startups
              </option>

              <option>
                Enterprise
              </option>
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

              <option>
                Instagram
              </option>

              <option>
                LinkedIn
              </option>

              <option>
                X
              </option>

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
              <Sparkles size={19} />
              Generating AI Content...
            </>
          ) : (
            <>
              <WandSparkles size={19} />
              Generate Campaign
              <ArrowRight size={18} />
            </>
          )}
        </button>

      </section>

      <section className="intelligence-section">

        <div className="section-header">

          <div>
            <p className="eyebrow">
              INTELLIGENCE
            </p>

            <h2>
              Brand Intelligence
            </h2>
          </div>

          <button
            className="text-button"
            onClick={() =>
              setActivePage(
                "Intelligence"
              )
            }
          >
            View insights
            <ArrowRight size={16} />
          </button>

        </div>

        <div className="intelligence-grid">

          <div className="intelligence-card">

            <div className="card-top">
              <span>
                Brand Voice
              </span>

              <div className="mini-icon">
                <Sparkles size={17} />
              </div>
            </div>

            <strong>
              94%
            </strong>

            <div className="progress">
              <div
                style={{
                  width: "94%",
                }}
              />
            </div>

            <p>
              Strong and consistent
            </p>

          </div>

          <div className="intelligence-card">

            <div className="card-top">
              <span>
                Content Consistency
              </span>

              <div className="mini-icon">
                <CheckCircle2 size={17} />
              </div>
            </div>

            <strong>
              High
            </strong>

            <div className="progress">
              <div
                style={{
                  width: "88%",
                }}
              />
            </div>

            <p>
              Across all active channels
            </p>

          </div>

          <div className="intelligence-card">

            <div className="card-top">
              <span>
                Active Campaigns
              </span>

              <div className="mini-icon">
                <TrendingUp size={17} />
              </div>
            </div>

            <strong>
              {campaigns.length}
            </strong>

            <div className="campaign-status">
              <span />
              Campaigns in workspace
            </div>

            <p>
              Live database information
            </p>

          </div>

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

          <h1>
            Brand DNA
          </h1>

          <p className="heading-description">
            Your brand's identity, voice and visual language.
          </p>
        </div>

        {/* ==================================================
            CREATE / EDIT BRAND BUTTON
            ONLY ONE BUTTON WILL APPEAR
        ================================================== */}

        <div className="brand-actions">

          {brand ? (
            <button
              className="primary-button"
              onClick={() =>
                openEditBrandForm(brand)
              }
            >
              <Sparkles size={18} />
              Edit Brand
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={openCreateBrandForm}
            >
              <Plus size={18} />
              Create Brand
            </button>
          )}

        </div>

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

      {/* ==================================================
          BRAND SELECTOR
      ================================================== */}

      {!loadingBrand &&
        brands.length > 0 && (

          <div className="brand-selector-panel">

            <div>
              <p className="eyebrow">
                YOUR BRANDS
              </p>

              <h3>
                Select a brand
              </h3>
            </div>

            <div className="brand-selector-list">

              {brands.map(
                (item) => (

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

                )
              )}

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

        <div className="large-panel">

          <div className="panel-icon">
            <Sparkles size={21} />
          </div>

          <h2>
            No brand found
          </h2>

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

            <div className="panel-icon">
              <Sparkles size={21} />
            </div>

            <h2>
              {brand.name}
            </h2>

            <p>
              {brand.description ||
                "No brand description available."}
            </p>

          </div>

          <div className="dna-grid">

            <div className="large-panel">

              <div className="panel-icon">
                <Sparkles size={21} />
              </div>

              <h2>
                Brand Voice
              </h2>

              <p>
                {brand.tone ||
                  "No tone information available."}
              </p>

              <div className="tag-list">

                {brand.tone && (
                  <span>
                    {brand.tone}
                  </span>
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

              <h2>
                Target Audience
              </h2>

              <p>
                {brand.target_audience ||
                  "No target audience information available."}
              </p>

              <div className="audience-score">

                <strong>
                  92%
                </strong>

                <span>
                  Audience match
                </span>

              </div>

            </div>

            <div className="large-panel">

              <div className="panel-icon">
                <Palette size={21} />
              </div>

              <h2>
                Visual Identity
              </h2>

              <p>
                Your brand colors and visual preferences.
              </p>

              <div className="visual-palette">

                <span
                  style={{
                    backgroundColor:
                      brand.primary_color ||
                      "#2E7D32",
                  }}
                />

                <span
                  style={{
                    backgroundColor:
                      brand.secondary_color ||
                      "#A5D6A7",
                  }}
                />

                <span
                  style={{
                    backgroundColor:
                      "#ffffff",
                  }}
                />

                <span
                  style={{
                    backgroundColor:
                      "#0f172a",
                  }}
                />

              </div>

            </div>

            <div className="large-panel">

              <div className="panel-icon">
                <CheckCircle2 size={21} />
              </div>

              <h2>
                Brand Consistency
              </h2>

              <p>
                Brand information is connected
                directly to the BrandForge database.
              </p>

              <div className="consistency-score">

                <strong>
                  94%
                </strong>

                <span>
                  Excellent
                </span>

              </div>

            </div>

            <div className="large-panel">

              <div className="panel-icon">
                <Sparkles size={21} />
              </div>

              <h2>
                Preferred Words
              </h2>

              <p>
                {brand.preferred_words ||
                  "No preferred words configured."}
              </p>

            </div>

            <div className="large-panel">

              <div className="panel-icon">
                <Brain size={21} />
              </div>

              <h2>
                Words to Avoid
              </h2>

              <p>
                {brand.words_to_avoid ||
                  "No restricted words configured."}
              </p>

            </div>

          </div>

        </>

      )}

      {/* ==================================================
          BRAND MODAL
      ================================================== */}

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

                  <label>
                    Brand Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      brandForm.name
                    }
                    onChange={
                      handleBrandChange
                    }
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
                    onChange={
                      handleBrandChange
                    }
                    placeholder="Example: College students"
                  />

                </div>

              </div>

              <div className="field">

                <label>
                  Brand Description
                </label>

                <textarea
                  name="description"
                  value={
                    brandForm.description
                  }
                  onChange={
                    handleBrandChange
                  }
                  placeholder="Describe your brand..."
                  rows="3"
                />

              </div>

              <div className="form-row">

                <div className="field">

                  <label>
                    Brand Tone
                  </label>

                  <input
                    type="text"
                    name="tone"
                    value={
                      brandForm.tone
                    }
                    onChange={
                      handleBrandChange
                    }
                    placeholder="Friendly, inspiring..."
                  />

                </div>

                <div className="field">

                  <label>
                    Personality
                  </label>

                  <input
                    type="text"
                    name="personality"
                    value={
                      brandForm.personality
                    }
                    onChange={
                      handleBrandChange
                    }
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
                    onChange={
                      handleBrandChange
                    }
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
                    onChange={
                      handleBrandChange
                    }
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
                      onChange={
                        handleBrandChange
                      }
                    />

                    <span>
                      {
                        brandForm.primary_color
                      }
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
                      onChange={
                        handleBrandChange
                      }
                    />

                    <span>
                      {
                        brandForm.secondary_color
                      }
                    </span>

                  </div>

                </div>

              </div>

              <div className="field">

                <label>
                  Logo URL
                </label>

                <input
                  type="text"
                  name="logo_url"
                  value={
                    brandForm.logo_url
                  }
                  onChange={
                    handleBrandChange
                  }
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

          <h1>
            Campaigns
          </h1>

          <p className="heading-description">
            Create, manage and monitor your AI-powered campaigns.
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
            <h2>
              Loading campaigns...
            </h2>
          </div>

        ) : campaigns.length === 0 ? (

          <div className="large-panel">

            <h2>
              No campaigns yet
            </h2>

            <p>
              Create your first campaign from
              the Campaign Engine.
            </p>

          </div>

        ) : (

          campaigns.map(
            (campaign) => (

              <div
                className="campaign-row"
                key={campaign.id}
              >

                <div className="campaign-row-icon">
                  <Megaphone size={21} />
                </div>

                <div className="campaign-row-content">

                  <h3>
                    {campaign.name}
                  </h3>

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
                  {campaign.status ||
                    "draft"}
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

            )
          )

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

          <h1>
            Content
          </h1>

          <p className="heading-description">
            Brand-aligned content generated for every channel.
          </p>
        </div>

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

      {contentError && (
        <div className="error-message">
          Content API: {contentError}
        </div>
      )}

      {loadingContent ? (

        <div className="large-panel">

          <h2>
            Loading content...
          </h2>

        </div>

      ) : contents.length === 0 ? (

        <div className="large-panel">

          <h2>
            No content available
          </h2>

          <p>
            No content has been generated yet.
          </p>

        </div>

      ) : (

        <div className="content-grid">

          {contents.map(
            (item) => (

              <div
                className="content-card"
                key={item.id}
              >

                <div className="content-card-top">

                  <LayoutGrid size={21} />

                  <span>
                    {item.platform ||
                      "General"}
                  </span>

                </div>

                <h3>
                  {item.content}
                </h3>

                <p>
                  {item.content_type}
                </p>

                <div className="content-footer">

                  <span>
                    {item.status ||
                      "draft"}
                  </span>

                  <span>
                    Brand aligned
                  </span>

                </div>

              </div>
            )
          )}

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

          <h1>
            Intelligence
          </h1>

          <p className="heading-description">
            Understand how your brand is performing.
          </p>
        </div>

      </div>

      <div className="intelligence-summary">

        <div>

          <span>
            Brand Growth
          </span>

          <strong>
            +28%
          </strong>

          <p>
            Compared with last month
          </p>

        </div>

        <div>

          <span>
            Audience Match
          </span>

          <strong>
            92%
          </strong>

          <p>
            Based on campaign activity
          </p>

        </div>

        <div>

          <span>
            Creative Score
          </span>

          <strong>
            94%
          </strong>

          <p>
            Across generated assets
          </p>

        </div>

      </div>

      <div className="large-panel insights-panel">

        <div className="panel-icon">
          <Brain size={21} />
        </div>

        <h2>
          AI Creative Insights
        </h2>

        <div className="insight-item">

          <CheckCircle2 size={18} />

          <span>
            Your visual identity is highly consistent.
          </span>

        </div>

        <div className="insight-item">

          <CheckCircle2 size={18} />

          <span>
            Short-form campaign messaging is performing strongly.
          </span>

        </div>

        <div className="insight-item">

          <CheckCircle2 size={18} />

          <span>
            Audience alignment has increased this month.
          </span>

        </div>

        <div className="insight-item">

          <CheckCircle2 size={18} />

          <span>
            Your strongest content uses concise messaging.
          </span>

        </div>

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

          <h1>
            Settings
          </h1>

          <p className="heading-description">
            Manage your BrandForge workspace.
          </p>

        </div>

      </div>

      <div className="settings-panel">

        <div className="settings-row">

          <div>

            <h3>
              Workspace Name
            </h3>

            <p>
              BrandForge AI
            </p>

          </div>

          <button>
            Edit
          </button>

        </div>

        <div className="settings-row">

          <div>

            <h3>
              AI Creativity
            </h3>

            <p>
              Balanced
            </p>

          </div>

          <button>
            Edit
          </button>

        </div>

        <div className="settings-row">

          <div>

            <h3>
              Connected Platforms
            </h3>

            <p>
              Instagram, LinkedIn, X
            </p>

          </div>

          <button>
            Manage
          </button>

        </div>

        <div className="settings-row">

          <div>

            <h3>
              Brand Intelligence
            </h3>

            <p>
              Automatic analysis enabled
            </p>

          </div>

          <button>
            Manage
          </button>

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

  // ==================================================
  // DASHBOARD UI
  // ==================================================

  return (

    <div className="dashboard">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-mark">
            <Sparkles size={22} />
          </div>

          <div>

            <h2>
              BrandForge
            </h2>

            <span>
              AI BRAND INTELLIGENCE
            </span>

          </div>

        </div>

        <div className="workspace-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {navigation.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <button
                  key={item.name}
                  className={`nav-item ${
                    activePage ===
                    item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActivePage(
                      item.name
                    )
                  }
                >

                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>

                </button>

              );

            }
          )}

        </nav>

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${
              activePage ===
              "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Settings"
              )
            }
          >

            <Settings size={19} />

            <span>
              Settings
            </span>

          </button>

          <button
            className="back-button"
            onClick={onBack}
          >

            <ArrowLeft size={18} />

            <span>
              Back to landing
            </span>

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="dashboard-main">

        <header className="topbar">

          <div className="breadcrumb">

            <span>
              BrandForge
            </span>

            <ArrowRight size={14} />

            <strong>
              {activePage}
            </strong>

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

                <strong>
                  Creator
                </strong>

                <span>
                  Admin
                </span>

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