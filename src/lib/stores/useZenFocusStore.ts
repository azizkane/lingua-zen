import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface ZenFocusState {
  balance: number;
  isLoading: boolean;
  targetLang: string;
  fetchBalance: () => Promise<void>;
  deduct: (amount: number) => Promise<boolean>;
  setTargetLang: (lang: string) => void;
}

export const useZenFocusStore = create<ZenFocusState>((set, get) => {
  // Listen for updates from Rust (multi-window sync)
  listen<number>("focus-update", (event) => {
    set({ balance: event.payload });
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
    setTargetLang: (lang: string) => {
      set({ targetLang: lang });
    },
  };
});