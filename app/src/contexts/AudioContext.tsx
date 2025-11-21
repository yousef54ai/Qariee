import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { audioService, Track, PlaybackMode } from '../services/audioService';

interface CurrentTrack {
  reciterId: string;
  reciterName: string;
  surahName: string;
  surahNumber: number;
  reciterColorPrimary?: string;
  reciterColorSecondary?: string;
}

interface AudioContextType {
  currentTrack: CurrentTrack | null;
  setCurrentTrack: (track: CurrentTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  needsUpdate: boolean;
  setNeedsUpdate: (needsUpdate: boolean) => void;
  position: number;
  duration: number;
  isBuffering: boolean;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
  playTrack: (track: Track, queue?: Track[]) => Promise<void>;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => Promise<void>;
  playNext: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackMode, setPlaybackModeState] = useState<PlaybackMode>('shuffle');
  const hasPlayedNextRef = useRef(false);

  // Initialize audio service with player
  useState(() => {
    audioService.initialize(player);
  });

  // Update state from player
  useState(() => {
    const interval = setInterval(() => {
      if (player) {
        setIsPlaying(player.playing);
        setPosition(player.currentTime);
        setDuration(player.duration || 0);
      }
    }, 100);

    return () => clearInterval(interval);
  });

  // Auto-play next track when current finishes
  useEffect(() => {
    if (duration > 0 && position > 0) {
      // Check if track has finished (within 1 second of end)
      const isNearEnd = duration - position < 1;

      if (isNearEnd && !player.playing && !hasPlayedNextRef.current) {
        hasPlayedNextRef.current = true;
        // Auto-play next track
        playNext();
      } else if (!isNearEnd) {
        // Reset flag when not near end
        hasPlayedNextRef.current = false;
      }
    }
  }, [position, duration, player.playing]);

  const playTrack = async (track: Track, queue: Track[] = []) => {
    try {
      hasPlayedNextRef.current = false; // Reset flag for new track
      await audioService.play(track, queue);
      setCurrentTrack({
        reciterId: track.reciterId,
        reciterName: track.reciterName,
        surahName: track.surahName,
        surahNumber: track.surahNumber,
        reciterColorPrimary: track.reciterColorPrimary,
        reciterColorSecondary: track.reciterColorSecondary,
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlayPause = () => {
    audioService.togglePlayPause();
  };

  const seekTo = async (seconds: number) => {
    await audioService.seekTo(seconds);
  };

  const playNext = async () => {
    hasPlayedNextRef.current = false; // Reset flag for next track
    await audioService.playNext();
    const track = audioService.getCurrentTrack();
    if (track) {
      setCurrentTrack({
        reciterId: track.reciterId,
        reciterName: track.reciterName,
        surahName: track.surahName,
        surahNumber: track.surahNumber,
        reciterColorPrimary: track.reciterColorPrimary,
        reciterColorSecondary: track.reciterColorSecondary,
      });
    }
  };

  const setPlaybackMode = (mode: PlaybackMode) => {
    setPlaybackModeState(mode);
    audioService.setPlaybackMode(mode);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        needsUpdate,
        setNeedsUpdate,
        position,
        duration,
        isBuffering,
        playbackMode,
        setPlaybackMode,
        playTrack,
        togglePlayPause,
        seekTo,
        playNext,
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
