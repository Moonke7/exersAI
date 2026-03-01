import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../utils/COLORS';

interface SelectDayModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dayIndex: number) => void;
}

const DAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' },
];

export const SelectDayModal: React.FC<SelectDayModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedDay !== null) {
      onConfirm(selectedDay);
      onClose();
      // Reset after closing
      setTimeout(() => setSelectedDay(null), 300);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after closing
    setTimeout(() => setSelectedDay(null), 300);
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
              className="w-full rounded-2xl p-6"
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
                className="text-xl font-bold mb-2 text-center"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Asignar Rutina
              </Text>
              <Text
                className="text-sm text-center mb-6"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                Selecciona el día de la semana para esta rutina
              </Text>

              <View className="flex-row flex-wrap justify-center gap-3 mb-6">
                {DAYS.map(day => {
                  const isSelected = selectedDay === day.id;
                  return (
                    <TouchableOpacity
                      key={day.id}
                      onPress={() => setSelectedDay(day.id)}
                      className={`w-[45%] py-3 px-4 rounded-xl border flex-row items-center justify-center ${
                        isSelected ? 'bg-primary/10' : 'bg-transparent'
                      }`}
                      style={{
                        borderColor: isSelected
                          ? COLORS.PRIMARY
                          : COLORS.SECONDARY + '40',
                        backgroundColor: isSelected
                          ? COLORS.PRIMARY + '10'
                          : 'transparent',
                      }}
                    >
                      <Text
                        className={`font-semibold ${
                          isSelected ? 'text-primary' : 'text-gray-500'
                        }`}
                        style={{
                          color: isSelected ? COLORS.PRIMARY : COLORS.SECONDARY,
                        }}
                      >
                        {day.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{ backgroundColor: COLORS.SECONDARY }}
                >
                  <Text className="font-semibold">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={selectedDay === null}
                  className="flex-1 py-3 rounded-xl items-center"
                  style={{
                    opacity: selectedDay !== null ? 1 : 0.5,
                    backgroundColor: COLORS.PRIMARY,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{ color: COLORS.TEXT_PRIMARY }}
                  >
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
