import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface ZenFocusState {
  balance: number;
  isLoading: boolean;
  targetLang: string;
  fetchBalance: () => Promise<void>;
  initSettings: () => Promise<void>;
  deduct: (amount: number) => Promise<boolean>;
  recharge: () => Promise<void>;
  setTargetLang: (lang: string) => Promise<void>;
}

export const useZenFocusStore = create<ZenFocusState>((set, get) => {
  // Sync Focus Balance
  listen<number>("focus-update", (event) => {
    set({ balance: event.payload });
  });

  // Sync Settings across windows
  listen<string>("settings-update", (event) => {
    set({ targetLang: event.payload });
  });

  return {
    balance: 10,
    isLoading: true,
    targetLang: "French",
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
        const lang = await invoke<string>("get_target_lang");
        set({ targetLang: lang });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    },
    deduct: async (amount: number) => {
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
        set({ targetLang: lang });
      } catch (error) {
        console.error("Failed to save language:", error);
      }
    },
  };
});