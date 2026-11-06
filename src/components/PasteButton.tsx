"use client";

import { writeClipboard } from "@/lib/clipboard";

interface PasteButtonProps {
  onPaste: () => void;
  disabled?: boolean;
}

export function PasteButton({ onPaste, disabled = false }: PasteButtonProps) {
  return (
    <button
      type="button"
      onClick={onPaste}
      disabled={disabled}
      className="flex items-center gap-2 h-11 px-4 rounded-lg border border-solid border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Paste from clipboard"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      Paste
    </button>
  );
}
