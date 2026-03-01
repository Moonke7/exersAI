import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRutinas } from '../../hooks/useRutinas';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../utils/COLORS';
import { MainStackParamList } from '../../navigation/types';
import { RutinaConEjercicios } from '../../types/rutina';
import { RoutineNameModal } from '../../components/RoutineNameModal';
import LoadingScreen from '../../components/LoadingScreen';
import { useRoutineStore } from '../../store/useRoutineStore';
import { SelectDayModal } from '../../components/SelectDayModal';
import Header from '../../components/Header';
import { FloatingButton } from '../../components/FloatingButton';

type BibliotecaRutinasNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'BibliotecaRutinas'
>;

export default function BibliotecaRutinas() {
  const navigation = useNavigation<BibliotecaRutinasNavigationProp>();
  const { user } = useAuthStore();
  const { setSelectedRoutine } = useRoutineStore();
  const { obtenerBiblioteca, eliminarRutina, actualizarRutina, isLoading } =
    useRutinas();

  const [rutinas, setRutinas] = useState<RutinaConEjercicios[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedRoutineIdForAssignment, setSelectedRoutineIdForAssignment] =
    useState<number | null>(null);

  // Estado para edición inline
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [editedNames, setEditedNames] = useState<{ [key: number]: string }>({});

  const { asignarRutinaADia } = useRutinas();

  const loadBiblioteca = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const biblioteca = await obtenerBiblioteca(user.id);
      setRutinas(biblioteca);
    } catch (err) {
      console.error('Error loading biblioteca:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadBiblioteca();
    }, [loadBiblioteca]),
  );

  const handleEliminarRutina = (rutinaId: number, nombre: string) => {
    Alert.alert(
      'Eliminar Rutina',
      `¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await eliminarRutina(rutinaId);
            if (success) {
              loadBiblioteca();
            }
          },
        },
      ],
    );
  };

  const selectRoutine = (rutina: RutinaConEjercicios) => {
    navigation.navigate('RoutineDetails', {
      rutinaId: rutina.id,
    });
  };

  // Helpers para edición inline
  const startEditingRoutine = (rutinaId: number, currentName: string) => {
    setEditingRoutineId(rutinaId);
    if (!editedNames[rutinaId]) {
      setEditedNames(prev => ({ ...prev, [rutinaId]: currentName }));
    }
  };

  const handleNameChange = (rutinaId: number, newName: string) => {
    setEditedNames(prev => ({ ...prev, [rutinaId]: newName }));
  };

  const saveRoutineName = async (rutinaId: number) => {
    const newName = editedNames[rutinaId];
    const rutina = rutinas.find(r => r.id === rutinaId);

    if (!newName || !rutina || newName.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (newName === rutina.nombre) {
      // No hay cambios, solo cerramos el editor
      setEditingRoutineId(null);
      return;
    }

    const success = await actualizarRutina(rutinaId, newName, rutina.objetivo);
    if (success) {
      setEditingRoutineId(null);
      loadBiblioteca(); // Recargar para mostrar el nuevo nombre
    } else {
      Alert.alert('Error', 'No se pudo actualizar el nombre de la rutina');
    }
  };

  const hasUnsavedChanges = (rutinaId: number): boolean => {
    const rutina = rutinas.find(r => r.id === rutinaId);
    const editedName = editedNames[rutinaId];
    return !!editedName && rutina ? editedName !== rutina.nombre : false;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.Background }}>
      {/* Header */}
      <Header title="Mis Rutinas" showBackButton />

      {loading || isLoading ? (
        <LoadingScreen message="Cargando rutinas..." />
      ) : (
        <ScrollView
          className="flex-1 px-6 mt-6"
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {rutinas.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <Icon name="fitness-center" size={80} color={COLORS.SECONDARY} />
              <Text
                className="text-center mt-4 text-base"
                style={{ color: COLORS.SECONDARY }}
              >
                No tienes rutinas guardadas
              </Text>
              <Text
                className="text-center mt-2 text-sm px-8"
                style={{ color: COLORS.SECONDARY }}
              >
                Crea tu primera rutina para comenzar a entrenar
              </Text>
              <TouchableOpacity
                onPress={() => setShowNameModal(true)}
                className="mt-6 rounded-lg px-6 py-3"
                style={{ backgroundColor: COLORS.PRIMARY }}
              >
                <Text className="text-white font-semibold">Crear Rutina</Text>
              </TouchableOpacity>
            </View>
          ) : (
            rutinas.map(rutina => {
              const ejerciciosCount = rutina.ejercicios?.length || 0;

              return (
                <View
                  key={rutina.id}
                  className="rounded-xl p-5 mb-4 shadow-sm"
                  style={{
                    backgroundColor: COLORS.SECONDARY_BACKGROUND,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  {/* Rutina Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                      {/* Nombre de rutina - editable */}
                      <View className="flex-row items-center mb-1">
                        {editingRoutineId === rutina.id ? (
                          <TextInput
                            value={editedNames[rutina.id] || rutina.nombre}
                            onChangeText={text =>
                              handleNameChange(rutina.id, text)
                            }
                            className="text-xl font-bold flex-1 px-2 py-1 rounded-md"
                            style={{
                              color: COLORS.TEXT_PRIMARY,
                              backgroundColor: COLORS.Background + '50',
                              borderWidth: 1,
                              borderColor: COLORS.PRIMARY,
                            }}
                            autoFocus
                            selectTextOnFocus
                          />
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              startEditingRoutine(rutina.id, rutina.nombre)
                            }
                            className="flex-1"
                          >
                            <Text
                              className="text-xl font-bold"
                              style={{ color: COLORS.TEXT_PRIMARY }}
                            >
                              {rutina.nombre}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {/* Icono editar / check */}
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              editingRoutineId === rutina.id ||
                              hasUnsavedChanges(rutina.id)
                            ) {
                              saveRoutineName(rutina.id);
                            } else {
                              startEditingRoutine(rutina.id, rutina.nombre);
                            }
                          }}
                          className="ml-2 p-2"
                        >
                          <Icon
                            name={
                              editingRoutineId === rutina.id ||
                              hasUnsavedChanges(rutina.id)
                                ? 'check'
                                : 'edit'
                            }
                            size={20}
                            color={
                              editingRoutineId === rutina.id ||
                              hasUnsavedChanges(rutina.id)
                                ? COLORS.SECONDARY_verde
                                : COLORS.SECONDARY
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      {rutina.objetivo && (
                        <Text
                          className="text-sm"
                          style={{ color: COLORS.SECONDARY }}
                        >
                          {rutina.objetivo}
                        </Text>
                      )}
                    </View>
                    <View
                      className="rounded-full p-3"
                      style={{
                        backgroundColor: COLORS.SECONDARY_verde + '20',
                      }}
                    >
                      <Icon
                        name="fitness-center"
                        size={24}
                        color={COLORS.SECONDARY_verde}
                      />
                    </View>
                  </View>

                  {/* Stats */}
                  <View className="flex-row items-center mb-4">
                    <View
                      className="rounded-lg px-3 py-2 mr-2"
                      style={{ backgroundColor: COLORS.Background }}
                    >
                      <View className="flex-row items-center">
                        <Icon
                          name="format-list-numbered"
                          size={16}
                          color={COLORS.TEXT_PRIMARY}
                        />
                        <Text
                          className="ml-1 text-xs font-semibold"
                          style={{ color: COLORS.TEXT_PRIMARY }}
                        >
                          {ejerciciosCount} ejercicio
                          {ejerciciosCount !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="space-y-2">
                    {/* Iniciar Rutina - Disabled */}
                    <TouchableOpacity
                      disabled
                      className="rounded-lg p-3 mb-2"
                      style={{
                        backgroundColor: COLORS.SECONDARY + '20',
                        opacity: 0.5,
                      }}
                    >
                      <View className="flex-row items-center justify-center">
                        <Icon
                          name="play-circle-filled"
                          size={20}
                          color={COLORS.SECONDARY}
                        />
                        <Text
                          className="ml-2 font-semibold text-sm"
                          style={{ color: COLORS.SECONDARY }}
                        >
                          Iniciar Rutina (Próximamente)
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Secondary Actions Row */}
                    <View className="flex-row gap-2">
                      {/* Asignar a Días */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedRoutineIdForAssignment(rutina.id);
                          setShowDayModal(true);
                        }}
                        className="flex-1 rounded-lg p-3"
                        style={{ backgroundColor: COLORS.PRIMARY + '10' }}
                      >
                        <View className="flex-row items-center justify-center">
                          <Icon name="event" size={18} color={COLORS.PRIMARY} />
                          <Text
                            className="ml-1 font-semibold text-xs"
                            style={{ color: COLORS.PRIMARY }}
                          >
                            Asignar
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Ver Detalles */}
                      <TouchableOpacity
                        onPress={() => selectRoutine(rutina)}
                        className="flex-1 rounded-lg p-3"
                        style={{ backgroundColor: COLORS.PRIMARY }}
                      >
                        <View className="flex-row items-center justify-center">
                          <Icon name="visibility" size={18} color="white" />
                          <Text className="ml-1 font-semibold text-xs text-white">
                            Ver
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Editar */}
                      <TouchableOpacity
                        onPress={() => {
                          // TODO: Navigate to edit routine
                        }}
                        className="flex-1 rounded-lg p-3"
                        style={{
                          backgroundColor: COLORS.SECONDARY_cobre + '20',
                        }}
                      >
                        <View className="flex-row items-center justify-center">
                          <Icon
                            name="edit"
                            size={18}
                            color={COLORS.SECONDARY_cobre}
                          />
                          <Text
                            className="ml-1 font-semibold text-xs"
                            style={{ color: COLORS.SECONDARY_cobre }}
                          >
                            Editar
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Eliminar */}
                      <TouchableOpacity
                        onPress={() =>
                          handleEliminarRutina(rutina.id, rutina.nombre)
                        }
                        className="rounded-lg p-3"
                        style={{ backgroundColor: '#ff4444' + '10' }}
                      >
                        <Icon name="delete" size={18} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      <FloatingButton
        onPress={() => setShowNameModal(true)}
        icon="add"
        size={24}
        label="Crear Rutina"
        color="white"
      />

      {/* Routine Name Modal */}
      <RoutineNameModal
        visible={showNameModal}
        onClose={() => setShowNameModal(false)}
        onConfirm={(name, preset) => {
          setShowNameModal(false);
          navigation.navigate('SelectEspacioForRoutine', {
            routineName: name,
            routinePreset: preset?.name,
          });
        }}
      />

      <SelectDayModal
        visible={showDayModal}
        onClose={() => {
          setShowDayModal(false);
          setSelectedRoutineIdForAssignment(null);
        }}
        onConfirm={async dayIndex => {
          if (selectedRoutineIdForAssignment && user?.id) {
            await asignarRutinaADia(
              user.id,
              dayIndex,
              selectedRoutineIdForAssignment,
            );
            setShowDayModal(false);
            setSelectedRoutineIdForAssignment(null);
            navigation.navigate('WeeklyPlan');
          }
        }}
      />
    </View>
  );
}
