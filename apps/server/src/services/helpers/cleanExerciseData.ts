import type { EjercicioMinimal } from "../../domain/types.js";

/**
 * Convierte un ejercicio de la BD a un formato mínimo para el prompt de IA.
 * Usado por Gemini y DeepSeek para reducir tokens enviados.
 */
export const cleanExerciseData = (exercises: any[]): EjercicioMinimal[] => {
  return exercises.map((ex) => ({
    id: ex.id,
    name: ex.nombre,
    muscle: ex.grupo_principal,
    difficulty: ex.dificultad,
    is_highlighted: ex.destacado || false,
    equipment: ex.equipamiento_ids,
  }));
};
