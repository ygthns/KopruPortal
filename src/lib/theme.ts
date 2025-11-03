export type ThemePreset = {
  id: string;
  label: string;
  description: string;
  cssVars: Record<string, string>;
  accent?: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    label: 'KöprüMezun Core',
    description: 'Signature cyan and midnight palette',
    cssVars: {
      '--primary': '200 82% 45%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '217 19% 68%',
      '--secondary-foreground': '222.2 47.4% 11.2%',
      '--accent': '180 75% 45%',
      '--accent-foreground': '222.2 47.4% 11.2%',
    },
  },
  {
    id: 'anadolu',
    label: 'Anadolu University',
    description: 'Deep indigo with warm saffron accents',
    cssVars: {
      '--primary': '244 70% 52%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '37 92% 58%',
      '--secondary-foreground': '222.2 47.4% 11.2%',
      '--accent': '203 90% 45%',
      '--accent-foreground': '210 40% 98%',
    },
  },
  {
    id: 'bosphorus',
    label: 'Bosphorus Tech',
    description: 'Marine blues with crisp neutrals',
    cssVars: {
      '--primary': '199 89% 40%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '203 36% 65%',
      '--secondary-foreground': '222.2 47.4% 11.2%',
      '--accent': '332 73% 55%',
      '--accent-foreground': '210 40% 98%',
    },
  },
  {
    id: 'kapadokya',
    label: 'Kapadokya Arts',
    description: 'Terracotta with soft olive contrast',
    cssVars: {
      '--primary': '17 71% 52%',
      '--primary-foreground': '210 40% 98%',
      '--secondary': '104 32% 55%',
      '--secondary-foreground': '222.2 47.4% 11.2%',
      '--accent': '43 96% 59%',
      '--accent-foreground': '222.2 47.4% 11.2%',
    },
  },
];

export type ThemeMode = 'system' | 'light' | 'dark';

export const applyThemePreset = (preset: ThemePreset) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(preset.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const setDocumentThemeMode = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'system') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    root.classList.toggle('dark', prefersDark);
    root.dataset.mode = prefersDark ? 'dark' : 'light';
    return;
  }
  root.classList.toggle('dark', mode === 'dark');
  root.dataset.mode = mode;
};

export const getPresetById = (id: string) =>
  THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
