import { create } from 'zustand';

interface MuscleStore {
  selectedMuscles: string[];
  toggleMuscle: (muscle: string) => void;
  setSelectedMuscles: (muscles: string[]) => void;
  clearMuscles: () => void;
}

export const useMuscleStore = create<MuscleStore>(set => ({
  selectedMuscles: [],

  toggleMuscle: (muscle: string) =>
    set(state => {
      const isSelected = state.selectedMuscles.includes(muscle);

      if (isSelected) {
        // Remove muscle if already selected
        return {
          selectedMuscles: state.selectedMuscles.filter(m => m !== muscle),
        };
      } else {
        return {
          selectedMuscles: [...state.selectedMuscles, muscle],
        };
      }
    }),

  setSelectedMuscles: (muscles: string[]) => set({ selectedMuscles: muscles }),

  clearMuscles: () => set({ selectedMuscles: [] }),
}));
