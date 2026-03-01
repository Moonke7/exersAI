import { useEffect, useCallback, useSyncExternalStore } from "react";

export interface UserProfile {
  id: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  goal: string;
  nivel: "Principiante" | "Intermedio" | "Avanzado";
  gender: "Masculino" | "Femenino" | "Otro";
}

export interface TestSessionState {
  profiles: UserProfile[];
  activeProfileId: string | null;
  selectedEquipmentIds: number[];
  selectedMuscles: string[];
}

const STORAGE_KEY = "exersai_admin_test_session";

const defaultState: TestSessionState = {
  profiles: [],
  activeProfileId: null,
  selectedEquipmentIds: [],
  selectedMuscles: [],
};

// Global State
let globalState = { ...defaultState };
let isLoadedGlobal = false;
let isLoadingSession = false;

// Listeners
type Listener = () => void;
let listeners: Listener[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return globalState;
}

// Helpers
function saveToStorage() {
  if (!isLoadedGlobal) return;
  const stateToStore = {
    activeProfileId: globalState.activeProfileId,
    selectedEquipmentIds: globalState.selectedEquipmentIds,
    selectedMuscles: globalState.selectedMuscles,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
}

function updateState(updater: (prev: TestSessionState) => TestSessionState) {
  globalState = updater(globalState);
  saveToStorage();
  emitChange();
}

// Initial load
async function initSession() {
  if (isLoadedGlobal || isLoadingSession) return;
  isLoadingSession = true;

  let storedState: Partial<TestSessionState> = {};
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        storedState = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored session state", e);
      }
    }
  }

  let fetchedProfiles: UserProfile[] = [];
  try {
    const res = await fetch("/api/perfiles");
    if (res.ok) {
      const data = await res.json();
      fetchedProfiles = data.profiles || [];
    }
  } catch (e) {
    console.error("Failed to fetch profiles from API", e);
  }

  globalState = {
    profiles: fetchedProfiles,
    activeProfileId:
      storedState.activeProfileId !== undefined
        ? String(storedState.activeProfileId)
        : null,
    selectedEquipmentIds: storedState.selectedEquipmentIds || [],
    selectedMuscles: storedState.selectedMuscles || [],
  };

  isLoadedGlobal = true;
  isLoadingSession = false;
  emitChange();
}

export function useTestSession() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Use local state for `isLoaded` based on the global signal to trigger re-renders
  // when loading finishes. In SSR, this will default to false.
  const isLoaded = isLoadedGlobal;

  useEffect(() => {
    if (!isLoadedGlobal) {
      initSession();
    }
  }, []);

  const addProfile = useCallback(async (profile: Omit<UserProfile, "id">) => {
    try {
      const res = await fetch("/api/perfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        const newProfile = data.profile;
        updateState((prev) => ({
          ...prev,
          profiles: [...prev.profiles, newProfile],
          activeProfileId: String(newProfile.id),
        }));
      } else {
        console.error("Failed to add profile", await res.text());
      }
    } catch (e) {
      console.error("Error adding profile:", e);
    }
  }, []);

  const setActiveProfile = useCallback((id: string) => {
    updateState((prev) => ({ ...prev, activeProfileId: String(id) }));
  }, []);

  const updateProfile = useCallback(
    async (id: string, updatedData: Omit<UserProfile, "id">) => {
      try {
        const res = await fetch("/api/perfiles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...updatedData }),
        });
        if (res.ok) {
          const data = await res.json();
          const updatedProfile = data.profile;
          updateState((prev) => ({
            ...prev,
            profiles: prev.profiles.map((p) =>
              p.id === String(id) ? updatedProfile : p,
            ),
          }));
        } else {
          console.error("Failed to update profile", await res.text());
        }
      } catch (e) {
        console.error("Error updating profile:", e);
      }
    },
    [],
  );

  const toggleEquipment = useCallback((id: number) => {
    updateState((prev) => {
      const isSelected = prev.selectedEquipmentIds.includes(id);
      return {
        ...prev,
        selectedEquipmentIds: isSelected
          ? prev.selectedEquipmentIds.filter((eId) => eId !== id)
          : [...prev.selectedEquipmentIds, id],
      };
    });
  }, []);

  const clearEquipment = useCallback(() => {
    updateState((prev) => ({ ...prev, selectedEquipmentIds: [] }));
  }, []);

  const setMuscles = useCallback((muscles: string[]) => {
    updateState((prev) => ({ ...prev, selectedMuscles: muscles }));
  }, []);

  const activeProfile =
    state.profiles.find((p) => p.id === String(state.activeProfileId)) || null;

  return {
    state,
    isLoaded,
    activeProfile,
    addProfile,
    updateProfile,
    setActiveProfile,
    toggleEquipment,
    clearEquipment,
    setMuscles,
  };
}
