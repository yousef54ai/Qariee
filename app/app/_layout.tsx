import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import '../src/services/i18n'; // Initialize i18n
import { initializeApp } from '../src/services/dataSync';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const { isFirstLaunch } = await initializeApp();

        if (isFirstLaunch) {
          console.log('First launch: Data loaded');
        } else {
          console.log('Using cached data, updating in background');
        }

        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // Continue anyway with possibly partial data
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Loading Qariee...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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
