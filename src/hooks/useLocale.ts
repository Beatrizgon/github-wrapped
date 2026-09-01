// src/hooks/useLocale.ts
import { useState } from 'react';
import { translations } from '../i18n/translations';
import type { Locale } from '../i18n/translations';

export function useLocale() {
  const [locale, setLocale] = useState<Locale>('pt');

  const toggleLocale = () =>
    setLocale((prev) => (prev === 'pt' ? 'en' : 'pt'));

  const t = translations[locale];

  return { locale, toggleLocale, t };
}
