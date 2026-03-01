// ============================================================
// REPOSITORY INTERFACE — IEjercicioRepository
// ============================================================

import type { Ejercicio } from "../entities/ejercicio.js";

export interface IEjercicioRepository {
  obtenerTodos(filtros?: {
    muscle?: string;
    difficulty?: number;
  }): Promise<Ejercicio[]>;

  obtenerPorId(id: number): Promise<Ejercicio | null>;

  obtenerPorMusculo(musculo: string): Promise<Ejercicio[]>;
}
