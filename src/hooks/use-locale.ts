import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/use-settings';

export function useLocale() {
  const { i18n, t } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  return {
    language,
    t,
    changeLanguage: (lng: 'en' | 'tr') => {
      useSettingsStore.getState().setLanguage(lng);
      void i18n.changeLanguage(lng);
    },
  };
}
