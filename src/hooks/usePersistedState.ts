"use client";

import { useState, useCallback, useEffect } from "react";
import { getItem, setItem } from "@/lib/storage";

export function usePersistedState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);

  // Read from localStorage once on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = getItem(key, null as unknown as T);
      if (stored !== null && stored !== undefined) {
        setValue(stored);
      }
    } catch {
      // keep initialValue
    }
  }, [key, initialValue]);

  const setPersistedValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof nextValue === "function" ? (nextValue as (prev: T) => T)(prev) : nextValue;
        try {
          setItem(key, resolved);
        } catch {
          // ignore storage errors
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setPersistedValue];
}
