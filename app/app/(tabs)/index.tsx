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
import { useTranslation } from 'react-i18next';
import { getAllReciters } from '../../src/services/database';
import { getReciterPhotoUrl } from '../../src/constants/config';
import { Reciter } from '../../src/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
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
          defaultSource={require('../../assets/images/icon.png')}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.reciterName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.surahCount}>114 Surahs</Text>
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
    <View style={styles.container}>
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
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  reciterImage: {
    width: '100%',
    height: CARD_WIDTH,
    backgroundColor: '#282828',
  },
  cardInfo: {
    padding: 12,
  },
  reciterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  surahCount: {
    fontSize: 12,
    color: '#B3B3B3',
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
