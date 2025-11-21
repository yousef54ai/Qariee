import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

// Import translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Helper to check if current language is RTL
export const isRTL = (): boolean => {
  return i18n.language === 'ar';
};

// Helper to check if current language is Arabic
export const isArabic = (): boolean => {
  return i18n.language === 'ar';
};

// Helper to get text direction
export const getTextDirection = (): 'rtl' | 'ltr' => {
  return isRTL() ? 'rtl' : 'ltr';
};

// Update RTL when language changes
i18n.on('languageChanged', (lng) => {
  const isRTLLang = lng === 'ar';
  I18nManager.forceRTL(isRTLLang);
  // Note: Changing RTL requires app reload in React Native
});

// Detect device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
const initialLanguage = deviceLanguage === 'ar' ? 'ar' : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // Force Arabic for development - TODO: Change to initialLanguage for production
  fallbackLng: 'en',
  compatibilityJSON: 'v3', // For React Native
  interpolation: {
    escapeValue: false,
  },
});

// Set initial RTL based on detected language
I18nManager.forceRTL(i18n.language === 'ar');

export default i18n;
