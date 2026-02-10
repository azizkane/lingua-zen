import React, { useState, useRef, useEffect } from "react";

const ALL_LANGUAGES = [
  "French", "English", "Spanish", "German", 
  "Japanese", "Chinese", "Italian", "Portuguese",
  "Russian", "Korean", "Dutch", "Polish", 
  "Turkish", "Swedish", "Indonesian", "Hindi",
  "Arabic", "Thai", "Vietnamese", "Greek",
  "Swahili", 
];

interface LanguageSelectorProps {
  currentLang: string;
  recentLangs: string[];
  onSelect: (lang: string) => void;
  variant: "ghost" | "settings";
  className?: string;
  preventDrag?: (e: React.MouseEvent) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLang, 
  recentLangs, 
  onSelect, 
  variant,
  className,
  preventDrag 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredLangs = ALL_LANGUAGES.filter(l => 
    l.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (lang: string) => {
    onSelect(lang);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* TRIGGER BUTTON */}
      <button 
        onMouseDown={preventDrag}
        onClick={() => setIsOpen(!isOpen)}
        className={variant === "ghost" 
          ? "flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/40 hover:bg-slate-700/60 text-slate-400 text-[10px] font-bold border border-slate-700/30 transition-colors backdrop-blur-sm"
          : "w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 transition-all"
        }
      >
        <span>{currentLang}</span>
        <span className="opacity-50 text-[10px]">▼</span>
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className={`absolute z-[150] bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col ${variant === "ghost" ? "top-full right-0 mt-1 w-40" : "top-full left-0 right-0 mt-2"}`}>
          
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-700/50">
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
            {/* Recent Section (Only if no search) */}
            {!search && recentLangs.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Recent</div>
                {recentLangs.map(lang => (
                  <button
                    key={`recent-${lang}`}
                    onClick={() => handleSelect(lang)}
                    className={`w-full text-left px-2 py-1.5 text-[10px] rounded hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors ${currentLang === lang ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'}`}
                  >
                    {lang}
                  </button>
                ))}
                <div className="h-px bg-slate-700/50 my-1 mx-2"></div>
              </div>
            )}

            {/* All Languages */}
            {!search && <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">All</div>}
            
            {filteredLangs.map(lang => (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`w-full text-left px-2 py-1.5 text-[10px] rounded hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors ${currentLang === lang ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'}`}
              >
                {lang}
              </button>
            ))}

            {filteredLangs.length === 0 && (
              <div className="px-2 py-2 text-[10px] text-slate-500 text-center italic">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
