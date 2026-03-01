// ============================================================
// INFRASTRUCTURE — D1RutinaRepository
// ============================================================

import { eq, desc } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import {
  rutinas,
  rutinaEjercicios,
  ejercicios,
  agendaSemanal,
} from "../db/schema.js";
import type { IRutinaRepository } from "../../domain/repositories/IRutinaRepository.js";
import type {
  Rutina,
  RutinaConEjercicios,
  RutinaEjercicio,
} from "../../domain/entities/rutina.js";

export class D1RutinaRepository implements IRutinaRepository {
  constructor(private readonly db: DrizzleDB) {}

  async crear(data: {
    usuarioId: string;
    nombre: string;
    objetivo?: string;
  }): Promise<Rutina> {
    const results = await this.db
      .insert(rutinas)
      .values({
        usuarioId: data.usuarioId,
        nombre: data.nombre,
        objetivo: data.objetivo ?? null,
      })
      .returning();
    return results[0] as unknown as Rutina;
  }

  async obtenerPorId(id: number): Promise<RutinaConEjercicios | null> {
    // 1. Obtener la rutina
    const rutinaResults = await this.db
      .select()
      .from(rutinas)
      .where(eq(rutinas.id, id))
      .limit(1);

    if (rutinaResults.length === 0) return null;

    // 2. Obtener los ejercicios de la rutina con el detalle del ejercicio
    const ejResults = await this.db
      .select({
        id: rutinaEjercicios.id,
        rutinaId: rutinaEjercicios.rutinaId,
        ejercicioId: rutinaEjercicios.ejercicioId,
        orden: rutinaEjercicios.orden,
        series: rutinaEjercicios.series,
        repeticiones: rutinaEjercicios.repeticiones,
        pesoSugerido: rutinaEjercicios.pesoSugerido,
        tiempoDescansoSegundos: rutinaEjercicios.tiempoDescansoSegundos,
        notasIa: rutinaEjercicios.notasIa,
        // Ejercicio anidado
        ejercicio: {
          id: ejercicios.id,
          nombre: ejercicios.nombre,
          gruposMusculares: ejercicios.gruposMusculares,
          instrucciones: ejercicios.instrucciones,
          videoUrl: ejercicios.videoUrl,
          equipamientoIds: ejercicios.equipamientoIds,
          patron: ejercicios.patron,
          dificultad: ejercicios.dificultad,
          grupoPrincipal: ejercicios.grupoPrincipal,
          destacado: ejercicios.destacado,
        },
      })
      .from(rutinaEjercicios)
      .leftJoin(ejercicios, eq(rutinaEjercicios.ejercicioId, ejercicios.id))
      .where(eq(rutinaEjercicios.rutinaId, id))
      .orderBy(rutinaEjercicios.orden);

    return {
      ...rutinaResults[0],
      ejercicios: ejResults,
    } as unknown as RutinaConEjercicios;
  }

  async obtenerBiblioteca(userId: string): Promise<RutinaConEjercicios[]> {
    // 1. Obtener todas las rutinas del usuario
    const rutinasResults = await this.db
      .select()
      .from(rutinas)
      .where(eq(rutinas.usuarioId, userId))
      .orderBy(desc(rutinas.createdAt));

    if (rutinasResults.length === 0) return [];

    // 2. Para cada rutina, obtener sus ejercicios
    const result: RutinaConEjercicios[] = [];

    for (const rutina of rutinasResults) {
      const ejResults = await this.db
        .select({
          id: rutinaEjercicios.id,
          rutinaId: rutinaEjercicios.rutinaId,
          ejercicioId: rutinaEjercicios.ejercicioId,
          orden: rutinaEjercicios.orden,
          series: rutinaEjercicios.series,
          repeticiones: rutinaEjercicios.repeticiones,
          pesoSugerido: rutinaEjercicios.pesoSugerido,
          tiempoDescansoSegundos: rutinaEjercicios.tiempoDescansoSegundos,
          notasIa: rutinaEjercicios.notasIa,
          ejercicio: {
            id: ejercicios.id,
            nombre: ejercicios.nombre,
            gruposMusculares: ejercicios.gruposMusculares,
            instrucciones: ejercicios.instrucciones,
            videoUrl: ejercicios.videoUrl,
            equipamientoIds: ejercicios.equipamientoIds,
            patron: ejercicios.patron,
            dificultad: ejercicios.dificultad,
            grupoPrincipal: ejercicios.grupoPrincipal,
            destacado: ejercicios.destacado,
          },
        })
        .from(rutinaEjercicios)
        .leftJoin(ejercicios, eq(rutinaEjercicios.ejercicioId, ejercicios.id))
        .where(eq(rutinaEjercicios.rutinaId, rutina.id))
        .orderBy(rutinaEjercicios.orden);

      result.push({
        ...rutina,
        ejercicios: ejResults,
      } as unknown as RutinaConEjercicios);
    }

    return result;
  }

