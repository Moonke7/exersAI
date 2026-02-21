import { create } from 'zustand';

interface EquipmentStore {
  selectedEquipment: number[];
  toggleEquipment: (equipmentId: number) => void;
  clearEquipment: () => void;
}

export const useEquipmentStore = create<EquipmentStore>(set => ({
  selectedEquipment: [],

  toggleEquipment: (equipmentId: number) =>
    set(state => {
      const isSelected = state.selectedEquipment.includes(equipmentId);

      if (isSelected) {
        // Remove equipment if already selected
        return {
          selectedEquipment: state.selectedEquipment.filter(
            id => id !== equipmentId,
          ),
        };
      } else {
        // Add equipment
        return {
          selectedEquipment: [...state.selectedEquipment, equipmentId],
        };
      }
    }),

  clearEquipment: () => set({ selectedEquipment: [] }),
}));
