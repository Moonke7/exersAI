import type {
  IEjercicioRepository,
  IEquipamientoRepository,
  IRutinaRepository,
} from "../../domain/repositories.js";
import type {
  CrearRutinaParams,
  CrearRutinaResult,
  Ejercicio,
} from "../../domain/types.js";

// Tipo del AI service — acepta Gemini o DeepSeek
interface AIRoutineService {
  generateRoutine(
    candidatos: Record<string, any[]>,
    level: string,
    goal: string,
  ): Promise<any>;
}

export class CrearRutinaUseCase {
  constructor(
    private readonly rutinaRepo: IRutinaRepository,
    private readonly ejercicioRepo: IEjercicioRepository,
    private readonly equipamientoRepo: IEquipamientoRepository,
    private readonly aiService: AIRoutineService,
  ) {}

  async ejecutar(params: CrearRutinaParams): Promise<CrearRutinaResult> {
    const { userId, espacioId, goal, muscles, level, routineName } = params;

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
    const equipmentIds = inventory.map((item) => item.id);

    // 3. Buscar ejercicios candidatos por grupo muscular
    const candidatos: Record<string, Ejercicio[]> = {};

    for (const musculo of normalizedMuscles) {
      const allExercises = await this.ejercicioRepo.obtenerPorMusculo(musculo);

      // Filtrar solo los ejercicios realizables con el equipamiento disponible
      const doable = allExercises.filter((exercise) => {
        const requiredIds = exercise.equipamiento_ids || [];
        return requiredIds.every((reqId: string) =>
          equipmentIds.includes(parseInt(reqId)),
        );
      });

      if (doable.length > 0) {
        candidatos[musculo] = doable;
      }
    }

    if (Object.keys(candidatos).length === 0) {
      throw new Error(
        "No se encontraron ejercicios para los grupos musculares especificados",
      );
    }

    // 4. Generar rutina con IA
    const routine = await this.aiService.generateRoutine(
      candidatos,
      level,
      goal,
    );

    // 6. Guardar rutina en la BD
    const rutinaName = routineName || `Rutina ${goal}`;
    const rutina = await this.rutinaRepo.crear({
      usuario_id: userId,
      nombre: rutinaName,
      objetivo: goal,
    });

    // 7. Preparar y guardar ejercicios
    const ejerciciosToInsert: any[] = [];
    let orden = 1;

    if (routine && Array.isArray(routine.routine)) {
      for (const group of routine.routine) {
        if (Array.isArray(group.exercises)) {
          group.exercises.forEach((ex: any) => {
            ejerciciosToInsert.push({
              rutina_id: rutina.id,
              ejercicio_id: ex.exercise_id?.toString() || ex.id?.toString(),
              series: ex.series || 3,
              repeticiones: ex.repeticiones || "10",
              tiempo_descanso_segundos: ex.descanso_segundos || 60,
              notas_ia: ex.notas || null,
              orden: orden++,
            });
          });
        }
      }
    }

    if (ejerciciosToInsert.length > 0) {
      try {
        await this.rutinaRepo.agregarEjercicios(ejerciciosToInsert);
      } catch (err) {
        // Log pero no falla — la rutina ya fue creada
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
