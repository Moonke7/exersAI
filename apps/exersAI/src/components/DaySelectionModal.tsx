import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/COLORS';

interface DaySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (diaSemana: number) => void;
  rutinaId: number;
}

const DAYS = [
  { number: 1, name: 'Lunes', short: 'LUN' },
  { number: 2, name: 'Martes', short: 'MAR' },
  { number: 3, name: 'Miércoles', short: 'MIÉ' },
  { number: 4, name: 'Jueves', short: 'JUE' },
  { number: 5, name: 'Viernes', short: 'VIE' },
  { number: 6, name: 'Sábado', short: 'SÁB' },
  { number: 7, name: 'Domingo', short: 'DOM' },
];

export function DaySelectionModal({
  visible,
  onClose,
  onConfirm,
  rutinaId,
}: DaySelectionModalProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedDay !== null) {
      onConfirm(selectedDay);
      setSelectedDay(null); // Reset
    }
  };

  const handleClose = () => {
    setSelectedDay(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />

        {/* Modal Content */}
        <View
          className=" rounded-t-3xl px-6 pt-6 pb-8 min-h-[65vh]"
          style={{
            backgroundColor: COLORS.SECONDARY_BACKGROUND,
            maxHeight: '70%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-2xl font-bold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              Asignar a un Día
            </Text>
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Icon name="close" size={24} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          <Text
            className="text-sm mb-4"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            Selecciona el día de la semana para esta rutina
          </Text>

          {/* Days List */}
          <ScrollView
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {DAYS.map(day => {
              const isSelected = selectedDay === day.number;

              return (
                <TouchableOpacity
                  key={day.number}
                  onPress={() => setSelectedDay(day.number)}
                  className="rounded-xl p-4 mb-3 flex-row items-center"
                  style={{
                    borderWidth: 2,
                    borderColor: isSelected
                      ? COLORS.PRIMARY
                      : COLORS.SOFT_BORDER,
                  }}
                >
                  <View
                    className="rounded-xl w-12 h-12 items-center justify-center mr-4"
                    style={{
                      backgroundColor: isSelected
                        ? COLORS.PRIMARY
                        : COLORS.TEXT_SECONDARY,
                    }}
                  >
                    <Text
                      className="font-bold text-xs"
                      style={{
                        color: isSelected ? 'white' : COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {day.short}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-lg font-bold"
                      style={{
                        color: isSelected
                          ? COLORS.PRIMARY
                          : COLORS.TEXT_SECONDARY,
                      }}
                    >
                      {day.name}
                    </Text>
                  </View>
                  {isSelected && (
                    <Icon
                      name="check-circle"
                      size={28}
                      color={COLORS.PRIMARY}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={selectedDay === null}
            className="rounded-xl p-4"
            style={{
              backgroundColor:
                selectedDay !== null ? COLORS.PRIMARY : COLORS.SECONDARY,
            }}
          >
            <Text className="text-white text-center font-semibold text-base">
              Asignar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
