import React from "react";
import { invoke } from "@tauri-apps/api/core";

interface SettingsButtonProps {
  preventDrag: (e: React.MouseEvent) => void;
  className?: string;
}

export const SettingsButton = ({
  preventDrag,
  className = "absolute top-0 right-6 z-50 px-3 py-2 rounded hover:bg-transparent text-slate-700 hover:text-indigo-400 transition-all border border-transparent",
}: SettingsButtonProps) => (
  <button
    onMouseDown={preventDrag}
    onClick={() => invoke("open_settings")}
    className={className}
    title="Settings"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 13a1.8 1.8 0 0 0 .18-1 1.8 1.8 0 0 0-.18-1l2-1.6a.5.5 0 0 0 .12-.64l-1.9-3.3a.5.5 0 0 0-.62-.22l-2.3.9a6 6 0 0 0-1.7-1l-.3-2.4A.5.5 0 0 0 13.7 2h-3.4a.5.5 0 0 0-.5.43L9.5 4.8a6 6 0 0 0-1.7 1l-2.3-.9a.5.5 0 0 0-.62.22L3 8.42a.5.5 0 0 0 .12.64l2 1.6a4.2 4.2 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.12.64l1.9 3.3a.5.5 0 0 0 .62.22l2.3-.9a6 6 0 0 0 1.7 1l.3 2.37a.5.5 0 0 0 .5.43h3.4a.5.5 0 0 0 .5-.43l.3-2.37a6 6 0 0 0 1.7-1l2.3.9a.5.5 0 0 0 .62-.22l1.9-3.3a.5.5 0 0 0-.12-.64z" />
    </svg>
  </button>
);
