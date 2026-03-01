export interface RoutinePreset {
  name: string;
  description: string;
  icon: string;
  muscles: string[]; // slugs from SelectBodyMuscles
}

export const ROUTINE_PRESETS: RoutinePreset[] = [
  {
    name: 'Upper',
    description: 'Trabaja todo el tren superior',
    icon: 'fitness-center',
    muscles: [
      'chest',
      'upper-back',
      'lower-back',
      'deltoids',
      'biceps',
      'triceps',
    ],
  },
  {
    name: 'Lower',
    description: 'Trabaja todo el tren inferior',
    icon: 'fitness-center',
    muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves', 'adductors'],
  },
  {
    name: 'Push',
    description: 'Pecho, hombros y tríceps',
    icon: 'fitness-center',
    muscles: ['chest', 'deltoids', 'triceps'],
  },
  {
    name: 'Pull',
    description: 'Espalda y bíceps',
    icon: 'fitness-center',
    muscles: ['upper-back', 'lower-back', 'biceps', 'trapezius'],
  },
  {
    name: 'Legs',
    description: 'Piernas completas',
    icon: 'fitness-center',
    muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'],
  },
  {
    name: 'Full Body',
    description: 'Entrenamiento de todo el cuerpo',
    icon: 'accessibility',
    muscles: [
      'chest',
      'upper-back',
      'deltoids',
      'biceps',
      'triceps',
      'quadriceps',
      'gluteal',
      'abs',
    ],
  },
];