  async actualizar(
    id: number,
    data: { nombre: string; objetivo?: string },
  ): Promise<Rutina> {
    const results = await this.db
      .update(rutinas)
      .set({
        nombre: data.nombre,
        objetivo: data.objetivo ?? null,
      })
      .where(eq(rutinas.id, id))
      .returning();
    return results[0] as unknown as Rutina;
  }

  async eliminar(id: number): Promise<void> {
    // 1. Eliminar ejercicios de la rutina
    await this.db
      .delete(rutinaEjercicios)
      .where(eq(rutinaEjercicios.rutinaId, id));

    // 2. Eliminar de la agenda
    await this.db.delete(agendaSemanal).where(eq(agendaSemanal.rutinaId, id));

    // 3. Eliminar la rutina
    await this.db.delete(rutinas).where(eq(rutinas.id, id));
  }

  async agregarEjercicios(
    items: Omit<RutinaEjercicio, "id" | "ejercicio">[],
  ): Promise<RutinaEjercicio[]> {
    const values = items.map((item) => ({
      rutinaId: item.rutinaId,
      ejercicioId: item.ejercicioId,
      orden: item.orden,
      series: item.series ?? 3,
      repeticiones: item.repeticiones ?? "10",
      tiempoDescansoSegundos: item.tiempoDescansoSegundos ?? 60,
      notasIa: item.notasIa ?? null,
    }));

    const results = await this.db
      .insert(rutinaEjercicios)
      .values(values)
      .returning();

    return results as unknown as RutinaEjercicio[];
  }

  async actualizarEjercicio(
    rutinaId: number,
    ejercicioId: number,
    data: Partial<
      Pick<
        RutinaEjercicio,
        | "series"
        | "repeticiones"
        | "tiempoDescansoSegundos"
        | "notasIa"
        | "orden"
      >
    >,
  ): Promise<RutinaEjercicio> {
    const updateData: Record<string, any> = {};
    if (data.series !== undefined) updateData.series = data.series;
    if (data.repeticiones !== undefined)
      updateData.repeticiones = data.repeticiones;
    if (data.tiempoDescansoSegundos !== undefined)
      updateData.tiempoDescansoSegundos = data.tiempoDescansoSegundos;
    if (data.notasIa !== undefined) updateData.notasIa = data.notasIa;
    if (data.orden !== undefined) updateData.orden = data.orden;

    const results = await this.db
      .update(rutinaEjercicios)
      .set(updateData)
      .where(eq(rutinaEjercicios.rutinaId, rutinaId))
      .returning();

    // Filtrar por ejercicioId (id de rutina_ejercicios)
    const found = results.find((r) => r.id === ejercicioId);
    return (found ?? results[0]) as unknown as RutinaEjercicio;
  }

  async eliminarEjercicio(
    rutinaId: number,
    ejercicioId: number,
  ): Promise<void> {
    await this.db
      .delete(rutinaEjercicios)
      .where(eq(rutinaEjercicios.id, ejercicioId));
  }
}
