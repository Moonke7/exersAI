import type { IEjercicioRepository } from "../../domain/repositories.js";
import type { Ejercicio } from "../../domain/types.js";

interface ObtenerEjerciciosFiltros {
  muscle?: string;
  difficulty?: string;
}

export class ObtenerEjerciciosUseCase {
  constructor(private readonly ejercicioRepo: IEjercicioRepository) {}

  async ejecutar(filtros?: ObtenerEjerciciosFiltros): Promise<Ejercicio[]> {
    return this.ejercicioRepo.obtenerTodos(filtros);
  }

  async ejecutarPorId(id: number): Promise<Ejercicio | null> {
    return this.ejercicioRepo.obtenerPorId(id);
  }
}
