// ============================================================
// REPOSITORY INTERFACE — IAgendaRepository
// ============================================================

import type { AgendaSemanal } from "../entities/agenda.js";

export interface IAgendaRepository {
  obtenerPorUsuario(userId: string): Promise<AgendaSemanal[]>;

  obtenerPorDia(
    userId: string,
    diaSemana: number,
  ): Promise<AgendaSemanal | null>;

  asignar(data: {
    usuarioId: string;
    diaSemana: number;
    rutinaId: number;
  }): Promise<AgendaSemanal>;

  actualizar(id: number, rutinaId: number): Promise<AgendaSemanal>;

  eliminar(id: number): Promise<void>;

  eliminarPorRutina(rutinaId: number): Promise<void>;
}
