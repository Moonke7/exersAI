import { Ejercicio, EjercicioMinimal } from "../types/Ejercicio";

export const cleanExerciseData = (
  exercises: Ejercicio[],
): EjercicioMinimal[] => {
  return exercises.map((ex) => ({
    id: ex.id,
    nombre: ex.nombre,
    orden: ex.orden,
    grupo_principal: ex.grupo_principal,
    dificultad: ex.dificultad,
    destacado: ex.destacado || false,
    equipamiento_ids: ex.equipamiento_ids,
    grupos_musculares: ex.grupos_musculares,
  }));
};
