// ============================================================
// USE CASE — Crear Rutina (con IA)
// ============================================================

import type { IRutinaRepository } from "../../domain/repositories/IRutinaRepository.js";
import type { IEjercicioRepository } from "../../domain/repositories/IEjercicioRepository.js";
import type { IEquipamientoRepository } from "../../domain/repositories/IEquipamientoRepository.js";
import type { IAIService } from "../../domain/services/IAIService.js";
import type { Ejercicio } from "../../domain/entities/ejercicio.js";
import {
  NotFoundError,
  ValidationError,
} from "../../domain/errors/domain-errors.js";

interface CrearRutinaParams {
  userId: string;
  espacioId: number;
  goal: string;
  muscles: string[];
  level: string;
  routineName?: string;
}

interface CrearRutinaResult {
  rutina_id: number;
  rutina_nombre: string;
  routine: any;
  candidatos_count: number;
  ejercicios_guardados: number;
}

export class CrearRutinaUseCase {
  constructor(
    private readonly rutinaRepo: IRutinaRepository,
    private readonly ejercicioRepo: IEjercicioRepository,
    private readonly equipamientoRepo: IEquipamientoRepository,
    private readonly aiService: IAIService,
  ) {}

  async ejecutar(params: CrearRutinaParams): Promise<CrearRutinaResult> {
    const { userId, espacioId, goal, muscles, level, routineName } = params;

    // Validaciones
    if (
      !goal ||
      !muscles ||
      muscles.length === 0 ||
      !level ||
      !userId ||
      !espacioId
    ) {
      throw new ValidationError(
        "Faltan campos requeridos: goal, muscles (array), level, userId, espacioId",
      );
    }

    // 1. Normalizar músculos (split por coma si vienen combinados)
    const normalizedMuscles = muscles
      .flatMap((muscle) =>
        typeof muscle === "string" && muscle.includes(",")
          ? muscle.split(",").map((m) => m.trim())
          : muscle,
      )
      .filter(Boolean);

    // 2. Obtener equipamiento disponible en el espacio
    const inventory = await this.equipamientoRepo.obtenerInventarioDeEspacio(
      userId,
      espacioId,
    );
    const equipmentIds = inventory.map((item) => item.equipoId);

    // 3. Buscar ejercicios candidatos por grupo muscular
    const candidatos: Record<string, Ejercicio[]> = {};

    for (const musculo of normalizedMuscles) {
      const allExercises = await this.ejercicioRepo.obtenerPorMusculo(musculo);

      // Filtrar solo los ejercicios realizables con el equipamiento disponible
      const doable = allExercises.filter((exercise) => {
        const requiredIds = exercise.equipamientoIds || [];
        return requiredIds.every((reqId) => equipmentIds.includes(reqId));
      });

      if (doable.length > 0) {
        candidatos[musculo] = doable;
      }
    }

    if (Object.keys(candidatos).length === 0) {
      throw new NotFoundError(
        "No se encontraron ejercicios para los grupos musculares especificados",
      );
    }

    // 4. Generar rutina con IA
    const routine = await this.aiService.generateRoutine(
      candidatos,
      level,
      goal,
    );

    // 5. Guardar rutina en la BD
    const rutinaName = routineName || `Rutina ${goal}`;
    const rutina = await this.rutinaRepo.crear({
      usuarioId: userId,
      nombre: rutinaName,
      objetivo: goal,
    });

    // 6. Preparar y guardar ejercicios
    const ejerciciosToInsert: any[] = [];
    let orden = 1;

    if (routine && Array.isArray(routine.routine)) {
      for (const ex of routine.routine) {
        ejerciciosToInsert.push({
          rutinaId: rutina.id,
          ejercicioId: ex.exercise_id,
          series: ex.series || 3,
          repeticiones: ex.repeticiones || "10",
          tiempoDescansoSegundos: ex.descanso_segundos || 60,
          notasIa: ex.notas || null,
          orden: ex.orden || orden++,
        });
      }
    }

    if (ejerciciosToInsert.length > 0) {
      try {
        await this.rutinaRepo.agregarEjercicios(ejerciciosToInsert);
      } catch (err) {
        console.warn(
          "Rutina creada pero algunos ejercicios fallaron al guardar:",
          err,
        );
      }
    }

    return {
      rutina_id: rutina.id,
      rutina_nombre: rutinaName,
      routine,
      candidatos_count: Object.values(candidatos).reduce(
        (acc, exs) => acc + exs.length,
        0,
      ),
      ejercicios_guardados: ejerciciosToInsert.length,
    };
  }
}
