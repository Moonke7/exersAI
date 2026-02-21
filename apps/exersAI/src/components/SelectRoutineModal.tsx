import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../utils/COLORS';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RutinaConEjercicios } from '../types/rutina';
import { useRutinas } from '../hooks/useRutinas';
import { useAuthStore } from '../store/useAuthStore';

interface SelectRoutineModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (routineId: number | null) => void;
  dayName?: string;
  initialRoutineId?: number | null;
}

export const SelectRoutineModal: React.FC<SelectRoutineModalProps> = ({
  visible,
  onClose,
  onConfirm,
  dayName,
  initialRoutineId,
}) => {
  const { obtenerBiblioteca, isLoading } = useRutinas();
  const { user } = useAuthStore();

  const [routines, setRoutines] = useState<RutinaConEjercicios[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (user?.id) {
        loadRoutines();
      }
      setSelectedRoutineId(initialRoutineId || null);
    }
  }, [visible, user?.id, initialRoutineId]);

  const loadRoutines = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await obtenerBiblioteca(user.id);
      setRoutines(data);
    } catch (error) {
      console.error('Error loading routines for modal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedRoutineId);
    onClose();
    // Reset selection after a delay to improve UX
    setTimeout(() => setSelectedRoutineId(null), 300);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setSelectedRoutineId(null), 300);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TouchableWithoutFeedback>
            <View
              className="w-full rounded-2xl p-6 max-h-[80%]"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: COLORS.SECONDARY_BACKGROUND,
              }}
            >
              <Text
                className="text-xl font-bold mb-1 text-center"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Seleccionar Rutina
              </Text>
              {dayName && (
                <Text
                  className="text-sm text-center mb-4"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  Asignar para el {dayName}
                </Text>
              )}

              {loading || isLoading ? (
                <View className="py-10">
                  <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                </View>
              ) : routines.length === 0 ? (
                <View className="py-8 items-center">
                  <Text
                    className="text-center mb-4"
                    style={{ color: COLORS.SECONDARY }}
                  >
                    No tienes rutinas creadas aún.
                  </Text>
                </View>
              ) : (
                <ScrollView className="mb-6 max-h-[400px]">
                  {routines.map(routine => {
                    const isSelected = selectedRoutineId === routine.id;
                    const exercisesText =
                      routine.ejercicios && routine.ejercicios.length > 0
                        ? routine.ejercicios
                            .slice(0, 3)
                            .map(e =>
                              e.ejercicio ? e.ejercicio.nombre : 'Ejercicio',
                            )
                            .join(', ') +
                          (routine.ejercicios.length > 3
                            ? ` +${routine.ejercicios.length - 3} más`
                            : '')
                        : 'Sin ejercicios';

                    return (
                      <TouchableOpacity
                        key={routine.id}
                        onPress={() =>
                          setSelectedRoutineId(
                            selectedRoutineId === routine.id
                              ? null
                              : routine.id,
                          )
                        }
                        className="mb-3 rounded-xl p-4 border"
                        style={{
                          borderColor: isSelected
                            ? COLORS.PRIMARY
                            : COLORS.SECONDARY + '40',
                          backgroundColor: isSelected
                            ? COLORS.PRIMARY + '10'
                            : 'transparent',
                        }}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1 pr-4">
                            <Text
                              className="font-bold text-base mb-1"
                              style={{
                                color: isSelected
                                  ? COLORS.PRIMARY
                                  : COLORS.TEXT_PRIMARY,
                              }}
                            >
                              {routine.nombre}
                            </Text>
                            <Text
                              className="text-xs"
                              style={{ color: COLORS.TEXT_SECONDARY }}
                              numberOfLines={1}
                            >
                              {exercisesText}
                            </Text>
                          </View>
                          {isSelected && (
                            <Icon
                              name="check-circle"
                              size={24}
                              color={COLORS.PRIMARY}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <View className="flex-row gap-3 mt-auto">
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{ backgroundColor: COLORS.SECONDARY }}
                >
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    backgroundColor: COLORS.PRIMARY,
                  }}
                >
                  <Text className="text-white font-semibold">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
