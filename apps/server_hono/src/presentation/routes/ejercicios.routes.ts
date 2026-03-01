// ============================================================
// ROUTES — Ejercicios
// ============================================================

import { Hono } from "hono";
import type { AppEnv } from "../types/env.js";

const ejerciciosRoutes = new Hono<AppEnv>();

/**
 * GET /api/ejercicios — listar ejercicios (filtros opcionales)
 */
ejerciciosRoutes.get("/", async (c) => {
  try {
    const useCase = c.get("obtenerEjerciciosUseCase");
    const muscle = c.req.query("muscle");
    const difficulty = c.req.query("difficulty");
    const exercises = await useCase.ejecutar({
      muscle: muscle || undefined,
      difficulty: difficulty ? parseInt(difficulty) : undefined,
    });
    return c.json(exercises);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/ejercicios/catalogo-equipamiento — todo el catálogo de equipos
 */
ejerciciosRoutes.get("/catalogo-equipamiento", async (c) => {
  try {
    const equipamientoRepo = c.get("equipamientoRepo");
    const equipment = await equipamientoRepo.obtenerCatalogo();
    return c.json(equipment);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/ejercicios/:id — detalle de un ejercicio
 */
ejerciciosRoutes.get("/:id", async (c) => {
  try {
    const useCase = c.get("obtenerEjerciciosUseCase");
    const id = parseInt(c.req.param("id"));
    const exercise = await useCase.ejecutarPorId(id);
    if (!exercise) {
      return c.json({ error: "Exercise not found" }, 404);
    }
    return c.json(exercise);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/ejercicios/crear-rutina — generar rutina con IA
 */
ejerciciosRoutes.post("/crear-rutina", async (c) => {
  try {
    const useCase = c.get("crearRutinaUseCase");
    const body = await c.req.json();
    const { goal, muscles, level, userId, espacioId, routineName } = body;

    const result = await useCase.ejecutar({
      userId,
      espacioId,
      goal,
      muscles,
      level,
      routineName,
    });

    return c.json({ success: true, ...result });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json({ error: error.message }, status);
  }
});

export default ejerciciosRoutes;
