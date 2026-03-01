// ============================================================
// INFRASTRUCTURE — D1EjercicioRepository
// ============================================================

import { eq, sql } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import { ejercicios } from "../db/schema.js";
import type { IEjercicioRepository } from "../../domain/repositories/IEjercicioRepository.js";
import type { Ejercicio } from "../../domain/entities/ejercicio.js";

export class D1EjercicioRepository implements IEjercicioRepository {
  constructor(private readonly db: DrizzleDB) {}

  async obtenerTodos(filtros?: {
    muscle?: string;
    difficulty?: number;
  }): Promise<Ejercicio[]> {
    let query = this.db.select().from(ejercicios).$dynamic();

    if (filtros?.muscle) {
      // JSON array contains — SQLite: json_each + LIKE fallback
      query = query.where(
        sql`${ejercicios.gruposMusculares} LIKE ${"%" + filtros.muscle + "%"}`,
      );
    }
    if (filtros?.difficulty) {
      query = query.where(eq(ejercicios.dificultad, filtros.difficulty));
    }

    const results = await query;
    return results as Ejercicio[];
  }

  async obtenerPorId(id: number): Promise<Ejercicio | null> {
    const results = await this.db
      .select()
      .from(ejercicios)
      .where(eq(ejercicios.id, id))
      .limit(1);
    return (results[0] as Ejercicio) ?? null;
  }

  async obtenerPorMusculo(musculo: string): Promise<Ejercicio[]> {
    // Buscar ejercicios cuyo array JSON de grupos_musculares contenga el músculo
    const results = await this.db
      .select()
      .from(ejercicios)
      .where(sql`${ejercicios.gruposMusculares} LIKE ${"%" + musculo + "%"}`);
    return results as Ejercicio[];
  }
}
