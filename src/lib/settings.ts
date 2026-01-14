export type AppSettings = {
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: true,
  soundsEnabled: true,
};

let current: AppSettings = { ...DEFAULT_SETTINGS };
const listeners = new Set<() => void>();

export function getSettings(): AppSettings {
  return current;
}

export function setSettings(next: Partial<AppSettings>) {
  current = { ...current, ...next };
  for (const fn of listeners) fn();
}

export function toggleSetting(key: keyof AppSettings) {
  setSettings({ [key]: !current[key] } as Partial<AppSettings>);
}

export function resetSettings() {
  current = { ...DEFAULT_SETTINGS };
  for (const fn of listeners) fn();
}

export function subscribeSettings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Simple React hook without external deps.
 * Works in Expo/React Native.
 */
import { useEffect, useState } from "react";

export function useSettings(): AppSettings {
  const [s, setS] = useState<AppSettings>(getSettings());

  useEffect(() => {
    return subscribeSettings(() => setS(getSettings()));
  }, []);

  return s;
}
