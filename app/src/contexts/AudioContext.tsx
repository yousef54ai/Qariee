import { createContext, useContext, useState, ReactNode } from 'react';

interface CurrentTrack {
  reciterId: string;
  reciterName: string;
  surahName: string;
  surahNumber: number;
  backgroundColor?: string;
}

interface AudioContextType {
  currentTrack: CurrentTrack | null;
  setCurrentTrack: (track: CurrentTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  needsUpdate: boolean;
  setNeedsUpdate: (needsUpdate: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>({
    reciterId: 'mishary-alafasy',
    reciterName: 'Mishary Alafasy',
    surahName: 'Al-Fatihah',
    surahNumber: 1,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        needsUpdate,
        setNeedsUpdate,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
