// ============================================================
// INFRASTRUCTURE — D1EquipamientoRepository
// ============================================================

import { eq, and } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import { catalogoEquipamiento, inventarioUsuario } from "../db/schema.js";
import type { IEquipamientoRepository } from "../../domain/repositories/IEquipamientoRepository.js";
import type {
  CatalogoEquipamiento,
  InventarioUsuario,
} from "../../domain/entities/equipamiento.js";

export class D1EquipamientoRepository implements IEquipamientoRepository {
  constructor(private readonly db: DrizzleDB) {}

  async obtenerCatalogo(): Promise<CatalogoEquipamiento[]> {
    const results = await this.db.select().from(catalogoEquipamiento);
    return results as CatalogoEquipamiento[];
  }

  async obtenerInventarioDeEspacio(
    userId: string,
    espacioId: number,
  ): Promise<InventarioUsuario[]> {
    const results = await this.db
      .select({
        id: inventarioUsuario.id,
        usuarioId: inventarioUsuario.usuarioId,
        espacioId: inventarioUsuario.espacioId,
        equipoId: inventarioUsuario.equipoId,
        cantidad: inventarioUsuario.cantidad,
        pesoMaximoDisponible: inventarioUsuario.pesoMaximoDisponible,
        equipo: {
          id: catalogoEquipamiento.id,
          nombre: catalogoEquipamiento.nombre,
          imagenUrl: catalogoEquipamiento.imagenUrl,
        },
      })
      .from(inventarioUsuario)
      .leftJoin(
        catalogoEquipamiento,
        eq(inventarioUsuario.equipoId, catalogoEquipamiento.id),
      )
      .where(
        and(
          eq(inventarioUsuario.usuarioId, userId),
          eq(inventarioUsuario.espacioId, espacioId),
        ),
      );
    return results as unknown as InventarioUsuario[];
  }

  async crear(data: {
    equipoId: number;
    cantidad: number;
    espacioId: number;
    usuarioId: string;
  }): Promise<InventarioUsuario> {
    const results = await this.db
      .insert(inventarioUsuario)
      .values({
        equipoId: data.equipoId,
        cantidad: data.cantidad,
        espacioId: data.espacioId,
        usuarioId: data.usuarioId,
      })
      .returning();
    return results[0] as unknown as InventarioUsuario;
  }

  async actualizar(
    id: number,
    userId: string,
    data: { equipoId?: number; cantidad?: number },
  ): Promise<InventarioUsuario> {
    const updateData: Record<string, any> = {};
    if (data.equipoId !== undefined) updateData.equipoId = data.equipoId;
    if (data.cantidad !== undefined) updateData.cantidad = data.cantidad;

    const results = await this.db
      .update(inventarioUsuario)
      .set(updateData)
      .where(
        and(
          eq(inventarioUsuario.id, id),
          eq(inventarioUsuario.usuarioId, userId),
        ),
      )
      .returning();
    return results[0] as unknown as InventarioUsuario;
  }

  async eliminar(id: number, userId: string): Promise<void> {
    await this.db
      .delete(inventarioUsuario)
      .where(
        and(
          eq(inventarioUsuario.id, id),
          eq(inventarioUsuario.usuarioId, userId),
        ),
      );
  }
}
