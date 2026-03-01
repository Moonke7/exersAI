// ============================================================
// ROUTES — Espacios
// ============================================================

import { Hono } from "hono";
import type { AppEnv } from "../types/env.js";

const espaciosRoutes = new Hono<AppEnv>();

/**
 * GET /api/espacios/:user_id
 */
espaciosRoutes.get("/:user_id", async (c) => {
  try {
    const userId = c.req.param("user_id");
    const useCase = c.get("espaciosUseCase");
    const data = await useCase.obtenerPorUsuario(userId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/espacios/crear-espacio
 */
espaciosRoutes.post("/crear-espacio", async (c) => {
  try {
    const { nombre, user_id } = await c.req.json();
    const useCase = c.get("espaciosUseCase");
    const data = await useCase.crear({ nombre, userId: user_id });
    return c.json(data, 201);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json({ error: error.message }, status);
  }
});

export default espaciosRoutes;
