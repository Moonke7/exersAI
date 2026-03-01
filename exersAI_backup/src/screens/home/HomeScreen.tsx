import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainStackParamList, MainTabParamList } from '../../navigation/types';
import { COLORS } from '../../utils/COLORS';
import { SyncService } from '../../utils/SyncService';
import { AgendaConRutina, Rutina } from '../../types/rutina';
import { useRutinas } from '../../hooks/useRutinas';
import LoadingScreen from '../../components/LoadingScreen';
import LinearGradient from 'react-native-linear-gradient';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { obtenerAgendaSemanal } = useRutinas();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [agendaSemanal, setAgendaSemanal] = useState<AgendaConRutina[]>([]);
  const [todayRoutine, setTodayRoutine] = useState<Rutina | null>(null);
  const [nextRoutine, setNextRoutine] = useState<AgendaConRutina | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAgendaSemanal = async () => {
        try {
          setIsLoading(true);

          const agenda = await obtenerAgendaSemanal();
          setAgendaSemanal(agenda);
          const today = new Date();

          let todayDay = today.getDay();
          todayDay = todayDay === 0 ? 7 : todayDay;

          const foundTodayRoutine = agenda.find(
            routine => routine.dia_semana === todayDay,
          );

          if (foundTodayRoutine) {
            setTodayRoutine(foundTodayRoutine.rutina);
            setNextRoutine(null);
            return;
          } else {
            setTodayRoutine(null);
          }

          // Find next routine from today onwards
          let foundNextRoutine = agenda.find(
            routine => routine.dia_semana > todayDay,
          );

          // If no routine found after today, find first routine of next week
          if (foundNextRoutine) {
            setNextRoutine(foundNextRoutine);
          } else {
            // Get first routine in the week (for next week)
            const firstRoutine = agenda.sort(
              (a, b) => a.dia_semana - b.dia_semana,
            )[0];
            setNextRoutine(firstRoutine || null);
          }
        } catch (error) {
          console.error('Error al obtener la agenda semanal:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAgendaSemanal();
    }, []),
  );

  console.log('Agenda semanal:', agendaSemanal);

  let streakDays = 5;

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await SyncService.synchronizeData();
      Alert.alert('Sincronización', 'Datos sincronizados correctamente.');
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Hubo un problema al sincronizar los datos.');
    } finally {
      setIsSyncing(false);
    }
  };

  const menuItems = [
    {
      title: 'Espacios',
      description: 'Explora los espacios disponibles',
      icon: 'map-pin',
      color: COLORS.PRIMARY,
      enabled: true,
      onPress: () => navigation.navigate('Espacios'),
    },
    {
      title: 'Plan Semanal',
      description: 'Planifica tus entrenamientos',
      icon: 'calendar',
      color: COLORS.SECONDARY_verde,
      enabled: true,
      onPress: () => navigation.navigate('WeeklyPlan'),
    },
    {
      title: 'Rutinas',
      description: 'Explora tus rutinas creadas',
      icon: 'activity',
      color: COLORS.SECONDARY_cobre,
      enabled: true,
      onPress: () => navigation.navigate('BibliotecaRutinas'),
    },
  ];

  if (isLoading) {
    return <LoadingScreen message="Cargando datos..." />;
  }

  let currentDay = new Date().getDay();
  currentDay = currentDay === 0 ? 7 : currentDay;

  let daysUntilNextRoutine = nextRoutine
    ? nextRoutine.dia_semana - currentDay
    : 0;

  if (daysUntilNextRoutine < 0) {
    daysUntilNextRoutine += 7;
  }
  if (daysUntilNextRoutine === 0 && nextRoutine) {
    daysUntilNextRoutine = 7;
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: COLORS.Background }}
    >
      {/* Header con información del usuario */}
      <View
        className="pt-14 pb-4 px-6 rounded-b-2xl"
        style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <View className="flex-1">
              <Text
                className="text-2xl font-bold mb-2"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Hola, {user?.name || 'Usuario'}
              </Text>
              <Text
                className="text-sm"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                ¿Listo para entrenar?
              </Text>
            </View>
          </View>

          {/* Sync Button */}
          <TouchableOpacity
            onPress={handleSync}
            disabled={isSyncing}
            className="p-2 rounded-full border"
            style={{ borderColor: COLORS.SOFT_BORDER }}
          >
            {isSyncing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Icon name="refresh-cw" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Routine Section */}
      <View className="px-6 mt-4">
        {todayRoutine ? (
          <View className="rounded-2xl flex-row justify-between items-center">
            <View className="flex-col mb-3">
              <Text
                className="ml-2 text-4xl font-semibold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Dia de
              </Text>
              <Text
                className="ml-2 text-5xl font-semibold"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                {todayRoutine.nombre}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RoutineDetails', {
                  rutinaId: todayRoutine.id,
                })
              }
              className="rounded-xl py-6 px-9 mr-4 flex-row items-center justify-center"
              style={{ backgroundColor: COLORS.SECONDARY_verde }}
            >
              <MaterialIcon name="play-arrow" size={48} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex flex-row justify-between items-center">
            <View className="flex-col mb-2">
              <Text
                className="ml-2 text-4xl font-semibold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                Día de
              </Text>

              <Text
                className="ml-2 text-5xl font-semibold"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                Descanso.
              </Text>
              {nextRoutine && (
                <Text
                  className="ml-2 text-md"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  {daysUntilNextRoutine === 1
                    ? 'Mañana '
                    : 'En ' + daysUntilNextRoutine + ' días '}
                  - {nextRoutine.rutina?.nombre}
                </Text>
              )}
            </View>

            <View
              className="p-6 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
            >
              <Icon name="moon" size={52} color={COLORS.TEXT_SECONDARY} />
            </View>
          </View>
        )}
      </View>

      {/* Streak Section */}
      <View className="px-6 mt-4">
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 3.25 }}
          locations={[0, 2]}
          colors={[COLORS.Racha + '15', COLORS.Racha + '30']}
          className="flex-row items-center shadow-sm p-4"
          style={{
            borderRadius: 16,
            shadowColor: COLORS.Racha,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            backgroundColor: COLORS.Background,
          }}
        >
          <View
            className="rounded-xl p-3 mr-4"
            style={{ backgroundColor: COLORS.Racha + '20' }}
          >
            <MaterialIcon
              name="local-fire-department"
              size={32}
              color={COLORS.Racha}
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold" style={{ color: COLORS.Racha }}>
              ¡Llevas {streakDays} {streakDays === 1 ? 'día' : 'días'} sin
              fallar!
            </Text>
            <Text
              className="text-sm mt-1"
              style={{ color: COLORS.TEXT_SECONDARY }}
            >
              Sigue así, mantén la racha 🔥
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Menú Principal */}
      <View className="px-6 mt-8">
        <View className="gap-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              disabled={!item.enabled}
              className={`rounded-xl p-5 flex-row items-center ${
                !item.enabled ? 'opacity-50' : ''
              }`}
              style={{
                borderBottomLeftRadius: COLORS.SOFT_BORDER,
                borderBottomRightRadius: COLORS.SOFT_BORDER,
                borderBottomColor: COLORS.SOFT_BORDER,
                borderBottomWidth: 1,
              }}
            >
              <Icon
                name={item.icon}
                size={28}
                color={item.color}
                style={{ marginRight: 16 }}
              />
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-sm mt-1"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  {item.description}
                </Text>
                {!item.enabled && (
                  <Text
                    className="text-xs mt-1"
                    style={{ color: COLORS.SECONDARY }}
                  >
                    Próximamente
                  </Text>
                )}
              </View>
              {item.enabled && (
                <Icon name="chevron-right" size={24} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
