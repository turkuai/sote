import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next, Translation } from 'react-i18next';

import enCommon from './locales/en/common';
import fiCommon from './locales/fi/common';
import svCommon from './locales/sv/common';
import eeCommon from './locales/ee/common';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi: {
        translation: fiCommon,
      },
      sv: {
        translation: svCommon,
      },
      en: {
        translation: enCommon,
      },
      ee: {
        translation: eeCommon,
      }
    },
    fallbackLng: 'fi',
    supportedLngs: ['fi', 'sv', 'en', 'ee'],
    lng: 'fi',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language',
    },
  });

export default i18n;
