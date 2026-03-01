// ============================================================
// USE CASE — Espacios
// ============================================================

import type { IEspacioRepository } from "../../domain/repositories/IEspacioRepository.js";
import type { Espacio } from "../../domain/entities/espacio.js";
import { ValidationError } from "../../domain/errors/domain-errors.js";

export class EspaciosUseCase {
  constructor(private readonly espacioRepo: IEspacioRepository) {}

  async obtenerPorUsuario(userId: string): Promise<Espacio[]> {
    return this.espacioRepo.obtenerPorUsuario(userId);
  }

  async crear(data: { nombre: string; userId: string }): Promise<Espacio> {
    if (!data.nombre) {
      throw new ValidationError("El nombre del espacio es obligatorio");
    }
    return this.espacioRepo.crear(data);
  }
}
