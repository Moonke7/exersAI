import { Request, Response } from "express";
import { EquipamientoRepository } from "../repositories/EquipamientoRepository.js";

const equipamientoRepo = new EquipamientoRepository();

export const EquipamientoController = {
  /**
   * GET /api/equipamiento/:user_id/:espacio_id
   */
  async getByEspacio(req: Request, res: Response) {
    try {
      const { user_id, espacio_id } = req.params;
      if (!user_id || !espacio_id) {
        return res
          .status(400)
          .json({ error: "user_id y espacio_id son obligatorios" });
      }
      const data = await equipamientoRepo.obtenerInventarioDeEspacio(
        user_id,
        parseInt(espacio_id),
      );
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching equipamiento:", error);
      res.status(500).json({ error: "Error al obtener el equipamiento" });
    }
  },

  /**
   * POST /api/equipamiento
   */
  async crear(req: Request, res: Response) {
    try {
      const { equipo_id, cantidad, espacio_id, user_id } = req.body;
      if (!equipo_id || !cantidad || !espacio_id || !user_id) {
        return res.status(400).json({
          error: "equipo_id, cantidad, espacio_id y user_id son obligatorios",
        });
      }
      const data = await equipamientoRepo.crear({
        equipo_id,
        cantidad,
        espacio_id,
        usuario_id: user_id,
      });
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating equipamiento:", error);
      res.status(500).json({ error: "Error al crear el equipamiento" });
    }
  },

  /**
   * PUT /api/equipamiento/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { equipo_id, cantidad, user_id } = req.body;
      if (!id || !user_id) {
        return res.status(400).json({ error: "id y user_id son obligatorios" });
      }
      const updateData: { equipo_id?: number; cantidad?: number } = {};
      if (equipo_id !== undefined) updateData.equipo_id = equipo_id;
      if (cantidad !== undefined) updateData.cantidad = cantidad;

      const data = await equipamientoRepo.actualizar(
        parseInt(id),
        user_id,
        updateData,
      );
      res.status(200).json(data);
    } catch (error) {
      console.error("Error updating equipamiento:", error);
      res.status(500).json({ error: "Error al actualizar el equipamiento" });
    }
  },

  /**
   * DELETE /api/equipamiento/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      if (!id || !user_id) {
        return res.status(400).json({ error: "id y user_id son obligatorios" });
      }
      await equipamientoRepo.eliminar(parseInt(id), user_id);
      res.status(200).json({ message: "Equipamiento eliminado exitosamente" });
    } catch (error) {
      console.error("Error deleting equipamiento:", error);
      res.status(500).json({ error: "Error al eliminar el equipamiento" });
    }
  },
};
