import { useState } from 'react';
import { apiFetch } from '../utils/api';
import {
  Rutina,
  RutinaConEjercicios,
  RutinaEjercicio,
  AgendaConRutina,
} from '../types/rutina';
import { LocalStorage } from '../storage/LocalStorage';

export function useRutinas() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== RUTINAS CRUD (Hybrid) ====================

  /**
   * Crea una nueva rutina vacía localmente
   */
  const crearRutina = async (
    userId: string,
    nombre: string,
    objetivo?: string,
  ): Promise<Rutina | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Create local routine object
      // Generate a temp ID (negative) to distinguish from server IDs
      const tempId = -Date.now();

      const newRoutine: Rutina = {
        id: tempId,
        usuario_id: userId,
        nombre,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        objetivo: objetivo,
      };

      const newRoutineWithExercises: RutinaConEjercicios = {
        ...newRoutine,
        ejercicios: [],
      };

      // Save to local storage
      await LocalStorage.saveRoutine(newRoutineWithExercises);

      // Add to pending sync queue
      await LocalStorage.addPendingSyncAction({
        type: 'CREATE_ROUTINE',
        payload: { userId, nombre, objetivo, tempId },
        timestamp: Date.now(),
      });

      return newRoutine;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error creating local rutina:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Genera una rutina usando IA (Online Only) y la guarda localmente
   */
  const generarRutina = async (
    userId: string,
    nombre: string,
    objetivo: string,
    musculos: string[],
    nivel: string,
    espacioId: number,
  ): Promise<RutinaConEjercicios | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Call API to generate routine
      const response = await apiFetch('/api/exercises/crear-rutina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          routineName: nombre,
          goal: objetivo,
          muscles: musculos,
          level: nivel,
          espacioId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar la rutina en el servidor');
      }

      const data = await response.json();
      const rutinaId = data.rutina_id;

      if (!rutinaId) {
        throw new Error('La API no devolvió un ID de rutina válido');
      }

      // 2. Fetch the fully populated routine from server (to get exercise IDs)
      const routineResponse = await apiFetch(`/api/rutinas/${rutinaId}`);
      if (!routineResponse.ok) {
        throw new Error('Error al obtener la rutina generada');
      }

      const routineData = await routineResponse.json();
      const fullRoutine: RutinaConEjercicios = routineData.data;

      // 3. Save to Local Storage (Cache)
      // Note: We don't need to add a Sync Pending Action because it's already on the server
      await LocalStorage.saveRoutine(fullRoutine);

      return fullRoutine;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error generating rutina:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene todas las rutinas de la biblioteca local
   */
  const obtenerBiblioteca = async (
    userId: string,
  ): Promise<RutinaConEjercicios[]> => {
    try {
      setIsLoading(true);
      setError(null);

      // Get from local storage
      const routines = await LocalStorage.getRoutines();
      return routines;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching local biblioteca:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene una rutina específica de local
   */
  const obtenerRutina = async (
    rutinaId: number,
  ): Promise<RutinaConEjercicios | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const routines = await LocalStorage.getRoutines();
      const routine = routines.find(r => r.id === rutinaId);

      return routine || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error fetching local rutina:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza una rutina (nombre y objetivo) localmente
   */
  const actualizarRutina = async (
    rutinaId: number,
    nombre: string,
    objetivo?: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const routines = await LocalStorage.getRoutines();
      const routineIndex = routines.findIndex(r => r.id === rutinaId);

      if (routineIndex === -1) {
        throw new Error('Rutina no encontrada localmente');
      }

      const updatedRoutine = {
        ...routines[routineIndex],
        nombre,
        objetivo,
        updated_at: new Date().toISOString(),
      };

      routines[routineIndex] = updatedRoutine;
      await LocalStorage.saveAllRoutines(routines);

      await LocalStorage.addPendingSyncAction({
        type: 'UPDATE_ROUTINE',
        payload: { rutinaId, nombre, objetivo },
        timestamp: Date.now(),
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error updating local rutina:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina una rutina de local
   */
  const eliminarRutina = async (rutinaId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await LocalStorage.deleteRoutine(rutinaId);

      await LocalStorage.addPendingSyncAction({
        type: 'DELETE_ROUTINE',
        payload: { rutinaId },
        timestamp: Date.now(),
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Error deleting local rutina:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RUTINA EJERCICIOS (Hybrid - Simplified for Update) ====================
  // Note: For simplicity in this hybrid approach, we will effectively just "update routine"
  // since the routine object in local storage contains the exercises.

  /**
   * Guarda/Actualiza los ejercicios de una rutina localmente
   */
  const guardarEjerciciosEnRutina = async (
    rutinaId: number,
    ejercicios: RutinaEjercicio[],
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const routines = await LocalStorage.getRoutines();
      const routineIndex = routines.findIndex(r => r.id === rutinaId);

      if (routineIndex === -1) {
        throw new Error('Rutina no encontrada');
      }

      routines[routineIndex].ejercicios = ejercicios;
      await LocalStorage.saveAllRoutines(routines);

      // We can treat this as a specialized update or just generic sync needed
      await LocalStorage.addPendingSyncAction({
        type: 'UPDATE_ROUTINE', // Broadly just update the whole routine content
        payload: { rutinaId, ejercicios },
        timestamp: Date.now(),
      });

      return true;
    } catch (err) {
      console.error('Error saving exercises locally', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // NOTE: We are keeping the granular methods for backward compatibility but implementing them via local storage
  // Ideally, one would just have "saveRoutine" that saves everything.

  const agregarEjerciciosARutina = async (
    rutinaId: number,
    ejercicios: Partial<RutinaEjercicio>[],
  ): Promise<boolean> => {
    // This implementation now just retrieves the routine, appends, and saves
    const routines = await LocalStorage.getRoutines();
    const routine = routines.find(r => r.id === rutinaId);
    if (!routine) return false;

    // Mock ID generation for local exercises
    const newEjercicios = ejercicios.map(
      e =>
        ({
          ...e,
          id: -Date.now() - Math.floor(Math.random() * 1000), // Temp ID
          rutina_id: rutinaId,
        } as RutinaEjercicio),
    );

    const updatedEjercicios = [...(routine.ejercicios || []), ...newEjercicios];
    return await guardarEjerciciosEnRutina(rutinaId, updatedEjercicios);
  };

  const actualizarEjercicioEnRutina = async (
    rutinaId: number,
    ejercicioId: number,
    datos: Partial<RutinaEjercicio>,
  ): Promise<boolean> => {
    const routines = await LocalStorage.getRoutines();
    const routine = routines.find(r => r.id === rutinaId);
    if (!routine || !routine.ejercicios) return false;

    const exIndex = routine.ejercicios.findIndex(e => e.id === ejercicioId);
    if (exIndex === -1) return false;

    routine.ejercicios[exIndex] = { ...routine.ejercicios[exIndex], ...datos };
    return await guardarEjerciciosEnRutina(rutinaId, routine.ejercicios);
  };

  const eliminarEjercicioDeRutina = async (
    rutinaId: number,
    ejercicioId: number,
  ): Promise<boolean> => {
    const routines = await LocalStorage.getRoutines();
    const routine = routines.find(r => r.id === rutinaId);
    if (!routine || !routine.ejercicios) return false;

    const updatedEjercicios = routine.ejercicios.filter(
      e => e.id !== ejercicioId,
    );
    return await guardarEjerciciosEnRutina(rutinaId, updatedEjercicios);
  };

  // ==================== AGENDA SEMANAL (Hybrid) ====================

  /**
   * Obtiene la agenda semanal completa local
   */
  const obtenerAgendaSemanal = async (
    userId?: string,
  ): Promise<AgendaConRutina[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const plan = await LocalStorage.getWeeklyPlan();
      return plan;
    } catch (err) {
      console.error('Error fetching local agenda:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Asigna una rutina a un día específico localmente
   */
  const asignarRutinaADia = async (
    userId: string,
    diaSemana: number,
    rutinaId: number,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const plan = await LocalStorage.getWeeklyPlan();
      const routines = await LocalStorage.getRoutines();
      const routine = routines.find(r => r.id === rutinaId);

      if (!routine) {
        console.error(`Routine ${rutinaId} not found locally for assignment`);
        return false;
      }

      // Remove existing for that day if any
      const filteredPlan = plan.filter(p => p.dia_semana !== diaSemana);

      // Add new
      const newItem: AgendaConRutina = {
        id: -Date.now(), // Temp ID
        usuario_id: userId,
        dia_semana: diaSemana,
        rutina_id: rutinaId,
        rutina: routine, // Embed routine for UI
        created_at: new Date().toISOString(),
      };

      const newPlan = [...filteredPlan, newItem];
      await LocalStorage.saveWeeklyPlan(newPlan);

      await LocalStorage.addPendingSyncAction({
        type: 'ASSIGN_ROUTINE',
        payload: { userId, dia_semana: diaSemana, rutina_id: rutinaId },
        timestamp: Date.now(),
      });

      return true;
    } catch (err) {
      console.error('Error assigning local rutina:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cambia la rutina asignada a un día
   */
  const cambiarRutinaDelDia = async (
    agendaId: number,
    nuevaRutinaId: number,
  ): Promise<boolean> => {
    // Find the day from the agendaId in the local plan
    const plan = await LocalStorage.getWeeklyPlan();
    const item = plan.find(p => p.id === agendaId);
    if (!item) return false;

    // Reuse assign to overwrite
    return await asignarRutinaADia(
      item.usuario_id,
      item.dia_semana,
      nuevaRutinaId,
    );
  };

  /**
   * Desasigna una rutina de un día
   */
  const desasignarRutinaDelDia = async (agendaId: number): Promise<boolean> => {
    try {
      setIsLoading(true);

      const plan = await LocalStorage.getWeeklyPlan();
      const item = plan.find(p => p.id === agendaId);

      const newPlan = plan.filter(p => p.id !== agendaId);
      await LocalStorage.saveWeeklyPlan(newPlan);

      if (item) {
        await LocalStorage.addPendingSyncAction({
          type: 'UNASSIGN_ROUTINE',
          payload: {
            agendaId: agendaId,
            dia_semana: item.dia_semana,
            userId: item.usuario_id,
          }, // Payload might need adj based on backend reqs
          timestamp: Date.now(),
        });
      }

      return true;
    } catch (err) {
      console.error('Error unassigning local rutina:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Rutinas
    crearRutina,
    generarRutina,
    obtenerBiblioteca,
    obtenerRutina,
    actualizarRutina,
    eliminarRutina,
    // Ejercicios
    agregarEjerciciosARutina,
    actualizarEjercicioEnRutina,
    eliminarEjercicioDeRutina,
    // Agenda
    obtenerAgendaSemanal,
    asignarRutinaADia,
    cambiarRutinaDelDia,
    desasignarRutinaDelDia,
    // Estado
    isLoading,
    error,
  };
}
