import { useEffect, useState, useRef } from "react";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { BreathingLoader } from "./components/BreathingLoader";
import { useZenFocusStore } from "./lib/stores/useZenFocusStore";
import "./App.css";

const MAX_CHARS = 1000;

const LANGUAGES = [
  "French", "English", "Spanish", "German", 
  "Japanese", "Chinese", "Italian", "Portuguese",
  "Russian", "Korean"
];

function App() {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const { balance, fetchBalance, deduct, recharge, targetLang, setTargetLang } = useZenFocusStore();

  const handleTranslate = async (textToTranslate: string, lang?: string) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed || balance <= 0 || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await invoke<string>("translate_text", { 
        text: trimmed.slice(0, MAX_CHARS),
        targetLang: lang || targetLang
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
    fetchBalance();
    
    let unlistenGhost: UnlistenFn | null = null;
    let unlistenPulse: UnlistenFn | null = null;

    const setupListeners = async () => {
      unlistenGhost = await listen("ghost-shown", async () => {
        setTranslation("");
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

  // Trigger re-translation when language changes
  useEffect(() => {
    if (inputText.trim() && !isLoading && translation) {
      handleTranslate(inputText);
    }
  }, [targetLang]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isPickerOpen) {
        setIsPickerOpen(false);
      } else {
        e.preventDefault();
        await invoke("hide_window");
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslate(inputText);
    }
  };

  return (
    <main 
      ref={mainRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex flex-col items-center justify-start min-h-screen bg-[#0f172a] text-white border border-slate-700 rounded-xl p-6 shadow-2xl overflow-hidden transition-all duration-500 outline-none ${isPulsing ? 'ring-4 ring-indigo-500/50' : 'ring-0'}`}
    >
      <div className="w-full flex justify-between items-center mb-4 border-b border-slate-800 pb-2 relative" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-indigo-400 pointer-events-none">Lingua-Zen</h1>
          <div className="relative">
            <button 
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 transition-colors"
            >
              {targetLang} ▾
            </button>
            
            {isPickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setTargetLang(lang);
                      setIsPickerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-indigo-600 transition-colors ${targetLang === lang ? 'text-indigo-400 bg-slate-900' : 'text-slate-300'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-full border border-slate-800 shadow-inner">
            <div className={`w-2 h-2 rounded-full ${balance > 0 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-rose-500'}`}></div>
            <span className="text-xs font-mono text-slate-300">{balance} E</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="relative">
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

        <div className="min-h-[120px] max-h-[180px] overflow-y-auto bg-slate-950/50 border border-dashed border-slate-800 rounded-lg p-4 relative custom-scrollbar">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
              <BreathingLoader />
            </div>
          ) : error ? (
            <div className="text-rose-400 text-[10px] leading-tight overflow-auto max-h-[100px]">
              <p className="font-bold mb-1 underline">Zen Error:</p>
              <p>{error}</p>
            </div>
          ) : balance <= 0 && !translation ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-slate-400 text-sm font-medium">Zen Focus Depleted</p>
              <button 
                onClick={recharge}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Recharge Energy (Test Mode +100)
              </button>
            </div>
          ) : translation ? (
            <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">{translation}</p>
          ) : (
            <p className="text-slate-600 text-sm italic">
              {isPulsing ? "Zen detected a copy..." : "Insight will appear here..."}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-3 text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ENTER</kbd> Translate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</kbd> Hide
            </span>
          </div>
          <button 
            onClick={() => handleTranslate(inputText)}
            disabled={isLoading || !inputText.trim() || balance <= 0}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm"
          >
            {balance > 0 ? 'Translate' : 'Locked'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
