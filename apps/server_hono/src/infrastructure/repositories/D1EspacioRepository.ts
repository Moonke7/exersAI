// ============================================================
// INFRASTRUCTURE — D1EspacioRepository
// ============================================================

import { eq } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import { espacios } from "../db/schema.js";
import type { IEspacioRepository } from "../../domain/repositories/IEspacioRepository.js";
import type { Espacio } from "../../domain/entities/espacio.js";

export class D1EspacioRepository implements IEspacioRepository {
  constructor(private readonly db: DrizzleDB) {}

  async obtenerPorUsuario(userId: string): Promise<Espacio[]> {
    const results = await this.db
      .select()
      .from(espacios)
      .where(eq(espacios.userId, userId));
    return results as Espacio[];
  }

  async crear(data: { nombre: string; userId: string }): Promise<Espacio> {
    const results = await this.db
      .insert(espacios)
      .values({
        nombre: data.nombre,
        userId: data.userId,
      })
      .returning();
    return results[0] as Espacio;
  }
}
