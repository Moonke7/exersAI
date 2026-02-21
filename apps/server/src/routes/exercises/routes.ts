import { Router } from "express";
import { EjerciciosController } from "../../controllers/EjerciciosController.js";

const router = Router();

router.get("/all-equipment", EjerciciosController.getAllEquipment);
router.post("/crear-rutina", EjerciciosController.crearRutina);
router.get("/", EjerciciosController.getAll);
router.get("/:id", EjerciciosController.getById);

export default router;
