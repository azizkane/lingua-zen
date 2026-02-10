import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useZenFocusStore } from "../lib/stores/useZenFocusStore";
import { getCurrentWindow } from "@tauri-apps/api/window";

const MAX_CHARS = 1000;

export function useZenTranslation() {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"translate" | "explain">("translate");
  const [isPulsing, setIsPulsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const { balance, deduct, targetLang, initSettings } = useZenFocusStore();

  const handleTranslate = async (textToTranslate: string, lang?: string) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed || balance <= 0 || isLoading) return;

    setTranslation("");
    setExplanation("");
    setShowExplanation(false);
    setLoadingType("translate");
    setIsLoading(true);
    setError(null);

    try {
      const result = await invoke<string>("translate_text", {
        text: trimmed.slice(0, MAX_CHARS),
        targetLang: lang || targetLang,
      });

      await deduct(1);
      setTranslation(result);
    } catch (err: any) {
      console.error("Translation failed:", err);
      setError(err?.toString() || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (explanation) {
      setShowExplanation(!showExplanation);
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed || balance < 3 || isLoading) return;

    setLoadingType("explain");
    setIsLoading(true);
    setError(null);
    setShowExplanation(true);

    try {
      const result = await invoke<string>("explain_text", {
        text: trimmed.slice(0, MAX_CHARS),
      });

      await deduct(3);
      setExplanation(result);
    } catch (err: any) {
      console.error("Explanation failed:", err);
      setError(err?.toString() || "Unknown error");
      setShowExplanation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectionAndTranslate = async () => {
    try {
      const text = await invoke<string>("grab_selection");
      if (text && text.trim().length > 0) {
        const limitedText = text.slice(0, MAX_CHARS);
        setInputText(limitedText);
        handleTranslate(limitedText);
      }
    } catch (error) {
      console.error("Failed to grab selection:", error);
    }
  };

  useEffect(() => {
    // Only listen for ghost events if this is the main window
    const winLabel = getCurrentWindow().label;
    if (winLabel !== "main") return;

    initSettings();

    let unlistenGhost: UnlistenFn | null = null;
    let unlistenPulse: UnlistenFn | null = null;

    const setupListeners = async () => {
      unlistenGhost = await listen("ghost-shown", async () => {
        setTranslation("");
        setExplanation("");
        setShowExplanation(false);
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
  }, []);

  return {
    inputText,
    setInputText,
    translation,
    explanation,
    showExplanation,
    setShowExplanation,
    isLoading,
    loadingType,
    isPulsing,
    error,
    textareaRef,
    mainRef,
    handleTranslate,
    handleExplain,
  };
}
