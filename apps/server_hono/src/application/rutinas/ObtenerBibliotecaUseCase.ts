// ============================================================
// USE CASE — Obtener Biblioteca de Rutinas
// ============================================================

import type { IRutinaRepository } from "../../domain/repositories/IRutinaRepository.js";
import type { RutinaConEjercicios } from "../../domain/entities/rutina.js";

export class ObtenerBibliotecaUseCase {
  constructor(private readonly rutinaRepo: IRutinaRepository) {}

  async ejecutar(userId: string): Promise<RutinaConEjercicios[]> {
    return this.rutinaRepo.obtenerBiblioteca(userId);
  }

  async ejecutarPorId(id: number): Promise<RutinaConEjercicios | null> {
    return this.rutinaRepo.obtenerPorId(id);
  }
}
