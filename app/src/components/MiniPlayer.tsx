import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from 'react-native-image-colors';
import { getReciterPhotoUrl } from '../constants/config';
import { useAudio } from '../contexts/AudioContext';

export default function MiniPlayer() {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, setIsPlaying } = useAudio();
  const [backgroundColor, setBackgroundColor] = useState('#282828');

  useEffect(() => {
    if (currentTrack) {
      extractColors(currentTrack.reciterId);
    }
  }, [currentTrack?.reciterId]);

  const extractColors = async (reciterId: string) => {
    try {
      const imageUrl = getReciterPhotoUrl(reciterId);
      const result = await getColors(imageUrl, {
        fallback: '#282828',
        cache: true,
        key: reciterId,
      });

      if (result.platform === 'android') {
        setBackgroundColor(result.dominant || '#282828');
      } else if (result.platform === 'ios') {
        setBackgroundColor(result.background || '#282828');
      }
    } catch (error) {
      console.error('Error extracting colors:', error);
      setBackgroundColor('#282828');
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { paddingBottom: insets.bottom, backgroundColor },
      ]}
      activeOpacity={0.9}
      onPress={() => {
        // TODO: Expand to full player
        console.log('Expand player');
      }}
    >
      <View style={styles.leftSection}>
        <Image
          source={{ uri: getReciterPhotoUrl(currentTrack.reciterId) }}
          style={styles.artwork}
          defaultSource={require('../../assets/images/icon.png')}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.surahName} numberOfLines={1}>
            {currentTrack.surahName}
          </Text>
          <Text style={styles.reciterName} numberOfLines={1}>
            {currentTrack.reciterName}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
            console.log('Play/Pause');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            // TODO: Next track
            console.log('Next');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.nextButton}
        >
          <Ionicons name="play-skip-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '30%' }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#404040',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#404040',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  surahName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  reciterName: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    marginLeft: 20,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#404040',
  },
  progress: {
    height: 2,
    backgroundColor: '#1DB954',
  },
});
