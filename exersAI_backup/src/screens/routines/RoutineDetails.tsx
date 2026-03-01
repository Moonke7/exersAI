import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainStackParamList } from '../../navigation/types';
import { useRoutineStore } from '../../store/useRoutineStore';
import { COLORS } from '../../utils/COLORS';
import { useRutinas } from '../../hooks/useRutinas';

type RoutineDetailsRouteProp = RouteProp<MainStackParamList, 'RoutineDetails'>;
type RoutineDetailsNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'RoutineDetails'
>;

export default function RoutineDetails() {
  const route = useRoute<RoutineDetailsRouteProp>();
  const navigation = useNavigation<RoutineDetailsNavigationProp>();
  const { rutinaId } = route.params;
  const { selectedRoutine, setSelectedRoutine } = useRoutineStore();
  const { obtenerRutina } = useRutinas();

  const handleStartRoutine = () => {
    Alert.alert('Iniciar Rutina', 'Funcionalidad en desarrollo');
    // Here we would navigate to a "Live Workout" screen
  };

  useEffect(() => {
    const uploadRoutine = async () => {
      const rutinaObtenida = await obtenerRutina(rutinaId);

      if (!rutinaObtenida) {
        Alert.alert('Error', 'No se pudo obtener la rutina');
        return;
      }

      setSelectedRoutine(rutinaObtenida);
    };
    uploadRoutine();
  }, [rutinaId]);

  if (!selectedRoutine || selectedRoutine.id !== rutinaId) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">
          Rutina no encontrada o no seleccionada.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 px-4 py-2 rounded-xl"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          <Text className="text-white">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <View
        className="pt-12 pb-4 px-4 flex-row justify-between items-center shadow-sm z-10"
        style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Icon name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold flex-1 text-center"
          numberOfLines={1}
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          {selectedRoutine.nombre}
        </Text>
        <TouchableOpacity
          onPress={handleStartRoutine}
          className="p-2 rounded-full"
          style={{ backgroundColor: COLORS.SECONDARY_verde + '20' }}
        >
          <Icon name="play-arrow" size={24} color={COLORS.SECONDARY_verde} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="mb-6">
          <Text
            className="text-sm mb-2 uppercase tracking-wider font-semibold"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Ejercicios
          </Text>
          {selectedRoutine.ejercicios.map((exercise, index) => (
            <View
              key={exercise.id}
              className="mb-4 rounded-xl p-4 shadow-sm border"
              style={{
                backgroundColor: COLORS.SECONDARY_BACKGROUND,
                borderColor: COLORS.SOFT_BORDER,
              }}
            >
              <View className="flex-row items-center mb-3 gap-2">
                <Icon
                  name="fitness-center"
                  size={16}
                  color={COLORS.TEXT_PRIMARY}
                />
                <Text
                  className="text-md font-semibold flex-1"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {exercise.ejercicio?.nombre || `Ejercicio ${index + 1}`}
                </Text>
              </View>

              {/* Sets & Reps Inputs */}
              <View className="flex-row justify-between items-center">
                <View className="items-center flex-1">
                  <Text
                    className="text-xs mb-1 uppercase"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    Series
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className="text-lg font-bold mx-2"
                      style={{ color: COLORS.TEXT_SECONDARY }}
                    >
                      {exercise.series}
                    </Text>
                  </View>
                </View>

                <View className="items-center flex-1">
                  <Text
                    className="text-xs mb-1 uppercase"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    Reps
                  </Text>
                  <View className="flex-row items-center">
                    {/* Simplified for now as text input handling in list is complex without memo */}
                    <Text
                      className="text-lg font-bold"
                      style={{ color: COLORS.TEXT_SECONDARY }}
                    >
                      {exercise.repeticiones}
                    </Text>
                  </View>
                </View>

                <View className="items-center flex-1">
                  <Text
                    className="text-xs mb-1 uppercase"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    Descanso
                  </Text>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: COLORS.TEXT_SECONDARY }}
                  >
                    {exercise.tiempo_descanso_segundos}s
                  </Text>
                </View>

                <View className="items-center flex-1">
                  <Text
                    className="text-xs mb-1 uppercase"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    Peso (KG)
                  </Text>
                  <TextInput
                    value={exercise.peso_sugerido?.toString()}
                    keyboardType="numeric"
                    placeholder="-"
                    className="text-lg font-bold text-center w-full"
                    style={{ color: COLORS.TEXT_SECONDARY }}
                  />
                </View>
              </View>

              {exercise.notas_ia && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-xs text-gray-400 italic">
                    Nota: {exercise.notas_ia}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Start Button */}
      <View className="absolute bottom-6 left-4 right-4">
        <TouchableOpacity
          onPress={handleStartRoutine}
          className="py-4 rounded-xl shadow-lg flex-row justify-center items-center"
          style={{ backgroundColor: COLORS.SECONDARY_verde }}
        >
          <Icon
            name="play-arrow"
            size={24}
            color={COLORS.TEXT_PRIMARY}
            style={{ marginRight: 8 }}
          />
          <Text
            className="text-white font-bold text-lg"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            INICIAR RUTINA
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
