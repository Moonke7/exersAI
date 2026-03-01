// ============================================================
// ROUTES — Rutinas (CRUD + ejercicios anidados)
// ============================================================

import { Hono } from "hono";
import type { AppEnv } from "../types/env.js";

const rutinasRoutes = new Hono<AppEnv>();

// ==================== RUTINAS CRUD ====================

/**
 * POST /api/rutinas/crear
 */
rutinasRoutes.post("/crear", async (c) => {
  try {
    const { userId, nombre, objetivo } = await c.req.json();
    const useCase = c.get("gestionRutinaUseCase");
    const data = await useCase.crear({ usuarioId: userId, nombre, objetivo });
    return c.json({ message: "Rutina creada exitosamente", data });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json(
      { message: "Error al crear rutina", error: error.message },
      status,
    );
  }
});

/**
 * GET /api/rutinas/biblioteca
 */
rutinasRoutes.get("/biblioteca", async (c) => {
  try {
    const userId = c.req.query("userId");
    if (!userId) {
      return c.json({ message: "Falta userId" }, 400);
    }
    const useCase = c.get("obtenerBibliotecaUseCase");
    const data = await useCase.ejecutar(userId);
    return c.json({ message: "Biblioteca obtenida exitosamente", data });
  } catch (error: any) {
    return c.json(
      { message: "Error al obtener biblioteca", error: error.message },
      500,
    );
  }
});

// ==================== AGENDA SEMANAL ====================

/**
 * GET /api/rutinas/agenda/semanal
 */
rutinasRoutes.get("/agenda/semanal", async (c) => {
  try {
    const userId = c.req.query("userId");
    if (!userId) {
      return c.json({ message: "Falta userId" }, 400);
    }
    const useCase = c.get("agendaSemanalUseCase");
    const data = await useCase.obtenerPorUsuario(userId);
    return c.json({ message: "Agenda obtenida exitosamente", data });
  } catch (error: any) {
    return c.json(
      { message: "Error al obtener agenda", error: error.message },
      500,
    );
  }
});

/**
 * POST /api/rutinas/agenda/asignar
 */
rutinasRoutes.post("/agenda/asignar", async (c) => {
  try {
    const { userId, dia_semana, rutina_id } = await c.req.json();
    if (!userId || dia_semana === undefined || !rutina_id) {
      return c.json(
        { message: "Faltan datos: userId, dia_semana, rutina_id" },
        400,
      );
    }
    const useCase = c.get("agendaSemanalUseCase");
    const { data, reasignada } = await useCase.asignarOActualizar(
      userId,
      dia_semana,
      rutina_id,
    );
    const message = reasignada
      ? "Rutina reasignada exitosamente"
      : "Rutina asignada exitosamente";
    return c.json({ message, data });
  } catch (error: any) {
    return c.json(
      { message: "Error al asignar rutina", error: error.message },
      500,
    );
  }
});

/**
 * PUT /api/rutinas/agenda/:id
 */
rutinasRoutes.put("/agenda/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { rutina_id } = await c.req.json();
    if (!rutina_id) {
      return c.json({ message: "Falta rutina_id" }, 400);
    }
    const useCase = c.get("agendaSemanalUseCase");
    const data = await useCase.actualizar(id, rutina_id);
    return c.json({ message: "Rutina cambiada exitosamente", data });
  } catch (error: any) {
    return c.json(
      { message: "Error al cambiar rutina", error: error.message },
      500,
    );
  }
});

/**
 * DELETE /api/rutinas/agenda/:id
 */
rutinasRoutes.delete("/agenda/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const useCase = c.get("agendaSemanalUseCase");
    await useCase.eliminar(id);
    return c.json({ message: "Rutina desasignada exitosamente" });
  } catch (error: any) {
    return c.json(
      { message: "Error al desasignar rutina", error: error.message },
      500,
    );
  }
});

// ==================== RUTINAS POR ID ====================

