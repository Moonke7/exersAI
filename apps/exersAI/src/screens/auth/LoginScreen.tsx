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
import { LoginScreenNavigationProp } from '../../navigation/types';
import { COLORS } from '../../utils/COLORS';

export function LoginScreen({
  navigation,
}: {
  navigation: LoginScreenNavigationProp;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      // La navegación se maneja automáticamente cuando cambia el estado de autenticación
      Alert.alert('Éxito', 'Sesión iniciada correctamente');
    } else {
      Alert.alert('Error', result.error || 'Error al iniciar sesión');
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
          Iniciar Sesión
        </Text>

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

        <View className="mb-6">
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
            placeholder="••••••••"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={password}
            onChangeText={setPassword}
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
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text style={{ color: COLORS.TEXT_SECONDARY }}>
            ¿No tienes cuenta?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register' as never)}
            disabled={isLoading}
          >
            <Text className="font-semibold" style={{ color: COLORS.PRIMARY }}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
