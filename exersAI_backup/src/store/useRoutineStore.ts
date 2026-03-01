import { create } from 'zustand';
import { RutinaConEjercicios } from '../types/rutina';

interface RoutineStore {
  selectedRoutine: RutinaConEjercicios | null;
  setSelectedRoutine: (routine: RutinaConEjercicios) => void;
  clearRoutine: () => void;
}

export const useRoutineStore = create<RoutineStore>(set => ({
  selectedRoutine: null,

  setSelectedRoutine: (routine: RutinaConEjercicios) =>
    set({ selectedRoutine: routine }),

  clearRoutine: () => set({ selectedRoutine: null }),
}));
