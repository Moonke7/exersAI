import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/COLORS';

interface FloatingButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
  size?: number;
  color?: string;
}

export function FloatingButton({
  onPress,
  icon,
  label,
  size,
  color,
}: FloatingButtonProps) {
  return (
    <View className="absolute bottom-6 left-4 right-4">
      <TouchableOpacity
        onPress={onPress}
        className="py-4 rounded-xl shadow-lg flex-row justify-center items-center"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <Icon name={icon} size={size || 24} color={color || 'white'} />
        {label && (
          <Text
            className="ml-2 font-semibold text-lg"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
