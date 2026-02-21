import { create } from 'zustand';

interface EquipmentInventoryState {
  espacioId: number | null;
  inventarioInicial: number[]; // IDs de equipos en el inventario original
  inventarioActual: number[]; // IDs de equipos seleccionados actualmente

  // Actions
  setEspacioId: (id: number) => void;
  setInventarioInicial: (equipmentIds: number[]) => void;
  toggleEquipment: (equipmentId: number) => void;
  reset: () => void;
  getAddedEquipment: () => number[];
  getRemovedEquipment: () => number[];
}

export const useEquipmentInventoryStore = create<EquipmentInventoryState>(
  set => ({
    espacioId: null,
    inventarioInicial: [],
    inventarioActual: [],

    setEspacioId: (id: number) => set({ espacioId: id }),

    setInventarioInicial: (equipmentIds: number[]) =>
      set({
        inventarioInicial: equipmentIds,
        inventarioActual: [...equipmentIds], // Copiar al actual
      }),

    toggleEquipment: (equipmentId: number) =>
      set(state => {
        const isCurrentlySelected =
          state.inventarioActual.includes(equipmentId);

        if (isCurrentlySelected) {
          // Remover del inventario actual
          return {
            inventarioActual: state.inventarioActual.filter(
              id => id !== equipmentId,
            ),
          };
        } else {
          // Agregar al inventario actual
          return {
            inventarioActual: [...state.inventarioActual, equipmentId],
          };
        }
      }),

    reset: () =>
      set({
        espacioId: null,
        inventarioInicial: [],
        inventarioActual: [],
      }),

    getAddedEquipment: (): number[] => {
      const state = useEquipmentInventoryStore.getState();
      return state.inventarioActual.filter(
        (id: number) => !state.inventarioInicial.includes(id),
      );
    },

    getRemovedEquipment: (): number[] => {
      const state = useEquipmentInventoryStore.getState();
      return state.inventarioInicial.filter(
        (id: number) => !state.inventarioActual.includes(id),
      );
    },
  }),
);
