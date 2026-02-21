import { supabase } from "../db/supabase.js";
import type { Espacio } from "../domain/types.js";
import type { IEspacioRepository } from "../domain/repositories.js";

export class EspacioRepository implements IEspacioRepository {
  async obtenerPorUsuario(userId: string): Promise<Espacio[]> {
    const { data, error } = await supabase
      .from("espacios")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return (data ?? []) as Espacio[];
  }

  async crear(data: { nombre: string; user_id: string }): Promise<Espacio> {
    const { data: created, error } = await supabase
      .from("espacios")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as Espacio;
  }
}
