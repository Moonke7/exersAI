import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../utils/COLORS';

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await register({ name, email, password });

    if (result.success) {
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      // Navegar a la pantalla principal
      // navigation.replace('Home'); // Ajusta según tu navegación
    } else {
      Alert.alert('Error', result.error || 'Error al crear la cuenta');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.Background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          Crear Cuenta
        </Text>

        <View className="mb-4">
          <Text
            className="mb-2 font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Nombre
          </Text>
          <TextInput
            className="rounded-lg p-3"
            style={{
              borderWidth: 1,
              borderColor: COLORS.SOFT_BORDER,
              backgroundColor: COLORS.SECONDARY_BACKGROUND,
              color: COLORS.TEXT_PRIMARY,
            }}
            placeholder="Tu nombre"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>

        <View className="mb-4">
          <Text
            className="mb-2 font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Email
          </Text>
          <TextInput
            className="rounded-lg p-3"
            style={{
              borderWidth: 1,
              borderColor: COLORS.SOFT_BORDER,
              backgroundColor: COLORS.SECONDARY_BACKGROUND,
              color: COLORS.TEXT_PRIMARY,
            }}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        <View className="mb-4">
          <Text
            className="mb-2 font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Contraseña
          </Text>
          <TextInput
            className="rounded-lg p-3"
            style={{
              borderWidth: 1,
              borderColor: COLORS.SOFT_BORDER,
              backgroundColor: COLORS.SECONDARY_BACKGROUND,
              color: COLORS.TEXT_PRIMARY,
            }}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <View className="mb-6">
          <Text
            className="mb-2 font-medium"
            style={{ color: COLORS.TEXT_PRIMARY }}
          >
            Confirmar Contraseña
          </Text>
          <TextInput
            className="rounded-lg p-3"
            style={{
              borderWidth: 1,
              borderColor: COLORS.SOFT_BORDER,
              backgroundColor: COLORS.SECONDARY_BACKGROUND,
              color: COLORS.TEXT_PRIMARY,
            }}
            placeholder="Repite tu contraseña"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          className="rounded-lg p-4"
          style={{
            backgroundColor: isLoading
              ? COLORS.SECONDARY_azul_cielo
              : COLORS.PRIMARY,
          }}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Registrarse
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text style={{ color: COLORS.TEXT_SECONDARY }}>
            ¿Ya tienes cuenta?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text className="font-semibold" style={{ color: COLORS.PRIMARY }}>
              Inicia Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
