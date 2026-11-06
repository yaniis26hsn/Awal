"use client";

import { useCallback, useRef, useState } from "react";

export type PolishStatus = "idle" | "loading" | "done" | "error";

export interface UsePolishReturn {
  status: PolishStatus;
  result: string;
  error: string | null;
  loading: boolean;
  run: (text: string, mode: string, tone?: string) => void;
  cancel: () => void;
}

export function usePolish(): UsePolishReturn {
  const [status, setStatus] = useState<PolishStatus>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setError(null);
  }, []);

  const run = useCallback(
    async (text: string, mode: string, tone?: string) => {
      cancel();

      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("loading");
      setResult("");
      setError(null);

      try {
        const response = await fetch("/api/polish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode, tone }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let msg = `Request failed (${response.status})`;
          try {
            const body = await response.json();
            if (body.error) msg = body.error;
          } catch {
            // ignore
          }
          throw new Error(msg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setResult(buffer);
          if (controller.signal.aborted) throw new Error("Aborted");
        }

        setStatus("done");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setStatus("idle");
          return;
        }
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [cancel],
  );

  const loading = status === "loading";

  return { status, result, error, loading, run, cancel };
}
