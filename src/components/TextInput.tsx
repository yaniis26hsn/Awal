"use client";

import { forwardRef, useRef, useCallback } from "react";
import { readClipboard } from "@/lib/clipboard";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxChars?: number;
  onPaste?: () => void;
}

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  function TextInput(
    { value, onChange, disabled = false, maxChars = 5000, onPaste },
    ref,
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handlePaste = useCallback(async () => {
      if (disabled) return;
      const text = await readClipboard();
      if (text !== null) {
        onChange(text);
        onPaste?.();
      }
    }, [disabled, onChange, onPaste]);

    const remaining = Math.max(0, maxChars - value.length);

    return (
      <div className="relative group">
        <textarea
          ref={(el) => {
            textareaRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
          }}
          dir="auto"
          spellCheck={true}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          disabled={disabled}
          maxLength={maxChars}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type your text…"
          className="w-full min-h-[160px] md:min-h-[220px] resize-none rounded-xl border border-solid border-gray-200 bg-white p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-gray-600 transition-colors"
          aria-label="Input text"
        />
        {remaining < 200 && remaining >= 0 && (
          <span className="absolute right-4 bottom-3 text-xs text-gray-500 dark:text-gray-400">
            {remaining} characters left
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
