import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common';
import fiCommon from './locales/fi/common';
import svCommon from './locales/sv/common';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enCommon,
            },
            fi: {
                translation: fiCommon,
            },

            sv: { translation: svCommon },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'fi', 'sv'],
        lng: 'en',
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
