import { Router } from "express";
import { EquipamientoController } from "../../controllers/EquipamientoController.js";

const router = Router();

router.get("/:user_id/:espacio_id", EquipamientoController.getByEspacio);
router.post("/", EquipamientoController.crear);
router.put("/:id", EquipamientoController.update);
router.delete("/:id", EquipamientoController.delete);

export default router;
