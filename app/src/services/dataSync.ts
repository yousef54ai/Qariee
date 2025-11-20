import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initDatabase,
  insertReciter,
  insertSurah,
  getAllReciters,
  deleteAllReciters,
  setMetadata,
  getMetadata,
} from './database';
import { RECITERS_METADATA_URL } from '../constants/config';
import { ReciterMetadata } from '../types';
import surahsData from '../../assets/data/surahs.json';

const FIRST_LAUNCH_KEY = 'first_launch_complete';

/**
 * Initialize app on first launch or subsequent launches
 * - First launch: Loads data with loading screen
 * - Subsequent launches: Returns immediately, updates in background
 */
export const initializeApp = async (): Promise<{ isFirstLaunch: boolean }> => {
  // Always initialize database
  await initDatabase();

  const isFirstLaunch = (await AsyncStorage.getItem(FIRST_LAUNCH_KEY)) === null;

  if (isFirstLaunch) {
    // First launch: Load all data synchronously
    console.log('First launch: Loading initial data...');
    await loadInitialData();
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    return { isFirstLaunch: true };
  } else {
    // Subsequent launch: Update in background
    console.log('Subsequent launch: Using cached data, updating in background...');
    updateDataInBackground();
    return { isFirstLaunch: false };
  }
};

/**
 * Load initial data on first launch
 */
const loadInitialData = async (): Promise<void> => {
  try {
    // Load reciters from R2
    await fetchAndSaveReciters();

    // Load bundled surahs data
    await loadSurahsData();

    console.log('Initial data loaded successfully');
  } catch (error) {
    console.error('Error loading initial data:', error);
    throw error;
  }
};

/**
 * Fetch reciters from R2 and save to database
 */
const fetchAndSaveReciters = async (): Promise<void> => {
  try {
    const response = await fetch(RECITERS_METADATA_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch reciters: ${response.status}`);
    }

    const data: ReciterMetadata = await response.json();

    // Clear existing reciters
    await deleteAllReciters();

    // Insert new reciters
    for (const reciter of data.reciters) {
      await insertReciter(reciter);
    }

    console.log(`Loaded ${data.reciters.length} reciters`);
  } catch (error) {
    console.error('Error fetching reciters:', error);
    throw error;
  }
};

/**
 * Load bundled surahs data into database
 */
const loadSurahsData = async (): Promise<void> => {
  try {
    // Check if surahs already loaded
    const surahsLoaded = await getMetadata('surahs_loaded');

    if (surahsLoaded === 'true') {
      console.log('Surahs already loaded');
      return;
    }

    // Insert all surahs
    for (const surah of surahsData.surahs) {
      await insertSurah(surah);
    }

    await setMetadata('surahs_loaded', 'true');
    console.log(`Loaded ${surahsData.surahs.length} surahs`);
  } catch (error) {
    console.error('Error loading surahs:', error);
    throw error;
  }
};

/**
 * Update data in background (fire and forget)
 */
const updateDataInBackground = (): void => {
  (async () => {
    try {
      // Fetch latest reciters
      const response = await fetch(RECITERS_METADATA_URL);

      if (!response.ok) {
        console.warn('Background update failed:', response.status);
        return;
      }

      const data: ReciterMetadata = await response.json();

      // Get current reciters from DB
      const currentReciters = await getAllReciters();
      const currentIds = currentReciters.map((r) => r.id);
      const newIds = data.reciters.map((r) => r.id);

      // Check if there are changes
      const hasChanges =
        currentIds.length !== newIds.length ||
        newIds.some((id) => !currentIds.includes(id));

      if (hasChanges) {
        console.log('New reciters detected, updating...');

        // Update database
        await deleteAllReciters();
        for (const reciter of data.reciters) {
          await insertReciter(reciter);
        }

        console.log('Background update completed successfully');
        // TODO: Emit event or show toast notification
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      console.error('Background update error:', error);
      // Fail silently - don't disturb user experience
    }
  })();
};

/**
 * Force refresh data (manual refresh)
 */
export const refreshData = async (): Promise<void> => {
  await fetchAndSaveReciters();
};
