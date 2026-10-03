import { useEffect, useRef, useState } from "react";
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
  ShieldCheck,
} from "lucide-react";

import "./dashboard.css";

const API_URL = "http://127.0.0.1:5001";

function Dashboard({ onBack }) {
  /* =========================================================
     PAGE
  ========================================================= */

  const [activePage, setActivePage] = useState(() => {
    const saved = localStorage.getItem("brandforge_active_page");

    const allowed = [
      "Overview",
      "Brand DNA",
      "Campaigns",
      "Content",
      "Quality Checker",
      "Settings",
    ];

    return allowed.includes(saved) ? saved : "Overview";
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

  const [qualityText, setQualityText] = useState("");
  const [qualityPlatform, setQualityPlatform] = useState("Instagram");

  /* =========================================================
     UI
  ========================================================= */

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceCopied, setVoiceCopied] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

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

  const [contentFilter, setContentFilter] =
    useState("All");

  const [copiedContentId, setCopiedContentId] =
    useState(null);

  /* =========================================================
     ADVANCED CONTENT EDITOR — STEP 3
  ========================================================= */

  const editorTextareaRef = useRef(null);
  const [editorMode, setEditorMode] = useState("edit");
  const [editorHistory, setEditorHistory] = useState([]);
  const [editorHistoryIndex, setEditorHistoryIndex] = useState(-1);
  const [editorSaving, setEditorSaving] = useState(false);

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

      setContents(
        Array.isArray(data.content)
          ? data.content
          : []
      );
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

  const regenerateContent = async (
    campaignId
  ) => {
    if (!campaignId) return;

    try {
      setContentError("");

      const response =
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

      const data =
        await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to regenerate content."
        );
      }

      await loadContent();
    } catch (error) {
      console.error(
        "REGENERATE ERROR:",
        error
      );

      setContentError(
        error.message ||
          "Unable to regenerate content."
      );
    }
  };

  const openContentEditor = (item) => {
    const initialText = item?.content || "";

    setEditingContent(item);
    setEditContentText(initialText);
    setEditorMode("edit");
    setEditorHistory([initialText]);
    setEditorHistoryIndex(0);
    setContentError("");
  };

  const closeContentEditor = () => {
    if (savingEditedContent || editorSaving) return;

    setEditingContent(null);
    setEditContentText("");
    setEditorHistory([]);
    setEditorHistoryIndex(-1);
    setEditorMode("edit");
  };

  const updateEditorText = (value, saveToHistory = true) => {
    setEditContentText(value);

    if (!saveToHistory) return;

    setEditorHistory((previous) => {
      const base =
        editorHistoryIndex >= 0
          ? previous.slice(0, editorHistoryIndex + 1)
          : previous;

      const next = [...base, value].slice(-30);
      return next;
    });

    setEditorHistoryIndex((previous) => {
      const nextLength =
        Math.min(
          editorHistoryIndex >= 0
            ? editorHistoryIndex + 2
            : 1,
          30
        );

      return nextLength - 1;
    });
  };

  const undoEditor = () => {
    if (editorHistoryIndex <= 0) return;

    const nextIndex = editorHistoryIndex - 1;
    setEditorHistoryIndex(nextIndex);
    setEditContentText(editorHistory[nextIndex]);
  };

  const redoEditor = () => {
    if (
      editorHistoryIndex < 0 ||
      editorHistoryIndex >= editorHistory.length - 1
    ) {
      return;
    }

    const nextIndex = editorHistoryIndex + 1;
    setEditorHistoryIndex(nextIndex);
    setEditContentText(editorHistory[nextIndex]);
  };

  const insertEditorText = (text) => {
    const textarea = editorTextareaRef.current;

    if (!textarea) {
      updateEditorText(`${editContentText}${text}`);
      return;
    }

    const start = textarea.selectionStart ?? editContentText.length;
    const end = textarea.selectionEnd ?? start;

    const nextText =
      editContentText.slice(0, start) +
      text +
      editContentText.slice(end);

    updateEditorText(nextText);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const wrapEditorSelection = (before, after = before) => {
    const textarea = editorTextareaRef.current;

    if (!textarea) {
      insertEditorText(`${before}${after}`);
      return;
    }

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const selected = editContentText.slice(start, end);

    if (!selected) {
      insertEditorText(`${before}${after}`);
      return;
    }

    const nextText =
      editContentText.slice(0, start) +
      before +
      selected +
      after +
      editContentText.slice(end);

    updateEditorText(nextText);

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    });
  };

  const runEditorAction = (action) => {
    const current = editContentText.trim();

    if (!current) return;

    let next = current;

    if (action === "hook") {
      const lines = current.split("\n");
      const firstLine = lines[0].trim();

      if (
        firstLine.length < 35 &&
        !/[!?✨🚀🔥💡]/.test(firstLine)
      ) {
        lines[0] =
          `✨ ${firstLine || "A fresh idea for your audience"} — here's why it matters.`;
        next = lines.join("\n");
      }
    }

    if (action === "cta") {
      if (
        !/\b(try|shop|buy|learn|discover|join|start|visit|explore|sign up|download|follow|share|comment|order|get|book|contact)\b/i.test(
          current
        )
      ) {
        next =
          `${current}\n\nReady to get started? Explore more today.`;
      }
    }

    if (action === "hashtags") {
      const platformName =
        String(editingContent?.platform || "").toLowerCase();

      const tags = platformName.includes("linkedin")
        ? "#BrandStrategy #ContentMarketing #Growth"
        : platformName.includes("x")
        ? "#BrandForge #Marketing #Content"
        : "#BrandForge #ContentCreation #Marketing";

      if (!current.includes("#BrandForge")) {
        next = `${current}\n\n${tags}`;
      }
    }

    if (action === "emoji") {
      const emoji = editingContent?.platform
        ?.toLowerCase()
        .includes("linkedin")
        ? "💡"
        : "✨";

      if (!/^[\s\S]*[✨🚀🔥💡🎯📣]/.test(current)) {
        next = `${emoji} ${current}`;
      }
    }

    if (action === "shorten") {
      const sentences = current
        .split(/(?<=[.!?])\s+/)
        .filter(Boolean);

      if (sentences.length > 4) {
        next = sentences.slice(0, 4).join(" ");
      }
    }

    if (next !== current) {
      updateEditorText(next);
    }
  };

  useEffect(() => {
    if (!editingContent) return undefined;

    const handleEditorKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "enter"
      ) {
        event.preventDefault();
        saveEditedContent();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeContentEditor();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z"
      ) {
        event.preventDefault();
        if (event.shiftKey) {
          redoEditor();
        } else {
          undoEditor();
        }
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        redoEditor();
      }
    };

    window.addEventListener(
      "keydown",
      handleEditorKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEditorKeyDown
      );
  }, [
    editingContent,
    editorHistory,
    editorHistoryIndex,
    editContentText,
    savingEditedContent,
    editorSaving,
  ]);

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

  const deleteContent = async (
    contentId
  ) => {
    if (!contentId) return;

    const confirmed =
      window.confirm(
        "Delete this content?"
      );

    if (!confirmed) return;

    try {
      setDeletingContentId(
        contentId
      );

      const response =
        await fetch(
          `${API_URL}/api/content/${contentId}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await safeJson(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete content."
        );
      }

      await loadContent();
    } catch (error) {
      console.error(
        "DELETE CONTENT ERROR:",
        error
      );

      setContentError(
        error.message ||
          "Unable to delete content."
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

    const query =
      value.trim().toLowerCase();

    if (!query) return;

    const campaignMatch =
      campaigns.find((campaign) =>
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
            String(field)
              .toLowerCase()
              .includes(query)
          )
      );

    if (campaignMatch) {
      setActivePage("Campaigns");
      setSelectedCampaign(
        campaignMatch
      );
      closeMenus();
      return;
    }

    const contentMatch =
      contents.find((item) =>
        [
          item.content,
          item.platform,
          item.content_type,
          item.status,
        ]
          .filter(Boolean)
          .some((field) =>
            String(field)
              .toLowerCase()
              .includes(query)
          )
      );

    if (contentMatch) {
      setActivePage("Content");
      closeMenus();
      return;
    }

    const brandMatch =
      brands.find((item) =>
        [
          item.name,
          item.description,
          item.target_audience,
          item.tone,
          item.personality,
        ]
          .filter(Boolean)
          .some((field) =>
            String(field)
              .toLowerCase()
              .includes(query)
          )
      );

    if (brandMatch) {
      setBrand(brandMatch);
      setActivePage("Brand DNA");
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

  const BrandFormModal = () => {
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
     BRAND VOICE PROFILE
  ========================================================= */

  const copyBrandVoice = async () => {
    if (!brand) return;

    const voiceText = [
      `Brand: ${brand.name || "Untitled brand"}`,
      `Audience: ${brand.target_audience || "Not defined"}`,
      `Tone: ${brand.tone || "Not defined"}`,
      `Personality: ${brand.personality || "Not defined"}`,
      `Preferred words: ${brand.preferred_words || "Not defined"}`,
      `Words to avoid: ${brand.words_to_avoid || "Not defined"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(voiceText);
      setVoiceCopied(true);
      window.setTimeout(() => setVoiceCopied(false), 1800);
    } catch (error) {
      console.error("COPY VOICE PROFILE ERROR:", error);
    }
  };

  const getVoiceProfileScore = () => {
    if (!brand) return 0;

    const fields = [
      brand.target_audience,
      brand.tone,
      brand.personality,
      brand.preferred_words,
      brand.words_to_avoid,
    ];

    return Math.round(
      (fields.filter((value) => value && value.trim()).length / fields.length) * 100
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

  const renderBrandDNA = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <p className="eyebrow blue-eyebrow">
              BRAND INTELLIGENCE
            </p>

            <h1>Brand DNA</h1>

            <p>
              Your brand identity,
              personality and visual
              language in one place.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              openEditBrandForm()
            }
          >
            <Pencil size={17} />
            {brand
              ? "Edit Brand"
              : "Create Brand"}
          </button>
        </div>

        {!brand ? (
          <div className="white-panel empty-state">
            <Sparkles size={42} />

            <h2>
              No brand created yet
            </h2>

            <p>
              Create your brand identity
              to unlock AI-powered
              campaigns.
            </p>

            <button
              className="primary-button"
              onClick={
                openCreateBrandForm
              }
            >
              <Plus size={18} />
              Create Your Brand
            </button>
          </div>
        ) : (
          <>
            <div className="brand-profile-card">
              <div
                className="brand-profile-logo"
                style={{
                  background:
                    brand.primary_color ||
                    "#1677FF",
                }}
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                  />
                ) : (
                  <span>
                    {brand.name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "B"}
                  </span>
                )}
              </div>

              <div className="brand-profile-main">
                <p className="eyebrow">
                  ACTIVE BRAND
                </p>

                <h2>
                  {brand.name}
                </h2>

                <p>
                  {brand.description ||
                    "Your brand description will appear here."}
                </p>
              </div>

              <div className="brand-status">
                <CheckCircle2 size={17} />
                Active
              </div>
            </div>

            <section className="voice-profile-panel">
              <div className="voice-profile-header">
                <div>
                  <p className="eyebrow blue-eyebrow">
                    REUSABLE VOICE SYSTEM
                  </p>
                  <h2>Brand Voice Profile</h2>
                  <p>
                    A reusable tone, personality and language guide applied across your generated content.
                  </p>
                </div>

                <div className="voice-profile-actions">
                  <div className="voice-completeness">
                    <span>Profile completeness</span>
                    <strong>{getVoiceProfileScore()}%</strong>
                  </div>

                  <button
                    type="button"
                    className="secondary-button voice-copy-button"
                    onClick={copyBrandVoice}
                  >
                    <Copy size={16} />
                    {voiceCopied ? "Copied" : "Copy Profile"}
                  </button>
                </div>
              </div>

              <div className="voice-profile-progress">
                <span style={{ width: `${getVoiceProfileScore()}%` }} />
              </div>

              <div className="voice-rules-grid">
                <div className="voice-rule">
                  <span className="voice-rule-number">01</span>
                  <div>
                    <h3>Who we speak to</h3>
                    <p>{brand.target_audience || "Define your target audience"}</p>
                  </div>
                </div>

                <div className="voice-rule">
                  <span className="voice-rule-number">02</span>
                  <div>
                    <h3>How we sound</h3>
                    <p>{brand.tone || "Define the brand tone"}</p>
                  </div>
                </div>

                <div className="voice-rule">
                  <span className="voice-rule-number">03</span>
                  <div>
                    <h3>Our personality</h3>
                    <p>{brand.personality || "Define the personality traits"}</p>
                  </div>
                </div>

                <div className="voice-rule voice-rule-positive">
                  <span className="voice-rule-number">04</span>
                  <div>
                    <h3>Words we prefer</h3>
                    <p>{brand.preferred_words || "Add preferred words and phrases"}</p>
                  </div>
                </div>

                <div className="voice-rule voice-rule-negative">
                  <span className="voice-rule-number">05</span>
                  <div>
                    <h3>Words we avoid</h3>
                    <p>{brand.words_to_avoid || "Add words and phrases to avoid"}</p>
                  </div>
                </div>

                <div className="voice-rule voice-rule-system">
                  <span className="voice-rule-number">06</span>
                  <div>
                    <h3>Applied everywhere</h3>
                    <p>Use this profile when generating, editing and checking content.</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="brand-dna-grid">
              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <Target size={20} />
                </div>

                <h3>
                  Target Audience
                </h3>

                <p>
                  {brand.target_audience ||
                    "Not defined"}
                </p>
              </div>

              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <Sparkles size={20} />
                </div>

                <h3>
                  Brand Tone
                </h3>

                <p>
                  {brand.tone ||
                    "Not defined"}
                </p>
              </div>

              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <Palette size={20} />
                </div>

                <h3>
                  Personality
                </h3>

                <p>
                  {brand.personality ||
                    "Not defined"}
                </p>
              </div>

              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <Sparkles size={20} />
                </div>

                <h3>
                  Preferred Words
                </h3>

                <p>
                  {brand.preferred_words ||
                    "Not defined"}
                </p>
              </div>

              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <X size={20} />
                </div>

                <h3>
                  Words to Avoid
                </h3>

                <p>
                  {brand.words_to_avoid ||
                    "Not defined"}
                </p>
              </div>

              <div className="white-panel dna-card">
                <div className="dna-icon">
                  <Palette size={20} />
                </div>

                <h3>
                  Brand Colors
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius:
                        "12px",
                      background:
                        brand.primary_color ||
                        "#1677FF",
                    }}
                  />

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius:
                        "12px",
                      background:
                        brand.secondary_color ||
                        "#B9DCFF",
                    }}
                  />
                </div>
              </div>
            </div>
          </>
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
                        regenerateContent(
                          campaign.id
                        )
                      }
                    >
                      <RefreshCw
                        size={16}
                      />
                      Regenerate
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
                      </div>

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
                    className="secondary-button content-regenerate-button"
                    onClick={() =>
                      regenerateContent(item.campaign_id)
                    }
                    disabled={!item.campaign_id}
                  >
                    <RefreshCw size={15} />
                    Regenerate
                  </button>

                  <button
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
     QUALITY CHECKER — STANDALONE WORKSPACE
  ========================================================= */

  const renderQualityChecker = () => {
    const qualityItem = {
      content: qualityText,
      platform: qualityPlatform,
    };

    const result = analyzeContent(qualityItem);
    const checks = [
      ["Brand voice", result.brandVoiceGood, "Preferred language is represented."],
      ["Hook", result.hookGood, "The opening is strong enough to stop the scroll."],
      ["CTA", result.ctaGood, "A clear action is suggested."],
      ["Audience fit", result.audienceGood, "The copy reflects the target audience."],
      ["No forbidden words", result.forbiddenWordsGood, result.detectedForbiddenWords.length ? `Found: ${result.detectedForbiddenWords.join(", ")}` : "No words from the avoid list were detected."],
      ["Length", result.lengthGood, `${result.characterCount} / ${result.maxLength} characters.`],
    ];

    const scoreClass =
      result.score >= 80
        ? "quality-good"
        : result.score >= 60
        ? "quality-warning"
        : "quality-danger";

    return (
      <>
        <div className="page-heading quality-page-heading">
          <div>
            <p className="eyebrow blue-eyebrow">AI QUALITY & TONE</p>
            <h1>Quality Checker</h1>
            <p>
              Check brand voice, tone, audience fit, CTA, forbidden words and platform length before publishing.
            </p>
          </div>

          <div className="quality-page-brand-pill">
            <ShieldCheck size={17} />
            <span>{brand?.name || "No active brand"}</span>
          </div>
        </div>

        <div className="quality-checker-page-grid">
          <section className="white-panel quality-input-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow blue-eyebrow">CHECK CONTENT</p>
                <h3>Paste or write your content</h3>
              </div>
              {contents.length > 0 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    const first = contents[0];
                    setQualityText(String(first?.content || ""));
                    setQualityPlatform(first?.platform || "Instagram");
                  }}
                >
                  <RefreshCw size={15} />
                  Use latest content
                </button>
              )}
            </div>

            <div className="quality-platform-row">
              <label>Platform</label>
              <div className="quality-platform-tabs">
                {["Instagram", "LinkedIn", "X"].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className={qualityPlatform === platform ? "active" : ""}
                    onClick={() => setQualityPlatform(platform)}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="quality-checker-textarea"
              value={qualityText}
              onChange={(event) => setQualityText(event.target.value)}
              placeholder="Paste your campaign content here..."
            />

            <div className="quality-input-footer">
              <span>{qualityText.length} characters</span>
              <span>Target: {qualityPlatform}</span>
            </div>
          </section>

          <section className="white-panel quality-results-panel">
            <div className="quality-result-top">
              <div>
                <p className="eyebrow blue-eyebrow">LIVE ANALYSIS</p>
                <h3>Content Health</h3>
              </div>
              <div className={`quality-score quality-page-score ${scoreClass}`}>
                {result.score}<span>/100</span>
              </div>
            </div>

            <div className="quality-page-progress">
              <span style={{ width: `${result.score}%` }} />
            </div>

            <div className="quality-check-list">
              {checks.map(([label, good, description]) => (
                <div className="quality-check-row" key={label}>
                  <div className={`quality-check-icon ${good ? "good" : "bad"}`}>
                    {good ? <CheckCircle2 size={16} /> : <X size={16} />}
                  </div>
                  <div>
                    <strong>{label}</strong>
                    <p>{description}</p>
                  </div>
                  <span className={good ? "check-status good" : "check-status bad"}>
                    {good ? "PASS" : "REVIEW"}
                  </span>
                </div>
              ))}
            </div>

            {result.detectedPreferredWords.length > 0 && (
              <div className="quality-detected-box positive">
                <strong>Preferred words detected</strong>
                <span>{result.detectedPreferredWords.join(", ")}</span>
              </div>
            )}

            {result.detectedForbiddenWords.length > 0 && (
              <div className="quality-detected-box negative">
                <strong>Words to avoid detected</strong>
                <span>{result.detectedForbiddenWords.join(", ")}</span>
              </div>
            )}
          </section>
        </div>

        <section className="white-panel quality-voice-reference">
          <div>
            <p className="eyebrow blue-eyebrow">BRAND VOICE REFERENCE</p>
            <h3>{brand?.name || "Your brand"} voice rules</h3>
          </div>
          <div className="quality-voice-tags">
            <span><strong>Tone:</strong> {brand?.tone || "Not set"}</span>
            <span><strong>Personality:</strong> {brand?.personality || "Not set"}</span>
            <span><strong>Audience:</strong> {brand?.target_audience || "Not set"}</span>
            <span><strong>Prefer:</strong> {brand?.preferred_words || "Not set"}</span>
            <span><strong>Avoid:</strong> {brand?.words_to_avoid || "Not set"}</span>
          </div>
        </section>
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
        return renderQualityChecker();

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
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
                placeholder="Search..."
              />
            </div>

            <button
              className="topbar-icon-button"
              onClick={() => {
                setShowNotifications(
                  (previous) =>
                    !previous
                );
                setShowProfileMenu(
                  false
                );
              }}
            >
              <Bell size={19} />

              {contents.length > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            {showNotifications && (
              <div className="topbar-dropdown notification-dropdown">
                <strong>
                  Notifications
                </strong>

                <p>
                  {contents.length > 0
                    ? `You have ${contents.length} generated content asset(s).`
                    : "No new notifications."}
                </p>
              </div>
            )}

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
                    <ShieldCheck
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

      <BrandFormModal />

      {/* CONTENT EDITOR — STEP 3 */}

      {editingContent && (
        <div
          className="brand-modal-overlay advanced-editor-overlay"
          onClick={closeContentEditor}
        >
          <div
            className="advanced-editor-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="advanced-editor-header">
              <div className="advanced-editor-title">
                <div className="advanced-editor-title-icon">
                  <WandSparkles size={18} />
                </div>

                <div>
                  <p className="eyebrow blue-eyebrow">
                    STEP 3 · ADVANCED CONTENT EDITOR
                  </p>

                  <h2>
                    Edit & polish your content
                  </h2>

                  <p>
                    Refine the copy, check content health,
                    and preview how it will look on its
                    target platform.
                  </p>
                </div>
              </div>

              <button
                className="modal-close"
                type="button"
                onClick={closeContentEditor}
                disabled={
                  savingEditedContent || editorSaving
                }
                aria-label="Close editor"
              >
                <X size={20} />
              </button>
            </div>

            {contentError && (
              <div className="error-message editor-error">
                {contentError}
              </div>
            )}

            <div className="advanced-editor-meta">
              <div className="editor-meta-item">
                <span>Platform</span>
                <strong>
                  {editingContent.platform || "Platform"}
                </strong>
              </div>

              <div className="editor-meta-item">
                <span>Content type</span>
                <strong>
                  {editingContent.content_type || "Content"}
                </strong>
              </div>

              <div className="editor-meta-item">
                <span>Status</span>
                <strong className="editor-status">
                  {editingContent.status || "draft"}
                </strong>
              </div>

              <div className="editor-meta-item editor-meta-health">
                <span>Live health</span>
                {(() => {
                  const quality = analyzeContent({
                    ...editingContent,
                    content: editContentText,
                  });

                  return (
                    <strong
                      className={
                        quality.score >= 85
                          ? "editor-health-good"
                          : quality.score >= 65
                          ? "editor-health-warning"
                          : "editor-health-danger"
                      }
                    >
                      {quality.score}/100
                    </strong>
                  );
                })()}
              </div>
            </div>

            <div className="advanced-editor-layout">
              <section className="editor-workspace">
                <div className="editor-toolbar-row">
                  <div className="editor-toolbar">
                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={() =>
                        wrapEditorSelection("**", "**")
                      }
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>

                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={() =>
                        wrapEditorSelection("*", "*")
                      }
                      title="Italic"
                    >
                      <em>I</em>
                    </button>

                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={() =>
                        insertEditorText("• ")
                      }
                      title="Bullet"
                    >
                      •
                    </button>

                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={() =>
                        insertEditorText("#")
                      }
                      title="Add hashtag"
                    >
                      #
                    </button>

                    <span className="editor-toolbar-divider" />

                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={undoEditor}
                      disabled={editorHistoryIndex <= 0}
                      title="Undo"
                    >
                      ↶
                    </button>

                    <button
                      type="button"
                      className="editor-tool-button"
                      onClick={redoEditor}
                      disabled={
                        editorHistoryIndex < 0 ||
                        editorHistoryIndex >=
                          editorHistory.length - 1
                      }
                      title="Redo"
                    >
                      ↷
                    </button>
                  </div>

                  <div className="editor-mode-switch">
                    <button
                      type="button"
                      className={
                        editorMode === "edit"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setEditorMode("edit")
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={
                        editorMode === "preview"
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setEditorMode("preview")
                      }
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {editorMode === "edit" ? (
                  <div className="advanced-textarea-shell">
                    <textarea
                      ref={editorTextareaRef}
                      className="advanced-content-textarea"
                      value={editContentText}
                      onChange={(event) =>
                        updateEditorText(
                          event.target.value
                        )
                      }
                      placeholder="Write or refine your content..."
                      spellCheck="true"
                    />

                    <div className="editor-counter-row">
                      <span>
                        {editContentText.length} characters
                      </span>

                      <span>
                        {
                          editContentText
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length
                        } words
                      </span>

                      <span>
                        Ctrl + Enter to save
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="editor-preview-stage">
                    <div className="editor-preview-label">
                      LIVE PREVIEW
                    </div>

                    <div
                      className={`platform-preview ${
                        String(
                          editingContent.platform || ""
                        )
                          .toLowerCase()
                          .includes("linkedin")
                          ? "linkedin-preview"
                          : String(
                              editingContent.platform || ""
                            )
                              .toLowerCase()
                              .includes("x")
                          ? "x-preview"
                          : "instagram-preview"
                      }`}
                    >
                      <div className="preview-top">
                        <div className="preview-avatar">
                          {brand?.name?.charAt(0) || "B"}
                        </div>

                        <div>
                          <strong>
                            {brand?.name ||
                              "Your Brand"}
                          </strong>
                          <span>
                            {editingContent.platform ||
                              "Social Platform"}
                          </span>
                        </div>
                      </div>

                      <div className="preview-copy">
                        {editContentText ||
                          "Your content preview will appear here."}
                      </div>

                      <div className="preview-actions">
                        <span>♡</span>
                        <span>○</span>
                        <span>↗</span>
                        <span>⋯</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="quick-edit-section">
                  <div className="quick-edit-heading">
                    <div>
                      <span>QUICK POLISH</span>
                      <strong>Improve in one click</strong>
                    </div>

                    <small>
                      Local editing tools — no content is lost
                    </small>
                  </div>

                  <div className="quick-edit-grid">
                    <button
                      type="button"
                      onClick={() =>
                        runEditorAction("hook")
                      }
                    >
                      <span>✨</span>
                      Improve hook
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        runEditorAction("cta")
                      }
                    >
                      <span>🎯</span>
                      Add CTA
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        runEditorAction("hashtags")
                      }
                    >
                      <span>#</span>
                      Add hashtags
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        runEditorAction("emoji")
                      }
                    >
                      <span>😊</span>
                      Add emoji
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        runEditorAction("shorten")
                      }
                    >
                      <span>↘</span>
                      Shorten
                    </button>
                  </div>
                </div>
              </section>

              <aside className="editor-side-panel">
                <div className="editor-side-card">
                  <div className="editor-side-heading">
                    <div>
                      <span>CONTENT HEALTH</span>
                      <strong>Live quality check</strong>
                    </div>

                    {(() => {
                      const quality = analyzeContent({
                        ...editingContent,
                        content: editContentText,
                      });

                      return (
                        <div
                          className={`editor-score ${
                            quality.score >= 85
                              ? "editor-score-good"
                              : quality.score >= 65
                              ? "editor-score-warning"
                              : "editor-score-danger"
                          }`}
                        >
                          {quality.score}
                        </div>
                      );
                    })()}
                  </div>

                  {(() => {
                    const quality = analyzeContent({
                      ...editingContent,
                      content: editContentText,
                    });

                    const checks = [
                      [
                        "Brand voice",
                        quality.brandVoiceGood,
                      ],
                      ["Hook", quality.hookGood],
                      ["CTA", quality.ctaGood],
                      [
                        "Audience",
                        quality.audienceGood,
                      ],
                      [
                        "No forbidden words",
                        quality.forbiddenWordsGood,
                      ],
                      [
                        "Length",
                        quality.lengthGood,
                      ],
                    ];

                    return (
                      <>
                        <div className="editor-score-bar">
                          <div
                            style={{
                              width: `${quality.score}%`,
                            }}
                          />
                        </div>

                        <div className="editor-check-list">
                          {checks.map(
                            ([label, good]) => (
                              <div
                                className="editor-check-row"
                                key={label}
                              >
                                <span>{label}</span>
                                <strong
                                  className={
                                    good
                                      ? "check-pass"
                                      : "check-review"
                                  }
                                >
                                  {good ? "✓ Good" : "Review"}
                                </strong>
                              </div>
                            )
                          )}
                        </div>

                        <div className="editor-limit">
                          <span>
                            Character limit
                          </span>
                          <strong>
                            {quality.characterCount} /{" "}
                            {quality.maxLength}
                          </strong>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="editor-side-card editor-tips-card">
                  <span className="editor-tip-label">
                    EDITOR SHORTCUTS
                  </span>

                  <div className="editor-shortcut">
                    <span>Save</span>
                    <kbd>Ctrl</kbd>
                    <b>+</b>
                    <kbd>Enter</kbd>
                  </div>

                  <div className="editor-shortcut">
                    <span>Undo</span>
                    <kbd>Ctrl</kbd>
                    <b>+</b>
                    <kbd>Z</kbd>
                  </div>

                  <div className="editor-shortcut">
                    <span>Close</span>
                    <kbd>Esc</kbd>
                  </div>
                </div>
              </aside>
            </div>

            <div className="advanced-editor-footer">
              <div className="editor-footer-info">
                <span className="editor-unsaved-dot" />
                <span>
                  Changes are saved only when you click Save Content.
                </span>
              </div>

              <div className="brand-form-actions editor-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeContentEditor}
                  disabled={
                    savingEditedContent || editorSaving
                  }
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="button"
                  onClick={saveEditedContent}
                  disabled={
                    savingEditedContent || editorSaving
                  }
                >
                  <CheckCircle2 size={17} />

                  {savingEditedContent
                    ? "Saving..."
                    : "Save Content"}
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