export const CDN_BASE_URL = 'https://cdn.qariee.com';

export const RECITERS_METADATA_URL = `${CDN_BASE_URL}/metadata/reciters.json`;

export const getReciterPhotoUrl = (reciterId: string): string => {
  return `${CDN_BASE_URL}/images/reciters/${reciterId}.jpg`;
};

export const getAudioUrl = (reciterId: string, surahNumber: number): string => {
  const surahPadded = surahNumber.toString().padStart(3, '0');
  return `${CDN_BASE_URL}/audio/${reciterId}/${surahPadded}.mp3`;
};
