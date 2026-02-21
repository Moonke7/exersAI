import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../utils/COLORS';

interface CreateEspacioModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (nombre: string) => Promise<void>;
  isLoading?: boolean;
}

export function CreateEspacioModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: CreateEspacioModalProps) {
  const [nombre, setNombre] = useState('');

  const handleConfirm = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el espacio');
      return;
    }

    await onConfirm(nombre.trim());
    setNombre(''); // Limpiar input después de crear
  };

  const handleClose = () => {
    setNombre('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="rounded-2xl p-6 w-[85%] shadow-xl"
          style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
        >
          <Text
            className="text-xl font-bold mb-1"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Crear Nuevo Espacio
          </Text>

          <Text className="mb-4" style={{ color: COLORS.TEXT_SECONDARY }}>
            Nombre del espacio
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-6 text-gray-800"
            placeholder="Ej: Gimnasio Casa"
            value={nombre}
            onChangeText={setNombre}
            editable={!isLoading}
            autoFocus
          />

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-lg p-3"
              style={{ backgroundColor: COLORS.SECONDARY }}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text className="text-center font-semibold">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-lg p-3`}
              style={{ backgroundColor: COLORS.PRIMARY }}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Aceptar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
