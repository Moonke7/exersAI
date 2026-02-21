import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getEquipment } from '../../hooks/getEquiment';
import { useEquipamiento } from '../../hooks/useEquipamiento';
import { Equipment } from '../../types/equipment';
import { useEquipmentInventoryStore } from '../../store/useEquipmentInventoryStore';
import { MainStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../utils/COLORS';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';

type EquipmentSelectorRouteProp = RouteProp<
  MainStackParamList,
  'EquipmentSelector'
>;
type EquipmentSelectorNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'EquipmentSelector'
>;

export default function EquipmentSelector() {
  const route = useRoute<EquipmentSelectorRouteProp>();
  const navigation = useNavigation<EquipmentSelectorNavigationProp>();
  const { espacioId } = route.params;

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    inventarioActual,
    setEspacioId,
    setInventarioInicial,
    toggleEquipment,
    getAddedEquipment,
    getRemovedEquipment,
    reset,
  } = useEquipmentInventoryStore();

  const { getInventario, createInventarioItem, deleteInventarioItem } =
    useEquipamiento();

  useEffect(() => {
    loadData();

    return () => {
      // Limpiar store al salir
      reset();
    };
  }, [espacioId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar todo el equipamiento disponible
      const allEquipment = await getEquipment();
      setEquipment(allEquipment);

      // Cargar inventario actual del espacio
      const inventario = await getInventario(espacioId);

      // Extraer los IDs de equipos que el usuario ya tiene
      const equipmentIds = inventario.map(item => item.equipo_id);

      // Configurar store
      setEspacioId(espacioId);
      setInventarioInicial(equipmentIds);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const added = getAddedEquipment();
      const removed = getRemovedEquipment();

      // Crear promesas para agregar equipos
      const addPromises = added.map(equipoId =>
        createInventarioItem(equipoId, 1, espacioId),
      );

      // Para eliminar, primero necesitamos obtener el inventario actual
      // y encontrar los IDs de los items a eliminar
      const inventario = await getInventario(espacioId);
      const deletePromises = removed.map(equipoId => {
        const item = inventario.find(inv => inv.equipo_id === equipoId);
        if (item) {
          return deleteInventarioItem(item.id);
        }
        return Promise.resolve(false);
      });

      // Ejecutar todas las promesas
      await Promise.all([...addPromises, ...deletePromises]);

      Alert.alert('Éxito', 'Inventario actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error saving inventory:', error);
      Alert.alert('Error', 'No se pudo guardar el inventario');
    } finally {
      setIsSaving(false);
    }
  };

  const isSelected = (id: number) => inventarioActual.includes(id);

  if (loading) {
    return <LoadingScreen message="Cargando equipamiento..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      <Header
        title="Editar Equipamiento"
        showBackButton
        extraData={'Seleccionados' + inventarioActual.length}
        extraDataIcon="fitness"
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row flex-wrap justify-between gap-4">
          {equipment.map(item => (
            <TouchableOpacity
              key={item.id}
              className="w-[47%] rounded-xl overflow-hidden shadow-md border-2"
              style={{
                borderColor: isSelected(item.id)
                  ? COLORS.SOFT_BORDER
                  : 'transparent',
                backgroundColor: COLORS.SECONDARY_BACKGROUND,
              }}
              onPress={() => toggleEquipment(item.id)}
              activeOpacity={0.7}
              disabled={isSaving}
            >
              <View className="w-full h-[120px] bg-gray-100">
                {item.imagen_url ? (
                  <Image
                    source={{ uri: item.imagen_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full justify-center items-center bg-gray-200">
                    <Text className="text-gray-400 text-xs">Sin imagen</Text>
                  </View>
                )}
              </View>
              <View className="p-3">
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: isSelected(item.id)
                      ? COLORS.SECONDARY_azul_cielo
                      : COLORS.TEXT_PRIMARY,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.nombre}
                </Text>
              </View>
              {isSelected(item.id) && (
                <View
                  className="absolute top-2 right-2 w-7 h-7 rounded-full justify-center items-center"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  <Text className="text-white text-base font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="mt-5 mb-5 w-full flex justify-center">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className="rounded-lg p-4 mx-5 items-center justify-center"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="save" size={20} color="white" />
              <Text className="text-white font-bold text-lg">Guardar</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
