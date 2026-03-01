import type { Espacio } from "../domain/types.js";
import type { IEspacioRepository } from "../domain/repositories.js";
import { SupabaseClient } from "@supabase/supabase-js";

export class EspacioRepository implements IEspacioRepository {
  private readonly supabase;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async obtenerPorUsuario(userId: string): Promise<Espacio[]> {
    const { data, error } = await this.supabase
      .from("espacios")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return (data ?? []) as Espacio[];
  }

  async crear(data: { nombre: string; user_id: string }): Promise<Espacio> {
    const { data: created, error } = await this.supabase
      .from("espacios")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as Espacio;
  }
}
