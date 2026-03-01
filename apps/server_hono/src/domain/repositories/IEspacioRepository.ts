// ============================================================
// REPOSITORY INTERFACE — IEspacioRepository
// ============================================================

import type { Espacio } from "../entities/espacio.js";

export interface IEspacioRepository {
  obtenerPorUsuario(userId: string): Promise<Espacio[]>;
  crear(data: { nombre: string; userId: string }): Promise<Espacio>;
}
