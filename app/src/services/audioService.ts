import { useAudioPlayer, AudioSource } from 'expo-audio';

export interface Track {
  reciterId: string;
  reciterName: string;
  reciterColorPrimary: string;
  reciterColorSecondary: string;
  surahNumber: number;
  surahName: string;
  audioUrl: string;
  isDownloaded: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  position: number;
  duration: number;
  isBuffering: boolean;
}

export type PlaybackMode = 'shuffle' | 'repeat';

class AudioService {
  private player: ReturnType<typeof useAudioPlayer> | null = null;
  private currentTrack: Track | null = null;
  private queue: Track[] = [];
  private originalQueue: Track[] = []; // Keep original order for shuffle/unshuffle
  private playbackMode: PlaybackMode = 'shuffle';
  private listeners: Set<(state: PlaybackState) => void> = new Set();

  /**
   * Initialize the audio player
   */
  initialize(player: ReturnType<typeof useAudioPlayer>) {
    this.player = player;
  }

  /**
   * Play a track
   */
  async play(track: Track, queue: Track[] = []) {
    if (!this.player) {
      throw new Error('Audio player not initialized');
    }

    this.currentTrack = track;
    this.originalQueue = [...queue]; // Keep original order

    // Apply shuffle if in shuffle mode
    if (this.playbackMode === 'shuffle' && queue.length > 0) {
      this.queue = this.shuffleArray([...queue]);
    } else {
      this.queue = queue;
    }

    try {
      // Replace current audio source
      this.player.replace(track.audioUrl as AudioSource);
      this.player.play();

      console.log(`Playing: ${track.surahName} by ${track.reciterName}`);
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Pause playback
   */
  pause() {
    if (this.player) {
      this.player.pause();
    }
  }

  /**
   * Resume playback
   */
  resume() {
    if (this.player) {
      this.player.play();
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (!this.player) return;

    if (this.player.playing) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Seek to position in seconds
   */
  async seekTo(seconds: number) {
    if (this.player) {
      this.player.seekTo(seconds);
    }
  }

  /**
   * Play next track in queue (or repeat current if in repeat mode)
   */
  async playNext() {
    // In repeat mode, replay current track
    if (this.playbackMode === 'repeat' && this.currentTrack) {
      await this.seekTo(0);
      this.resume();
      return;
    }

    // In shuffle mode, play next from queue
    if (this.queue.length === 0) {
      console.log('No next track in queue');
      return;
    }

    const nextTrack = this.queue.shift();
    if (nextTrack) {
      await this.play(nextTrack, this.queue);
    }
  }

  /**
   * Get current track
   */
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  /**
   * Get queue
   */
  getQueue(): Track[] {
    return this.queue;
  }

  /**
   * Get player instance
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Set playback mode
   */
  setPlaybackMode(mode: PlaybackMode) {
    this.playbackMode = mode;

    // If switching to shuffle, shuffle the current queue
    if (mode === 'shuffle' && this.originalQueue.length > 0) {
      this.queue = this.shuffleArray([...this.originalQueue]);
    } else if (mode === 'repeat') {
      // Restore original order when switching to repeat
      this.queue = [...this.originalQueue];
    }
  }

  /**
   * Get current playback mode
   */
  getPlaybackMode(): PlaybackMode {
    return this.playbackMode;
  }

  /**
   * Clear current track and queue
   */
  clear() {
    this.currentTrack = null;
    this.queue = [];
    this.originalQueue = [];
    if (this.player) {
      this.player.pause();
    }
  }
}

// Singleton instance
export const audioService = new AudioService();
