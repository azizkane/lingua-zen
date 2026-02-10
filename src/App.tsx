import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { GhostWindow } from "./components/ghost/GhostWindow";
import { SettingsWindow } from "./components/settings/SettingsWindow";
import "./App.css";

function App() {
  const [windowLabel, setWindowLabel] = useState("");

  useEffect(() => {
    setWindowLabel(getCurrentWindow().label);
  }, []);

  if (windowLabel === "settings") {
    return <SettingsWindow />;
  }

  // Default to Ghost Window
  return <GhostWindow />;
}

export default App;