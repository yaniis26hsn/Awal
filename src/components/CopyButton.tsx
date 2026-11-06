"use client";

interface CopyButtonProps {
  onCopy: () => void;
  text: string;
  disabled?: boolean;
}

export function CopyButton({ onCopy, text, disabled = false }: CopyButtonProps) {
  const hasText = text.length > 0;

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled || !hasText}
      className={`flex items-center gap-2 h-11 px-4 rounded-lg border border-solid bg-white text-gray-700 font-medium hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
        disabled || !hasText
          ? "border-gray-200 dark:border-gray-700"
          : "border-gray-200 dark:border-gray-700"
      }`}
      aria-label="Copy result to clipboard"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>
      Copy
    </button>
  );
}
