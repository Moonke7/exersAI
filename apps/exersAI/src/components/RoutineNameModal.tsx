import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ROUTINE_PRESETS, RoutinePreset } from '../config/routinePresets';
import { COLORS } from '../utils/COLORS';

interface RoutineNameModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (name: string, preset?: RoutinePreset) => void;
}

export function RoutineNameModal({
  visible,
  onClose,
  onConfirm,
}: RoutineNameModalProps) {
  const [routineName, setRoutineName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<
    RoutinePreset | undefined
  >();

  const handlePresetSelect = (preset: RoutinePreset) => {
    setSelectedPreset(preset);
    setRoutineName(preset.name);
  };

  const handleConfirm = () => {
    if (routineName.trim()) {
      onConfirm(routineName.trim(), selectedPreset);
      // Reset state
      setRoutineName('');
      setSelectedPreset(undefined);
    }
  };

  const handleClose = () => {
    setRoutineName('');
    setSelectedPreset(undefined);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
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
            className="rounded-t-3xl px-6 pt-6 pb-8 min-h-[65vh]"
            style={{
              maxHeight: '85%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
              backgroundColor: COLORS.SECONDARY_BACKGROUND,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-2xl font-bold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Nombre de Rutina
              </Text>
              <TouchableOpacity onPress={handleClose} className="p-2">
                <Icon name="close" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {/* Input */}
            <View className="mb-6">
              <TextInput
                value={routineName}
                onChangeText={text => {
                  setRoutineName(text);
                  setSelectedPreset(undefined); // Clear preset if typing manually
                }}
                placeholder="Escribe un nombre personalizado..."
                className="rounded-xl p-4 text-base"
                style={{
                  backgroundColor: COLORS.SECONDARY_BACKGROUND,
                  color: COLORS.TEXT_PRIMARY,
                  borderWidth: 1,
                  borderColor: COLORS.SOFT_BORDER,
                }}
                placeholderTextColor={COLORS.SECONDARY}
              />
            </View>

            {/* Presets */}
            <Text
              className="text-sm font-semibold mb-3"
              style={{ color: COLORS.SECONDARY }}
            >
              O selecciona un nombre común:
            </Text>

            <ScrollView
              className="flex-1 mb-4"
              showsVerticalScrollIndicator={false}
            >
              {ROUTINE_PRESETS.map((preset, index) => {
                const isSelected = selectedPreset?.name === preset.name;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePresetSelect(preset)}
                    className="rounded-xl p-4 mb-3 flex-row items-center"
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected
                        ? COLORS.PRIMARY
                        : COLORS.SOFT_BORDER,
                    }}
                  >
                    <View
                      className="rounded-xl p-3 mr-3"
                      style={{
                        backgroundColor: isSelected
                          ? COLORS.PRIMARY
                          : COLORS.PRIMARY + '10',
                      }}
                    >
                      <Icon
                        name={preset.icon}
                        size={24}
                        color={isSelected ? 'white' : COLORS.TEXT_PRIMARY}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-bold mb-1"
                        style={{
                          color: isSelected
                            ? COLORS.PRIMARY
                            : COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {preset.name}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{ color: COLORS.TEXT_SECONDARY }}
                      >
                        {preset.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={24}
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
              disabled={!routineName.trim()}
              className="rounded-xl p-4"
              style={{
                backgroundColor: COLORS.PRIMARY,
                opacity: routineName.trim() ? 1 : 0.5,
              }}
            >
              <Text className="text-white text-center font-semibold text-base">
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
