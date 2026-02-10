import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useZenFocusStore } from "../lib/stores/useZenFocusStore";
import { getCurrentWindow } from "@tauri-apps/api/window";

const MAX_CHARS = 1000;

interface TranslationResponse {
  translation: string;
  hazard_level: "safe" | "low" | "medium" | "high";
  hazard_reason: string | null;
}

export function useZenTranslation() {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  
  const [hazardLevel, setHazardLevel] = useState<"safe" | "low" | "medium" | "high">("safe");
  const [hazardReason, setHazardReason] = useState<string | null>(null);

  const [cachedSource, setCachedSource] = useState("");
  const [cachedExplanation, setCachedExplanation] = useState("");
  const [cachedMnemonic, setCachedMnemonic] = useState("");

  const [insightText, setInsightText] = useState("");
  const [insightTitle, setInsightTitle] = useState("");
  const [showInsight, setShowInsight] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"translate" | "explain" | "mnemonic">("translate");
  const [isPulsing, setIsPulsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const { balance, deduct, targetLang, insightLang, initSettings } = useZenFocusStore();

  useEffect(() => {
    if (inputText !== cachedSource) {
      setTranslation("");
      setHazardLevel("safe");
      setHazardReason(null);
      setCachedExplanation("");
      setCachedMnemonic("");
      setInsightText("");
      setShowInsight(false);
    }
  }, [inputText]);

  const handleTranslate = async (textToTranslate: string, lang?: string) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed || balance <= 0 || isLoading) return;

    setLoadingType("translate");
    setIsLoading(true);
    setError(null);

    try {
      const rawResult = await invoke<string>("translate_text", {
        text: trimmed.slice(0, MAX_CHARS),
        targetLang: lang || targetLang,
      });

      let finalTranslation = rawResult;
      let finalHazardLevel: "safe" | "low" | "medium" | "high" = "safe";
      let finalHazardReason = null;

      try {
        const parsed: TranslationResponse = JSON.parse(rawResult);
        finalTranslation = parsed.translation;
        finalHazardLevel = parsed.hazard_level;
        finalHazardReason = parsed.hazard_reason;
      } catch (e) {
        console.warn("Failed to parse JSON translation");
      }

      await deduct(1);
      setTranslation(finalTranslation);
      setHazardLevel(finalHazardLevel);
      setHazardReason(finalHazardReason);
      setCachedSource(trimmed);
    } catch (err: any) {
      console.error("Translation failed:", err);
      setError(err?.toString() || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (cachedExplanation && inputText === cachedSource) {
      setInsightTitle("Zen Insight");
      setInsightText(cachedExplanation);
      setShowInsight(true);
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed || balance < 3 || isLoading) return;

    setLoadingType("explain");
    setInsightTitle("Zen Insight");
    setIsLoading(true);
    setError(null);
    setShowInsight(true);

    try {
      const result = await invoke<string>("explain_text", {
        text: trimmed.slice(0, MAX_CHARS),
        insightLang: insightLang,
        hazardContext: hazardReason
      });

      await deduct(3);
      setCachedExplanation(result);
      setInsightText(result);
      setCachedSource(trimmed);
    } catch (err: any) {
      console.error("Explanation failed:", err);
      setError(err?.toString() || "Unknown error");
      setShowInsight(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMnemonic = async () => {
    if (!translation) return; 
    
    if (cachedMnemonic && inputText === cachedSource) {
      setInsightTitle("Zen Mnemonic");
      setInsightText(cachedMnemonic);
      setShowInsight(true);
      return;
    }

    if (balance < 3 || isLoading) return;

    setLoadingType("mnemonic");
    setInsightTitle("Zen Mnemonic");
    setIsLoading(true);
    setError(null);
    setShowInsight(true);

    try {
      const result = await invoke<string>("generate_mnemonic", {
        text: inputText.slice(0, MAX_CHARS),
        targetText: translation.slice(0, MAX_CHARS),
        insightLang: insightLang
      });

      await deduct(3);
      setCachedMnemonic(result);
      setInsightText(result);
      setCachedSource(inputText);
    } catch (err: any) {
      console.error("Mnemonic failed:", err);
      setError(err?.toString() || "Unknown error");
      setShowInsight(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectionAndTranslate = async () => {
    try {
      const text = await invoke<string>("grab_selection");
      if (text && text.trim().length > 0) {
        const limitedText = text.slice(0, MAX_CHARS);
        if (limitedText !== inputText) {
          setInputText(limitedText);
          handleTranslate(limitedText);
        }
      }
    } catch (error) {
      console.error("Failed to grab selection:", error);
    }
  };

  useEffect(() => {
    const winLabel = getCurrentWindow().label;
    if (winLabel !== "main") return;

    initSettings();

    let unlistenGhost: UnlistenFn | null = null;
    let unlistenPulse: UnlistenFn | null = null;

    const setupListeners = async () => {
      unlistenGhost = await listen("ghost-shown", async () => {
        setError(null);
        fetchSelectionAndTranslate();

        if (mainRef.current) mainRef.current.focus();

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
          }
        }, 150);
      });

      unlistenPulse = await listen("zen-pulse", () => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      });
    };

    setupListeners();

    return () => {
      if (unlistenGhost) unlistenGhost();
      if (unlistenPulse) unlistenPulse();
    };
  }, [inputText, translation]);

  return {
    inputText,
    setInputText,
    translation,
    hazardLevel,
    hazardReason,
    insightText,
    insightTitle,
    showInsight,
    setShowInsight,
    isLoading,
    loadingType,
    isPulsing,
    error,
    textareaRef,
    mainRef,
    handleTranslate,
    handleExplain,
    handleMnemonic,
  };
}