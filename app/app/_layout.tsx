import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioProvider, useAudio } from '../src/contexts/AudioContext';
import '../src/services/i18n'; // Initialize i18n
import { initializeApp } from '../src/services/dataSync';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '../src/utils/fonts';

function RootLayoutContent() {
  const [isReady, setIsReady] = useState(false);
  const { setNeedsUpdate } = useAudio();
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SurahNames: require('../assets/fonts/surah_names.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        const { isFirstLaunch, needsUpdate } = await initializeApp();

        if (isFirstLaunch) {
          console.log('First launch: Data loaded');
        } else {
          console.log('Using cached data, updating in background');
        }

        setNeedsUpdate(needsUpdate);
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // Continue anyway with possibly partial data
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading Qariee...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <RootLayoutContent />
      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
