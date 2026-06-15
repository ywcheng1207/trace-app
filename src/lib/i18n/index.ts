import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/lib/i18n/locales/en/common.json';
import zhHans from '@/lib/i18n/locales/zh-Hans/common.json';
import zhHant from '@/lib/i18n/locales/zh-Hant/common.json';

const resources = {
  'zh-Hant': { common: zhHant },
  'zh-Hans': { common: zhHans },
  en: { common: en },
} as const;

type SupportedLocale = 'zh-Hant' | 'zh-Hans' | 'en';

const FALLBACK_LOCALE: SupportedLocale = 'en';

const detectLocale = (): SupportedLocale => {
  for (const locale of getLocales()) {
    const tag = locale.languageTag;
    if (tag.startsWith('zh-Hant') || tag.startsWith('zh-TW') || tag.startsWith('zh-HK')) {
      return 'zh-Hant';
    }
    if (tag.startsWith('zh-Hans') || tag.startsWith('zh-CN') || tag.startsWith('zh-SG')) {
      return 'zh-Hans';
    }
    if (locale.languageCode === 'zh') return 'zh-Hant';
    if (locale.languageCode === 'en') return 'en';
  }
  return FALLBACK_LOCALE;
};

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLocale(),
  fallbackLng: FALLBACK_LOCALE,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
