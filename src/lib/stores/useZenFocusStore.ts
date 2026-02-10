import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export interface ModelInfo {
  id: string;
  name: string;
  source: string;
  description: string;
}

interface ZenFocusState {
  balance: number;
  isLoading: boolean;
  targetLang: string;
  insightLang: string;
  activeModel: string;
  availableModels: ModelInfo[];
  recentTargetLangs: string[];
  isPro: boolean; // New state
  fetchBalance: () => Promise<void>;
  initSettings: () => Promise<void>;
  deduct: (amount: number) => Promise<boolean>;
  recharge: () => Promise<void>;
  setTargetLang: (lang: string) => Promise<void>;
  setInsightLang: (lang: string) => Promise<void>;
  setActiveModel: (model: string) => Promise<void>;
  addRecentLanguage: (lang: string) => void;
}

export const useZenFocusStore = create<ZenFocusState>((set, get) => {
  listen<number>("focus-update", (event) => {
    set({ balance: event.payload });
  });

  listen<string>("settings-update", (event) => {
    set({ targetLang: event.payload });
  });

  listen<string>("insight-lang-update", (event) => {
    set({ insightLang: event.payload });
  });

  listen<string>("model-update", (event) => {
    set({ activeModel: event.payload });
  });

  return {
    balance: 10,
    isLoading: true,
    targetLang: "French",
    insightLang: "English",
    activeModel: "google/gemini-2.0-flash-001",
    availableModels: [],
    recentTargetLangs: ["French", "English", "Spanish"],
    isPro: false, // Default to free tier
    
    fetchBalance: async () => {
      try {
        const balance = await invoke<number>("get_focus_balance");
        set({ balance, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        set({ isLoading: false });
      }
    },
    initSettings: async () => {
      try {
        const [lang, iLang, model, models] = await Promise.all([
          invoke<string>("get_target_lang"),
          invoke<string>("get_insight_lang"),
          invoke<string>("get_active_model"),
          invoke<ModelInfo[]>("get_available_models")
        ]);
        set({ 
          targetLang: lang, 
          insightLang: iLang,
          activeModel: model, 
          availableModels: models 
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    },
    deduct: async (amount: number) => {
      // PRO BYPASS
      if (get().isPro) return true;

      try {
        const newBalance = await invoke<number>("deduct_focus_points", { amount });
        set({ balance: newBalance });
        return true;
      } catch (error) {
        console.error("Deduction failed:", error);
        return false;
      }
    },
    recharge: async () => {
      try {
        const newBalance = await invoke<number>("debug_recharge_focus");
        set({ balance: newBalance });
      } catch (error) {
        console.error("Recharge failed:", error);
      }
    },
    setTargetLang: async (lang: string) => {
      try {
        await invoke("save_target_lang", { lang });
        get().addRecentLanguage(lang);
        set({ targetLang: lang });
      } catch (error) {
        console.error("Failed to save language:", error);
      }
    },
    setInsightLang: async (lang: string) => {
      try {
        await invoke("save_insight_lang", { lang });
        set({ insightLang: lang });
      } catch (error) {
        console.error("Failed to save insight language:", error);
      }
    },
    setActiveModel: async (model: string) => {
      try {
        await invoke("save_active_model", { model });
        await invoke("refresh_ai_service");
        set({ activeModel: model });
      } catch (error) {
        console.error("Failed to save model:", error);
      }
    },
    addRecentLanguage: (lang: string) => {
      const current = get().recentTargetLangs;
      const updated = [lang, ...current.filter(l => l !== lang)].slice(0, 3);
      set({ recentTargetLangs: updated });
    },
  };
});
