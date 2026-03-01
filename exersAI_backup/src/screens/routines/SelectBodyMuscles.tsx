import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMuscleStore } from '../../store/useMuscleStore';
import Body, { type Slug } from 'react-native-body-highlighter';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../utils/COLORS';
import { MainStackParamList } from '../../navigation/types';
import { ROUTINE_PRESETS } from '../../config/routinePresets';

type SelectBodyMusclesRouteProp = RouteProp<
  MainStackParamList,
  'SelectBodyMusclesWithParams'
>;
type SelectBodyMusclesNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'SelectBodyMusclesWithParams'
>;

// Muscle groups available for selection
const MUSCLE_GROUPS = [
  { slug: 'chest', name: 'Pecho', intensity: 1 },
  { slug: 'abs', name: 'Abdominales', intensity: 1 },
  { slug: 'biceps', name: 'Bíceps', intensity: 1 },
  { slug: 'triceps', name: 'Tríceps', intensity: 1 },
  { slug: 'forearm', name: 'Antebrazo', intensity: 1 },
  { slug: 'upper-back', name: 'Espalda Alta', intensity: 1 },
  { slug: 'lower-back', name: 'Espalda Baja', intensity: 1 },
  { slug: 'deltoids', name: 'Hombros', intensity: 1 },
  { slug: 'trapezius', name: 'Trapecio', intensity: 1 },
  { slug: 'obliques', name: 'Oblicuos', intensity: 1 },
  { slug: 'adductors', name: 'Aductores', intensity: 1 },
  { slug: 'hamstring', name: 'Isquiotibiales', intensity: 1 },
  { slug: 'quadriceps', name: 'Cuádriceps', intensity: 1 },
  { slug: 'calves', name: 'Pantorrillas', intensity: 1 },
  { slug: 'tibialis', name: 'Tibiales', intensity: 1 },
  { slug: 'gluteal', name: 'Glúteos', intensity: 1 },
  { slug: 'neck', name: 'Cuello', intensity: 1 },
] as const;

export default function SelectBodyMuscles() {
  const navigation = useNavigation<SelectBodyMusclesNavigationProp>();
  const route = useRoute<SelectBodyMusclesRouteProp>();
  const { selectedMuscles, toggleMuscle, clearMuscles, setSelectedMuscles } =
    useMuscleStore();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [frontView, setFrontView] = useState(true);
  const { user } = useAuthStore();

  // Get route parameters
  const {
    customName,
    dayOfWeek,
    source,
    espacioId,
    routineName,
    routinePreset,
  } = route.params || {};

  // Preselect muscles if there's a preset
  useEffect(() => {
    if (routinePreset) {
      const preset = ROUTINE_PRESETS.find(p => p.name === routinePreset);
      if (preset && preset.muscles.length > 0) {
        // Set the preset muscles
        setSelectedMuscles(preset.muscles);
      }
    }
  }, [routinePreset, setSelectedMuscles]);

  // Prepare data for the body highlighter
  const bodyData = MUSCLE_GROUPS.filter(muscle =>
    selectedMuscles.includes(muscle.slug),
  ).map(muscle => ({
    slug: muscle.slug as Slug,
    intensity: 2, // Higher intensity for selected muscles
  }));

  const handleBodyPartPress = (bodyPart: { slug?: Slug }) => {
    if (bodyPart.slug) {
      toggleMuscle(bodyPart.slug);
    }
  };

  const handleMuscleNameDisplay = (slug: string) => {
    const muscle = MUSCLE_GROUPS.find(m => m.slug === slug);
    return muscle?.name || slug;
  };

  const handleCrearRutina = () => {
    navigation.navigate('RoutineGenerated', {
      espacioId,
      selectedMuscles,
      routineName,
    } as never);
  };

  console.log(user);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: COLORS.Background }}
    >
      <View
        className="pt-14 p-5"
        style={{
          backgroundColor: COLORS.SECONDARY_BACKGROUND,
        }}
      >
        <Text
          className="text-2xl font-bold mb-2"
          style={{ color: COLORS.TEXT_PRIMARY }}
        >
          {routineName
            ? `Rutina: ${routineName}`
            : source === 'split' && customName
            ? `Rutina: ${customName}`
            : 'Selecciona Grupos Musculares'}
        </Text>
        {source === 'split' && dayOfWeek && (
          <Text
            className="text-sm mb-2"
            style={{ color: COLORS.TEXT_SECONDARY }}
          >
            {dayOfWeek}
          </Text>
        )}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {selectedMuscles.map(slug => (
            <View
              key={slug}
              className="py-1.5 px-3 rounded-2xl"
              style={{ backgroundColor: COLORS.TEXT_PRIMARY + '20' }}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: COLORS.TEXT_SECONDARY }}
              >
                {handleMuscleNameDisplay(slug)}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row justify-between items-center gap-2.5">
          <TouchableOpacity
            onPress={clearMuscles}
            className="py-2 px-4 rounded-lg self-start w-[48%] items-center"
            style={{
              opacity: selectedMuscles.length > 0 ? 1 : 0.5,
              backgroundColor: COLORS.SECONDARY_cobre,
            }}
            disabled={selectedMuscles.length === 0}
          >
            <Text className="text-white font-semibold text-sm">Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCrearRutina}
            className="py-2 px-4 rounded-lg w-[48%] items-center"
            style={{
              opacity: selectedMuscles.length > 0 ? 1 : 0.5,
              backgroundColor: COLORS.SECONDARY_verde,
            }}
            disabled={selectedMuscles.length === 0}
          >
            <Text className="text-white font-semibold text-sm">
              Crear Rutina
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Body Views */}
      <View
        className="flex-col justify-around py-3 mx-4 mt-4 mb-4 rounded-xl shadow-md"
        style={{ backgroundColor: COLORS.SECONDARY_BACKGROUND }}
      >
        <View className="w-full flex-row justify-between items-center px-5 gap-2.5">
          <View className="flex-row-reverse items-center gap-2.5">
            <Text
              className="text-base font-semibold"
              style={{ color: COLORS.TEXT_PRIMARY }}
            >
              {frontView ? 'Vista Frontal' : 'Vista Posterior'}
            </Text>

            <TouchableOpacity
              onPress={() => setFrontView(!frontView)}
              className="rounded-full p-2 justify-center items-center"
              style={{ borderWidth: 1, borderColor: COLORS.SOFT_BORDER }}
            >
              <Icon name="rotate-left" size={24} color={COLORS.TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-1.5">
            <TouchableOpacity onPress={() => setGender('female')}>
              <Icon
                name="girl"
                size={48}
                color={
                  gender === 'female' ? COLORS.TEXT_PRIMARY : COLORS.SECONDARY
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender('male')}>
              <Icon
                name="boy"
                size={48}
                color={
                  gender === 'male' ? COLORS.TEXT_PRIMARY : COLORS.SECONDARY
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {frontView && (
          <View className="items-center flex-1">
            <View className="items-center justify-center">
              <Body
                data={bodyData}
                scale={1.8}
                side="front"
                gender={gender}
                onBodyPartPress={handleBodyPartPress}
                border={COLORS.SOFT_BORDER}
                colors={[COLORS.PRIMARY, COLORS.PRIMARY]}
              />
            </View>
          </View>
        )}

        {!frontView && (
          <View className="items-center flex-1">
            <View className="items-center justify-center">
              <Body
                data={bodyData}
                scale={1.8}
                side="back"
                gender={gender}
                onBodyPartPress={handleBodyPartPress}
                border={COLORS.SOFT_BORDER}
                colors={[COLORS.PRIMARY, COLORS.PRIMARY]}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
