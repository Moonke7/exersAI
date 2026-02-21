import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEspacios, Espacio } from '../../hooks/useEspacios';
import { CreateEspacioModal } from '../../components/CreateEspacioModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { COLORS } from '../../utils/COLORS';
import Header from '../../components/Header';
import { FloatingButton } from '../../components/FloatingButton';

type EspaciosScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Espacios'
>;

export default function EspaciosScreen() {
  const navigation = useNavigation<EspaciosScreenNavigationProp>();
  const { getEspacios, createEspacio, isLoading } = useEspacios();
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar espacios al montar el componente
  useEffect(() => {
    loadEspacios();
  }, []);

  const loadEspacios = async () => {
    const data = await getEspacios();
    setEspacios(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEspacios();
    setRefreshing(false);
  };

  const handleCreateEspacio = async (nombre: string) => {
    const newEspacio = await createEspacio(nombre);
    if (newEspacio) {
      setModalVisible(false);
      await loadEspacios(); // Recargar lista
      // Navegar al detalle del nuevo espacio
      navigation.navigate('EspacioDetail', {
        espacioId: newEspacio.id,
        espacioName: newEspacio.nombre,
      });
    }
  };

  const handleEspacioPress = (espacio: Espacio) => {
    console.log(espacio);
    navigation.navigate('EspacioDetail', {
      espacioId: espacio.id,
      espacioName: espacio.nombre,
    });
  };

  const renderEspacio = ({ item }: { item: Espacio }) => (
    <TouchableOpacity
      onPress={() => handleEspacioPress(item)}
      className="rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
      style={{
        backgroundColor: COLORS.SECONDARY_BACKGROUND,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        className="rounded-full p-3 mr-4"
        style={{ backgroundColor: COLORS.PRIMARY + '20' }}
      >
        <Icon name="location-city" size={24} color={COLORS.PRIMARY} />
      </View>
      <View className="flex-1">
        <Text
          className="text-lg font-semibold"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          {item.nombre}
        </Text>
        <Text className="text-sm" style={{ color: COLORS.TEXT_SECONDARY }}>
          Ver detalles
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={COLORS.TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 mt-20">
      <Icon name="location-city" size={80} color="#D1D5DB" />
      <Text className="text-xl font-bold text-gray-700 mt-4">
        No tienes espacios
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        Crea tu primer espacio de entrenamiento presionando el botón de arriba
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <Header title="Mis Espacios" showBackButton />

      {/* Lista de espacios */}
      <View className="flex-1 px-6 mt-4">
        {isLoading && espacios.length === 0 ? (
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: COLORS.Background }}
          >
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text className="mt-4" style={{ color: COLORS.SECONDARY }}>
              Cargando espacios...
            </Text>
          </View>
        ) : (
          <FlatList
            data={espacios}
            renderItem={renderEspacio}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 80 }}
          />
        )}
      </View>

      <FloatingButton
        onPress={() => setModalVisible(true)}
        icon="add"
        size={24}
        label="Crear espacio"
        color="white"
      />

      {/* Modal para crear espacio */}
      <CreateEspacioModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCreateEspacio}
        isLoading={isLoading}
      />
    </View>
  );
}
