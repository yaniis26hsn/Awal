"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import type { Mode } from "@/lib/schema";

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const MODE_LABELS: Record<Mode, string> = {
  fix: "Fix errors",
  improve: "Improve",
  rewrite: "Rewrite",
};

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Polishing mode"
      className="inline-flex flex-wrap gap-1 rounded-lg border border-solid border-gray-200 p-1 bg-white dark:bg-gray-900 dark:border-gray-700"
    >
      {Object.values(MODES).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={MODE_LABELS[m]}
            onClick={() => onChange(m)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        );
      })}
    </div>
  );
}

const MODES: Mode[] = ["fix", "improve", "rewrite"];
