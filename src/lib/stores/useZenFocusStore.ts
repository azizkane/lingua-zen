import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { openUrl } from "@tauri-apps/plugin-opener";
import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";

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
  isPro: boolean;
  user: User | null;
  userName: string | null;
  userAvatar: string | null;
  fetchBalance: () => Promise<void>;
  initSettings: () => Promise<void>;
  deduct: (amount: number) => Promise<boolean>;
  recharge: () => Promise<void>;
  setTargetLang: (lang: string) => Promise<void>;
  setInsightLang: (lang: string) => Promise<void>;
  setActiveModel: (model: string) => Promise<void>;
  addRecentLanguage: (lang: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useZenFocusStore = create<ZenFocusState>((set, get) => {
  // Global Event Listeners with small sync delays
  listen<number>("focus-update", (event) => {
    setTimeout(() => set({ balance: event.payload }), 50);
  });

  listen<string>("settings-update", (event) => {
    setTimeout(() => set({ targetLang: event.payload }), 50);
  });

  listen<string>("insight-lang-update", (event) => {
    setTimeout(() => set({ insightLang: event.payload }), 50);
  });

  listen<string>("model-update", (event) => {
    setTimeout(() => set({ activeModel: event.payload }), 50);
  });

  listen<boolean>("pro-update", (event) => {
    setTimeout(() => set({ isPro: event.payload }), 100);
  });

  // Supabase Auth Listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(`DEBUG: Supabase Auth Event [${event}]`, session?.user?.email);
    
    if (session?.user) {
      set({ 
        user: session.user,
        userName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        userAvatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
      });
    } else {
      set({ user: null, userName: null, userAvatar: null });
    }
    
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      setTimeout(() => get().initSettings(), 200);
    }
  });

  return {
    balance: 10,
    isLoading: true,
    targetLang: "French",
    insightLang: "English",
    activeModel: "google/gemini-2.0-flash-001",
    availableModels: [],
    recentTargetLangs: ["French", "English", "Spanish"],
    isPro: false,
    user: null,
    userName: null,
    userAvatar: null,
    
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
        const { data: { session } } = await supabase.auth.getSession();
        
        const fetchSetting = async <T>(cmd: string, defaultValue: T): Promise<T> => {
          try { return await invoke<T>(cmd); } 
          catch (e) { return defaultValue; }
        };

        const [lang, iLang, model, models, proStatus] = await Promise.all([
          fetchSetting<string>("get_target_lang", "French"),
          fetchSetting<string>("get_insight_lang", "English"),
          fetchSetting<string>("get_active_model", "google/gemini-2.0-flash-001"),
          fetchSetting<ModelInfo[]>("get_available_models", []),
          fetchSetting<boolean>("get_pro_active", false)
        ]);

        set({ 
          targetLang: lang, 
          insightLang: iLang,
          activeModel: model, 
          availableModels: models,
          isPro: proStatus,
          user: session?.user || null,
          userName: session?.user.user_metadata?.full_name || session?.user.user_metadata?.name || null,
          userAvatar: session?.user.user_metadata?.avatar_url || session?.user.user_metadata?.picture || null
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    },

    deduct: async (amount: number) => {
      if (get().isPro) return true;
      try {
        const newBalance = await invoke<number>("deduct_focus_points", { amount });
        set({ balance: newBalance });
        return true;
      } catch (error) {
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
      } catch (error) {}
    },

    setInsightLang: async (lang: string) => {
      try {
        await invoke("save_insight_lang", { lang });
        set({ insightLang: lang });
      } catch (error) {}
    },

    setActiveModel: async (model: string) => {
      try {
        await invoke("save_active_model", { model });
        await invoke("refresh_ai_service");
        set({ activeModel: model });
      } catch (error) {}
    },

    addRecentLanguage: (lang: string) => {
      const current = get().recentTargetLangs;
      const updated = [lang, ...current.filter(l => l !== lang)].slice(0, 3);
      set({ recentTargetLangs: updated });
    },

    signInWithGoogle: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "lingua-zen://auth-callback",
          skipBrowserRedirect: true
        }
      });
      if (data?.url) await openUrl(data.url);
    },

    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, userName: null, userAvatar: null });
    }
  };
});
