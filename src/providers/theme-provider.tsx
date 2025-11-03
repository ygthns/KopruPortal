import { useEffect } from 'react';
import {
  applyThemePreset,
  getPresetById,
  setDocumentThemeMode,
} from '@/lib/theme';
import { useSettingsStore } from '@/store/use-settings';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const themePresetId = useSettingsStore((state) => state.themePresetId);
  const setHydrated = useSettingsStore((state) => state.setHydrated);

  useEffect(() => {
    setDocumentThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode !== 'system' || typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      setDocumentThemeMode('system');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [themeMode]);

  useEffect(() => {
    const preset = getPresetById(themePresetId);
    applyThemePreset(preset);
  }, [themePresetId]);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return <>{children}</>;
}
