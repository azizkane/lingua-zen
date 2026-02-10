import React, { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useZenFocusStore } from "../../lib/stores/useZenFocusStore";
import { LanguageSelector } from "../shared/LanguageSelector";

export const SettingsWindow = () => {
  const { 
    balance, 
    recharge, 
    targetLang, 
    setTargetLang, 
    insightLang,
    setInsightLang,
    activeModel, 
    setActiveModel,
    availableModels,
    recentTargetLangs,
    isPro,
    initSettings 
  } = useZenFocusStore();
  
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    initSettings();
  }, []);

  const selectedModelInfo = useMemo(() => {
    return availableModels.find(m => m.id === activeModel);
  }, [availableModels, activeModel]);

  const startDrag = () => invoke("start_drag");
  const preventDrag = (e: React.MouseEvent) => e.stopPropagation();

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      await invoke("hide_window");
    }
  };

  const updateLanguage = async (lang: string) => {
    await setTargetLang(lang);
    triggerSavedMsg();
  };

  const updateInsightLanguage = async (lang: string) => {
    await setInsightLang(lang);
    triggerSavedMsg();
  };

  const updateModel = async (modelId: string) => {
    await setActiveModel(modelId);
    triggerSavedMsg();
  };

  const triggerSavedMsg = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const handleUpgrade = async () => {
    try {
      await invoke("open_checkout");
    } catch (error: any) {
      console.error("Failed to open checkout:", error);
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
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="h-screen bg-slate-900 text-white p-8 overflow-y-auto outline-none relative custom-scrollbar"
    >
      <DragHandle />
      <header className="flex justify-between items-start mb-8 relative z-10 pointer-events-none">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter text-indigo-400">Settings</h1>
            {isPro && (
              <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">Pro</span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-1">Configure your Zen linguistic environment.</p>
          {showSavedMsg && (
            <span className="inline-block mt-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 animate-pulse pointer-events-auto">
              ✓ Preferences Auto-Saved
            </span>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Intelligence</label>
          <select 
            onMouseDown={preventDrag}
            value={activeModel}
            onChange={(e) => updateModel(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[180px] cursor-pointer"
          >
            {availableModels.length > 0 ? (
              availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.source})
                </option>
              ))
            ) : (
              <option disabled>Loading models...</option>
            )}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {!isPro && (
          <section className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 border border-indigo-400/30 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white">Unlock Lingua-Zen Pro</h2>
                <ul className="text-indigo-100 text-xs space-y-1 opacity-90">
                  <li className="flex items-center gap-2">✓ Unlimited Zen Energy (No recharges)</li>
                  <li className="flex items-center gap-2">✓ Priority Access to New Models</li>
                  <li className="flex items-center gap-2">✓ Cultural Risk Intelligence</li>
                </ul>
              </div>
              <button 
                onMouseDown={preventDrag}
                onClick={handleUpgrade}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-xl pointer-events-auto"
              >
                UPGRADE NOW
              </button>
            </div>
          </section>
        )}

        {/* Translation Language */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl z-30">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">A/あ</span>
            Translation
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Default Target</label>
              <LanguageSelector 
                currentLang={targetLang}
                recentLangs={recentTargetLangs}
                onSelect={updateLanguage}
                variant="settings"
                preventDrag={preventDrag}
              />
            </div>
          </div>
        </section>

        {/* Insight Language */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl z-20">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">💡</span>
            Insights & Mnemonics
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Communication Language</label>
              <LanguageSelector 
                currentLang={insightLang}
                recentLangs={recentTargetLangs} 
                onSelect={updateInsightLanguage}
                variant="settings"
                preventDrag={preventDrag}
              />
              <p className="text-[9px] text-slate-500 mt-2 italic">* Language used for memory aids.</p>
            </div>
          </div>
        </section>

        {/* AI Details */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl md:col-span-2">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">AI</span>
            Intelligence Details
          </h2>
          <div className="p-4 bg-slate-950/50 border border-slate-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Selected Model</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">
                {selectedModelInfo?.source || 'Unknown'}
              </span>
            </div>
            <p className="text-xs font-bold text-white mb-1">
              {selectedModelInfo?.name || 'Loading model...'}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-2 italic border-t border-slate-800 pt-2">
              {selectedModelInfo?.description || 'No description available.'}
            </p>
          </div>
        </section>

        {/* System Section */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl md:col-span-2">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-slate-500/20 flex items-center justify-center text-slate-400 text-xs">⌨</span>
            System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Global Shortcut</label>
              <kbd className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-indigo-400 font-mono text-xs inline-block">Alt + Shift + Z</kbd>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Zen Balance</label>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-700 rounded-lg">
                <span className="text-lg font-mono text-white">{isPro ? '∞' : balance} E</span>
                <button onMouseDown={preventDrag} onClick={recharge} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold transition-all text-indigo-300 border border-indigo-500/20">Recharge</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-8 flex justify-end relative z-10 pb-4">
        <button onMouseDown={preventDrag} onClick={() => invoke("hide_window")} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all border border-indigo-500/50 shadow-lg active:scale-95 text-sm">Done</button>
      </footer>
    </main>
  );
};
