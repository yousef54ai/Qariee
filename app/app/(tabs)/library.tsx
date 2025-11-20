import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getAllDownloads, getSurahByNumber } from '../../src/services/database';
import { Download, Surah } from '../../src/types';

interface DownloadWithSurah extends Download {
  surah?: Surah;
}

export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const [downloads, setDownloads] = useState<DownloadWithSurah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const downloadedItems = await getAllDownloads();

      // Enrich downloads with surah info
      const enriched = await Promise.all(
        downloadedItems.map(async (download) => {
          const surah = await getSurahByNumber(download.surah_number);
          return { ...download, surah };
        })
      );

      setDownloads(enriched);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDownloadItem = ({ item }: { item: DownloadWithSurah }) => {
    if (!item.surah) return null;

    const isRTL = i18n.language === 'ar';
    const surahName = isRTL ? item.surah.name_ar : item.surah.name_en;

    return (
      <TouchableOpacity
        style={styles.downloadItem}
        onPress={() => {
          // TODO: Play downloaded audio
          console.log('Play downloaded:', item.reciter_id, item.surah_number);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.downloadInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="musical-notes" size={24} color="#1DB954" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.surahNumber}>
              {item.surah_number}. {surahName}
            </Text>
            <Text style={styles.reciterName}>{item.reciter_id}</Text>
          </View>
        </View>
        <Ionicons name="checkmark-circle" size={24} color="#1DB954" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  if (downloads.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="download-outline" size={80} color="#B3B3B3" />
        <Text style={styles.emptyTitle}>No Downloads Yet</Text>
        <Text style={styles.emptySubtitle}>
          Download surahs to listen offline
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('downloads')}</Text>
        <Text style={styles.downloadCount}>
          {downloads.length} {downloads.length === 1 ? 'surah' : 'surahs'}
        </Text>
      </View>
      <FlatList
        data={downloads}
        renderItem={renderDownloadItem}
        keyExtractor={(item) => `${item.reciter_id}-${item.surah_number}`}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  downloadCount: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 8,
  },
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  surahNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reciterName: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});