/**
 * GET /api/rutinas/:id
 */
rutinasRoutes.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const useCase = c.get("obtenerBibliotecaUseCase");
    const data = await useCase.ejecutarPorId(id);
    if (!data) {
      return c.json({ message: "Rutina no encontrada" }, 404);
    }
    return c.json({ message: "Rutina obtenida exitosamente", data });
  } catch (error: any) {
    return c.json({ message: "Rutina no encontrada" }, 404);
  }
});

/**
 * PUT /api/rutinas/:id
 */
rutinasRoutes.put("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { nombre, objetivo } = await c.req.json();
    const useCase = c.get("gestionRutinaUseCase");
    const data = await useCase.actualizar(id, { nombre, objetivo });
    return c.json({ message: "Rutina actualizada exitosamente", data });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json(
      { message: "Error al actualizar rutina", error: error.message },
      status,
    );
  }
});

/**
 * DELETE /api/rutinas/:id
 */
rutinasRoutes.delete("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const useCase = c.get("gestionRutinaUseCase");
    await useCase.eliminar(id);
    return c.json({ message: "Rutina eliminada exitosamente" });
  } catch (error: any) {
    return c.json(
      { message: "Error al eliminar rutina", error: error.message },
      500,
    );
  }
});

// ==================== EJERCICIOS DE UNA RUTINA ====================

/**
 * POST /api/rutinas/:rutina_id/ejercicios
 */
rutinasRoutes.post("/:rutina_id/ejercicios", async (c) => {
  try {
    const rutinaId = parseInt(c.req.param("rutina_id"));
    const { ejercicios } = await c.req.json();
    const useCase = c.get("gestionRutinaUseCase");
    const data = await useCase.agregarEjercicios(rutinaId, ejercicios);
    return c.json({ message: "Ejercicios agregados exitosamente", data });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json(
      { message: "Error al agregar ejercicios", error: error.message },
      status,
    );
  }
});

/**
 * PUT /api/rutinas/:rutina_id/ejercicios/:ejercicio_id
 */
rutinasRoutes.put("/:rutina_id/ejercicios/:ejercicio_id", async (c) => {
  try {
    const rutinaId = parseInt(c.req.param("rutina_id"));
    const ejercicioId = parseInt(c.req.param("ejercicio_id"));
    const { series, repeticiones, descanso_segundos, notas, orden } =
      await c.req.json();

    const updateData: any = {};
    if (series !== undefined) updateData.series = series;
    if (repeticiones !== undefined) updateData.repeticiones = repeticiones;
    if (descanso_segundos !== undefined)
      updateData.tiempoDescansoSegundos = descanso_segundos;
    if (notas !== undefined) updateData.notasIa = notas;
    if (orden !== undefined) updateData.orden = orden;

    const useCase = c.get("gestionRutinaUseCase");
    const data = await useCase.actualizarEjercicio(
      rutinaId,
      ejercicioId,
      updateData,
    );
    return c.json({ message: "Ejercicio actualizado exitosamente", data });
  } catch (error: any) {
    return c.json(
      { message: "Error al actualizar ejercicio", error: error.message },
      500,
    );
  }
});

/**
 * DELETE /api/rutinas/:rutina_id/ejercicios/:ejercicio_id
 */
rutinasRoutes.delete("/:rutina_id/ejercicios/:ejercicio_id", async (c) => {
  try {
    const rutinaId = parseInt(c.req.param("rutina_id"));
    const ejercicioId = parseInt(c.req.param("ejercicio_id"));
    const useCase = c.get("gestionRutinaUseCase");
    await useCase.eliminarEjercicio(rutinaId, ejercicioId);
    return c.json({ message: "Ejercicio eliminado exitosamente" });
  } catch (error: any) {
    return c.json(
      { message: "Error al eliminar ejercicio", error: error.message },
      500,
    );
  }
});

export default rutinasRoutes;
