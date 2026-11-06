"use client";

import { usePersistedState } from "@/hooks/usePersistedState";
import type { Tone } from "@/lib/schema";

interface ToneSelectorProps {
  tone: Tone;
  onChange: (tone: Tone) => void;
}

const TONE_LABELS: Record<Tone, string> = {
  neutral: "Neutral",
  formal: "Formal",
  friendly: "Friendly",
  professional: "Professional",
  concise: "Concise",
};

export function ToneSelector({ tone, onChange }: ToneSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Tone"
      className="inline-flex flex-wrap gap-1 rounded-lg border border-solid border-gray-200 p-1 bg-white dark:bg-gray-900 dark:border-gray-700"
    >
      {Object.values(TONES).map((t) => {
        const active = tone === t;
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={TONE_LABELS[t]}
            onClick={() => onChange(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {TONE_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}

const TONES: Tone[] = ["neutral", "formal", "friendly", "professional", "concise"];
