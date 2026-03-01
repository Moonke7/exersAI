// ============================================================
// USE CASE — Equipamiento (catálogo + inventario del usuario)
// ============================================================

import type { IEquipamientoRepository } from "../../domain/repositories/IEquipamientoRepository.js";
import type {
  CatalogoEquipamiento,
  InventarioUsuario,
} from "../../domain/entities/equipamiento.js";
import { ValidationError } from "../../domain/errors/domain-errors.js";

export class EquipamientoUseCase {
  constructor(private readonly equipamientoRepo: IEquipamientoRepository) {}

  async obtenerCatalogo(): Promise<CatalogoEquipamiento[]> {
    return this.equipamientoRepo.obtenerCatalogo();
  }

  async obtenerInventario(
    userId: string,
    espacioId: number,
  ): Promise<InventarioUsuario[]> {
    return this.equipamientoRepo.obtenerInventarioDeEspacio(userId, espacioId);
  }

  async crear(data: {
    equipoId: number;
    cantidad: number;
    espacioId: number;
    usuarioId: string;
  }): Promise<InventarioUsuario> {
    if (
      !data.equipoId ||
      !data.cantidad ||
      !data.espacioId ||
      !data.usuarioId
    ) {
      throw new ValidationError(
        "equipoId, cantidad, espacioId y usuarioId son obligatorios",
      );
    }
    return this.equipamientoRepo.crear(data);
  }

  async actualizar(
    id: number,
    userId: string,
    data: { equipoId?: number; cantidad?: number },
  ): Promise<InventarioUsuario> {
    return this.equipamientoRepo.actualizar(id, userId, data);
  }

  async eliminar(id: number, userId: string): Promise<void> {
    return this.equipamientoRepo.eliminar(id, userId);
  }
}
