import type { IRutinaRepository } from "../../domain/repositories.js";
import type { RutinaConEjercicios } from "../../domain/types.js";

export class ObtenerBibliotecaUseCase {
  constructor(private readonly rutinaRepo: IRutinaRepository) {}

  async ejecutar(userId: string): Promise<RutinaConEjercicios[]> {
    return this.rutinaRepo.obtenerBiblioteca(userId);
  }

  async ejecutarPorId(id: number): Promise<RutinaConEjercicios | null> {
    return this.rutinaRepo.obtenerPorId(id);
  }
}
