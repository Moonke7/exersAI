import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  useFocusEffect,
  useRoute,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RutinaConEjercicios, RutinaEjercicio } from '../../types/rutina';
import { useMuscleStore } from '../../store/useMuscleStore';
import { useEquipmentStore } from '../../store/useEquipmentStore';
import { useRutinas } from '../../hooks/useRutinas';
import { COLORS } from '../../utils/COLORS';
import { MainStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { DaySelectionModal } from '../../components/DaySelectionModal';
import { RemoveExerciseModal } from '../../components/RemoveExerciseModal';
import LoadingScreen from '../../components/LoadingScreen';
import { hardcodedRoutine } from '../../test/harcodedRoutine';
import { ExerciseDetailModal } from '../../components/exerciseDetailModal';
import { Slug } from 'react-native-body-highlighter';

type RoutineGeneratedRouteProp = RouteProp<
  MainStackParamList,
  'RoutineGenerated'
>;

type RoutineGeneratedNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'RoutineGenerated'
>;

const MUSCLE_DB_MAP: Partial<Record<string, string>> = {
  abs: 'Abdominales',
  adductors: 'Aductores',
  biceps: 'Bíceps',
  calves: 'Gemelos',
  chest: 'Pecho',
  deltoids: 'Hombros',
  forearm: 'Antebrazos',
  gluteal: 'Glúteos',
  hamstring: 'Isquios',
  'lower-back': 'Espalda Baja',
  obliques: 'Core',
  quadriceps: 'Cuádriceps',
  trapezius: 'Trapecios',
  triceps: 'Tríceps',
  'upper-back': 'Espalda',
};

export const normalizeMuscles = (slugs: string[]): string[] => {
  const mappedMuscles = slugs
    .map(slug => MUSCLE_DB_MAP[slug])
    .filter((muscle): muscle is string => muscle !== undefined);

  return Array.from(new Set(mappedMuscles));
};

export default function RoutineGenerated() {
  const [routine, setRoutine] = useState<RutinaConEjercicios | null>(null);
  const [exercises, setExercises] = useState<RutinaEjercicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<RutinaEjercicio | null>(null);

  // Remove exercise modal state
  const [exerciseToRemove, setExerciseToRemove] =
    useState<RutinaEjercicio | null>(null);

  const { selectedMuscles } = useMuscleStore();
  const { selectedEquipment } = useEquipmentStore();
  const { user } = useAuthStore();
  const route = useRoute<RoutineGeneratedRouteProp>();
  const navigation = useNavigation<RoutineGeneratedNavigationProp>();
  const { asignarRutinaADia, generarRutina } = useRutinas();

  const { espacioId, routineName } = route.params || {};

  const loadRoutine = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // --- HARDCODED PARA DESARROLLO DE VISTA ---
      // const result: RutinaConEjercicios = hardcodedRoutine;
      const muscles = normalizeMuscles(selectedMuscles);

      const result: RutinaConEjercicios | null = await generarRutina(
        user?.id || '',
        routineName || 'Nueva Rutina',
        'Hipertrofia',
        muscles,
        'intermediate',
        espacioId || 1,
      );

      if (!result) {
        setError('Error al generar la rutina');
        return;
      }

      setRoutine(result);
      // Initialize exercises state sorted by orden
      const sorted = [...result.ejercicios].sort(
        (a, b) => (a.orden || 0) - (b.orden || 0),
      );
      setExercises(sorted);
    } catch (err) {
      console.error('Error loading routine:', err);
      setError('Error al cargar la rutina');
    } finally {
      setLoading(false);
    }
  }, [selectedMuscles, selectedEquipment, espacioId, user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadRoutine();
    }, [loadRoutine]),
  );

  const handleAssignDay = async (diaSemana: number) => {
    if (!routine?.id || !user?.id) return;

    const success = await asignarRutinaADia(user.id, diaSemana, routine.id);
    if (success) {
      setShowDayModal(false);
      Alert.alert('Éxito', 'Rutina asignada exitosamente', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('WeeklyPlan'),
        },
      ]);
    } else {
      Alert.alert('Error', 'No se pudo asignar la rutina');
    }
  };

  const handleContinueWithoutAssigning = () => {
    navigation.navigate('BibliotecaRutinas');
  };

  /** Called when user releases after dragging */
  const handleDragEnd = ({ data }: { data: RutinaEjercicio[] }) => {
    // Reassign orden based on new position
    const reordered = data.map((ex, index) => ({ ...ex, orden: index + 1 }));
    setExercises(reordered);
  };

  /** Opens the remove confirmation modal */
  const handlePressRemove = (exercise: RutinaEjercicio) => {
    setExerciseToRemove(exercise);
  };

  /** Confirms removal — filters the exercise and refreshes orden */
  const handleConfirmRemove = () => {
    if (!exerciseToRemove) return;
    const updated = exercises
      .filter(ex => ex.id !== exerciseToRemove.id)
      .map((ex, index) => ({ ...ex, orden: index + 1 }));
    setExercises(updated);
    setExerciseToRemove(null);
  };

  const handleSelectExercise = (exercise: RutinaEjercicio) => {
    console.log('Exercise selected:', exercise);
    setSelectedExercise(exercise);
  };

  /** Renders each exercise card for DraggableFlatList */
  const renderExerciseItem = ({
    item: exercise,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<RutinaEjercicio>) => {
    const index = getIndex() ?? 0;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => handleSelectExercise(exercise)}
          disabled={isActive}
          activeOpacity={0.5}
          className="mx-4 mb-3 rounded-xl flex-row"
          style={{
            backgroundColor: COLORS.SECONDARY_BACKGROUND,
            borderLeftWidth: 4,
            borderLeftColor: isActive ? COLORS.PRIMARY : COLORS.SOFT_BORDER,
            opacity: isActive ? 0.9 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: isActive ? 6 : 2 },
            shadowOpacity: isActive ? 0.25 : 0.1,
            shadowRadius: isActive ? 8 : 4,
            elevation: isActive ? 8 : 3,
          }}
        >
          <View
            className="w-[10%] flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: isActive ? COLORS.PRIMARY : COLORS.SOFT_BORDER,
            }}
          >
            <Text className="text-white font-bold text-lg">{index + 1}</Text>
          </View>

          <View className="flex-row items-center gap-2 absolute top-1 right-1">
            {/* Drag handle hint */}
            <Icon name="drag-handle" size={20} color={COLORS.TEXT_SECONDARY} />
            {/* Remove button */}
            <TouchableOpacity
              onPress={() => handlePressRemove(exercise)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-col w-[90%]">
            {/* Exercise name + order number */}
            <View className="flex-row items-center px-3 pb-2 pt-0.5 w-[80%]">
              <Text
                className="flex-1 text-base font-semibold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                {exercise.ejercicio?.nombre || 'Ejercicio'}
              </Text>
            </View>

            {/* Stats row */}
            <View
              className="flex-row justify-around py-2 mx-3"
              style={{ borderTopWidth: 1, borderTopColor: COLORS.SOFT_BORDER }}
            >
              <View className="items-center">
                <Text
                  className="text-xs mb-1"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  Sets
                </Text>
                <Text
                  className="text-base font-semibold"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {exercise.series}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className="text-xs mb-1"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  Reps
                </Text>
                <Text
                  className="text-base font-semibold"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {exercise.repeticiones}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className="text-xs mb-1"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  Descanso
                </Text>
                <Text
                  className="text-base font-semibold"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {exercise.tiempo_descanso_segundos}s
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  /** Header rendered inside the FlatList */
  const renderHeader = () => (
    <View
      className="pt-14 pb-6 px-6 rounded-b-2xl mb-4"
      style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
    >
      <Text className="text-white text-2xl font-bold mb-1.5">
        Propuesta de rutina
      </Text>
      <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
        Músculos a trabajar: {selectedMuscles.join(', ')}
      </Text>
      <Text className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Mantén presionado para reordenar · Toca ✕ para quitar
      </Text>

      {routineName && (
        <View
          className="mt-2.5 px-3 py-1 rounded-full self-start"
          style={{ backgroundColor: COLORS.PRIMARY + '20' }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: COLORS.PRIMARY }}
          >
            {routineName}
          </Text>
        </View>
      )}
    </View>
  );

  /** Footer rendered inside the FlatList */
  const renderFooter = () => (
    <View className="px-4 pb-10 pt-2 gap-3">
      <TouchableOpacity
        onPress={() => setShowDayModal(true)}
        className="rounded-xl py-4 flex-row items-center justify-center"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <Icon name="event" size={22} color="white" />
        <Text className="text-white font-bold text-base ml-2">
          Asignar a un Día
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleContinueWithoutAssigning}
        className="rounded-xl py-4 flex-row items-center justify-center"
        style={{
          backgroundColor: COLORS.SECONDARY_BACKGROUND,
          borderWidth: 2,
          borderColor: COLORS.PRIMARY,
        }}
      >
        <Icon name="arrow-forward" size={22} color={COLORS.PRIMARY} />
        <Text
          className="font-bold text-base ml-2"
          style={{ color: COLORS.PRIMARY }}
        >
          Continuar sin Asignar
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <LoadingScreen message="Generando rutina..." />;
  }

  if (error) {
    return (
      <View
        className="flex-1 justify-center items-center p-5"
        style={{ backgroundColor: COLORS.Background }}
      >
        <Text
          className="text-base text-center"
          style={{ color: COLORS.SECONDARY_cobre }}
        >
          {error}
        </Text>
      </View>
    );
  }

  if (!routine) {
    return (
      <View
        className="flex-1 justify-center items-center p-5"
        style={{ backgroundColor: COLORS.Background }}
      >
        <Text
          className="text-base text-center"
          style={{ color: COLORS.TEXT_SECONDARY }}
        >
          No hay rutina disponible. Selecciona músculos y crea una rutina.
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      className="flex-1"
      style={{ backgroundColor: COLORS.Background }}
    >
      <DraggableFlatList
        data={exercises}
        keyExtractor={item => String(item.id)}
        onDragEnd={handleDragEnd}
        renderItem={renderExerciseItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        // Ensure scroll works alongside drag
        activationDistance={5}
      />

      {/* Day Selection Modal */}
      <DaySelectionModal
        visible={showDayModal}
        onClose={() => setShowDayModal(false)}
        onConfirm={handleAssignDay}
        rutinaId={routine?.id || 0}
      />

      {/* Remove Exercise Modal */}
      <RemoveExerciseModal
        visible={exerciseToRemove !== null}
        exerciseName={exerciseToRemove?.ejercicio?.nombre || ''}
        onCancel={() => setExerciseToRemove(null)}
        onConfirm={handleConfirmRemove}
      />

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        visible={selectedExercise !== null}
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </GestureHandlerRootView>
  );
}
