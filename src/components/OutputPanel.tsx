"use client";

interface OutputPanelProps {
  result: string;
  onCopy: () => void;
  copied: boolean;
}

export function OutputPanel({ result, onCopy, copied }: OutputPanelProps) {
  const hasResult = result.length > 0;

  return (
    <div className="relative group">
      <div
        className="rounded-xl border border-solid border-gray-200 bg-white p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 min-h-[160px] md:min-h-[220px] break-words whitespace-pre-wrap"
        aria-live="polite"
        aria-label="Polished result"
      >
        {hasResult ? result : "Result (streams in)"}
      </div>

      {hasResult && (
        <button
          type="button"
          onClick={onCopy}
          disabled={copied}
          className="absolute top-3 right-3 h-9 w-9 rounded-full border border-solid border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={copied ? "Copied" : "Copy result"}
          title={copied ? "Copied ✓" : "Copy"}
        >
          {copied ? (
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
