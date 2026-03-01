import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rutina, RutinaConEjercicios, AgendaConRutina } from '../types/rutina';

const KEYS = {
  ROUTINES: 'exersai_routines',
  WEEKLY_PLAN: 'exersai_weekly_plan',
  PENDING_SYNC: 'exersai_pending_sync',
};

// Extend the type to include tempId for local storage handling
interface LocalRoutine extends RutinaConEjercicios {
  tempId?: number;
}

export interface PendingSyncAction {
  type:
    | 'CREATE_ROUTINE'
    | 'UPDATE_ROUTINE'
    | 'DELETE_ROUTINE'
    | 'ASSIGN_ROUTINE'
    | 'UNASSIGN_ROUTINE';
  payload: any;
  timestamp: number;
}

export const LocalStorage = {
  // --- Routines ---

  async getRoutines(): Promise<LocalRoutine[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.ROUTINES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading routines from local storage', e);
      return [];
    }
  },

  async saveRoutine(routine: LocalRoutine): Promise<void> {
    try {
      const routines = await LocalStorage.getRoutines();
      const index = routines.findIndex(
        r => r.id === routine.id || (r.tempId && r.tempId === routine.tempId),
      );

      let newRoutines;
      if (index >= 0) {
        newRoutines = [...routines];
        newRoutines[index] = routine;
      } else {
        newRoutines = [...routines, routine];
      }

      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(newRoutines));
    } catch (e) {
      console.error('Error saving routine to local storage', e);
      throw e;
    }
  },

  async deleteRoutine(rutinaId: number | string): Promise<void> {
    try {
      const routines = await LocalStorage.getRoutines();
      // Cast to check tempId safely or just check id
      const newRoutines = routines.filter(
        r => r.id !== rutinaId && r.tempId !== rutinaId,
      );
      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(newRoutines));
    } catch (e) {
      console.error('Error deleting routine from local storage', e);
      throw e;
    }
  },

  async saveAllRoutines(routines: LocalRoutine[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
    } catch (e) {
      console.error('Error saving all routines to local storage', e);
      throw e;
    }
  },

  // --- Weekly Plan ---

  async getWeeklyPlan(): Promise<AgendaConRutina[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.WEEKLY_PLAN);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading weekly plan from local storage', e);
      return [];
    }
  },

  async saveWeeklyPlan(plan: AgendaConRutina[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WEEKLY_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.error('Error saving weekly plan to local storage', e);
      throw e;
    }
  },

  // --- Sync Queue ---

  async getPendingSyncActions(): Promise<PendingSyncAction[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.PENDING_SYNC);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading pending sync actions', e);
      return [];
    }
  },

  async addPendingSyncAction(action: PendingSyncAction): Promise<void> {
    try {
      const actions = await LocalStorage.getPendingSyncActions();
      const newActions = [...actions, action];
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(newActions));
    } catch (e) {
      console.error('Error adding pending sync action', e);
      throw e;
    }
  },

  async clearPendingSyncActions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.PENDING_SYNC);
    } catch (e) {
      console.error('Error clearing pending sync actions', e);
      throw e;
    }
  },

  // --- Clear All (for debugging/logout) ---
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.ROUTINES,
        KEYS.WEEKLY_PLAN,
        KEYS.PENDING_SYNC,
      ]);
    } catch (e) {
      console.error('Error clearing local storage', e);
    }
  },
};
