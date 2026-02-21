import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainStackParamList } from '../../navigation/types';
import { useEquipamiento, InventarioItem } from '../../hooks/useEquipamiento';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../utils/COLORS';
import Header from '../../components/Header';
import { FloatingButton } from '../../components/FloatingButton';

type EspacioDetailRouteProp = RouteProp<MainStackParamList, 'EspacioDetail'>;
type EspacioDetailNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'EspacioDetail'
>;

export default function EspacioDetailScreen() {
  const navigation = useNavigation<EspacioDetailNavigationProp>();
  const route = useRoute<EspacioDetailRouteProp>();
  const { espacioName, espacioId } = route.params;
  const { user } = useAuthStore();
  const { getInventario } = useEquipamiento();

  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadInventario();
    }, [espacioId, user?.id]),
  );

  const loadInventario = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getInventario(espacioId);
      setInventario(data);
    } catch (error) {
      console.error('Error loading inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToEquipmentSelector = () => {
    navigation.navigate('EquipmentSelector', { espacioId });
  };

  const renderItem = ({ item }: { item: InventarioItem }) => (
    <View
      className="flex-1 rounded-lg p-3 border m-1.5"
      style={{
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
        borderColor: COLORS.SOFT_BORDER,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="w-full h-24 bg-gray-200 rounded-md mb-2 overflow-hidden">
        {item.equipos?.imagen_url ? (
          <Image
            source={{ uri: item.equipos.imagen_url }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-full justify-center items-center">
            <Icon name="fitness-center" size={32} color="#9CA3AF" />
          </View>
        )}
      </View>
      <Text
        className="font-semibold text-sm mb-1"
        numberOfLines={2}
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        {item.equipos?.nombre || `Equipo #${item.equipo_id}`}
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      <Header
        title={espacioName}
        showBackButton
        extraData={inventario.length.toString()}
        extraDataIcon="fitness-center"
      />
      <View className="flex-1 p-4">
        {loading ? (
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: COLORS.Background }}
          >
            <ActivityIndicator size="large" color={COLORS.SECONDARY_purpura} />
            <Text className="text-sm mt-4" style={{ color: COLORS.SECONDARY }}>
              Cargando equipos...
            </Text>
          </View>
        ) : inventario.length > 0 ? (
          <FlatList
            data={inventario}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View
            className="flex-1 justify-center items-center opacity-50"
            style={{ backgroundColor: COLORS.Background }}
          >
            <Icon name="fitness-center" size={60} color="#D1D5DB" />
            <Text className="text-gray-500 text-center mt-3">
              Aún no hay equipamiento
            </Text>
          </View>
        )}
      </View>

      <FloatingButton
        onPress={handleNavigateToEquipmentSelector}
        icon="edit"
        size={32}
        color="white"
      />
    </View>
  );
}
