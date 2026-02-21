import { Request, Response } from "express";
import { EspacioRepository } from "../repositories/EspacioRepository.js";

const espacioRepo = new EspacioRepository();

export const EspaciosController = {
  /**
   * GET /api/espacios/:user_id
   */
  async getByUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      if (!user_id) {
        return res.status(400).json({ error: "user_id es obligatorio" });
      }
      const data = await espacioRepo.obtenerPorUsuario(user_id);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching espacios:", error);
      res.status(500).json({ error: "Error al obtener los espacios" });
    }
  },

  /**
   * POST /api/espacios/crear-espacio
   */
  async crear(req: Request, res: Response) {
    try {
      const { nombre, user_id } = req.body;
      if (!nombre) {
        return res.status(400).json({ error: "Nombre es obligatorio" });
      }
      const data = await espacioRepo.crear({ nombre, user_id });
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating space:", error);
      res.status(500).json({ error: "Error al crear el espacio" });
    }
  },
};
