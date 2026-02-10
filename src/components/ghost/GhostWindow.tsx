import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { BreathingLoader } from "../BreathingLoader";
import { useZenFocusStore } from "../../lib/stores/useZenFocusStore";
import { useZenTranslation } from "../../hooks/useZenTranslation";

const MAX_CHARS = 1000;
const LANGUAGES = [
  "French", "English", "Spanish", "German", 
  "Japanese", "Chinese", "Italian", "Portuguese",
  "Russian", "Korean"
];

export const GhostWindow = () => {
  const {
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
  } = useZenTranslation();

  const { balance, recharge, targetLang, setTargetLang } = useZenFocusStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const startDrag = () => invoke("start_drag");
  const preventDrag = (e: React.MouseEvent) => e.stopPropagation();

  const toggleSticky = async () => {
    const newState = await invoke<boolean>("toggle_sticky");
    setIsSticky(newState);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isPickerOpen) setIsPickerOpen(false);
      else if (showExplanation) setShowExplanation(false);
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
    setIsPickerOpen(false);
    if (inputText.trim()) {
      handleTranslate(inputText, lang);
    }
  };

  const DragHandle = () => (
    <div 
      className="absolute top-0 left-0 right-0 h-14 cursor-move select-none z-0" 
      onMouseDown={startDrag}
    />
  );

  return (
    <main 
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex flex-col items-center justify-start h-screen bg-[#0f172a] text-white border border-slate-700 rounded-xl p-6 shadow-2xl overflow-hidden transition-all duration-500 outline-none relative ${isPulsing ? 'ring-4 ring-indigo-500/50' : 'ring-0'}`}
    >
      <DragHandle />

      <div className="w-full flex justify-between items-center mb-4 border-b border-slate-800 pb-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-indigo-400">Lingua-Zen</h1>
          <div className="relative pointer-events-auto">
            <button 
              onMouseDown={preventDrag}
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 transition-colors"
            >
              {targetLang} ▾
            </button>
            {isPickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onMouseDown={preventDrag}
                    onClick={() => updateLanguage(lang)}
                    className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-indigo-600 transition-colors ${targetLang === lang ? 'text-indigo-400 bg-slate-900' : 'text-slate-300'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-full border border-slate-800 shadow-inner mr-1">
            <div className={`w-2 h-2 rounded-full ${balance > 0 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-rose-500'}`}></div>
            <span className="text-xs font-mono text-slate-300">{balance} E</span>
          </div>

          <button 
            onMouseDown={preventDrag}
            onClick={toggleSticky}
            className={`p-1 rounded-lg transition-all ${isSticky ? 'text-indigo-400 bg-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
            title={isSticky ? "Unpin (Ghost Mode)" : "Pin (Sticky Mode)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isSticky ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 4-4 4-4-4"/><path d="M4 12v8h16v-8"/><path d="M2 14h20"/></svg>
          </button>
          
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-medium border border-indigo-500/30">
            Gemini 2.0
          </span>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col space-y-4 relative z-10 min-h-0">
        <div className="relative shrink-0">
          <textarea
            ref={textareaRef}
            value={inputText}
            maxLength={MAX_CHARS}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Select text to translate..."
            className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm"
          />
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-600 font-mono pointer-events-none">
            {inputText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* FLEXIBLE RESULT AREA */}
        <div className="flex-1 min-h-[120px] bg-slate-950/50 border border-dashed border-slate-800 rounded-lg relative flex overflow-hidden">
          {isLoading && !showExplanation && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-2">
                <BreathingLoader />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                  Zen {loadingType}...
                </span>
              </div>
            </div>
          )}

          {error ? (
            <div className="w-full p-4 text-rose-400 text-[10px] leading-tight overflow-auto custom-scrollbar">
              <p className="font-bold mb-1 underline">Zen Error:</p>
              <p>{error}</p>
            </div>
          ) : balance <= 0 && !translation ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-slate-400 text-sm font-medium">Zen Focus Depleted</p>
              <button 
                onMouseDown={preventDrag}
                onClick={recharge}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Recharge Energy (Test Mode +100)
              </button>
            </div>
          ) : (
            <>
              {/* Translation Pane */}
              <div 
                className={`p-4 overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${
                  showExplanation ? "w-1/2 border-r border-slate-800" : "w-full"
                }`}
              >
                {translation ? (
                  <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                    {translation}
                  </p>
                ) : (
                  <p className="text-slate-600 text-sm italic">
                    {isPulsing ? "Zen detected a copy..." : "Insight will appear here..."}
                  </p>
                )}
              </div>

              {/* Explanation Pane */}
              <div
                className={`bg-slate-900/30 transition-all duration-500 ease-in-out overflow-hidden flex flex-col ${
                  showExplanation ? "w-1/2 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <div className="flex items-center gap-2 p-3 border-b border-slate-800 shrink-0">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">✨ Zen Insight</span>
                  <button
                    onMouseDown={preventDrag}
                    onClick={() => setShowExplanation(false)}
                    className="ml-auto text-[10px] text-slate-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                  {isLoading && loadingType === "explain" ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <BreathingLoader />
                      <span className="text-[9px] text-indigo-400 font-bold animate-pulse">Explaining...</span>
                    </div>
                  ) : (
                    <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                      {explanation}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 pb-2 shrink-0">
          <div className="flex gap-3 text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ENTER</kbd> Translate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</kbd> Hide</span>
          </div>

          <div className="flex gap-2">
            <button
              onMouseDown={preventDrag}
              onClick={handleExplain}
              disabled={isLoading || !inputText.trim() || balance < 3}
              className={`px-4 py-2 border rounded-lg font-bold transition-all active:scale-95 text-sm flex items-center gap-1.5 ${
                showExplanation
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-800/50 hover:bg-slate-700 text-indigo-300 border-slate-700"
              }`}
            >
              <span className={showExplanation ? "text-white" : "text-indigo-400"}>✨</span> Explain
            </button>
            <button
              onMouseDown={preventDrag}
              onClick={() => handleTranslate(inputText)}
              disabled={isLoading || !inputText.trim() || balance <= 0}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm"
            >
              {balance > 0 ? "Translate" : "Locked"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};