// ============================================================
// INFRASTRUCTURE — D1AgendaRepository
// ============================================================

import { eq, and, asc } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import type { IAgendaRepository } from "../../domain/repositories/IAgendaRepository.js";
import type { AgendaSemanal } from "../../domain/entities/agenda.js";
import { schema } from "@exersai/shared/db";

export class D1AgendaRepository implements IAgendaRepository {
  constructor(private readonly db: DrizzleDB) {}

  async obtenerPorUsuario(userId: string): Promise<AgendaSemanal[]> {
    // 1. Obtener agenda del usuario
    const agendaResults = await this.db
      .select()
      .from(schema.agendaSemanal)
      .leftJoin(
        schema.rutinas,
        eq(schema.agendaSemanal.rutinaId, schema.rutinas.id),
      )
      .where(eq(schema.agendaSemanal.usuarioId, userId))
      .orderBy(asc(schema.agendaSemanal.diaSemana));

    // 2. Para cada entrada con rutina, obtener los ejercicios
    const result: AgendaSemanal[] = [];
    for (const item of agendaResults) {
      if (item.rutinas?.id) {
        const ejResults = await this.db
          .select()
          .from(schema.rutinaEjercicios)
          .where(eq(schema.rutinaEjercicios.rutinaId, item.rutinas.id))
          .orderBy(asc(schema.rutinaEjercicios.orden));

        result.push({
          ...item,
          rutina: {
            ...item.rutinas,
            ejercicios: ejResults,
          },
        } as unknown as AgendaSemanal);
      } else {
        result.push(item as unknown as AgendaSemanal);
      }
    }

    return result;
  }

  async obtenerPorDia(
    userId: string,
    diaSemana: number,
  ): Promise<AgendaSemanal | null> {
    const results = await this.db
      .select()
      .from(schema.agendaSemanal)
      .where(
        and(
          eq(schema.agendaSemanal.usuarioId, userId),
          eq(schema.agendaSemanal.diaSemana, diaSemana),
        ),
      )
      .limit(1);
    return (results[0] as unknown as AgendaSemanal) ?? null;
  }

  async asignar(data: {
    usuarioId: string;
    diaSemana: number;
    rutinaId: number;
  }): Promise<AgendaSemanal> {
    const results = await this.db
      .insert(schema.agendaSemanal)
      .values({
        usuarioId: data.usuarioId,
        diaSemana: data.diaSemana,
        rutinaId: data.rutinaId,
      })
      .returning();
    return results[0] as unknown as AgendaSemanal;
  }

  async actualizar(id: number, rutinaId: number): Promise<AgendaSemanal> {
    const results = await this.db
      .update(schema.agendaSemanal)
      .set({
        rutinaId: rutinaId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.agendaSemanal.id, id))
      .returning();
    return results[0] as unknown as AgendaSemanal;
  }

  async eliminar(id: number): Promise<void> {
    await this.db
      .delete(schema.agendaSemanal)
      .where(eq(schema.agendaSemanal.id, id));
  }

  async eliminarPorRutina(rutinaId: number): Promise<void> {
    await this.db
      .delete(schema.agendaSemanal)
      .where(eq(schema.agendaSemanal.rutinaId, rutinaId));
  }
}
