import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { getAllReciters } from '../src/services/database';
import { getReciterPhotoUrl } from '../src/constants/config';
import { Reciter } from '../src/types';
import MiniPlayer from '../src/components/MiniPlayer';
import UpdateBanner from '../src/components/UpdateBanner';
import { useAudio } from '../src/contexts/AudioContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { needsUpdate, setNeedsUpdate } = useAudio();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReciters();
  }, []);

  const loadReciters = async () => {
    try {
      const data = await getAllReciters();
      setReciters(data);
    } catch (error) {
      console.error('Error loading reciters:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReciterCard = ({ item }: { item: Reciter }) => {
    const isRTL = i18n.language === 'ar';
    const name = isRTL ? item.name_ar : item.name_en;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // TODO: Navigate to reciter detail
          console.log('Navigate to reciter:', item.id);
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: getReciterPhotoUrl(item.id) }}
          style={styles.reciterImage}
          defaultSource={require('../assets/images/icon.png')}
          resizeMode="cover"
        />
        <View style={styles.cardInfo}>
          <Text style={styles.reciterName} numberOfLines={2}>
            {name}
          </Text>
        </View>
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

  if (reciters.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No reciters available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {needsUpdate && <UpdateBanner onDismiss={() => setNeedsUpdate(false)} />}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('reciters')}</Text>
      </View>
      <FlatList
        data={reciters}
        renderItem={renderReciterCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
      <MiniPlayer />
    </SafeAreaView>
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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  reciterImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: CARD_WIDTH / 2,
    backgroundColor: '#282828',
  },
  cardInfo: {
    paddingTop: 12,
    alignItems: 'center',
  },
  reciterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B3B3B3',
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#B3B3B3',
    fontSize: 16,
  },
});
