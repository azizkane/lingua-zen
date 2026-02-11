import React from "react";
import { invoke } from "@tauri-apps/api/core";

interface MinimizeButtonProps {
  preventDrag: (e: React.MouseEvent) => void;
  className?: string;
}

export const MinimizeButton = ({
  preventDrag,
  className = "absolute top-0 right-0 z-50 px-3 py-2 rounded hover:bg-transparent text-slate-600 hover:text-indigo-400 transition-all border border-transparent",
}: MinimizeButtonProps) => (
  <button
    onMouseDown={preventDrag}
    onClick={() => invoke("hide_window")}
    className={className}
    title="Minimize"
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
      <path d="M5 12h14" />
    </svg>
  </button>
);
