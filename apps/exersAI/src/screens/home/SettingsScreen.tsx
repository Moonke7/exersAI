import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../utils/COLORS';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  const settingsSections: Array<{
    title: string;
    items: Array<{
      icon: string;
      label: string;
      subtitle?: string;
      enabled: boolean;
      onPress: () => void;
      isDestructive?: boolean;
    }>;
  }> = [
    {
      title: 'Cuenta',
      items: [
        {
          icon: 'person',
          label: 'Editar Perfil',
          subtitle: 'Nombre, foto, etc.',
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'email',
          label: 'Cambiar Email',
          subtitle: user?.email,
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'lock',
          label: 'Cambiar Contraseña',
          subtitle: 'Actualizar contraseña',
          enabled: false,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Preferencias',
      items: [
        {
          icon: 'fitness-center',
          label: 'Objetivo de Entrenamiento',
          subtitle: 'Hipertrofia',
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'notifications',
          label: 'Notificaciones',
          subtitle: 'Gestionar notificaciones',
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'language',
          label: 'Idioma',
          subtitle: 'Español',
          enabled: false,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Aplicación',
      items: [
        {
          icon: 'help',
          label: 'Ayuda y Soporte',
          subtitle: 'Contacta con nosotros',
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'info',
          label: 'Acerca de',
          subtitle: 'Versión 1.0.0',
          enabled: false,
          onPress: () => {},
        },
        {
          icon: 'policy',
          label: 'Privacidad y Términos',
          subtitle: 'Políticas de la app',
          enabled: false,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Sesión',
      items: [
        {
          icon: 'logout',
          label: 'Cerrar Sesión',
          subtitle: 'Salir de tu cuenta',
          enabled: true,
          onPress: handleLogout,
          isDestructive: true,
        },
      ],
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <View
        className="pt-14 pb-6 px-6 rounded-b-2xl"
        style={{ backgroundColor: COLORS.Background }}
      >
        <Text className="text-white text-2xl font-bold">Configuración</Text>
        <Text className="text-white/80 text-sm mt-1">
          Gestiona tu cuenta y preferencias
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Información del usuario */}
        <View
          className="rounded-xl p-5 mb-6 shadow-sm"
          style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
        >
          <View className="flex-row items-center">
            <View
              className="rounded-full p-4 mr-4"
              style={{ backgroundColor: COLORS.PRIMARY + '20' }}
            >
              <Icon name="person" size={32} color={COLORS.PRIMARY} />
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-semibold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                {user?.name || 'Usuario'}
              </Text>
              <Text
                className="text-sm"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Secciones de configuración */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text
              className="text-sm font-semibold mb-3 px-1"
              style={{ color: COLORS.TEXT_SECONDARY }}
            >
              {section.title}
            </Text>
            <View
              className="rounded-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
            >
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={item.onPress}
                  disabled={!item.enabled || isLoading}
                  className={`flex-row items-center p-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b' : ''
                  } ${!item.enabled ? 'opacity-50' : ''}`}
                  style={{
                    borderBottomColor:
                      itemIndex !== section.items.length - 1
                        ? COLORS.SOFT_BORDER
                        : 'transparent',
                  }}
                >
                  <View
                    className="rounded-full p-2 mr-3"
                    style={{
                      backgroundColor: item.isDestructive
                        ? '#FEE2E2'
                        : COLORS.Background,
                    }}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={
                        item.isDestructive ? '#EF4444' : COLORS.TEXT_SECONDARY
                      }
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="font-semibold"
                      style={{
                        color: item.isDestructive
                          ? '#EF4444'
                          : COLORS.TEXT_PRIMARY,
                      }}
                    >
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text
                        className="text-sm mt-0.5"
                        style={{ color: COLORS.TEXT_SECONDARY }}
                      >
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  {item.enabled && !item.isDestructive && (
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={COLORS.TEXT_SECONDARY}
                    />
                  )}
                  {!item.enabled && (
                    <Text
                      className="text-xs"
                      style={{ color: COLORS.SECONDARY }}
                    >
                      Próximamente
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Espacio inferior */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
