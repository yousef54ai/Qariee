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
      update_available: 'A new version of Qariee is available! Please update to get the latest features and improvements.',
      update: 'Update',
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
      update_available: 'يتوفر إصدار جديد من قارئي! يرجى التحديث للحصول على أحدث الميزات والتحسينات.',
      update: 'تحديث',
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
