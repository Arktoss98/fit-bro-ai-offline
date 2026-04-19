import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import pl from './pl';
import de from './de';
import en from './en';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

const supportedLanguages = ['pl', 'de', 'en'];
const defaultLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    de: { translation: de },
    en: { translation: en },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
