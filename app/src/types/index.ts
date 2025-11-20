export interface Reciter {
  id: string;
  name_en: string;
  name_ar: string;
}

export interface Surah {
  number: number;
  name_ar: string;
  name_en: string;
  verses: number;
}

export interface Download {
  reciter_id: string;
  surah_number: number;
  local_file_path: string;
  downloaded_at: string;
}

export interface ReciterMetadata {
  reciters: Reciter[];
}

export interface SurahMetadata {
  surahs: Surah[];
}
