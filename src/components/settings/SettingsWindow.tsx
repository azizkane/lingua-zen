import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useZenFocusStore } from "../../lib/stores/useZenFocusStore";

const LANGUAGES = [
  "French", "English", "Spanish", "German", 
  "Japanese", "Chinese", "Italian", "Portuguese",
  "Russian", "Korean"
];

export const SettingsWindow = () => {
  const { balance, recharge, targetLang, setTargetLang } = useZenFocusStore();
  const [showSavedMsg, setShowSavedMsg] = useState(false);

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
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
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
      className="min-h-screen bg-slate-900 text-white p-10 overflow-y-auto outline-none relative"
    >
      <DragHandle />
      <header className="flex justify-between items-center mb-10 relative z-10 pointer-events-none">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-indigo-400">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your Zen linguistic environment.</p>
        </div>
        {showSavedMsg && (
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 animate-pulse pointer-events-auto">
            ✓ Preferences Auto-Saved
          </span>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm shadow-xl">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm">A/あ</span>
            Language & AI
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Default Target</label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onMouseDown={preventDrag}
                    onClick={() => updateLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${targetLang === lang ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm shadow-xl">
          <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center text-slate-400 text-sm">⌨</span>
            System
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Global Shortcut</label>
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-indigo-400 font-mono text-sm">Alt + Shift + Z</kbd>
                <span className="text-[10px] text-slate-500 leading-tight">Shortcuts can be customized in the next update.</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Zen Balance</label>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-700 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xl font-mono text-white">{balance} Energy</span>
                  <span className="text-[10px] text-slate-500">Free Tier Limit</span>
                </div>
                <button onMouseDown={preventDrag} onClick={recharge} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all text-indigo-300 border border-indigo-500/20">Recharge</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 flex justify-end relative z-10">
        <button onMouseDown={preventDrag} onClick={() => invoke("hide_window")} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 shadow-lg active:scale-95">Done</button>
      </footer>
    </main>
  );
};
