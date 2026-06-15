import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAiCoach from '@/lib/i18n/locales/en/ai-coach.json';
import enAuth from '@/lib/i18n/locales/en/auth.json';
import enCommon from '@/lib/i18n/locales/en/common.json';
import enExercises from '@/lib/i18n/locales/en/exercises.json';
import enMuscle from '@/lib/i18n/locales/en/muscle.json';
import enNav from '@/lib/i18n/locales/en/nav.json';
import enNotify from '@/lib/i18n/locales/en/notify.json';
import enSchedule from '@/lib/i18n/locales/en/schedule.json';
import enSetting from '@/lib/i18n/locales/en/setting.json';
import enStatistics from '@/lib/i18n/locales/en/statistics.json';
import zhHansAiCoach from '@/lib/i18n/locales/zh-Hans/ai-coach.json';
import zhHansAuth from '@/lib/i18n/locales/zh-Hans/auth.json';
import zhHansCommon from '@/lib/i18n/locales/zh-Hans/common.json';
import zhHansExercises from '@/lib/i18n/locales/zh-Hans/exercises.json';
import zhHansMuscle from '@/lib/i18n/locales/zh-Hans/muscle.json';
import zhHansNav from '@/lib/i18n/locales/zh-Hans/nav.json';
import zhHansNotify from '@/lib/i18n/locales/zh-Hans/notify.json';
import zhHansSchedule from '@/lib/i18n/locales/zh-Hans/schedule.json';
import zhHansSetting from '@/lib/i18n/locales/zh-Hans/setting.json';
import zhHansStatistics from '@/lib/i18n/locales/zh-Hans/statistics.json';
import zhHantAiCoach from '@/lib/i18n/locales/zh-Hant/ai-coach.json';
import zhHantAuth from '@/lib/i18n/locales/zh-Hant/auth.json';
import zhHantCommon from '@/lib/i18n/locales/zh-Hant/common.json';
import zhHantExercises from '@/lib/i18n/locales/zh-Hant/exercises.json';
import zhHantMuscle from '@/lib/i18n/locales/zh-Hant/muscle.json';
import zhHantNav from '@/lib/i18n/locales/zh-Hant/nav.json';
import zhHantNotify from '@/lib/i18n/locales/zh-Hant/notify.json';
import zhHantSchedule from '@/lib/i18n/locales/zh-Hant/schedule.json';
import zhHantSetting from '@/lib/i18n/locales/zh-Hant/setting.json';
import zhHantStatistics from '@/lib/i18n/locales/zh-Hant/statistics.json';

const resources = {
  'zh-Hant': {
    common: zhHantCommon,
    nav: zhHantNav,
    auth: zhHantAuth,
    notify: zhHantNotify,
    exercises: zhHantExercises,
    muscle: zhHantMuscle,
    schedule: zhHantSchedule,
    statistics: zhHantStatistics,
    setting: zhHantSetting,
    'ai-coach': zhHantAiCoach,
  },
  'zh-Hans': {
    common: zhHansCommon,
    nav: zhHansNav,
    auth: zhHansAuth,
    notify: zhHansNotify,
    exercises: zhHansExercises,
    muscle: zhHansMuscle,
    schedule: zhHansSchedule,
    statistics: zhHansStatistics,
    setting: zhHansSetting,
    'ai-coach': zhHansAiCoach,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    notify: enNotify,
    exercises: enExercises,
    muscle: enMuscle,
    schedule: enSchedule,
    statistics: enStatistics,
    setting: enSetting,
    'ai-coach': enAiCoach,
  },
} as const;

const NAMESPACES = [
  'common',
  'nav',
  'auth',
  'notify',
  'exercises',
  'muscle',
  'schedule',
  'statistics',
  'setting',
  'ai-coach',
] as const;

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
  ns: NAMESPACES,
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
