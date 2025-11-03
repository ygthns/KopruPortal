import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'tr' ? 'TRY' : 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value);

export const randomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const getLocale = () =>
  (typeof window !== 'undefined' && window.navigator.language.slice(0, 2)) ||
  'en';

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const booleanRandom = (chance = 0.5) => Math.random() < chance;
