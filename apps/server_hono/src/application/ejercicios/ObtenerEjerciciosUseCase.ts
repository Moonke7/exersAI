// ============================================================
// USE CASE — Obtener Ejercicios
// ============================================================

import type { IEjercicioRepository } from "../../domain/repositories/IEjercicioRepository.js";
import type { Ejercicio } from "../../domain/entities/ejercicio.js";

interface ObtenerEjerciciosFiltros {
  muscle?: string;
  difficulty?: number;
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
