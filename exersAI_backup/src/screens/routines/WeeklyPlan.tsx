import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRutinas } from '../../hooks/useRutinas';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../utils/COLORS';
import { MainStackParamList } from '../../navigation/types';
import { AgendaConRutina } from '../../types/rutina';
import LoadingScreen from '../../components/LoadingScreen';
import { SelectRoutineModal } from '../../components/SelectRoutineModal';
import Header from '../../components/Header';
import { FloatingButton } from '../../components/FloatingButton';

type WeeklyPlanNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'WeeklyPlan'
>;

interface DaySchedule {
  dia_semana: number; // 1-7
  dia_nombre: string;
  agenda?: AgendaConRutina; // undefined = día de descanso
}

const DAYS_MAP: { [key: number]: string } = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export default function WeeklyPlan() {
  const navigation = useNavigation<WeeklyPlanNavigationProp>();
  const { user } = useAuthStore();
  const { obtenerAgendaSemanal, isLoading } = useRutinas();

  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [selectedDayForAssignment, setSelectedDayForAssignment] =
    useState<DaySchedule | null>(null);

  const { asignarRutinaADia, desasignarRutinaDelDia } = useRutinas();

  const loadWeeklyPlan = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const agenda = await obtenerAgendaSemanal(user.id);

      // Create array of all 7 days
      const allDays: DaySchedule[] = [1, 2, 3, 4, 5, 6, 7].map(dayNum => {
        const agendaItem = agenda.find(a => a.dia_semana === dayNum);
        return {
          dia_semana: dayNum,
          dia_nombre: DAYS_MAP[dayNum],
          agenda: agendaItem,
        };
      });

      setWeekSchedule(allDays);
    } catch (err) {
      console.error('Error loading weekly plan:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadWeeklyPlan();
    }, [loadWeeklyPlan]),
  );

  const diasConRutina = weekSchedule.filter(d => d.agenda).length;

  const handleRoutineDetails = (rutinaId: number) => {
    navigation.navigate('RoutineDetails', {
      rutinaId: rutinaId,
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <Header title="Mi Plan Semanal" showBackButton />

      {loading || isLoading ? (
        <LoadingScreen message="Cargando plan semanal..." />
      ) : (
        <ScrollView
          className="flex-1 px-6 mt-6"
          // commented for the floating button to work
          /*  contentContainerStyle={{ paddingBottom: 80 }} */
        >
          {weekSchedule.map(day => {
            const hasRoutine = !!day.agenda;
            const rutina = day.agenda?.rutina;
            const ejerciciosCount = rutina?.ejercicios?.length || 0;

            return (
              <View
                key={day.dia_semana}
                className="rounded-xl p-5 mb-4 shadow-sm"
                style={{
                  backgroundColor: COLORS.SECONDARY_BACKGROUND,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {/* Day Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text
                      className="text-xl font-bold mb-1"
                      style={{ color: COLORS.TEXT_PRIMARY }}
                    >
                      {day.dia_nombre}
                    </Text>
                    {hasRoutine && rutina ? (
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: COLORS.PRIMARY }}
                      >
                        {rutina.nombre}
                      </Text>
                    ) : (
                      <Text
                        className="text-sm"
                        style={{ color: COLORS.SECONDARY }}
                      >
                        Día de Descanso
                      </Text>
                    )}
                  </View>
                  <View
                    className="rounded-full p-3"
                    style={{
                      backgroundColor: hasRoutine
                        ? COLORS.SECONDARY_verde + '20'
                        : COLORS.SECONDARY + '20',
                    }}
                  >
                    <Icon
                      name={hasRoutine ? 'check-circle' : 'event-available'}
                      size={24}
                      color={
                        hasRoutine ? COLORS.SECONDARY_verde : COLORS.SECONDARY
                      }
                    />
                  </View>
                </View>

                {/* Exercise Count or Rest Day */}
                {hasRoutine && rutina ? (
                  <>
                    <View
                      className="rounded-lg p-3 mb-3"
                      style={{ backgroundColor: COLORS.Background }}
                    >
                      <View className="flex-row items-center">
                        <Icon
                          name="fitness-center"
                          size={20}
                          color={COLORS.TEXT_PRIMARY}
                        />
                        <Text
                          className="ml-2 text-sm font-semibold"
                          style={{ color: COLORS.TEXT_PRIMARY }}
                        >
                          {ejerciciosCount} ejercicio
                          {ejerciciosCount !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      {rutina.objetivo && (
                        <Text
                          className="text-xs mt-1"
                          style={{ color: COLORS.SECONDARY }}
                        >
                          Objetivo: {rutina.objetivo}
                        </Text>
                      )}
                    </View>

                    {/* Exercises Preview */}
                    {ejerciciosCount > 0 && (
                      <View className="mt-2">
                        {rutina.ejercicios
                          .slice(0, 3)
                          .map((ejercicio, index) => (
                            <View
                              key={ejercicio.id}
                              className="flex-row items-center py-2"
                              style={{
                                borderBottomWidth:
                                  index < Math.min(2, ejerciciosCount - 1)
                                    ? 1
                                    : 0,
                                borderBottomColor: COLORS.SECONDARY + '30',
                              }}
                            >
                              <View
                                className="w-6 h-6 rounded-full items-center justify-center mr-3"
                                style={{
                                  backgroundColor: COLORS.PRIMARY + '20',
                                }}
                              >
                                <Text
                                  className="text-xs font-bold"
                                  style={{ color: COLORS.PRIMARY }}
                                >
                                  {index + 1}
                                </Text>
                              </View>
                              <Text
                                className="flex-1 text-sm"
                                style={{ color: COLORS.TEXT_PRIMARY }}
                                numberOfLines={1}
                              >
                                {ejercicio.series}x{ejercicio.repeticiones}
                              </Text>
                            </View>
                          ))}
                        {ejerciciosCount > 3 && (
                          <Text
                            className="text-xs mt-2 text-center"
                            style={{ color: COLORS.SECONDARY }}
                          >
                            +{ejerciciosCount - 3} más
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row gap-2 mt-3">
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDayForAssignment(day);
                          setShowRoutineModal(true);
                        }}
                        className="flex-1 rounded-lg p-3"
                        style={{ backgroundColor: COLORS.PRIMARY + '10' }}
                      >
                        <Text
                          className="text-center font-semibold text-sm"
                          style={{ color: COLORS.PRIMARY }}
                        >
                          Cambiar Rutina
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          handleRoutineDetails(rutina.id);
                        }}
                        className="flex-1 rounded-lg p-3"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                      >
                        <Text className="text-center font-semibold text-sm text-white">
                          Ver Detalles
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDayForAssignment(day);
                      setShowRoutineModal(true);
                    }}
                    className="mt-3 rounded-lg p-3 flex-row items-center justify-center"
                    style={{
                      backgroundColor: COLORS.PRIMARY + '10',
                      borderWidth: 1,
                      borderColor: COLORS.PRIMARY + '30',
                      borderStyle: 'dashed',
                    }}
                  >
                    <Icon name="add-circle" size={20} color={COLORS.PRIMARY} />
                    <Text
                      className="ml-2 font-semibold text-sm"
                      style={{ color: COLORS.PRIMARY }}
                    >
                      Asignar Rutina
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* idk if its correct to put the floating button here */}
      {/* <FloatingButton
        onPress={() => navigation.navigate('SelectEspacioForRoutine' as never)}
        icon="add"
        size={24}
        label="Crear nueva rutina"
        color="white"
      /> */}

      <SelectRoutineModal
        visible={showRoutineModal}
        onClose={() => {
          setShowRoutineModal(false);
          setSelectedDayForAssignment(null);
        }}
        onConfirm={async routineId => {
          if (selectedDayForAssignment && user?.id) {
            if (routineId) {
              await asignarRutinaADia(
                user.id,
                selectedDayForAssignment.dia_semana,
                routineId,
              );
            } else if (selectedDayForAssignment.agenda) {
              await desasignarRutinaDelDia(selectedDayForAssignment.agenda.id);
            }

            setShowRoutineModal(false);
            setSelectedDayForAssignment(null);
            loadWeeklyPlan(); // Refresh the plan
          }
        }}
        dayName={selectedDayForAssignment?.dia_nombre}
        initialRoutineId={selectedDayForAssignment?.agenda?.rutina?.id}
      />
    </View>
  );
}
