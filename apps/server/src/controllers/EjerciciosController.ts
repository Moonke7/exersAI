import { Request, Response } from "express";
import { EjercicioRepository } from "../repositories/EjercicioRepository.js";
import { EquipamientoRepository } from "../repositories/EquipamientoRepository.js";
import { RutinaRepository } from "../repositories/RutinaRepository.js";
import { ObtenerEjerciciosUseCase } from "../use-cases/ejercicios/ObtenerEjerciciosUseCase.js";
import { CrearRutinaUseCase } from "../use-cases/rutinas/CrearRutinaUseCase.js";
import { generateDeepSeekRoutine } from "@exersai/shared/services/LLM-models/deepseek.js";
import { createSupabaseClient } from "@exersai/shared/db/supabase";

// Helper to lazy-load the dependencies
let _ejercicioRepo: EjercicioRepository | null = null;
let _equipamientoRepo: EquipamientoRepository | null = null;
let _rutinaRepo: RutinaRepository | null = null;
let _obtenerEjerciciosUseCase: ObtenerEjerciciosUseCase | null = null;
let _crearRutinaUseCase: CrearRutinaUseCase | null = null;

function getDependencies() {
  if (_crearRutinaUseCase) {
    return {
      obtenerEjerciciosUseCase: _obtenerEjerciciosUseCase!,
      crearRutinaUseCase: _crearRutinaUseCase!,
      equipamientoRepo: _equipamientoRepo!,
    };
  }

  const supabaseKey = process.env.SUPABASE_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseKey || !supabaseUrl) {
    throw new Error(
      "Server configuration error: Missing Supabase credentials in environment",
    );
  }

  const supabase = createSupabaseClient({ supabaseUrl, supabaseKey });

  _ejercicioRepo = new EjercicioRepository(supabase);
  _equipamientoRepo = new EquipamientoRepository(supabase);
  _rutinaRepo = new RutinaRepository(supabase);

  _obtenerEjerciciosUseCase = new ObtenerEjerciciosUseCase(_ejercicioRepo);

  const aiService = {
    generateRoutine: (
      candidatos: Record<string, any[]>,
      level: string,
      goal: string,
    ) => generateDeepSeekRoutine(candidatos, level, goal),
  };

  _crearRutinaUseCase = new CrearRutinaUseCase(
    _rutinaRepo,
    _ejercicioRepo,
    _equipamientoRepo,
    aiService,
  );

  return {
    obtenerEjerciciosUseCase: _obtenerEjerciciosUseCase,
    crearRutinaUseCase: _crearRutinaUseCase,
    equipamientoRepo: _equipamientoRepo,
  };
}

export const EjerciciosController = {
  /**
   * GET /api/exercises
   */
  async getAll(req: Request, res: Response) {
    try {
      const { obtenerEjerciciosUseCase } = getDependencies();
      const { muscle, difficulty } = req.query;
      const exercises = await obtenerEjerciciosUseCase.ejecutar({
        muscle: muscle as string | undefined,
        difficulty: difficulty as string | undefined,
      });
      res.status(200).json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ error: "Error fetching exercises" });
    }
  },

  /**
   * GET /api/exercises/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { obtenerEjerciciosUseCase } = getDependencies();
      const id = parseInt(req.params.id);
      const exercise = await obtenerEjerciciosUseCase.ejecutarPorId(id);
      if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
      }
      res.status(200).json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ error: "Error fetching exercise" });
    }
  },

  /**
   * GET /api/exercises/all-equipment
   */
  async getAllEquipment(req: Request, res: Response) {
    try {
      const { equipamientoRepo } = getDependencies();
      const equipment = await equipamientoRepo.obtenerCatalogo();
      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ error: "Error fetching equipment" });
    }
  },

  /**
   * POST /api/exercises/crear-rutina
   */
  async crearRutina(req: Request, res: Response) {
    try {
      const { crearRutinaUseCase } = getDependencies();
      const { goal, muscles, level, userId, espacioId, routineName } = req.body;

      if (
        !goal ||
        !muscles ||
        !Array.isArray(muscles) ||
        muscles.length === 0 ||
        !level ||
        !userId ||
        !espacioId
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: goal, muscles (array), level, userId, and espacioId are required",
        });
      }

      const result = await crearRutinaUseCase.ejecutar({
        userId,
        espacioId,
        goal,
        muscles,
        level,
        routineName,
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("Error creating routine:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      // Devolver 404 si el error es de "no exercises found"
      if (message.includes("No se encontraron ejercicios")) {
        return res.status(404).json({ error: message });
      }
      res
        .status(500)
        .json({ error: "Error al crear la rutina", details: message });
    }
  },
};
