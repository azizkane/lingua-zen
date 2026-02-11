import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BreathingLoader } from "../BreathingLoader";
import { FormattedText } from "../shared/FormattedText";
import { LanguageSelector } from "../shared/LanguageSelector";
import { MinimizeButton } from "../shared/MinimizeButton";
import { SettingsButton } from "../shared/Settingsbutton";
import { useZenFocusStore } from "../../lib/stores/useZenFocusStore";
import { useZenTranslation } from "../../hooks/useZenTranslation";

const MAX_CHARS = 1000;

export const GhostWindow = () => {
  const {
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
  } = useZenTranslation();

  const {
    balance,
    recharge,
    targetLang,
    setTargetLang,
    recentTargetLangs,
    isPro,
  } = useZenFocusStore();
  const [isSticky, setIsSticky] = useState(false);

  const startDrag = () => invoke("start_drag");
  const preventDrag = (e: React.MouseEvent) => e.stopPropagation();

  const toggleSticky = async () => {
    const newState = await invoke<boolean>("toggle_sticky");
    setIsSticky(newState);
  };

  const handleUpgrade = () => invoke("open_checkout");

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showInsight) setShowInsight(false);
      else {
        e.preventDefault();
        setIsSticky(false);
        await invoke("hide_window");
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslate(inputText);
    }
  };

  const updateLanguage = (lang: string) => {
    setTargetLang(lang);
    if (inputText.trim()) {
      handleTranslate(inputText, lang);
    }
  };

  const DragHandle = () => (
    <div
      className="absolute top-0 left-0 right-0 h-10 cursor-move select-none z-0"
      onMouseDown={startDrag}
    />
  );

  const getHazardHeaderColor = () => {
    if (insightTitle !== "Zen Insight") return "bg-slate-900/20";
    switch (hazardLevel) {
      case "high":
        return "bg-rose-900/40 border-b border-rose-500/30";
      case "medium":
        return "bg-amber-900/40 border-b border-amber-500/30";
      case "low":
        return "bg-amber-700/20 border-b border-amber-500/20";
      default:
        return "bg-slate-900/20 border-b border-slate-800/30";
    }
  };

  const getHazardTextColor = () => {
    if (insightTitle !== "Zen Insight") return "text-indigo-400/80";
    switch (hazardLevel) {
      case "high":
        return "text-rose-400 font-bold";
      case "medium":
        return "text-amber-400 font-bold";
      case "low":
        return "text-amber-300/90";
      default:
        return "text-indigo-400/80";
    }
  };

  return (
    <main
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex flex-col items-center justify-start h-screen bg-[#0f172a] text-white border border-slate-700 rounded-xl p-6 shadow-2xl overflow-hidden transition-all duration-500 outline-none relative ${isPulsing ? "ring-4 ring-indigo-500/50" : "ring-0"}`}
    >
      <DragHandle />

      <div className="absolute top-2 left-4 z-0 pointer-events-none select-none opacity-50">
        <span className="text-[16px] font-medium italic tracking-widest text-indigo-300">
          Lingua Zen
        </span>
      </div>

      <MinimizeButton preventDrag={preventDrag} />
      <SettingsButton preventDrag={preventDrag} />

      <div className="w-full flex justify-end items-center mt-1 mb-3 border-b border-slate-800/50 pb-2 relative z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative">
            <LanguageSelector
              currentLang={targetLang}
              recentLangs={recentTargetLangs}
              onSelect={updateLanguage}
              variant="ghost"
              preventDrag={preventDrag}
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/50 rounded-full border border-slate-800 shadow-inner mr-1">
            <div
              className={`w-2 h-2 rounded-full ${isPro || balance > 0 ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "bg-rose-500"}`}
            ></div>
            <span className="text-xs font-mono text-slate-400">
              {isPro ? "∞" : balance} E
            </span>
          </div>

          <button
            onMouseDown={preventDrag}
            onClick={toggleSticky}
            className={`p-1 rounded-lg transition-all ${isSticky ? "text-indigo-400 bg-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-slate-500 hover:text-slate-300"}`}
            title={isSticky ? "Unpin (Ghost Mode)" : "Pin (Sticky Mode)"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isSticky ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v8" />
              <path d="m16 4-4 4-4-4" />
              <path d="M4 12v8h16v-8" />
              <path d="M2 14h20" />
            </svg>
          </button>

          <span className="px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-500 text-[9px] font-bold border border-slate-700/30">
            {isPro ? "Pro Active" : "AI Active"}
          </span>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col space-y-2 relative z-10 min-h-0">
        <div className="relative shrink-0">
          <textarea
            ref={textareaRef}
            value={inputText}
            maxLength={MAX_CHARS}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Select text to translate..."
            className="w-full h-24 bg-slate-950/80 border border-slate-700/50 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all resize-none text-sm"
          />
          <div className="absolute bottom-2 right-3 text-[9px] text-slate-700 font-mono pointer-events-none">
            {inputText.length}/{MAX_CHARS}
          </div>
        </div>

        <div className="flex-1 min-h-[120px] bg-slate-950/30 border border-dashed border-slate-800 rounded-lg relative overflow-hidden group">
          {isLoading && loadingType === "translate" && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-2">
                <BreathingLoader />
                <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-tighter">
                  Zen Translating...
                </span>
              </div>
            </div>
          )}

          {error ? (
            <div className="w-full h-full p-4 text-rose-400/80 text-[10px] leading-tight overflow-auto custom-scrollbar">
              <p className="font-bold mb-1 underline">Zen Error:</p>
              <p>{error}</p>
            </div>
          ) : !isPro && balance <= 0 && !translation ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2 px-6">
              <p className="text-slate-500 text-sm font-medium">
                Zen Focus Depleted
              </p>
              <button
                onMouseDown={preventDrag}
                onClick={handleUpgrade}
                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg"
              >
                Go Pro for ∞ Energy
              </button>
              <button
                onMouseDown={preventDrag}
                onClick={recharge}
                className="text-[10px] text-slate-600 hover:text-slate-400"
              >
                Or use test recharge
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
                {translation ? (
                  <>
                    <FormattedText
                      text={translation}
                      className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap"
                    />
                    {(hazardLevel === "medium" || hazardLevel === "high") && (
                      <div className="mt-3 p-2 rounded bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
                        <span className="text-rose-400 text-xs mt-0.5">⚠️</span>
                        <div>
                          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">
                            Cultural Risk Detected
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {hazardReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PRO NUDGE - When energy is low */}
                    {!isPro && balance <= 2 && !isLoading && (
                      <button
                        onMouseDown={preventDrag}
                        onClick={handleUpgrade}
                        className="mt-4 w-full p-2 rounded bg-indigo-500/10 border border-dashed border-indigo-500/30 text-indigo-300 text-[10px] hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
                      >
                        ⚡ Energy low. Remove limits with Pro →
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-slate-700 text-sm italic">
                    {isPulsing
                      ? "Zen detected a copy..."
                      : "Insight will appear here..."}
                  </p>
                )}
              </div>

              <div
                className={`absolute inset-0 bg-[#0f172a]/95 backdrop-blur-md transition-all duration-300 ease-in-out z-30 flex flex-col border-l border-indigo-500/20 ${
                  showInsight
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }`}
              >
                <div
                  className={`flex items-center gap-2 px-3 py-1 shrink-0 transition-colors duration-500 ${getHazardHeaderColor()}`}
                >
                  <span
                    className={`text-[8px] font-bold uppercase tracking-widest leading-none ${getHazardTextColor()}`}
                  >
                    {hazardLevel !== "safe" && insightTitle === "Zen Insight"
                      ? "⚠️ "
                      : "✨ "}
                    {insightTitle}
                  </span>
                  <button
                    onMouseDown={preventDrag}
                    onClick={() => setShowInsight(false)}
                    className="ml-auto p-0.5 rounded-sm hover:bg-slate-800 text-slate-600 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                  {isLoading &&
                  (loadingType === "explain" || loadingType === "mnemonic") ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <BreathingLoader />
                    </div>
                  ) : (
                    <FormattedText
                      text={insightText}
                      className="text-slate-300 leading-relaxed text-[13px] whitespace-pre-wrap"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 pb-2 shrink-0">
          <div className="flex gap-3 text-[9px] text-slate-600 font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800/50 rounded border border-slate-700/30">
                ENTER
              </kbd>{" "}
              Translate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800/50 rounded border border-slate-700/30">
                ESC
              </kbd>{" "}
              Hide
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onMouseDown={preventDrag}
              onClick={handleMnemonic}
              disabled={
                isLoading ||
                !inputText.trim() ||
                (!isPro && balance < 3) ||
                !translation
              }
              className={`px-3 py-2 border rounded-lg font-bold transition-all active:scale-95 text-xs flex items-center gap-1.5 ${showInsight && insightTitle === "Zen Mnemonic" ? "bg-indigo-600/80 border-indigo-500/50 text-white shadow-lg" : "bg-slate-800/30 hover:bg-slate-700 text-slate-400 border-slate-700/50 disabled:opacity-50"}`}
              title="Create Mnemonic (3E)"
            >
              🧠
            </button>

            <button
              onMouseDown={preventDrag}
              onClick={handleExplain}
              disabled={
                isLoading || !inputText.trim() || (!isPro && balance < 3)
              }
              className={`relative px-4 py-2 border rounded-lg font-bold transition-all active:scale-95 text-xs flex items-center gap-1.5 ${showInsight && insightTitle === "Zen Insight" ? "bg-indigo-600/80 border-indigo-500/50 text-white shadow-lg" : "bg-slate-800/30 hover:bg-slate-700 text-indigo-400/70 border-slate-700/50"}`}
            >
              {hazardLevel !== "safe" ? (
                <div
                  className={`w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] ${
                    hazardLevel === "high"
                      ? "bg-rose-500 animate-ping"
                      : hazardLevel === "medium"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-amber-400"
                  }`}
                />
              ) : (
                <span
                  className={
                    showInsight && insightTitle === "Zen Insight"
                      ? "text-white"
                      : "text-indigo-400/70"
                  }
                >
                  ✨
                </span>
              )}
              Explain
            </button>
            <button
              onMouseDown={preventDrag}
              onClick={() => handleTranslate(inputText)}
              disabled={
                isLoading || !inputText.trim() || (!isPro && balance <= 0)
              }
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/50 disabled:text-slate-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm"
            >
              {isPro || balance > 0 ? "Translate" : "Locked"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
