"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePolish } from "@/hooks/usePolish";
import { usePersistedState } from "@/hooks/usePersistedState";
import { ModeSelector } from "@/components/ModeSelector";
import { ToneSelector } from "@/components/ToneSelector";
import { TextInput } from "@/components/TextInput";
import { OutputPanel } from "@/components/OutputPanel";
import { DiffView } from "@/components/DiffView";
import { PasteButton } from "@/components/PasteButton";
import { CopyButton } from "@/components/CopyButton";
import type { Mode, Tone } from "@/lib/schema";

const DEFAULT_MODE: Mode = "fix";
const DEFAULT_TONE: Tone = "neutral";

export default function Page() {
  const [mode, setMode] = usePersistedState<Mode>("awal:mode", DEFAULT_MODE);
  const [tone, setTone] = usePersistedState<Tone>("awal:tone", DEFAULT_TONE);
  const [diffEnabled, setDiffEnabled] = usePersistedState<boolean>("awal:diff", false);
  const [text, setText] = useState("");

  const { status, result, error, loading, run } = usePolish();
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Tone is only relevant for improve/rewrite; reset to neutral when in fix mode
  useEffect(() => {
    if (mode === "fix") setTone("neutral");
  }, [mode, setTone]);

  const handlePaste = useCallback(async () => {
    const clipboardText = await navigator.clipboard.readText().catch(() => null);
    if (clipboardText !== null) {
      setText(clipboardText);
      inputRef.current?.focus();
    }
  }, []);

  const handleTextChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const handlePolish = useCallback(() => {
    if (!text.trim()) return;
    run(text, mode, tone);
  }, [run, text, mode, tone]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed — silently ignore
    }
  }, [result]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handlePolish();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        handleCopy();
      }
    },
    [handlePolish, handleCopy],
  );

  const empty = !text.trim();
  const toneVisible = mode === "improve" || mode === "rewrite";

  let statusMessage: string | null = null;
  let statusType: "info" | "error" | "success" = "info";

  if (status === "error") {
    statusMessage = error ?? "Something went wrong.";
    statusType = "error";
  } else if (status === "loading") {
    statusMessage = "Polishing…";
  } else if (status === "done") {
    if (!result || result === text) {
      statusMessage = "No changes needed ✓";
      statusType = "success";
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <header className="border-b border-solid border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">AWAL</span>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            polish
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mx-auto max-w-3xl px-4 mt-0.5">
          Paste text. Get it fixed or improved. Copy. Done.
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">

          {/* Mode selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">
              Mode
            </span>
            <ModeSelector mode={mode} onChange={setMode} />
          </div>

          {/* Tone selector (conditional) */}
          {toneVisible && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 shrink-0">
                Tone
              </span>
              <ToneSelector tone={tone} onChange={setTone} />
            </div>
          )}

          {/* Input */}
          <section className="flex flex-col gap-3">
            <TextInput
              ref={inputRef}
              value={text}
              onChange={handleTextChange}
              disabled={loading}
              onPaste={handlePaste}
            />
            <div className="flex items-center gap-2">
              <PasteButton onPaste={handlePaste} disabled={loading} />
              <button
                type="button"
                onClick={handlePolish}
                disabled={loading || empty}
                className={`ml-auto flex-1 md:flex-none h-11 px-6 rounded-lg font-medium transition-colors ${
                  loading || empty
                    ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm"
                }`}
              >
                {loading ? "Polishing…" : "Polish"}
              </button>
            </div>
          </section>

          {/* Output */}
          <section className="flex flex-col gap-3">
            <OutputPanel result={result} onCopy={handleCopy} copied={copied} />
            <div className="flex items-center gap-2">
              <CopyButton text={result} onCopy={handleCopy} disabled={loading || !result} />
              <button
                type="button"
                onClick={() => setDiffEnabled((d) => !d)}
                className="h-11 px-3 rounded-lg border border-solid border-gray-200 bg-white text-sm text-gray-600 font-medium hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                aria-pressed={diffEnabled}
                aria-label="Toggle show changes"
              >
                {diffEnabled ? "Hide changes" : "Show changes"}
              </button>
            </div>
            {statusMessage && (
              <p className={`text-sm ${
                statusType === "error"
                  ? "text-red-600 dark:text-red-400"
                  : statusType === "success"
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {statusMessage}
              </p>
            )}
            <DiffView enabled={diffEnabled} input={text} output={result} />
          </section>

        </div>
      </main>

      <footer className="border-t border-solid border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your text is sent to an AI service to be processed and is not stored by this app.
          </p>
        </div>
      </footer>
    </div>
  );
}
