import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/COLORS';

interface RemoveExerciseModalProps {
  visible: boolean;
  exerciseName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RemoveExerciseModal({
  visible,
  exerciseName,
  onCancel,
  onConfirm,
}: RemoveExerciseModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      >
        {/* Card */}
        <View
          className="w-full rounded-2xl p-6"
          style={{
            backgroundColor: COLORS.SECONDARY_BACKGROUND,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          {/* Icon */}
          <View
            className="self-center w-14 h-14 rounded-full justify-center items-center mb-4"
            style={{ backgroundColor: '#ef444420' }}
          >
            <Icon name="delete-outline" size={30} color="#ef4444" />
          </View>

          {/* Title */}
          <Text
            className="text-lg font-bold text-center mb-2.5"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Quitar ejercicio
          </Text>

          {/* Message */}
          <Text
            className="text-sm text-center leading-5 mb-6"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            ¿Estás seguro de quitar{' '}
            <Text
              className="font-semibold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              {exerciseName}
            </Text>{' '}
            de tu rutina?
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {/* Cancel */}
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 rounded-xl py-3.5 items-center"
              style={{ borderWidth: 2, borderColor: COLORS.SOFT_BORDER }}
            >
              <Text
                className="font-semibold text-base"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            {/* Confirm */}
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 rounded-xl py-3.5 items-center bg-red-500"
            >
              <Text className="text-white font-bold text-base">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
