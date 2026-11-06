"use client";

import { diffWords } from "diff";

interface DiffViewProps {
  enabled: boolean;
  input: string;
  output: string;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// We render with React elements only (no dangerouslySetInnerHTML) per PROJECT.md security rules.
export function DiffView({ enabled, input, output }: DiffViewProps) {
  if (!enabled) return null;

  const parts = diffWords(input, output);

  return (
    <div className="mt-4 rounded-xl border border-solid border-gray-200 bg-gray-50 p-4 dark:bg-gray-800 dark:border-gray-700 max-h-[400px] overflow-y-auto text-sm leading-relaxed">
      <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Changes vs. original
      </p>
      {parts.map((part, i) => {
        const text = escapeHtml(part.value);
        if (part.added) {
          return (
            <span key={i} className="bg-green-100 text-green-900 rounded px-0.5 dark:bg-green-900/30 dark:text-green-300">
              {text}
            </span>
          );
        }
        if (part.removed) {
          return (
            <span key={i} className="bg-red-100 text-red-900 line-through rounded px-0.5 dark:bg-red-900/30 dark:text-red-300">
              {text}
            </span>
          );
        }
        return <span key={i} className="text-gray-700 dark:text-gray-300">{text}</span>;
      })}
    </div>
  );
}
