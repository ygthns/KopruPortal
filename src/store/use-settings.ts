import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  applyThemePreset,
  getPresetById,
  type ThemeMode,
  THEME_PRESETS,
} from '@/lib/theme';

type Language = 'en' | 'tr';

type SettingsState = {
  language: Language;
  themeMode: ThemeMode;
  themePresetId: string;
  onboardingComplete: boolean;
  hydrated: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemePreset: (presetId: string) => void;
  setOnboardingComplete: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
};

const defaultState: Omit<
  SettingsState,
  | 'setLanguage'
  | 'toggleLanguage'
  | 'setThemeMode'
  | 'setThemePreset'
  | 'setOnboardingComplete'
  | 'setHydrated'
> = {
  language: 'en',
  themeMode: 'system',
  themePresetId: THEME_PRESETS[0].id,
  onboardingComplete: false,
  hydrated: false,
};

const fallbackStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
} as unknown as Storage;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => {
        const next = get().language === 'en' ? 'tr' : 'en';
        set({ language: next });
      },
      setThemeMode: (themeMode) => set({ themeMode }),
      setThemePreset: (themePresetId) => {
        const preset = getPresetById(themePresetId);
        applyThemePreset(preset);
        set({ themePresetId });
      },
      setOnboardingComplete: (onboardingComplete) =>
        set({ onboardingComplete }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'koprumezun.settings',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? fallbackStorage : window.localStorage,
      ),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const preset = getPresetById(state.themePresetId);
        applyThemePreset(preset);
      },
    },
  ),
);
