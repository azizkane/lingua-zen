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
    user,
    userName,
    userAvatar,
    signInWithGoogle,
    signOut,
    initSettings 
  } = useZenFocusStore();
  
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const verifySubscription = async () => {
    setIsVerifying(true);
    await initSettings();
    setTimeout(() => setIsVerifying(false), 1000);
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
          <p className="text-slate-500 text-sm mt-1">Configure your Zen linguistic environment.</p>
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
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[180px] cursor-pointer"
          >
            {availableModels.length > 0 ? (
              availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.source})
                </option>
              ))
            ) : (
              <option disabled>No Models (Retry init...)</option>
            )}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* ACCOUNT SECTION */}
        <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm shadow-xl flex flex-col justify-between overflow-hidden">
          <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">👤</span>
            Zen Identity
          </h2>
          {user ? (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                {userAvatar ? (
                  <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-indigo-500/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold uppercase shadow-inner">
                    {userName?.[0] || user.email?.[0]}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm text-white truncate font-bold tracking-tight">{userName || "Zen User"}</span>
                  <span className="text-[10px] text-slate-500 truncate font-mono">{user.email}</span>
                </div>
              </div>
              <button 
                onMouseDown={preventDrag}
                onClick={signOut}
                className="w-full py-2 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] text-slate-400 italic">Sign in to sync your Pro status and history.</p>
              <button 
                onMouseDown={preventDrag}
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 py-3 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all active:scale-95 shadow-lg"
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-1.5 4.14-4.74 7.02-9.21 8.3l7.98 6.19c4.66-4.32 7.27-10.71 7.27-18.96z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.13 1.42-4.85 2.26-7.91 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                Continue with Google
              </button>
            </div>
          )}
        </section>

        {/* PRO SECTION */}
        {!isPro ? (
          <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 border border-indigo-400/30 shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Unlock Pro</h2>
                <ul className="text-indigo-100 text-[10px] space-y-1 opacity-90">
                  <li className="flex items-center gap-2">✓ Unlimited Zen Energy</li>
                  <li className="flex items-center gap-2">✓ Cultural Risk Intelligence</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onMouseDown={preventDrag}
                  onClick={handleUpgrade}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-black text-xs hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                >
                  UPGRADE
                </button>
                <button 
                  onMouseDown={preventDrag}
                  onClick={verifySubscription}
                  className="text-[9px] text-indigo-200/60 hover:text-white transition-colors uppercase tracking-widest font-bold text-center"
                >
                  {isVerifying ? "Checking..." : "Sync Cloud Pro"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-emerald-400">Pro Active</h2>
                <p className="text-[10px] text-slate-400">Synced via Cloud.</p>
              </div>
            </div>
            <button 
              onMouseDown={preventDrag}
              onClick={() => invoke("save_pro_status", { status: false })}
              className="mt-4 text-[9px] text-slate-600 hover:text-rose-400 transition-colors uppercase tracking-widest font-bold"
            >
              (Debug) Reset
            </button>
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
              <p className="text-[9px] text-slate-500 mt-2 italic">* Used for memory aids.</p>
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
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">{selectedModelInfo?.source || 'Unknown'}</span>
            </div>
            <p className="text-xs font-bold text-white mb-1">{selectedModelInfo?.name || 'Loading model...'}</p>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-2 italic border-t border-slate-800 pt-2">{selectedModelInfo?.description}</p>
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
