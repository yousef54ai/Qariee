import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      library: 'Library',
      reciters: 'Reciters',
      downloads: 'Downloads',
      loading: 'Loading...',
      play: 'Play',
      pause: 'Pause',
      download: 'Download',
      downloading: 'Downloading...',
      downloaded: 'Downloaded',
      verses: 'verses',
      surah: 'Surah',
    },
  },
  ar: {
    translation: {
      home: 'الرئيسية',
      library: 'المكتبة',
      reciters: 'القراء',
      downloads: 'التنزيلات',
      loading: 'جاري التحميل...',
      play: 'تشغيل',
      pause: 'إيقاف',
      download: 'تنزيل',
      downloading: 'جاري التنزيل...',
      downloaded: 'تم التنزيل',
      verses: 'آيات',
      surah: 'سورة',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
