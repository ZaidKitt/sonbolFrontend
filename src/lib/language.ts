export type Language = "ar" | "en";

const LANGUAGE_STORAGE_KEY = "sonbol-language";

export function isLanguage(value: string | null): value is Language {
  return value === "ar" || value === "en";
}

export function getPreferredLanguage(defaultLanguage: Language = "ar"): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  if (isLanguage(queryLanguage)) {
    return queryLanguage;
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    return defaultLanguage;
  }

  return defaultLanguage;
}

export function storeLanguage(language: Language) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // If browser storage is blocked, query params still preserve language during navigation.
  }
}

export function bookingPath(language: Language, serviceCode?: string) {
  const params = new URLSearchParams({ lang: language });
  if (serviceCode) {
    params.set("service", serviceCode);
  }

  return `/booking?${params.toString()}`;
}
