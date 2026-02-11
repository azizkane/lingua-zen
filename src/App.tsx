import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";
import { GhostWindow } from "./components/ghost/GhostWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import { useZenFocusStore } from "./lib/stores/useZenFocusStore";
import { supabase } from "./lib/supabase";
import "./App.css";

function App() {
  const [windowLabel, setWindowLabel] = useState("");
  const { initSettings } = useZenFocusStore();

  const processDeepLink = async (url: string) => {
    console.log("INFO: Processing deep link:", url);
    
    // 1. AUTH CALLBACK
    if (url.includes("auth-callback")) {
      let paramsString = "";
      if (url.includes("#")) {
        paramsString = url.split("#")[1];
      } else if (url.includes("?")) {
        paramsString = url.split("?")[1];
      }

      if (paramsString) {
        const params = new URLSearchParams(paramsString);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        
        if (access_token && refresh_token) {
          console.log("SUCCESS: Initializing Supabase session from deep link...");
          await supabase.auth.setSession({ access_token, refresh_token });
          await initSettings();
        }
      }
    }
    
    // 2. PRO ACTIVATION
    if (url.includes("activate")) {
      console.log("INFO: Pro activation detected.");
      await invoke("save_pro_status", { status: true });
      await initSettings();
    }
  };

  useEffect(() => {
    setWindowLabel(getCurrentWindow().label);
    
    // Listener for Local Dev Browser redirect (localhost:1420/?action=activate)
    const handleStripeRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "activate") {
        await invoke("save_pro_status", { status: true });
        window.history.replaceState({}, document.title, "/");
        await initSettings();
      }
    };

    // SETUP DEEP LINK LISTENERS
    const setupListeners = async () => {
      // Listen for OS native deep links (via plugin)
      const unlistenDeepLink = await onOpenUrl((urls) => {
        urls.forEach(processDeepLink);
      });

      // Listen for links caught by Rust single-instance
      const unlistenEvent = await listen<string>("deep-link-received", (event) => {
        processDeepLink(event.payload);
      });

      return () => {
        unlistenDeepLink();
        unlistenEvent();
      };
    };

    handleStripeRedirect();
    const cleanupPromise = setupListeners();

    return () => {
      cleanupPromise.then(cleanup => cleanup());
    };
  }, []);

  if (windowLabel === "settings") {
    return <SettingsWindow />;
  }

  return <GhostWindow />;
}

export default App;
