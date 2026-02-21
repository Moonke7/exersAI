import type { IAgendaRepository } from "../../domain/repositories.js";
import type { AgendaSemanal } from "../../domain/types.js";

export class AgendaSemanalUseCase {
  constructor(private readonly agendaRepo: IAgendaRepository) {}

  async obtenerPorUsuario(userId: string): Promise<AgendaSemanal[]> {
    return this.agendaRepo.obtenerPorUsuario(userId);
  }

  /**
   * Asigna una rutina a un día. Si ya existe una asignación para ese día, la actualiza.
   */
  async asignarOActualizar(
    userId: string,
    diaSemana: number,
    rutinaId: number,
  ): Promise<{ data: AgendaSemanal; reasignada: boolean }> {
    const existing = await this.agendaRepo.obtenerPorDia(userId, diaSemana);

    if (existing) {
      const updated = await this.agendaRepo.actualizar(existing.id, rutinaId);
      return { data: updated, reasignada: true };
    }

    const created = await this.agendaRepo.asignar({
      usuario_id: userId,
      dia_semana: diaSemana,
      rutina_id: rutinaId,
    });
    return { data: created, reasignada: false };
  }

  async actualizar(id: number, rutinaId: number): Promise<AgendaSemanal> {
    return this.agendaRepo.actualizar(id, rutinaId);
  }

  async eliminar(id: number): Promise<void> {
    return this.agendaRepo.eliminar(id);
  }
}
