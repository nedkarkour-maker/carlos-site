"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { en, type ContentBundle } from "@/config/content";
import { fr } from "@/config/content.fr";

/**
 * Client-side EN/FR switch. The page is served in English (so it stays a
 * fully static build); if the visitor picked French before, the saved
 * choice is re-applied right after hydration and remembered in
 * localStorage. `<html lang>` is kept in sync for assistive tech.
 *
 * Newsletter posts follow the same switch: a post is translated when a
 * matching file exists in content/newsletter/fr/, otherwise the English
 * version renders in both languages. See components/LocalizedPost.tsx.
 */

export type Locale = "en" | "fr";

const bundles: Record<Locale, ContentBundle> = { en, fr };
const STORAGE_KEY = "locale";

// The choice lives in localStorage, read through useSyncExternalStore so
// hydration stays clean (the server snapshot is always "en"). If storage
// is unavailable (private mode), the in-memory value keeps the toggle
// working for the visit; `overridden` makes it win over a stale stored
// value that couldn't be replaced.
let memoryLocale: Locale = "en";
let overridden = false;
const listeners = new Set<() => void>();

function subscribeToLocale(listener: () => void) {
  // Also re-reads on cross-tab changes (the storage event).
  window.addEventListener("storage", listener);
  listeners.add(listener);
  return () => {
    window.removeEventListener("storage", listener);
    listeners.delete(listener);
  };
}

function readLocale(): Locale {
  if (overridden) return memoryLocale;
  try {
    // Only the exact value "fr" flips the language — anything else that
    // might be sitting in storage falls back to the EN default.
    return window.localStorage.getItem(STORAGE_KEY) === "fr" ? "fr" : "en";
  } catch {
    return memoryLocale;
  }
}

const serverLocale = (): Locale => "en";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    readLocale,
    serverLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    memoryLocale = next;
    overridden = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted — the toggle still works for this visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/** The active locale and the setter (for the navbar toggle). */
export function useLocale() {
  return useContext(LocaleContext);
}

/** All visitor copy in the active language. */
export function useContent(): ContentBundle {
  return bundles[useContext(LocaleContext).locale];
}
