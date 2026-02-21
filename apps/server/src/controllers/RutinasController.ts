import { Request, Response } from "express";
import { RutinaRepository } from "../repositories/RutinaRepository.js";
import { AgendaRepository } from "../repositories/AgendaRepository.js";
import { ObtenerBibliotecaUseCase } from "../use-cases/rutinas/ObtenerBibliotecaUseCase.js";
import { AgendaSemanalUseCase } from "../use-cases/rutinas/AgendaSemanalUseCase.js";

const rutinaRepo = new RutinaRepository();
const agendaRepo = new AgendaRepository();

const obtenerBibliotecaUseCase = new ObtenerBibliotecaUseCase(rutinaRepo);
const agendaUseCase = new AgendaSemanalUseCase(agendaRepo);

export const RutinasController = {
  // ==================== RUTINAS CRUD ====================

  /**
   * POST /api/rutinas/crear
   */
  async crear(req: Request, res: Response) {
    try {
      const { userId, nombre, objetivo } = req.body;
      if (!userId || !nombre) {
        return res
          .status(400)
          .json({ message: "Faltan datos requeridos: userId, nombre" });
      }
      const data = await rutinaRepo.crear({
        usuario_id: userId,
        nombre,
        objetivo,
      });
      return res
        .status(200)
        .json({ message: "Rutina creada exitosamente", data });
    } catch (error) {
      console.error("Error creating rutina:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al crear rutina", error: msg });
    }
  },

  /**
   * GET /api/rutinas/biblioteca
   */
  async getBiblioteca(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "Falta userId" });
      }
      const data = await obtenerBibliotecaUseCase.ejecutar(userId as string);
      return res
        .status(200)
        .json({ message: "Biblioteca obtenida exitosamente", data });
    } catch (error) {
      console.error("Error fetching biblioteca:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al obtener biblioteca", error: msg });
    }
  },

  /**
   * GET /api/rutinas/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await obtenerBibliotecaUseCase.ejecutarPorId(id);
      if (!data) {
        return res.status(404).json({ message: "Rutina no encontrada" });
      }
      return res
        .status(200)
        .json({ message: "Rutina obtenida exitosamente", data });
    } catch (error) {
      console.error("Error fetching rutina:", error);
      return res.status(404).json({ message: "Rutina no encontrada" });
    }
  },

  /**
   * PUT /api/rutinas/:id
   */
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, objetivo } = req.body;
      if (!nombre) {
        return res.status(400).json({ message: "Falta el nombre" });
      }
      const data = await rutinaRepo.actualizar(id, { nombre, objetivo });
      return res
        .status(200)
        .json({ message: "Rutina actualizada exitosamente", data });
    } catch (error) {
      console.error("Error updating rutina:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al actualizar rutina", error: msg });
    }
  },

  /**
   * DELETE /api/rutinas/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await rutinaRepo.eliminar(id);
      return res.status(200).json({ message: "Rutina eliminada exitosamente" });
    } catch (error) {
      console.error("Error deleting rutina:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al eliminar rutina", error: msg });
    }
  },

  // ==================== RUTINA EJERCICIOS ====================

  /**
   * POST /api/rutinas/:rutina_id/ejercicios
   */
  async agregarEjercicios(req: Request, res: Response) {
    try {
      const rutinaId = parseInt(req.params.rutina_id);
      const { ejercicios } = req.body;
      if (!ejercicios || !Array.isArray(ejercicios)) {
        return res
          .status(400)
          .json({ message: "Se requiere un array de ejercicios" });
      }
      const ejerciciosToInsert = ejercicios.map((ej, index) => ({
        rutina_id: rutinaId,
        ejercicio_id: ej.ejercicio_id,
        series: ej.series || 3,
        repeticiones: ej.repeticiones || "10",
        tiempo_descanso_segundos: ej.descanso_segundos || 60,
        notas_ia: ej.notas || null,
        orden: ej.orden !== undefined ? ej.orden : index + 1,
      }));
      const data = await rutinaRepo.agregarEjercicios(ejerciciosToInsert);
      return res
        .status(200)
        .json({ message: "Ejercicios agregados exitosamente", data });
    } catch (error) {
      console.error("Error adding ejercicios:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al agregar ejercicios", error: msg });
    }
  },

  /**
   * PUT /api/rutinas/:rutina_id/ejercicios/:ejercicio_id
   */
  async actualizarEjercicio(req: Request, res: Response) {
    try {
      const rutinaId = parseInt(req.params.rutina_id);
      const ejercicioId = parseInt(req.params.ejercicio_id);
      const { series, repeticiones, descanso_segundos, notas, orden } =
        req.body;

      const updateData: any = {};
      if (series !== undefined) updateData.series = series;
      if (repeticiones !== undefined) updateData.repeticiones = repeticiones;
      if (descanso_segundos !== undefined)
        updateData.tiempo_descanso_segundos = descanso_segundos;
      if (notas !== undefined) updateData.notas_ia = notas;
      if (orden !== undefined) updateData.orden = orden;

      const data = await rutinaRepo.actualizarEjercicio(
        rutinaId,
        ejercicioId,
        updateData,
      );
      return res
        .status(200)
        .json({ message: "Ejercicio actualizado exitosamente", data });
    } catch (error) {
      console.error("Error updating ejercicio:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al actualizar ejercicio", error: msg });
    }
  },

  /**
   * DELETE /api/rutinas/:rutina_id/ejercicios/:ejercicio_id
   */
  async eliminarEjercicio(req: Request, res: Response) {
    try {
      const rutinaId = parseInt(req.params.rutina_id);
      const ejercicioId = parseInt(req.params.ejercicio_id);
      await rutinaRepo.eliminarEjercicio(rutinaId, ejercicioId);
      return res
        .status(200)
        .json({ message: "Ejercicio eliminado exitosamente" });
    } catch (error) {
      console.error("Error deleting ejercicio:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al eliminar ejercicio", error: msg });
    }
  },

  // ==================== AGENDA SEMANAL ====================

  /**
   * GET /api/rutinas/agenda/semanal
   */
  async getAgenda(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "Falta userId" });
      }
      const data = await agendaUseCase.obtenerPorUsuario(userId as string);
      return res
        .status(200)
        .json({ message: "Agenda obtenida exitosamente", data });
    } catch (error) {
      console.error("Error fetching agenda:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al obtener agenda", error: msg });
    }
  },

  /**
   * POST /api/rutinas/agenda/asignar
   */
  async asignarAgenda(req: Request, res: Response) {
    try {
      const { userId, dia_semana, rutina_id } = req.body;
      if (!userId || !dia_semana || !rutina_id) {
        return res
          .status(400)
          .json({ message: "Faltan datos: userId, dia_semana, rutina_id" });
      }
      const { data, reasignada } = await agendaUseCase.asignarOActualizar(
        userId,
        dia_semana,
        rutina_id,
      );
      const message = reasignada
        ? "Rutina reasignada exitosamente"
        : "Rutina asignada exitosamente";
      return res.status(200).json({ message, data });
    } catch (error) {
      console.error("Error assigning agenda:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al asignar rutina", error: msg });
    }
  },

  /**
   * PUT /api/rutinas/agenda/:id
   */
  async actualizarAgenda(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { rutina_id } = req.body;
      if (!rutina_id) {
        return res.status(400).json({ message: "Falta rutina_id" });
      }
      const data = await agendaUseCase.actualizar(id, rutina_id);
      return res
        .status(200)
        .json({ message: "Rutina cambiada exitosamente", data });
    } catch (error) {
      console.error("Error updating agenda:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al cambiar rutina", error: msg });
    }
  },

  /**
   * DELETE /api/rutinas/agenda/:id
   */
  async eliminarAgenda(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await agendaUseCase.eliminar(id);
      return res
        .status(200)
        .json({ message: "Rutina desasignada exitosamente" });
    } catch (error) {
      console.error("Error deleting from agenda:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";
      return res
        .status(500)
        .json({ message: "Error al desasignar rutina", error: msg });
    }
  },
};
