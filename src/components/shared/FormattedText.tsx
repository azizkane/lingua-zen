import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * A ultra-lightweight formatter for bold and italic text.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  if (!text) return null;

  // Split text into parts based on bold/italic markers
  // **bold** | *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-bold text-white underline decoration-indigo-500/30 underline-offset-2">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic text-slate-200">{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </span>
  );
};
