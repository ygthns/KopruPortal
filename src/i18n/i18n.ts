import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import tr from './tr.json';

export const resources = {
  en: { translation: en },
  tr: { translation: tr },
} as const;

const defaultLanguage =
  (typeof window !== 'undefined' &&
    window.localStorage.getItem('koprumezun.lang')) ||
  (typeof navigator !== 'undefined' && navigator.language.startsWith('tr')
    ? 'tr'
    : 'en');

void i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  keySeparator: '.',
  returnObjects: true,
  detection: {
    order: ['localStorage', 'navigator'],
    caches: [],
  },
});

export default i18n;
