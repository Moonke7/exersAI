// ============================================================
// ROUTES — Equipamiento
// ============================================================

import { Hono } from "hono";
import type { AppEnv } from "../types/env.js";

const equipamientoRoutes = new Hono<AppEnv>();

/**
 * GET /api/equipamiento/:user_id/:espacio_id
 */
equipamientoRoutes.get("/:user_id/:espacio_id", async (c) => {
  try {
    const userId = c.req.param("user_id");
    const espacioId = parseInt(c.req.param("espacio_id"));
    const useCase = c.get("equipamientoUseCase");
    const data = await useCase.obtenerInventario(userId, espacioId);
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /api/equipamiento
 */
equipamientoRoutes.post("/", async (c) => {
  try {
    const { equipo_id, cantidad, espacio_id, user_id } = await c.req.json();
    const useCase = c.get("equipamientoUseCase");
    const data = await useCase.crear({
      equipoId: equipo_id,
      cantidad,
      espacioId: espacio_id,
      usuarioId: user_id,
    });
    return c.json(data, 201);
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json({ error: error.message }, status);
  }
});

/**
 * PUT /api/equipamiento/:id
 */
equipamientoRoutes.put("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { equipo_id, cantidad, user_id } = await c.req.json();
    const useCase = c.get("equipamientoUseCase");
    const data = await useCase.actualizar(id, user_id, {
      equipoId: equipo_id,
      cantidad,
    });
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /api/equipamiento/:id
 */
equipamientoRoutes.delete("/:id", async (c) => {
  try {
    const { user_id } = await c.req.json();
    const id = parseInt(c.req.param("id"));
    const useCase = c.get("equipamientoUseCase");
    await useCase.eliminar(id, user_id);
    return c.json({ message: "Equipamiento eliminado exitosamente" });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default equipamientoRoutes;
