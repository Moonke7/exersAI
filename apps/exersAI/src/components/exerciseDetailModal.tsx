import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RutinaEjercicio } from '../types/rutina';
import { COLORS } from '../utils/COLORS';

interface ExerciseDetailModalProps {
  visible: boolean;
  exercise: RutinaEjercicio | null;
  onClose: () => void;
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View
      className="flex-1 items-center py-3 rounded-xl"
      style={{ backgroundColor: COLORS.Background }}
    >
      <Text className="text-xs mb-1" style={{ color: COLORS.TEXT_SECONDARY }}>
        {label}
      </Text>
      <Text
        className="text-lg font-bold"
        style={{ color: COLORS.TEXT_PRIMARY }}
      >
        {value}
      </Text>
    </View>
  );
}

export function ExerciseDetailModal({
  visible,
  exercise,
  onClose,
}: ExerciseDetailModalProps) {
  if (!exercise) return null;

  const videoUrl = exercise.ejercicio?.video_url;
  const imageUrl = exercise.ejercicio?.imagen_url;
  const muscle = exercise.ejercicio?.grupos_musculares?.[0] || 'General';
  const nombre = exercise.ejercicio?.nombre || 'Ejercicio';

  const handleOpenVideo = () => {
    if (videoUrl) {
      Linking.openURL(videoUrl).catch(() => {});
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Root container: centers everything */}
      <View
        className="flex-1 justify-center items-center px-6"
        pointerEvents="box-none"
      >
        {/* Backdrop – absolute so it doesn't push the card out of center */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.5}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            opacity: 0.5,
          }}
        />

        {/* Card */}
        <View
          className="rounded-3xl overflow-hidden w-full"
          style={{
            backgroundColor: COLORS.SECONDARY_BACKGROUND,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          {/* ── CONTENT ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* Header row */}
            <View className="px-5 pt-5 pb-3 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                {/* Muscle badge */}
                <View
                  className="self-start px-2.5 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: COLORS.PRIMARY + '25' }}
                >
                  <Text
                    className="text-xs font-semibold capitalize"
                    style={{ color: COLORS.PRIMARY }}
                  >
                    {muscle}
                  </Text>
                </View>
                {/* Exercise name */}
                <Text
                  className="text-xl font-bold"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {nombre}
                </Text>
              </View>
              {/* Close button */}
              <TouchableOpacity
                onPress={onClose}
                className="p-1.5 rounded-full"
                style={{ backgroundColor: COLORS.Background }}
              >
                <Icon name="close" size={22} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              className="mx-5 mb-4"
              style={{ height: 1, backgroundColor: COLORS.SOFT_BORDER }}
            />

            {/* Stats */}
            <View className="flex-row px-5 gap-3 mb-4">
              <StatBox label="Series" value={exercise.series} />
              <StatBox label="Repeticiones" value={exercise.repeticiones} />
              {exercise.tiempo_descanso_segundos !== undefined && (
                <StatBox
                  label="Descanso"
                  value={`${exercise.tiempo_descanso_segundos}s`}
                />
              )}
            </View>

            {/* Notes */}
            {exercise.notas_ia && (
              <View
                className="mx-5 rounded-xl p-4"
                style={{ backgroundColor: COLORS.Background }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon
                    name="lightbulb-outline"
                    size={18}
                    color={COLORS.PRIMARY}
                  />
                  <Text
                    className="text-sm font-bold"
                    style={{ color: COLORS.PRIMARY }}
                  >
                    Notas del entrenador IA
                  </Text>
                </View>
                <Text
                  className="text-sm leading-5 italic"
                  style={{ color: COLORS.TEXT_PRIMARY }}
                >
                  {exercise.notas_ia}
                </Text>
              </View>
            )}

            {/* Video link button (if no thumbnail was shown) */}
            {videoUrl && !imageUrl && (
              <TouchableOpacity
                onPress={handleOpenVideo}
                className="mx-5 mt-4 rounded-xl py-4 flex-row items-center justify-center gap-2"
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.PRIMARY,
                }}
              >
                <Icon
                  name="play-circle-outline"
                  size={22}
                  color={COLORS.PRIMARY}
                />
                <Text
                  className="font-semibold text-base"
                  style={{ color: COLORS.PRIMARY }}
                >
                  Ver video del ejercicio
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
