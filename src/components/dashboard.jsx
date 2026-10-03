import { useEffect, useState } from "react";
import {
  Home,
  Sparkles,
  Megaphone,
  LayoutGrid,
  Settings,
  ArrowLeft,
  ArrowRight,
  WandSparkles,
  Search,
  Bell,
  User,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Target,
  Plus,
  X,
  RefreshCw,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  Palette,
  Copy,
} from "lucide-react";

import "./dashboard.css";

const API_URL = "http://127.0.0.1:5001";

function Dashboard({ onBack }) {
  /* =========================================================
     PAGE
  ========================================================= */

  const [activePage, setActivePage] = useState(() => {
    const saved = localStorage.getItem("brandforge_active_page");

    const normalizedSaved =
      saved === "Quality & Tone Checker"
        ? "Quality Checker"
        : saved;

    const allowed = [
      "Overview",
      "Brand DNA",
      "Campaigns",
      "Content",
      "Quality Checker",
      "Settings",
    ];

    return allowed.includes(normalizedSaved)
      ? normalizedSaved
      : "Overview";
  });

  useEffect(() => {
    localStorage.setItem("brandforge_active_page", activePage);
  }, [activePage]);

  /* =========================================================
     DATA
  ========================================================= */

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

  /* =========================================================
     UI
  ========================================================= */

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCreatorProfile, setShowCreatorProfile] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState(() => {
    try {
      const savedUser = localStorage.getItem("brandforge_user");
      return savedUser ? JSON.parse(savedUser) : {};
    } catch {
      return {};
    }
  });

  /* =========================================================
     BRAND MODAL
  ========================================================= */

  const [showBrandForm, setShowBrandForm] = useState(false);
  const [brandFormMode, setBrandFormMode] = useState("create");
  const [savingBrand, setSavingBrand] = useState(false);
  const [saveError, setSaveError] = useState("");

  const emptyBrandForm = {
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
  };

  const [brandForm, setBrandForm] = useState(emptyBrandForm);

  /* =========================================================
     CAMPAIGN CREATOR
  ========================================================= */

  const [campaignType, setCampaignType] =
    useState("Product Launch");

  const [audience, setAudience] =
    useState("Creators");

  const [platform, setPlatform] =
    useState("All Platforms");

  const [idea, setIdea] = useState("");
  const [generatingContent, setGeneratingContent] =
    useState(false);

  const [regeneratingCampaignId, setRegeneratingCampaignId] =
    useState(null);

  /* =========================================================
     CONTENT
  ========================================================= */

  const [showContentForm, setShowContentForm] =
    useState(false);

  const [savingContent, setSavingContent] =
    useState(false);

  const [contentForm, setContentForm] = useState({
    campaign_id: "",
    platform: "Instagram",
    content_type: "Social Post",
    content: "",
  });

  const [editingContent, setEditingContent] =
    useState(null);

  const [editContentText, setEditContentText] =
    useState("");

  const [savingEditedContent, setSavingEditedContent] =
    useState(false);

  const [deletingContentId, setDeletingContentId] =
    useState(null);

  const [regeneratingContentId, setRegeneratingContentId] =
    useState(null);

  const [contentFilter, setContentFilter] =
    useState("All");

  const [copiedContentId, setCopiedContentId] =
    useState(null);

  const [editorAssistLoading, setEditorAssistLoading] =
    useState(false);

  const [editorNotice, setEditorNotice] =
    useState("");

  /* =========================================================
     QUALITY CHECKER PAGE
  ========================================================= */

  const [qualityDraft, setQualityDraft] = useState("");
  const [qualityPlatform, setQualityPlatform] = useState("Instagram");

  const normalizeQualityPlatform = (value) => {
    const text = String(value || "").toLowerCase();

    if (text.includes("linkedin")) return "LinkedIn";
    if (text === "x" || text.includes(" x") || text.includes("twitter")) {
      return "X";
    }

    return "Instagram";
  };

  const useLatestContentForQuality = () => {
    const latest = contents[0];

    if (!latest) {
      setQualityDraft("");
      setQualityPlatform("Instagram");
      return;
    }

    setQualityDraft(latest.content || "");
    setQualityPlatform(normalizeQualityPlatform(latest.platform));
  };

  useEffect(() => {
    if (!qualityDraft && contents.length > 0) {
      useLatestContentForQuality();
    }
  }, [contents, qualityDraft]);

  /* =========================================================
     CONTENT QUALITY & TONE CHECKER
  ========================================================= */

  const analyzeContent = (item) => {
    const text = String(item?.content || "").trim();

    const platform = String(
      item?.platform || ""
    ).toLowerCase();

    const preferredWords = String(
      brand?.preferred_words || ""
    )
      .split(",")
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    const wordsToAvoid = String(
      brand?.words_to_avoid || ""
    )
      .split(",")
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    const lowerText = text.toLowerCase();

    let maxLength = 3000;

    if (platform.includes("x")) {
      maxLength = 280;
    } else if (platform.includes("instagram")) {
      maxLength = 2200;
    } else if (platform.includes("linkedin")) {
      maxLength = 3000;
    }

    const lengthGood =
      text.length > 0 && text.length <= maxLength;

    const detectedForbiddenWords = wordsToAvoid.filter(
      (word) => lowerText.includes(word)
    );

    const forbiddenWordsGood =
      detectedForbiddenWords.length === 0;

    const detectedPreferredWords = preferredWords.filter(
      (word) => lowerText.includes(word)
    );

    const brandVoiceGood =
      preferredWords.length === 0 ||
      detectedPreferredWords.length > 0;

    const firstLine = text.split("\n")[0]?.trim() || "";

    const hookGood =
      firstLine.length >= 20 ||
      /[!?🌱✨🚀🔥💡]/.test(firstLine);

    const ctaGood =
      /\b(try|shop|buy|learn|discover|join|start|visit|explore|sign up|download|follow|share|comment|order|get|book|contact)\b/i.test(
        text
      );

    const audienceText = String(
      brand?.target_audience || ""
    ).toLowerCase();

    const audienceKeywords = audienceText
      .split(/[\s,&/-]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 4)
      .slice(0, 8);

    const audienceGood =
      !audienceKeywords.length ||
      audienceKeywords.some((word) =>
        lowerText.includes(word)
      );

    const toneSignals = {
      friendly: [
        "you",
        "your",
        "we",
        "together",
        "let's",
        "hey",
        "welcome",
        "community",
      ],
      professional: [
        "strategy",
        "results",
        "optimize",
        "business",
        "insight",
        "solution",
        "performance",
        "professional",
      ],
      energetic: [
        "launch",
        "boost",
        "exciting",
        "power",
        "fast",
        "win",
        "ready",
        "🚀",
        "🔥",
        "✨",
      ],
      confident: [
        "proven",
        "built",
        "leading",
        "trusted",
        "can",
        "will",
        "ready",
        "expert",
        "strong",
      ],
    };

    const toneScores = Object.entries(toneSignals).reduce(
      (scores, [tone, signals]) => {
        scores[tone] = signals.reduce(
          (total, signal) =>
            total +
            (lowerText.includes(signal.toLowerCase())
              ? 1
              : 0),
          0
        );
        return scores;
      },
      {}
    );

    const detectedTone =
      Object.entries(toneScores).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "balanced";

    const brandTone = String(
      brand?.tone || ""
    ).toLowerCase();

    const toneAligned =
      !brandTone ||
      brandTone.includes(detectedTone) ||
      (brandTone.includes("professional") &&
        detectedTone === "professional") ||
      (brandTone.includes("formal") &&
        detectedTone === "professional") ||
      (brandTone.includes("friendly") &&
        detectedTone === "friendly") ||
      (brandTone.includes("energetic") &&
        detectedTone === "energetic") ||
      (brandTone.includes("confident") &&
        detectedTone === "confident");

    const recommendations = [];

    if (!lengthGood) {
      recommendations.push(
        `Shorten the message to stay within the ${maxLength}-character limit.`
      );
    }

    if (!hookGood) {
      recommendations.push(
        "Strengthen the opening line with a clearer hook or benefit."
      );
    }

    if (!ctaGood) {
      recommendations.push(
        "Add a clear call to action so the audience knows what to do next."
      );
    }

    if (!brandVoiceGood) {
      recommendations.push(
        preferredWords.length
          ? `Use at least one preferred brand word such as “${preferredWords[0]}”.`
          : "Align the wording more closely with the brand voice."
      );
    }

    if (!forbiddenWordsGood) {
      recommendations.push(
        `Replace brand-sensitive words: ${detectedForbiddenWords.join(", ")}.`
      );
    }

    if (!audienceGood) {
      recommendations.push(
        "Mention a need, benefit, or phrase that clearly matches the target audience."
      );
    }

    if (!toneAligned) {
      recommendations.push(
        `The detected ${detectedTone} tone may not match the brand tone (${brand?.tone || "configured brand tone"}).`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Content is aligned. Keep the structure and tone consistent across channels."
      );
    }

    let score = 100;

    if (!lengthGood) score -= 20;
    if (!hookGood) score -= 10;
    if (!ctaGood) score -= 10;
    if (!brandVoiceGood) score -= 10;
    if (!forbiddenWordsGood) score -= 25;
    if (!audienceGood) score -= 10;

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      lengthGood,
      hookGood,
      ctaGood,
      brandVoiceGood,
      forbiddenWordsGood,
      audienceGood,
      detectedTone,
      toneAligned,
      recommendations,
      detectedForbiddenWords,
      detectedPreferredWords,
      characterCount: text.length,
      maxLength,
    };
  };

  /* =========================================================
     SETTINGS
  ========================================================= */

  const [workspaceSettings, setWorkspaceSettings] =
    useState(() => ({
      workspaceName:
        localStorage.getItem(
          "brandforge_workspace_name"
        ) || "BrandForge AI",

      aiCreativity:
        localStorage.getItem(
          "brandforge_ai_creativity"
        ) || "Balanced",

      connectedPlatforms:
        localStorage.getItem(
          "brandforge_connected_platforms"
        ) || "Instagram, LinkedIn, X",

      brandIntelligence:
        localStorage.getItem(
          "brandforge_brand_intelligence"
        ) || "Automatic analysis enabled",
    }));

  const [editingSetting, setEditingSetting] =
    useState(null);

  const [settingDraft, setSettingDraft] =
    useState("");

  useEffect(() => {
    localStorage.setItem(
      "brandforge_workspace_name",
      workspaceSettings.workspaceName
    );

    localStorage.setItem(
      "brandforge_ai_creativity",
      workspaceSettings.aiCreativity
    );

    localStorage.setItem(
      "brandforge_connected_platforms",
      workspaceSettings.connectedPlatforms
    );

    localStorage.setItem(
      "brandforge_brand_intelligence",
      workspaceSettings.brandIntelligence
    );
  }, [workspaceSettings]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

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
      name: "Quality Checker",
      icon: ShieldCheck,
    },
  ];

  /* =========================================================
     HELPERS
  ========================================================= */

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good evening";
    }

    return "Good night";
  };

  const closeMenus = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const openCreatorProfile = () => {
    try {
      const savedUser = localStorage.getItem("brandforge_user");
      setCreatorProfile(savedUser ? JSON.parse(savedUser) : {});
    } catch {
      setCreatorProfile({});
    }

    setShowNotifications(false);
    setShowProfileMenu(false);
    setShowCreatorProfile(true);
  };

  const closeCreatorProfile = () => {
    setShowCreatorProfile(false);
  };

  const safeJson = async (response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        message: text,
      };
    }
  };

  /* =========================================================
     LOAD BRAND
  ========================================================= */

  const loadBrand = async () => {
    try {
      setLoadingBrand(true);
      setBrandError("");

      const response = await fetch(
        `${API_URL}/api/brands`
      );

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load brands."
        );
      }

      const loadedBrands =
        Array.isArray(data.brands)
          ? data.brands
          : [];

      setBrands(loadedBrands);

      if (loadedBrands.length > 0) {
        setBrand((current) => {
          if (!current) {
            return loadedBrands[0];
          }

          return (
            loadedBrands.find(
              (item) => item.id === current.id
            ) || loadedBrands[0]
          );
        });
      } else {
        setBrand(null);
      }
    } catch (error) {
      console.error("BRAND LOAD ERROR:", error);

      setBrands([]);
      setBrand(null);

      setBrandError(
        error.message ||
          "Backend is not available."
      );
    } finally {
      setLoadingBrand(false);
    }
  };

  /* =========================================================
     LOAD CAMPAIGNS
  ========================================================= */

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      setCampaignError("");

      const response = await fetch(
        `${API_URL}/api/campaigns`
      );

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load campaigns."
        );
      }

      setCampaigns(
        Array.isArray(data.campaigns)
          ? data.campaigns
          : []
      );
    } catch (error) {
      console.error(
        "CAMPAIGN LOAD ERROR:",
        error
      );

      setCampaigns([]);

      setCampaignError(
        error.message ||
          "Backend is not available."
      );
    } finally {
      setLoadingCampaigns(false);
    }
  };

  /* =========================================================
     CONTENT VIEW HELPERS
  ========================================================= */

  const getLocallyDeletedContentIds = () => {
    try {
      const saved = localStorage.getItem(
        "brandforge_deleted_content_ids"
      );

      const ids = saved ? JSON.parse(saved) : [];

      return Array.isArray(ids)
        ? ids.map((id) => String(id))
        : [];
    } catch {
      return [];
    }
  };

  const rememberDeletedContentId = (contentId) => {
    const normalizedId = String(contentId);
    const ids = new Set(getLocallyDeletedContentIds());
    ids.add(normalizedId);

    localStorage.setItem(
      "brandforge_deleted_content_ids",
      JSON.stringify(Array.from(ids))
    );
  };

  const removeDeletedContentIds = (items) => {
    const deletedIds = new Set(getLocallyDeletedContentIds());

    return items.filter(
      (item) => !deletedIds.has(String(item?.id))
    );
  };

  const regenerateTextLocally = (text, platform) => {
    const lines = String(text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return String(text || "");
    }

    const original = lines[0];
    const base = original
      .replace(/^Here's a fresh take:\s*/i, "")
      .replace(/^Ready for a new perspective\?:?\s*/i, "")
      .replace(/^A better way to think about it:\s*/i, "")
      .replace(/^A fresh way to say it:\s*/i, "")
      .trim();

    const variants = [
      `Here's a fresh take: ${base}`,
      `Ready for a new perspective? ${base}`,
      `A better way to think about it: ${base}`,
      `A fresh way to say it: ${base}`,
    ];

    const currentLower = original.toLowerCase();
    let variant = variants[0];

    if (currentLower.startsWith("here's a fresh take:")) {
      variant = variants[1];
    } else if (currentLower.startsWith("ready for a new perspective?")) {
      variant = variants[2];
    } else if (currentLower.startsWith("a better way to think about it:")) {
      variant = variants[3];
    }

    // Give platform-specific wording a little variation without changing the core message.
    const platformName = String(platform || "").toLowerCase();
    if (platformName.includes("x") && currentLower === base.toLowerCase()) {
      variant = `New thought: ${base}`;
    }

    return [variant, ...lines.slice(1)].join("\n");
  };

  /* =========================================================
     LOAD CONTENT
  ========================================================= */

  const loadContent = async () => {
    try {
      setLoadingContent(true);
      setContentError("");

      const response = await fetch(
        `${API_URL}/api/content`
      );

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load content."
        );
      }

      const loadedContent =
        Array.isArray(data.content)
          ? data.content
          : [];

      setContents(removeDeletedContentIds(loadedContent));
    } catch (error) {
      console.error(
        "CONTENT LOAD ERROR:",
        error
      );

      setContents([]);

      setContentError(
        error.message ||
          "Backend is not available."
      );
    } finally {
      setLoadingContent(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadBrand();
    loadCampaigns();
    loadContent();
  }, []);

  const refreshData = () => {
    loadBrand();
    loadCampaigns();
    loadContent();
  };

  /* =========================================================
     BRAND
  ========================================================= */

  const resetBrandForm = () => {
    setBrandForm({
      ...emptyBrandForm,
    });
  };

  const openCreateBrandForm = () => {
    resetBrandForm();
    setBrandFormMode("create");
    setSaveError("");
    setShowBrandForm(true);
    closeMenus();
  };

  const openEditBrandForm = (
    selected = brand
  ) => {
    if (!selected) {
      openCreateBrandForm();
      return;
    }

    setBrandForm({
      name: selected.name || "",
      description:
        selected.description || "",
      target_audience:
        selected.target_audience || "",
      tone: selected.tone || "",
      personality:
        selected.personality || "",
      preferred_words:
        selected.preferred_words || "",
      words_to_avoid:
        selected.words_to_avoid || "",
      primary_color:
        selected.primary_color ||
        "#1677FF",
      secondary_color:
        selected.secondary_color ||
        "#B9DCFF",
      logo_url:
        selected.logo_url || "",
    });

    setBrand(selected);
    setBrandFormMode("edit");
    setSaveError("");
    setShowBrandForm(true);
    closeMenus();
  };

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

  const handleLogoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveError(
        "Please select an image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError(
        "Image must be smaller than 5 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setBrandForm((previous) => ({
        ...previous,
        logo_url: reader.result,
      }));

      setSaveError("");
    };

    reader.readAsDataURL(file);
  };

  const handleSaveBrand = async (event) => {
    event.preventDefault();

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
      setSaveError("");

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
          brandForm.logo_url || "",
      };

      let response;

      if (
        brandFormMode === "edit" &&
        brand?.id
      ) {
        response = await fetch(
          `${API_URL}/api/brands/${brand.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
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
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data =
        await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save brand."
        );
      }

      await loadBrand();

      setShowBrandForm(false);
      resetBrandForm();

      setActivePage("Brand DNA");
    } catch (error) {
      console.error(
        "SAVE BRAND ERROR:",
        error
      );

      setSaveError(
        error.message ||
          "Unable to save brand."
      );
    } finally {
      setSavingBrand(false);
    }
  };

  /* =========================================================
     CAMPAIGN GENERATION
  ========================================================= */

  const handleGenerate = async () => {
    setCampaignError("");

    if (!brand) {
      setCampaignError(
        "Please create a brand first."
      );
      return;
    }

    if (!idea.trim()) {
      setCampaignError(
        "Please enter a campaign idea."
      );
      return;
    }

    try {
      setGeneratingContent(true);

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
              name: `${campaignType} Campaign`,
              idea: idea.trim(),
              objective:
                `Create a ${campaignType.toLowerCase()} campaign`,
              target_audience:
                audience,
              key_message:
                idea.trim(),
              platforms:
                platform,
              status: "draft",
            }),
          }
        );

      const campaignData =
        await safeJson(
          campaignResponse
        );

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
          "Campaign ID was not returned."
        );
      }

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
              campaign_id: campaignId,
            }),
          }
        );

      const contentData =
        await safeJson(
          contentResponse
        );

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
    } catch (error) {
      console.error(
        "GENERATION ERROR:",
        error
      );

      setCampaignError(
        error.message ||
          "Unable to generate campaign."
      );
    } finally {
      setGeneratingContent(false);
    }
  };

  /* =========================================================
     CONTENT
  ========================================================= */

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
    closeMenus();
  };

  const handleContentChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setContentForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateContent = async (
    event
  ) => {
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
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            campaign_id: Number(
              contentForm.campaign_id
            ),
            platform:
              contentForm.platform,
            content_type:
              contentForm.content_type,
            content:
              contentForm.content.trim(),
            status: "draft",
          }),
        }
      );

      const data =
        await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create content."
        );
      }

      setShowContentForm(false);

      await loadContent();
    } catch (error) {
      console.error(
        "CREATE CONTENT ERROR:",
        error
      );

      setContentError(
        error.message ||
          "Unable to create content."
      );
    } finally {
      setSavingContent(false);
    }
  };

  const regenerateContent = async (target) => {
    const targetItem =
      target && typeof target === "object"
        ? target
        : null;

    const normalizedCampaignId = Number(
      targetItem?.campaign_id ?? target
    );

    const normalizedContentId = targetItem?.id
      ? String(targetItem.id)
      : null;

    const locallyRegenerate = (item) => {
      if (!item?.id) return false;

      setContents((previous) =>
        previous.map((contentItem) =>
          String(contentItem?.id) === String(item.id)
            ? {
                ...contentItem,
                content: regenerateTextLocally(
                  contentItem.content,
                  contentItem.platform
                ),
              }
            : contentItem
        )
      );

      return true;
    };

    try {
      setContentError("");
      setCampaignError("");

      if (normalizedContentId) {
        setRegeneratingContentId(normalizedContentId);
      }

      if (
        Number.isFinite(normalizedCampaignId) &&
        normalizedCampaignId > 0
      ) {
        setRegeneratingCampaignId(normalizedCampaignId);

        try {
          const response = await fetch(
            `${API_URL}/api/generate-content`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                campaign_id: normalizedCampaignId,
              }),
            }
          );

          const data = await safeJson(response);

          if (!response.ok) {
            throw new Error(
              data.message ||
                data.error ||
                "Failed to regenerate campaign content."
            );
          }

          await Promise.all([loadCampaigns(), loadContent()]);
          setSelectedCampaign(null);
          setActivePage("Content");
          return;
        } catch (apiError) {
          console.warn(
            "API regeneration failed; using local regeneration fallback.",
            apiError
          );

          if (targetItem) {
            locallyRegenerate(targetItem);
          } else {
            setContents((previous) =>
              previous.map((contentItem) =>
                String(contentItem?.campaign_id) ===
                String(normalizedCampaignId)
                  ? {
                      ...contentItem,
                      content: regenerateTextLocally(
                        contentItem.content,
                        contentItem.platform
                      ),
                    }
                  : contentItem
              )
            );
          }

          setSelectedCampaign(null);
          setActivePage("Content");
          setContentError(
            "Content regenerated in the workspace. The AI backend was unavailable, so this version was refreshed locally."
          );
          return;
        }
      }

      if (targetItem) {
        locallyRegenerate(targetItem);
        setEditorNotice(
          "Content regenerated. Review the new version before saving."
        );
        return;
      }

      setContentError(
        "This content does not have a valid campaign or content ID to regenerate."
      );
    } finally {
      setRegeneratingCampaignId(null);
      setRegeneratingContentId(null);
    }
  };

  const openContentEditor = (item) => {
    setEditingContent(item);
    setEditContentText(item?.content || "");
    setContentError("");
    setEditorNotice("");
  };

  const closeContentEditor = () => {
    if (savingEditedContent || editorAssistLoading) return;

    setEditingContent(null);
    setEditContentText("");
    setContentError("");
    setEditorNotice("");
  };

  const getEditorLimit = (platformName) => {
    const platformValue = String(platformName || "").toLowerCase();

    if (platformValue.includes("x")) return 280;
    if (platformValue.includes("instagram")) return 2200;
    if (platformValue.includes("linkedin")) return 3000;

    return 3000;
  };

  const improveEditorText = (mode) => {
    if (!editingContent) return;

    const current = editContentText.trim();

    if (!current) {
      setContentError("Add some content before using an editor assist.");
      return;
    }

    setEditorAssistLoading(true);
    setContentError("");
    setEditorNotice("");

    try {
      let next = current;

      if (mode === "hook") {
        const lines = next.split("\n");
        const first = lines[0]?.trim() || "";
        if (!/[!?]/.test(first)) {
          lines[0] = `Ready to make a difference? ${first}`.trim();
        }
        next = lines.join("\n");
      }

      if (mode === "cta") {
        if (!/\b(try|shop|buy|learn|discover|join|start|visit|explore|sign up|download|follow|share|comment|order|get|book|contact)\b/i.test(next)) {
          next = `${next.replace(/\s+$/, "")}\n\nReady to get started? Explore the next step today.`;
        }
      }

      if (mode === "clean") {
        next = next
          .replace(/[ \t]+/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .replace(/\s+([,.!?])/g, "$1")
          .trim();
      }

      if (mode === "shorten") {
        const limit = getEditorLimit(editingContent.platform);
        if (next.length > limit) {
          next = `${next.slice(0, Math.max(0, limit - 3)).trim()}...`;
        } else {
          const sentences = next.split(/(?<=[.!?])\s+/);
          if (sentences.length > 3) {
            next = sentences.slice(0, 3).join(" ").trim();
          }
        }
      }

      setEditContentText(next);
      setEditorNotice(
        mode === "hook"
          ? "Hook improved locally. Review the new opening before saving."
          : mode === "cta"
            ? "CTA added locally. Review the closing before saving."
            : mode === "shorten"
              ? "Content shortened for the selected platform."
              : "Formatting cleaned up."
      );
    } finally {
      setEditorAssistLoading(false);
    }
  };


  const regenerateEditorSection = () => {
    if (!editingContent) return;

    const current = editContentText.trim();

    if (!current) {
      setContentError("Add some content before regenerating a section.");
      return;
    }

    setEditorAssistLoading(true);
    setContentError("");
    setEditorNotice("");

    try {
      const lines = current
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        setContentError("There is no section to regenerate.");
        return;
      }

      const original = lines[0];
      const variants = [
        `Here's a fresh take: ${original.replace(/^Here's a fresh take:\s*/i, "")}`,
        `Ready for a new perspective? ${original.replace(/^Ready for a new perspective\?:\s*/i, "")}`,
        `A better way to think about it: ${original.replace(/^A better way to think about it:\s*/i, "")}`,
      ];

      const currentLower = original.toLowerCase();
      const nextVariant = currentLower.startsWith("here's a fresh take:")
        ? variants[1]
        : currentLower.startsWith("ready for a new perspective?")
          ? variants[2]
          : variants[0];

      lines[0] = nextVariant;
      setEditContentText(lines.join("\n"));
      setEditorNotice(
        "Section regenerated locally. Review the new version before saving."
      );
    } finally {
      setEditorAssistLoading(false);
    }
  };

  const saveEditedContent = async () => {
    if (!editingContent?.id) return;

    if (!editContentText.trim()) {
      setContentError(
        "Content cannot be empty."
      );
      return;
    }

    try {
      setSavingEditedContent(true);
      setContentError("");

      const response =
        await fetch(
          `${API_URL}/api/content/${editingContent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              content:
                editContentText.trim(),
            }),
          }
        );

      const data =
        await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update content."
        );
      }

      setEditingContent(null);
      setEditContentText("");
      setEditorNotice("");

      await loadContent();
    } catch (error) {
      console.error(
        "EDIT CONTENT ERROR:",
        error
      );

      setContentError(
        error.message ||
          "Unable to update content."
      );
    } finally {
      setSavingEditedContent(false);
    }
  };

  const copyContent = async (item) => {
    if (!item?.content) return;

    try {
      await navigator.clipboard.writeText(
        item.content
      );

      setCopiedContentId(item.id);

      window.setTimeout(() => {
        setCopiedContentId((current) =>
          current === item.id ? null : current
        );
      }, 1600);
    } catch (error) {
      console.error("COPY CONTENT ERROR:", error);
      setContentError(
        "Unable to copy content. Please select and copy it manually."
      );
    }
  };

  const deleteContent = async (contentId) => {
    if (!contentId) return;

    const normalizedId = String(contentId);
    const confirmed = window.confirm("Delete this content?");

    if (!confirmed) return;

    try {
      setDeletingContentId(normalizedId);
      setContentError("");

      const response = await fetch(
        `${API_URL}/api/content/${encodeURIComponent(normalizedId)}`,
        {
          method: "DELETE",
        }
      );

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to delete content."
        );
      }

      rememberDeletedContentId(normalizedId);
      setContents((previous) =>
        previous.filter(
          (item) => String(item?.id) !== normalizedId
        )
      );
    } catch (error) {
      console.error("DELETE CONTENT ERROR:", error);

      // Keep the Content page usable even when the backend delete route is unavailable.
      rememberDeletedContentId(normalizedId);
      setContents((previous) =>
        previous.filter(
          (item) => String(item?.id) !== normalizedId
        )
      );

      setContentError(
        "Content was removed from your workspace. The server could not confirm the delete."
      );
    } finally {
      setDeletingContentId(null);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (value) => {
    setSearchQuery(value);

    const query = value.trim().toLowerCase();

    // Never leave an old campaign detail modal open while searching.
    setSelectedCampaign(null);

    if (!query) return;

    // Search content first so platform searches such as
    // "instagram", "linkedin" or "x" open Content instead
    // of opening an unrelated campaign detail view.
    const contentMatch = contents.find((item) =>
      [
        item.platform,
        item.content_type,
        item.content,
        item.status,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(query)
        )
    );

    if (contentMatch) {
      setActivePage("Content");
      const platformName = String(contentMatch.platform || "").trim();
      const supportedPlatforms = ["Instagram", "LinkedIn", "X"];
      setContentFilter(
        supportedPlatforms.includes(platformName)
          ? platformName
          : "All"
      );
      closeMenus();
      return;
    }

    const campaignMatch = campaigns.find((campaign) =>
      [
        campaign.name,
        campaign.idea,
        campaign.objective,
        campaign.target_audience,
        campaign.key_message,
        campaign.platforms,
        campaign.status,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(query)
        )
    );

    if (campaignMatch) {
      setActivePage("Campaigns");
      setSelectedCampaign(null);
      closeMenus();
      return;
    }

    const brandMatch = brands.find((item) =>
      [
        item.name,
        item.description,
        item.target_audience,
        item.tone,
        item.personality,
      ]
        .filter(Boolean)
        .some((field) =>
          String(field).toLowerCase().includes(query)
        )
    );

    if (brandMatch) {
      setBrand(brandMatch);
      setActivePage("Brand DNA");
      setSelectedCampaign(null);
      closeMenus();
    }
  };

  /* =========================================================
     SETTINGS
  ========================================================= */

  const startSettingEdit = (key) => {
    setEditingSetting(key);
    setSettingDraft(
      workspaceSettings[key] || ""
    );
  };

  const saveSetting = () => {
    if (!editingSetting) return;

    const value =
      settingDraft.trim();

    if (!value) return;

    setWorkspaceSettings(
      (previous) => ({
        ...previous,
        [editingSetting]: value,
      })
    );

    setEditingSetting(null);
    setSettingDraft("");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "brandforge_logged_in"
    );

    localStorage.removeItem(
      "brandforge_user"
    );

    localStorage.removeItem(
      "brandforge_active_page"
    );

    closeMenus();

    if (typeof onBack === "function") {
      onBack();
    }
  };

  /* =========================================================
     BRAND MODAL
  ========================================================= */

  const renderBrandFormModal = () => {
    if (!showBrandForm) return null;

    return (
      <div
        className="brand-modal-overlay"
        onClick={() => {
          if (!savingBrand) {
            setShowBrandForm(false);
          }
        }}
      >
        <div
          className="brand-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
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
                Build a clear identity
                for your AI campaigns.
              </p>
            </div>

            <button
              className="modal-close"
              type="button"
              onClick={() =>
                setShowBrandForm(false)
              }
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
            className="brand-form"
            onSubmit={handleSaveBrand}
          >
            <div className="form-row">
              <div className="field">
                <label>
                  Brand Name *
                </label>

                <input
                  name="name"
                  value={brandForm.name}
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
                  name="target_audience"
                  value={
                    brandForm.target_audience
                  }
                  onChange={
                    handleBrandChange
                  }
                  placeholder="College students"
                />
              </div>
            </div>

            <div className="field">
              <label>
                Brand Description
              </label>

              <textarea
                name="description"
                rows="3"
                value={
                  brandForm.description
                }
                onChange={
                  handleBrandChange
                }
                placeholder="Describe your brand..."
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>
                  Brand Tone
                </label>

                <input
                  name="tone"
                  value={brandForm.tone}
                  onChange={
                    handleBrandChange
                  }
                  placeholder="Friendly, energetic..."
                />
              </div>

              <div className="field">
                <label>
                  Personality
                </label>

                <input
                  name="personality"
                  value={
                    brandForm.personality
                  }
                  onChange={
                    handleBrandChange
                  }
                  placeholder="Bold, modern..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>
                  Preferred Words
                </label>

                <input
                  name="preferred_words"
                  value={
                    brandForm.preferred_words
                  }
                  onChange={
                    handleBrandChange
                  }
                  placeholder="fresh, sustainable..."
                />
              </div>

              <div className="field">
                <label>
                  Words to Avoid
                </label>

                <input
                  name="words_to_avoid"
                  value={
                    brandForm.words_to_avoid
                  }
                  onChange={
                    handleBrandChange
                  }
                  placeholder="cheap, boring..."
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
                Brand Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleLogoUpload
                }
              />

              {brandForm.logo_url && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <img
                    src={
                      brandForm.logo_url
                    }
                    alt="Brand logo"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "14px",
                    }}
                  />

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setBrandForm(
                        (previous) => ({
                          ...previous,
                          logo_url: "",
                        })
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="brand-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowBrandForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingBrand}
              >
                <CheckCircle2 size={18} />

                {savingBrand
                  ? "Saving..."
                  : brandFormMode ===
                    "edit"
                  ? "Update Brand"
                  : "Create Brand"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  /* =========================================================
     OVERVIEW
  ========================================================= */

  const renderOverview = () => {
    return (
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
              Your AI-powered creative
              studio for brand-aligned
              campaigns and content.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              const element =
                document.querySelector(
                  ".ai-engine-card"
                );

              element?.scrollIntoView({
                behavior: "smooth",
              });
            }}
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
                Active campaigns
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
                AI generated content
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
              <Target size={20} />
            </div>

            <div className="stat-content">
              <span>Platforms</span>

              <strong>06</strong>

              <small>
                <TrendingUp size={13} />
                Connected channels
              </small>
            </div>

            <div className="platform-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
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
                Describe your campaign
                idea, choose your audience,
                select platforms and let AI
                generate content for your
                brand.
              </p>

              {!brand && (
                <div className="warning-message">
                  Create a brand before
                  generating campaigns.
                </div>
              )}

              <div className="idea-input-wrapper">
                <Sparkles size={17} />

                <textarea
                  value={idea}
                  onChange={(event) =>
                    setIdea(
                      event.target.value
                    )
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
                onClick={
                  handleGenerate
                }
                disabled={
                  generatingContent
                }
              >
                {generatingContent ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="spin"
                    />

                    Generating AI
                    Content...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />

                    Generate Campaign

                    <ArrowRight
                      size={17}
                    />
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

          <section className="white-panel recent-panel">
            <div className="panel-heading">
              <h3>
                Recent Campaigns
              </h3>

              <button
                className="view-link"
                onClick={() =>
                  setActivePage(
                    "Campaigns"
                  )
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
            ) : campaigns.length ===
              0 ? (
              <div className="empty-small">
                No campaigns yet.
              </div>
            ) : (
              <div className="recent-list">
                {campaigns
                  .slice(0, 5)
                  .map((campaign) => (
                    <div
                      className="recent-item"
                      key={campaign.id}
                    >
                      <div className="recent-item-icon">
                        <Megaphone
                          size={17}
                        />
                      </div>

                      <div className="recent-item-info">
                        <strong>
                          {
                            campaign.name
                          }
                        </strong>

                        <span>
                          {
                            campaign.platforms ||
                            "All Platforms"
                          }
                        </span>
                      </div>

                      <button
                        className="icon-button"
                        onClick={() =>
                          setSelectedCampaign(
                            campaign
                          )
                        }
                      >
                        <ChevronRight
                          size={17}
                        />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </>
    );
  };

  /* =========================================================
     BRAND DNA
  ========================================================= */

  const copyBrandVoiceProfile = async () => {
    if (!brand) return;

    const profileText = [
      `Brand: ${brand.name || "Brand"}`,
      `Who we speak to: ${brand.target_audience || "Not defined"}`,
      `How we sound: ${brand.tone || "Not defined"}`,
      `Our personality: ${brand.personality || "Not defined"}`,
      `Words we prefer: ${brand.preferred_words || "Not defined"}`,
      `Words we avoid: ${brand.words_to_avoid || "Not defined"}`,
      `Applied everywhere: Brand voice profile is applied to generated content.`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(profileText);
    } catch (error) {
      console.error("COPY BRAND VOICE ERROR:", error);
    }
  };

  const renderBrandDNA = () => {
    const brandPrimary = brand?.primary_color || "#1677FF";
    const brandSecondary = brand?.secondary_color || "#B9DCFF";

    return (
      <>
        <div className="page-heading brand-dna-heading">
          <div>
            <p className="eyebrow blue-eyebrow">BRAND INTELLIGENCE</p>
            <h1>Brand DNA</h1>
            <p>Your brand identity, personality and visual language in one place.</p>
          </div>

          <button
            className="primary-button brand-dna-edit-button"
            onClick={() => openEditBrandForm()}
          >
            <Pencil size={15} />
            {brand ? "Edit Brand" : "Create Brand"}
          </button>
        </div>

        {!brand ? (
          <div className="white-panel empty-state">
            <Sparkles size={42} />
            <h2>No brand created yet</h2>
            <p>Create your brand identity to unlock AI-powered campaigns.</p>
            <button className="primary-button" onClick={openCreateBrandForm}>
              <Plus size={18} />
              Create Your Brand
            </button>
          </div>
        ) : (
          <div className="brand-dna-page">
            <section className="brand-dna-logo-only">
              <div
                className="brand-dna-logo-circle"
                style={{ background: brandPrimary }}
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} />
                ) : (
                  <span>
                    {brand.name?.charAt(0)?.toUpperCase() || "B"}
                  </span>
                )}
              </div>
            </section>

            <div className="brand-dna-active-row">
              <div>
                <span className="brand-dna-active-label">ACTIVE BRAND</span>
                <h2>{brand.name}</h2>
                <p>
                  {brand.description ||
                    "Your brand profile is ready to guide every campaign and content asset."}
                </p>
              </div>

              <div className="brand-dna-active-badge">
                <CheckCircle2 size={14} />
                Active
              </div>
            </div>

            {brands.length > 0 && (
              <section className="brand-dna-all-brands">
                <div className="brand-dna-subheading">
                  <div>
                    <span className="brand-dna-section-kicker">YOUR BRANDS</span>
                    <h3>All created brands</h3>
                  </div>
                  <span className="brand-dna-brand-count">{brands.length} brand{brands.length === 1 ? "" : "s"}</span>
                </div>

                <div className="brand-dna-brand-list">
                  {brands.map((item) => {
                    const itemPrimary = item.primary_color || "#1677FF";
                    const isActive = String(item.id) === String(brand.id);

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`brand-dna-brand-card ${isActive ? "active" : ""}`}
                        onClick={() => setBrand(item)}
                      >
                        <div
                          className="brand-dna-brand-avatar"
                          style={{ background: itemPrimary }}
                        >
                          {item.logo_url ? (
                            <img src={item.logo_url} alt={item.name} />
                          ) : (
                            <span>{item.name?.charAt(0)?.toUpperCase() || "B"}</span>
                          )}
                        </div>

                        <div className="brand-dna-brand-info">
                          <strong>{item.name || "Untitled Brand"}</strong>
                          <span>{item.tone || "Tone not defined"}</span>
                        </div>

                        <div className="brand-dna-brand-status">
                          {isActive ? (
                            <>
                              <CheckCircle2 size={14} />
                              Active
                            </>
                          ) : (
                            "View"
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="brand-voice-profile-card">
              <div className="brand-voice-profile-header">
                <div>
                  <span className="brand-dna-section-kicker">BRAND VOICE PROFILE</span>
                  <h3>A reusable tone, personality and language guide applied to every generated content.</h3>
                </div>

                <div className="brand-voice-profile-actions">
                  <div className="brand-voice-completeness">
                    <span>PROFILE COMPLETENESS</span>
                    <strong>
                      {[
                        brand.target_audience,
                        brand.tone,
                        brand.personality,
                        brand.preferred_words,
                        brand.words_to_avoid,
                      ].filter(Boolean).length * 20 || 20}%
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="brand-voice-copy-button"
                    onClick={copyBrandVoiceProfile}
                  >
                    <Copy size={13} />
                    Copy Profile
                  </button>
                </div>
              </div>

              <div className="brand-voice-progress-track">
                <div
                  className="brand-voice-progress-fill"
                  style={{
                    width: `${[
                      brand.target_audience,
                      brand.tone,
                      brand.personality,
                      brand.preferred_words,
                      brand.words_to_avoid,
                    ].filter(Boolean).length * 20 || 20}%`,
                    background: `linear-gradient(90deg, ${brandPrimary}, ${brandSecondary})`,
                  }}
                />
              </div>

              <div className="brand-voice-grid">
                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon"><Target size={12} /></div>
                  <div>
                    <strong>Who we speak to</strong>
                    <span>{brand.target_audience || "Not defined"}</span>
                  </div>
                </div>

                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon"><Sparkles size={12} /></div>
                  <div>
                    <strong>How we sound</strong>
                    <span>{brand.tone || "Not defined"}</span>
                  </div>
                </div>

                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon"><Palette size={12} /></div>
                  <div>
                    <strong>Our personality</strong>
                    <span>{brand.personality || "Not defined"}</span>
                  </div>
                </div>

                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon brand-voice-item-icon-green"><CheckCircle2 size={12} /></div>
                  <div>
                    <strong>Words we prefer</strong>
                    <span>{brand.preferred_words || "Not defined"}</span>
                  </div>
                </div>

                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon brand-voice-item-icon-red"><X size={12} /></div>
                  <div>
                    <strong>Words we avoid</strong>
                    <span>{brand.words_to_avoid || "Not defined"}</span>
                  </div>
                </div>

                <div className="brand-voice-item">
                  <div className="brand-voice-item-icon brand-voice-item-icon-purple"><Sparkles size={12} /></div>
                  <div>
                    <strong>Applied everywhere</strong>
                    <span>Used for your campaigns, content and quality checks.</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="brand-dna-detail-stack">
              <div className="brand-dna-detail-card">
                <div className="brand-dna-detail-icon"><Target size={13} /></div>
                <div>
                  <strong>Target Audience</strong>
                  <span>{brand.target_audience || "Not defined"}</span>
                </div>
              </div>

              <div className="brand-dna-detail-card">
                <div className="brand-dna-detail-icon"><Sparkles size={13} /></div>
                <div>
                  <strong>Brand Tone</strong>
                  <span>{brand.tone || "Not defined"}</span>
                </div>
              </div>

              <div className="brand-dna-detail-card">
                <div className="brand-dna-detail-icon"><Palette size={13} /></div>
                <div>
                  <strong>Personality</strong>
                  <span>{brand.personality || "Not defined"}</span>
                </div>
              </div>

              <div className="brand-dna-detail-card">
                <div className="brand-dna-detail-icon"><Sparkles size={13} /></div>
                <div>
                  <strong>Preferred Words</strong>
                  <span>{brand.preferred_words || "Not defined"}</span>
                </div>
              </div>

              <div className="brand-dna-detail-card">
                <div className="brand-dna-detail-icon"><X size={13} /></div>
                <div>
                  <strong>Words to Avoid</strong>
                  <span>{brand.words_to_avoid || "Not defined"}</span>
                </div>
              </div>

              <div className="brand-dna-detail-card brand-dna-color-card">
                <div className="brand-dna-detail-icon"><Palette size={13} /></div>
                <div>
                  <strong>Brand Colors</strong>
                  <div className="brand-dna-color-swatches">
                    <span style={{ background: brandPrimary }} />
                    <span style={{ background: brandSecondary }} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </>
    );
  };

  /* =========================================================
     CAMPAIGNS
  ========================================================= */

  const renderCampaigns = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow blue-eyebrow">
              CAMPAIGN STUDIO
            </p>

            <h1>Campaigns</h1>

            <p>
              Create and manage your
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
            Create Campaign
          </button>
        </div>

        {campaignError && (
          <div className="error-message">
            {campaignError}
          </div>
        )}

        {loadingCampaigns ? (
          <div className="white-panel loading-state">
            Loading campaigns...
          </div>
        ) : campaigns.length ===
          0 ? (
          <div className="white-panel empty-state">
            <Megaphone size={42} />

            <h2>
              No campaigns yet
            </h2>

            <p>
              Start by creating a
              campaign from the AI
              Campaign Engine.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage(
                  "Overview"
                )
              }
            >
              <Plus size={18} />
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="campaign-list">
            {campaigns.map(
              (campaign) => (
                <div
                  className="white-panel campaign-card"
                  key={campaign.id}
                >
                  <div className="campaign-card-top">
                    <div className="campaign-card-icon">
                      <Megaphone
                        size={21}
                      />
                    </div>

                    <div>
                      <span className="campaign-status">
                        {campaign.status ||
                          "draft"}
                      </span>

                      <h3>
                        {
                          campaign.name
                        }
                      </h3>
                    </div>
                  </div>

                  <p>
                    {campaign.idea ||
                      campaign.objective ||
                      "Campaign idea"}
                  </p>

                  <div className="campaign-meta">
                    <span>
                      <Target
                        size={15}
                      />
                      {
                        campaign.target_audience ||
                        "General audience"
                      }
                    </span>

                    <span>
                      <LayoutGrid
                        size={15}
                      />
                      {
                        campaign.platforms ||
                        "All Platforms"
                      }
                    </span>
                  </div>

                  <div className="campaign-actions">
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setSelectedCampaign(
                          campaign
                        )
                      }
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        regenerateContent(campaign.id)
                      }
                      disabled={
                        regeneratingCampaignId === Number(campaign.id)
                      }
                    >
                      <RefreshCw
                        size={16}
                        className={
                          regeneratingCampaignId === Number(campaign.id)
                            ? "spin"
                            : ""
                        }
                      />
                      {regeneratingCampaignId === Number(campaign.id)
                        ? "Regenerating..."
                        : "Regenerate"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </>
    );
  };

  /* =========================================================
     CONTENT
  ========================================================= */

  const renderContent = () => {
    const contentPlatforms = [
      "All",
      "Instagram",
      "LinkedIn",
      "X",
    ];

    const filteredContents =
      contentFilter === "All"
        ? contents
        : contents.filter((item) =>
            String(item.platform || "")
              .toLowerCase()
              .includes(contentFilter.toLowerCase())
          );

    const activeCampaignName =
      selectedCampaign?.name ||
      (contents.length > 0
        ? campaigns.find(
            (campaign) =>
              campaign.id === contents[0]?.campaign_id
          )?.name
        : null);

    return (
      <>
        <div className="content-studio-hero">
          <div>
            <p className="eyebrow blue-eyebrow">
              CONTENT STUDIO
            </p>

            <h1>One idea. Every platform.</h1>

            <p className="content-studio-description">
              Review, refine and reuse brand-aligned
              content across Instagram, LinkedIn and X.
            </p>

            {activeCampaignName && (
              <div className="content-campaign-context">
                <span>Campaign</span>
                <strong>{activeCampaignName}</strong>
              </div>
            )}
          </div>

          <button
            className="primary-button"
            onClick={openCreateContentForm}
          >
            <Plus size={18} />
            Add Content
          </button>
        </div>

        <div className="content-studio-toolbar">
          <div className="platform-filter-tabs">
            {contentPlatforms.map((platformName) => (
              <button
                key={platformName}
                type="button"
                className={`platform-filter ${
                  contentFilter === platformName
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setContentFilter(platformName)
                }
              >
                {platformName === "All"
                  ? "All Content"
                  : platformName}
                <span>
                  {platformName === "All"
                    ? contents.length
                    : contents.filter((item) =>
                        String(item.platform || "")
                          .toLowerCase()
                          .includes(platformName.toLowerCase())
                      ).length}
                </span>
              </button>
            ))}
          </div>

          <div className="content-studio-summary">
            <Sparkles size={15} />
            <span>
              {filteredContents.length} platform-ready asset
              {filteredContents.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {contentError && (
          <div className="error-message">
            {contentError}
          </div>
        )}

        {loadingContent ? (
          <div className="white-panel loading-state">
            Loading content...
          </div>
        ) : contents.length === 0 ? (
          <div className="white-panel empty-state">
            <LayoutGrid size={42} />

            <h2>No content yet</h2>

            <p>
              Generate a campaign to create your first AI
              content.
            </p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="white-panel empty-state content-filter-empty">
            <LayoutGrid size={38} />

            <h2>No {contentFilter} content yet</h2>

            <p>
              Generate or add content for this platform to
              see it here.
            </p>

            <button
              className="secondary-button"
              onClick={() => setContentFilter("All")}
            >
              View all content
            </button>
          </div>
        ) : (
          <div className="content-grid content-studio-grid">
            {filteredContents.map((item) => (
              <div
                className="white-panel content-card"
                key={item.id}
              >
                <div className="content-card-header">
                  <div>
                    <span className="content-platform">
                      {item.platform ||
                        "Platform"}
                    </span>

                    <h3>
                      {item.content_type ||
                        "Content"}
                    </h3>
                  </div>

                  <span className="content-status">
                    {item.status ||
                      "draft"}
                  </span>
                </div>

                <div className="content-preview">
                  {item.content ||
                    "No content available."}
                </div>

                {(() => {
                  const quality = analyzeContent(item);

                  return (
                    <div className="quality-checker">
                      <div className="quality-header">
                        <div>
                          <span className="quality-eyebrow">
                            AI QUALITY CHECK
                          </span>
                          <h4>Content Health</h4>
                        </div>

                        <div
                          className={`quality-score ${
                            quality.score >= 85
                              ? "quality-good"
                              : quality.score >= 65
                              ? "quality-warning"
                              : "quality-danger"
                          }`}
                        >
                          {quality.score}
                          <span>/100</span>
                        </div>
                      </div>

                      <div className="quality-progress">
                        <div
                          className={`quality-progress-fill ${
                            quality.score >= 85
                              ? "quality-good-fill"
                              : quality.score >= 65
                              ? "quality-warning-fill"
                              : "quality-danger-fill"
                          }`}
                          style={{ width: `${quality.score}%` }}
                        />
                      </div>

                      <div className="quality-list">
                        <div className="quality-row">
                          <span>
                            {quality.brandVoiceGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Brand Voice
                          </span>
                          <strong
                            className={
                              quality.brandVoiceGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.brandVoiceGood ? "Aligned" : "Review"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.lengthGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Length
                          </span>
                          <strong
                            className={
                              quality.lengthGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.lengthGood ? "Good" : "Too Long"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.hookGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Hook
                          </span>
                          <strong
                            className={
                              quality.hookGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.hookGood ? "Strong" : "Needs Work"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.ctaGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            CTA
                          </span>
                          <strong
                            className={
                              quality.ctaGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.ctaGood ? "Present" : "Missing"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.forbiddenWordsGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Brand Words
                          </span>
                          <strong
                            className={
                              quality.forbiddenWordsGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.forbiddenWordsGood
                              ? "Clean"
                              : "Check Words"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.audienceGood ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Audience Fit
                          </span>
                          <strong
                            className={
                              quality.audienceGood
                                ? "quality-ok"
                                : "quality-review"
                            }
                          >
                            {quality.audienceGood ? "Good" : "Review"}
                          </strong>
                        </div>

                        <div className="quality-row">
                          <span>
                            {quality.toneAligned ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <span className="quality-alert-icon">!</span>
                            )}
                            Tone
                          </span>
                          <strong
                            className={
                              quality.toneAligned
                                ? "quality-ok"
                                : "quality-review"
                            }
                            style={{ textTransform: "capitalize" }}
                          >
                            {quality.detectedTone}
                          </strong>
                        </div>
                      </div>

                      {quality.recommendations.length > 0 && (
                        <div
                          className="quality-recommendations"
                          style={{
                            marginTop: "11px",
                            padding: "11px 12px",
                            borderRadius: "10px",
                            background: "#f5f9ff",
                            border: "1px solid #dfeaf7",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: "7px",
                              color: "#234773",
                              fontSize: "9px",
                              fontWeight: 800,
                            }}
                          >
                            Recommended improvements
                          </strong>
                          {quality.recommendations.slice(0, 3).map(
                            (recommendation, index) => (
                              <div
                                className="quality-recommendation"
                                key={`${recommendation}-${index}`}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "7px",
                                  marginTop: index === 0 ? 0 : "5px",
                                  color: "#617996",
                                  fontSize: "8px",
                                  lineHeight: 1.5,
                                }}
                              >
                                <span
                                  style={{
                                    color: "#1677ff",
                                    fontWeight: 900,
                                  }}
                                >
                                  •
                                </span>
                                <span>{recommendation}</span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {quality.detectedForbiddenWords.length > 0 && (
                        <div className="quality-warning-box">
                          <strong>Brand voice warning</strong>
                          <span>
                            Avoid: {quality.detectedForbiddenWords.join(", ")}
                          </span>
                        </div>
                      )}

                      <div className="quality-footer">
                        <span>
                          {quality.characterCount} / {quality.maxLength} characters
                        </span>
                        <span>
                          {quality.detectedPreferredWords.length > 0
                            ? "Brand language detected"
                            : "AI review complete"}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="content-actions">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      openContentEditor(item)
                    }
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="secondary-button content-copy-button"
                    onClick={() => copyContent(item)}
                  >
                    <Copy size={15} />
                    {copiedContentId === item.id
                      ? "Copied"
                      : "Copy"}
                  </button>

                  <button
                    type="button"
                    className="secondary-button content-regenerate-button"
                    onClick={() => regenerateContent(item)}
                    disabled={
                      regeneratingContentId === String(item.id) ||
                      regeneratingCampaignId === Number(item.campaign_id)
                    }
                  >
                    <RefreshCw
                      size={15}
                      className={
                        regeneratingContentId === String(item.id)
                          ? "button-spin"
                          : ""
                      }
                    />
                    {regeneratingContentId === String(item.id)
                      ? "Regenerating..."
                      : "Regenerate"}
                  </button>

                  <button
                    type="button"
                    className="icon-danger-button"
                    title="Delete content"
                    aria-label="Delete content"
                    onClick={() =>
                      deleteContent(item.id)
                    }
                    disabled={
                      deletingContentId === item.id
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  /* =========================================================
     QUALITY & TONE CHECKER
  ========================================================= */

  const renderQualityToneChecker = () => {
    const quality = analyzeContent({
      content: qualityDraft,
      platform: qualityPlatform,
    });

    const scoreClass =
      quality.score >= 80
        ? "quality-tool-score-good"
        : quality.score >= 60
          ? "quality-tool-score-warning"
          : "quality-tool-score-danger";

    const checks = [
      {
        label: "Brand voice",
        good: quality.brandVoiceGood,
        value: quality.brandVoiceGood ? "PASS" : "REVIEW",
        description: quality.brandVoiceGood
          ? "Preferred language is represented."
          : "The copy needs stronger brand-language alignment.",
      },
      {
        label: "Hook",
        good: quality.hookGood,
        value: quality.hookGood ? "PASS" : "REVIEW",
        description: quality.hookGood
          ? "The opening is strong enough to stop the scroll."
          : "Strengthen the opening with a clearer hook or benefit.",
      },
      {
        label: "CTA",
        good: quality.ctaGood,
        value: quality.ctaGood ? "PASS" : "REVIEW",
        description: quality.ctaGood
          ? "A clear action is suggested."
          : "Add a clear next action for the audience.",
      },
      {
        label: "Audience fit",
        good: quality.audienceGood,
        value: quality.audienceGood ? "PASS" : "REVIEW",
        description: quality.audienceGood
          ? "The copy reflects the target audience."
          : "Add audience-specific language or benefits.",
      },
      {
        label: "No forbidden words",
        good: quality.forbiddenWordsGood,
        value: quality.forbiddenWordsGood ? "PASS" : "REVIEW",
        description: quality.forbiddenWordsGood
          ? "No words from the avoid list were detected."
          : `Avoid: ${quality.detectedForbiddenWords.join(", ")}.`,
      },
      {
        label: "Length",
        good: quality.lengthGood,
        value: quality.lengthGood ? "PASS" : "REVIEW",
        description: `${quality.characterCount} / ${quality.maxLength} characters.`,
      },
    ];

    return (
      <div className="quality-tool-page">
        <div className="quality-tool-heading">
          <div>
            <p className="quality-tool-eyebrow">AI QUALITY & TONE</p>
            <h1>Quality Checker</h1>
            <p>
              Check brand voice, tone, audience fit, CTA, forbidden words and
              platform length before publishing.
            </p>
          </div>

          <div className="quality-tool-brand-pill">
            <ShieldCheck size={15} />
            <span>{brand?.name || "BrandForge"}</span>
          </div>
        </div>

        {contentError && (
          <div className="error-message">{contentError}</div>
        )}

        <div className="quality-tool-layout">
          <section className="quality-tool-input-card">
            <div className="quality-tool-card-heading">
              <div>
                <span className="quality-tool-card-label">CHECK CONTENT</span>
                <strong>Paste or write your content</strong>
              </div>

              <button
                type="button"
                className="quality-tool-latest-button"
                onClick={useLatestContentForQuality}
                disabled={!contents.length}
              >
                <RefreshCw size={14} />
                Use latest content
              </button>
            </div>

            <div className="quality-tool-platform-label">PLATFORM</div>
            <div className="quality-tool-platforms" role="tablist" aria-label="Platform">
              {["Instagram", "LinkedIn", "X"].map((platformName) => (
                <button
                  key={platformName}
                  type="button"
                  role="tab"
                  aria-selected={qualityPlatform === platformName}
                  className={`quality-tool-platform-button ${
                    qualityPlatform === platformName ? "active" : ""
                  }`}
                  onClick={() => setQualityPlatform(platformName)}
                >
                  {platformName}
                </button>
              ))}
            </div>

            <textarea
              className="quality-tool-textarea"
              value={qualityDraft}
              onChange={(event) => setQualityDraft(event.target.value)}
              placeholder="Paste or write your content here..."
              spellCheck="true"
            />

            <div className="quality-tool-textarea-footer">
              <span>{quality.characterCount} characters</span>
              <span>Target: {qualityPlatform}</span>
            </div>
          </section>

          <section className="quality-tool-analysis-card">
            <div className="quality-tool-analysis-heading">
              <div>
                <span className="quality-tool-card-label">LIVE ANALYSIS</span>
                <strong>Content Health</strong>
              </div>

              <div className={`quality-tool-score ${scoreClass}`}>
                <span>{quality.score}</span>
                <small>/100</small>
              </div>
            </div>

            <div className="quality-tool-progress-track">
              <div
                className="quality-tool-progress-fill"
                style={{ width: `${quality.score}%` }}
              />
            </div>

            <div className="quality-tool-checks">
              {checks.map((check) => (
                <div className="quality-tool-check" key={check.label}>
                  <div className={`quality-tool-check-icon ${check.good ? "pass" : "review"}`}>
                    {check.good ? <CheckCircle2 size={15} /> : <span>!</span>}
                  </div>

                  <div className="quality-tool-check-copy">
                    <strong>{check.label}</strong>
                    <span>{check.description}</span>
                  </div>

                  <span className={`quality-tool-check-status ${check.good ? "pass" : "review"}`}>
                    {check.value}
                  </span>
                </div>
              ))}
            </div>

            {quality.detectedPreferredWords.length > 0 && (
              <div className="quality-tool-preferred">
                <strong>Preferred words detected</strong>
                <span>{quality.detectedPreferredWords.join(", ")}</span>
              </div>
            )}

          </section>
        </div>
      </div>
    );
  };

  /* =========================================================
     SETTINGS
  ========================================================= */

  const renderSettings = () => {
    const settings = [
      {
        key: "workspaceName",
        label: "Workspace Name",
        description:
          "The name shown across your BrandForge workspace.",
      },
      {
        key: "aiCreativity",
        label: "AI Creativity",
        description:
          "Controls the preferred creativity level for generated content.",
      },
      {
        key: "connectedPlatforms",
        label: "Connected Platforms",
        description:
          "Platforms currently connected to this workspace.",
      },
      {
        key: "brandIntelligence",
        label: "Brand Intelligence",
        description:
          "How BrandForge handles brand intelligence.",
      },
    ];

    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow blue-eyebrow">
              WORKSPACE
            </p>

            <h1>Settings</h1>

            <p>
              Manage your BrandForge
              workspace preferences.
            </p>
          </div>
        </div>

        <div className="settings-list">
          {settings.map(
            (setting) => (
              <div
                className="white-panel setting-card"
                key={setting.key}
              >
                <div>
                  <h3>
                    {setting.label}
                  </h3>

                  <p>
                    {setting.description}
                  </p>

                  {editingSetting ===
                  setting.key ? (
                    <input
                      className="setting-input"
                      value={
                        settingDraft
                      }
                      onChange={(event) =>
                        setSettingDraft(
                          event.target
                            .value
                        )
                      }
                    />
                  ) : (
                    <strong>
                      {
                        workspaceSettings[
                          setting.key
                        ]
                      }
                    </strong>
                  )}
                </div>

                {editingSetting ===
                setting.key ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setEditingSetting(
                          null
                        );
                        setSettingDraft(
                          ""
                        );
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={
                        saveSetting
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="secondary-button"
                    onClick={() =>
                      startSettingEdit(
                        setting.key
                      )
                    }
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </>
    );
  };

  /* =========================================================
     PAGE ROUTER
  ========================================================= */

  const renderPage = () => {
    switch (activePage) {
      case "Brand DNA":
        return renderBrandDNA();

      case "Campaigns":
        return renderCampaigns();

      case "Content":
        return renderContent();

      case "Quality Checker":
        return renderQualityToneChecker();

      case "Settings":
        return renderSettings();

      case "Overview":
      default:
        return renderOverview();
    }
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

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
                  activePage ===
                  item.name
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActivePage(
                    item.name
                  );
                  closeMenus();
                }}
              >
                <Icon size={19} />

                <span>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() =>
              setActivePage("Settings")
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="sidebar-back"
            onClick={handleLogout}
          >
            <ArrowLeft size={17} />
            Back / Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              {activePage}
            </div>
          </div>

          <div className="topbar-right">

            <div className="search-box">
              <Search size={17} />

              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSelectedCampaign(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch(event.currentTarget.value);
                  }
                }}
                placeholder="Search..."
                aria-label="Search BrandForge"
              />
            </div>

            <div className="notification-wrapper">
              <button
                type="button"
                className={`topbar-icon-button ${
                  showNotifications ? "active" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowNotifications((previous) => !previous);
                  setShowProfileMenu(false);
                }}
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={19} />

                {(contents.length > 0 || campaigns.length > 0) && (
                  <span className="notification-dot" />
                )}
              </button>

              {showNotifications && (
                <div
                  className="topbar-dropdown notification-dropdown"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="dropdown-header">
                    <div>
                      <strong>Notifications</strong>
                      <span className="notification-count">
                        {contents.length + campaigns.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {contents.length === 0 && campaigns.length === 0 ? (
                    <div className="notification-empty">
                      <Bell size={20} />
                      <strong>You're all caught up</strong>
                      <p>No new campaign or content notifications.</p>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {campaigns.slice(0, 3).map((campaign) => (
                        <button
                          type="button"
                          className="notification-item"
                          key={`campaign-${campaign.id}`}
                          onClick={() => {
                            setActivePage("Campaigns");
                            setSelectedCampaign(campaign);
                            setShowNotifications(false);
                          }}
                        >
                          <span className="notification-icon">
                            <Megaphone size={15} />
                          </span>
                          <span>
                            <strong>Campaign ready</strong>
                            <p>{campaign.name || "New campaign created."}</p>
                          </span>
                        </button>
                      ))}

                      {contents.slice(0, 3).map((item) => (
                        <button
                          type="button"
                          className="notification-item"
                          key={`content-${item.id}`}
                          onClick={() => {
                            setActivePage("Content");
                            setShowNotifications(false);
                          }}
                        >
                          <span className="notification-icon">
                            <Sparkles size={15} />
                          </span>
                          <span>
                            <strong>Content generated</strong>
                            <p>
                              {item.platform || "Platform"} content is ready to review.
                            </p>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="topbar-menu-wrapper">
              <button
                className="profile"
                onClick={() => {
                  setShowProfileMenu(
                    (previous) =>
                      !previous
                  );

                  setShowNotifications(
                    false
                  );
                }}
              >
                <div className="profile-avatar">
                  <User size={18} />
                </div>

                <div>
                  <strong>
                    Creator
                  </strong>

                  <span>
                    Workspace
                  </span>
                </div>

                <ChevronRight
                  size={15}
                />
              </button>

              {showProfileMenu && (
                <div className="topbar-dropdown profile-dropdown">
                  <button
                    type="button"
                    className="profile-dropdown-profile-button"
                    onClick={openCreatorProfile}
                  >
                    <User size={16} />
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      setActivePage(
                        "Brand DNA"
                      );
                      closeMenus();
                    }}
                  >
                    <Sparkles
                      size={16}
                    />
                    Brand DNA
                  </button>

                  <button
                    onClick={() => {
                      setActivePage(
                        "Campaigns"
                      );
                      closeMenus();
                    }}
                  >
                    <Megaphone
                      size={16}
                    />
                    Campaigns
                  </button>

                  <button
                    onClick={() => {
                      setActivePage(
                        "Content"
                      );
                      closeMenus();
                    }}
                  >
                    <LayoutGrid
                      size={16}
                    />
                    Content
                  </button>

                  <button
                    onClick={() => {
                      setActivePage(
                        "Quality Checker"
                      );
                      closeMenus();
                    }}
                  >
                    <CheckCircle2
                      size={16}
                    />
                    Quality Checker
                  </button>

                  <button
                    onClick={() => {
                      setActivePage(
                        "Settings"
                      );
                      closeMenus();
                    }}
                  >
                    <Settings
                      size={16}
                    />
                    Settings
                  </button>

                  <button
                    onClick={
                      handleLogout
                    }
                  >
                    <ArrowLeft
                      size={16}
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE */}

        <div className="page-content">
          {renderPage()}
        </div>
      </main>

      {/* BRAND MODAL */}

      {renderBrandFormModal()}

      {/* CONTENT EDITOR */}

      {editingContent && (
        <div
          className="brand-modal-overlay content-editor-overlay"
          onClick={closeContentEditor}
        >
          <div
            className="content-editor-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="content-editor-header">
              <div>
                <div className="content-editor-title-row">
                  <span className="content-editor-badge">CONTENT EDITOR</span>
                  <span className="content-editor-platform">
                    {editingContent.platform || "Platform"}
                  </span>
                </div>
                <h2>Refine your content</h2>
                <p>Polish the message, check its quality, and save a publish-ready version.</p>
              </div>

              <button
                className="modal-close"
                onClick={closeContentEditor}
                disabled={savingEditedContent || editorAssistLoading}
                aria-label="Close editor"
              >
                <X size={20} />
              </button>
            </div>

            {contentError && (
              <div className="error-message">
                {contentError}
              </div>
            )}

            <div className="content-editor-layout">
              <section className="content-editor-workspace">
                <div className="content-editor-section-heading">
                  <div>
                    <span>EDITOR</span>
                    <strong>Write and refine</strong>
                  </div>
                  <span className="editor-status-dot">Live</span>
                </div>

                <div className="content-editor-textarea-wrap">
                  <textarea
                    className="content-editor-textarea"
                    value={editContentText}
                    onChange={(event) => {
                      setEditContentText(event.target.value);
                      setEditorNotice("");
                      setContentError("");
                    }}
                    placeholder="Write or refine your content here..."
                    spellCheck="true"
                    autoFocus
                  />
                  <div className="content-editor-counter">
                    <span>{editContentText.length.toLocaleString()} characters</span>
                    <span>Limit: {getEditorLimit(editingContent.platform).toLocaleString()}</span>
                  </div>
                </div>

                <div className="editor-assist-panel">
                  <div className="editor-assist-heading">
                    <div>
                      <WandSparkles size={16} />
                      <strong>Quick Assist</strong>
                    </div>
                    <span>Fast local refinements</span>
                  </div>

                  <div className="editor-assist-actions">
                    <button
                      type="button"
                      onClick={() => improveEditorText("hook")}
                      disabled={editorAssistLoading}
                    >
                      <Sparkles size={14} />
                      Improve Hook
                    </button>
                    <button
                      type="button"
                      onClick={() => improveEditorText("cta")}
                      disabled={editorAssistLoading}
                    >
                      <Target size={14} />
                      Add CTA
                    </button>
                    <button
                      type="button"
                      onClick={() => improveEditorText("shorten")}
                      disabled={editorAssistLoading}
                    >
                      <ArrowLeft size={14} />
                      Shorten
                    </button>
                    <button
                      type="button"
                      onClick={() => improveEditorText("clean")}
                      disabled={editorAssistLoading}
                    >
                      <CheckCircle2 size={14} />
                      Clean Up
                    </button>
                    <button
                      type="button"
                      onClick={regenerateEditorSection}
                      disabled={editorAssistLoading}
                    >
                      <RefreshCw size={14} />
                      Regenerate Section
                    </button>
                  </div>
                </div>

                {editorNotice && (
                  <div className="editor-notice">
                    <CheckCircle2 size={15} />
                    <span>{editorNotice}</span>
                  </div>
                )}
              </section>

              <aside className="content-editor-sidebar">
                <div className="editor-preview-card">
                  <div className="editor-preview-header">
                    <div>
                      <span>LIVE PREVIEW</span>
                      <strong>{editingContent.platform || "Content"}</strong>
                    </div>
                    <Eye size={17} />
                  </div>
                  <div className="editor-preview-body">
                    {editContentText.trim() || "Your edited content will appear here."}
                  </div>
                </div>

                <div className="editor-quality-card">
                  {(() => {
                    const editorAnalysis = analyzeContent({
                      ...editingContent,
                      content: editContentText,
                    });
                    const scoreClass =
                      editorAnalysis.score >= 80
                        ? "quality-good"
                        : editorAnalysis.score >= 60
                          ? "quality-warning"
                          : "quality-danger";

                    return (
                      <>
                        <div className="editor-quality-heading">
                          <div>
                            <span>AI QUALITY CHECK</span>
                            <strong>Content health</strong>
                          </div>
                          <div className={`editor-quality-score ${scoreClass}`}>
                            {editorAnalysis.score}
                            <small>/100</small>
                          </div>
                        </div>

                        <div className="editor-quality-progress">
                          <div style={{ width: `${editorAnalysis.score}%` }} />
                        </div>

                        <div className="editor-quality-list">
                          <div className="editor-quality-row">
                            <span>Length</span>
                            <strong className={editorAnalysis.lengthGood ? "ok" : "warn"}>
                              {editorAnalysis.characterCount <= editorAnalysis.maxLength ? "Good" : "Too long"}
                            </strong>
                          </div>
                          <div className="editor-quality-row">
                            <span>Hook</span>
                            <strong className={editorAnalysis.hookGood ? "ok" : "warn"}>
                              {editorAnalysis.hookGood ? "Strong" : "Review"}
                            </strong>
                          </div>
                          <div className="editor-quality-row">
                            <span>CTA</span>
                            <strong className={editorAnalysis.ctaGood ? "ok" : "warn"}>
                              {editorAnalysis.ctaGood ? "Present" : "Add one"}
                            </strong>
                          </div>
                          <div className="editor-quality-row">
                            <span>Brand Voice</span>
                            <strong className={editorAnalysis.brandVoiceGood ? "ok" : "warn"}>
                              {editorAnalysis.brandVoiceGood ? "Aligned" : "Review"}
                            </strong>
                          </div>
                          <div className="editor-quality-row">
                            <span>Audience Fit</span>
                            <strong className={editorAnalysis.audienceGood ? "ok" : "warn"}>
                              {editorAnalysis.audienceGood ? "Aligned" : "Review"}
                            </strong>
                          </div>
                          <div className="editor-quality-row">
                            <span>Tone</span>
                            <strong
                              className={editorAnalysis.toneAligned ? "ok" : "warn"}
                              style={{ textTransform: "capitalize" }}
                            >
                              {editorAnalysis.detectedTone}
                            </strong>
                          </div>
                        </div>

                        {editorAnalysis.recommendations.length > 0 && (
                          <div
                            className="editor-quality-recommendations"
                            style={{
                              marginTop: "10px",
                              padding: "10px 11px",
                              borderRadius: "10px",
                              background: "#f5f9ff",
                              border: "1px solid #dfeaf7",
                            }}
                          >
                            <strong
                              style={{
                                display: "block",
                                marginBottom: "6px",
                                color: "#234773",
                                fontSize: "9px",
                              }}
                            >
                              Recommended improvements
                            </strong>
                            {editorAnalysis.recommendations.slice(0, 2).map(
                              (recommendation, index) => (
                                <div
                                  key={`${recommendation}-${index}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "6px",
                                    marginTop: index === 0 ? 0 : "5px",
                                    color: "#617996",
                                    fontSize: "8px",
                                    lineHeight: 1.45,
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#1677ff",
                                      fontWeight: 900,
                                    }}
                                  >
                                    •
                                  </span>
                                  <span>{recommendation}</span>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {editorAnalysis.detectedForbiddenWords.length > 0 && (
                          <div className="editor-quality-warning">
                            Avoid: {editorAnalysis.detectedForbiddenWords.join(", ")}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </aside>
            </div>

            <div className="content-editor-footer">
              <div>
                <span className="editor-footer-dot" />
                Changes are saved to your campaign content.
              </div>
              <div className="brand-form-actions">
                <button
                  className="secondary-button"
                  onClick={closeContentEditor}
                  disabled={savingEditedContent || editorAssistLoading}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={saveEditedContent}
                  disabled={savingEditedContent || editorAssistLoading}
                >
                  <CheckCircle2 size={17} />
                  {savingEditedContent ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CONTENT */}

      {showContentForm && (
        <div
          className="brand-modal-overlay"
          onClick={() =>
            setShowContentForm(false)
          }
        >
          <div
            className="brand-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="brand-modal-header">
              <div>
                <p className="eyebrow">
                  CONTENT STUDIO
                </p>

                <h2>
                  Add Content
                </h2>

                <p>
                  Create a content asset
                  manually.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowContentForm(
                    false
                  )
                }
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
              className="brand-form"
              onSubmit={
                handleCreateContent
              }
            >
              <div className="field">
                <label>
                  Campaign
                </label>

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
                    Select Campaign
                  </option>

                  {campaigns.map(
                    (campaign) => (
                      <option
                        key={
                          campaign.id
                        }
                        value={
                          campaign.id
                        }
                      >
                        {
                          campaign.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>
                    Platform
                  </label>

                  <select
                    name="platform"
                    value={
                      contentForm.platform
                    }
                    onChange={
                      handleContentChange
                    }
                  >
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
                      Facebook
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label>
                    Content Type
                  </label>

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

                    <option>
                      Caption
                    </option>

                    <option>
                      Ad Copy
                    </option>

                    <option>
                      LinkedIn Post
                    </option>

                    <option>
                      Announcement
                    </option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>
                  Content
                </label>

                <textarea
                  name="content"
                  rows="10"
                  value={
                    contentForm.content
                  }
                  onChange={
                    handleContentChange
                  }
                  placeholder="Write your content here..."
                  required
                />
              </div>

              <div className="brand-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowContentForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    savingContent
                  }
                >
                  <CheckCircle2
                    size={17}
                  />

                  {savingContent
                    ? "Saving..."
                    : "Create Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATOR PROFILE */}

      {showCreatorProfile && (
        <div
          className="creator-profile-overlay"
          onClick={closeCreatorProfile}
        >
          <div
            className="creator-profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="creator-profile-close"
              onClick={closeCreatorProfile}
              aria-label="Close profile"
            >
              <X size={20} />
            </button>

            <div className="creator-profile-hero">
              <div className="creator-profile-avatar">
                <User size={30} />
              </div>
              <div>
                <p className="eyebrow blue-eyebrow">
                  CREATOR PROFILE
                </p>
                <h2>
                  {creatorProfile?.name || "Creator"}
                </h2>
                <p>
                  {creatorProfile?.email || "Account email not available"}
                </p>
              </div>
            </div>

            <div className="creator-profile-grid">
              <div className="creator-profile-card">
                <span>Role</span>
                <strong>Creator</strong>
              </div>

              <div className="creator-profile-card">
                <span>Workspace</span>
                <strong>{workspaceSettings.workspaceName}</strong>
              </div>

              <div className="creator-profile-card">
                <span>Status</span>
                <strong className="creator-profile-status">Active</strong>
              </div>

              <div className="creator-profile-card">
                <span>AI Creativity</span>
                <strong>{workspaceSettings.aiCreativity}</strong>
              </div>
            </div>

            <div className="creator-profile-footer">
              <div>
                <CheckCircle2 size={16} />
                <span>Your BrandForge workspace is active and ready.</span>
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={closeCreatorProfile}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMPAIGN DETAILS */}

      {selectedCampaign && (
        <div
          className="campaign-details-overlay"
          onClick={() =>
            setSelectedCampaign(null)
          }
        >
          <div
            className="campaign-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="campaign-details-close"
              onClick={() =>
                setSelectedCampaign(
                  null
                )
              }
            >
              <X size={20} />
            </button>

            <p className="eyebrow blue-eyebrow">
              CAMPAIGN DETAILS
            </p>

            <h2>
              {
                selectedCampaign.name
              }
            </h2>

            <p>
              {
                selectedCampaign.idea
              }
            </p>

            <div className="campaign-details-grid">
              <div>
                <strong>
                  Objective
                </strong>

                <span>
                  {
                    selectedCampaign.objective ||
                    "—"
                  }
                </span>
              </div>

              <div>
                <strong>
                  Target Audience
                </strong>

                <span>
                  {
                    selectedCampaign.target_audience ||
                    "—"
                  }
                </span>
              </div>

              <div>
                <strong>
                  Key Message
                </strong>

                <span>
                  {
                    selectedCampaign.key_message ||
                    "—"
                  }
                </span>
              </div>

              <div>
                <strong>
                  Platforms
                </strong>

                <span>
                  {
                    selectedCampaign.platforms ||
                    "—"
                  }
                </span>
              </div>

              <div>
                <strong>
                  Status
                </strong>

                <span>
                  {
                    selectedCampaign.status ||
                    "—"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;