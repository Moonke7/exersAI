import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainStackParamList } from '../../navigation/types';
import { useEspacios, Espacio } from '../../hooks/useEspacios';
import { COLORS } from '../../utils/COLORS';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';

type SelectEspacioNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'SelectEspacioForRoutine'
>;

type SelectEspacioRouteProp = RouteProp<
  MainStackParamList,
  'SelectEspacioForRoutine'
>;

export default function SelectEspacioForRoutine() {
  const navigation = useNavigation<SelectEspacioNavigationProp>();
  const route = useRoute<SelectEspacioRouteProp>();
  const { routineName, routinePreset } = route.params || {};
  const { getEspacios, isLoading } = useEspacios();
  const [espacios, setEspacios] = useState<Espacio[]>([]);

  useEffect(() => {
    const fetchEspacios = async () => {
      const fetchedEspacios = await getEspacios();
      setEspacios(fetchedEspacios);
    };
    fetchEspacios();
  }, []);

  const handleSelectEspacio = (espacioId: number) => {
    navigation.navigate('SelectBodyMusclesWithParams', {
      espacioId,
      routineName,
      routinePreset,
    });
  };

  if (isLoading) {
    return <LoadingScreen message="Cargando espacios..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <Header title="Selecciona un Espacio" showBackButton />

      <ScrollView className="flex-1 px-6 mt-6">
        {espacios.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Icon name="location-city" size={80} color={COLORS.SECONDARY} />
            <Text
              className="text-center mt-4 text-base"
              style={{ color: COLORS.SECONDARY }}
            >
              No tienes espacios configurados
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Espacios')}
              className="mt-4 rounded-lg px-6 py-3"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Text className="text-white font-semibold">Crear Espacio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          espacios.map(espacio => (
            <TouchableOpacity
              key={espacio.id}
              onPress={() => handleSelectEspacio(espacio.id)}
              className="rounded-xl p-5 mb-4 shadow-sm flex-row items-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                backgroundColor: COLORS.SECONDARY_BACKGROUND,
              }}
            >
              <View
                className="rounded-xl p-3 mr-4"
                style={{ backgroundColor: COLORS.TEXT_PRIMARY + '20' }}
              >
                <Icon name="location-city" size={28} color={COLORS.PRIMARY} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold mb-1"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {espacio.nombre}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  Toca para seleccionar
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={24}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
