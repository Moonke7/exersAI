import { Router } from "express";
import { RutinasController } from "../../controllers/RutinasController.js";

const router = Router();

// Rutinas CRUD
router.post("/crear", RutinasController.crear);
router.get("/biblioteca", RutinasController.getBiblioteca);

// Agenda Semanal (antes que /:id para evitar conflictos de ruta)
router.get("/agenda/semanal", RutinasController.getAgenda);
router.post("/agenda/asignar", RutinasController.asignarAgenda);
router.put("/agenda/:id", RutinasController.actualizarAgenda);
router.delete("/agenda/:id", RutinasController.eliminarAgenda);

// Rutinas por ID
router.get("/:id", RutinasController.getById);
router.put("/:id", RutinasController.update);
router.delete("/:id", RutinasController.delete);

// Ejercicios de una rutina
router.post("/:rutina_id/ejercicios", RutinasController.agregarEjercicios);
router.put(
  "/:rutina_id/ejercicios/:ejercicio_id",
  RutinasController.actualizarEjercicio,
);
router.delete(
  "/:rutina_id/ejercicios/:ejercicio_id",
  RutinasController.eliminarEjercicio,
);

export default router;
