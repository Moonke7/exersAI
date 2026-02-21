import { Router } from "express";
import { EspaciosController } from "../../controllers/EspaciosController.js";

const router = Router();

router.get("/:user_id", EspaciosController.getByUser);
router.post("/crear-espacio", EspaciosController.crear);

export default router;
