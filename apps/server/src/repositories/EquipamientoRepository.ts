import { supabase } from "../db/supabase.js";
import type {
  CatalogoEquipamiento,
  InventarioUsuario,
} from "../domain/types.js";
import type { IEquipamientoRepository } from "../domain/repositories.js";

export class EquipamientoRepository implements IEquipamientoRepository {
  async obtenerCatalogo(): Promise<CatalogoEquipamiento[]> {
    const { data, error } = await supabase
      .from("catalogo_equipamiento")
      .select("*");
    if (error) throw error;
    return (data ?? []) as CatalogoEquipamiento[];
  }

  async obtenerInventarioDeEspacio(
    userId: string,
    espacioId: number,
  ): Promise<InventarioUsuario[]> {
    const { data, error } = await supabase
      .from("inventario_usuario")
      .select(
        `
        *,
        equipos:equipo_id (
          id,
          nombre,
          imagen_url
        )
      `,
      )
      .eq("espacio_id", espacioId)
      .eq("usuario_id", userId);

    if (error) throw error;
    return (data ?? []) as InventarioUsuario[];
  }

  async crear(data: {
    equipo_id: number;
    cantidad: number;
    espacio_id: number;
    usuario_id: string;
  }): Promise<InventarioUsuario> {
    const { data: created, error } = await supabase
      .from("inventario_usuario")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as InventarioUsuario;
  }

  async actualizar(
    id: number,
    userId: string,
    data: { equipo_id?: number; cantidad?: number },
  ): Promise<InventarioUsuario> {
    const { data: updated, error } = await supabase
      .from("inventario_usuario")
      .update(data)
      .eq("id", id)
      .eq("usuario_id", userId)
      .select()
      .single();

    if (error) throw error;
    return updated as InventarioUsuario;
  }

  async eliminar(id: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from("inventario_usuario")
      .delete()
      .eq("id", id)
      .eq("usuario_id", userId);

    if (error) throw error;
  }
}
