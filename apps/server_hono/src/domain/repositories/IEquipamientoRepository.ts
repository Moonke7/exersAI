// ============================================================
// REPOSITORY INTERFACE — IEquipamientoRepository
// ============================================================

import type {
  CatalogoEquipamiento,
  InventarioUsuario,
} from "../entities/equipamiento.js";

export interface IEquipamientoRepository {
  obtenerCatalogo(): Promise<CatalogoEquipamiento[]>;

  obtenerInventarioDeEspacio(
    userId: string,
    espacioId: number,
  ): Promise<InventarioUsuario[]>;

  crear(data: {
    equipoId: number;
    cantidad: number;
    espacioId: number;
    usuarioId: string;
  }): Promise<InventarioUsuario>;

  actualizar(
    id: number,
    userId: string,
    data: { equipoId?: number; cantidad?: number },
  ): Promise<InventarioUsuario>;

  eliminar(id: number, userId: string): Promise<void>;
}
