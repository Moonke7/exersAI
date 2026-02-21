import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, session: AuthSession) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
  updateSession: (session: AuthSession) => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  // Guardar autenticación
  setAuth: async (user, session) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('session', JSON.stringify(session));
      set({ user, session, isAuthenticated: true });
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  },

  // Limpiar autenticación (cerrar sesión)
  clearAuth: async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('session');
      set({ user: null, session: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  },

  // Cargar autenticación desde AsyncStorage (al iniciar la app)
  loadAuth: async () => {
    try {
      set({ isLoading: true });
      const [userJson, sessionJson] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('session'),
      ]);

      if (userJson && sessionJson) {
        const user = JSON.parse(userJson);
        const session = JSON.parse(sessionJson);
        set({ user, session, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Actualizar solo la sesión (para refresh token si se implementa)
  updateSession: async session => {
    try {
      await AsyncStorage.setItem('session', JSON.stringify(session));
      set({ session });
    } catch (error) {
      console.error('Error updating session:', error);
    }
  },
}));
