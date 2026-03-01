import type { AgendaSemanal } from "../domain/types.js";
import type { IAgendaRepository } from "../domain/repositories.js";
import { SupabaseClient } from "@supabase/supabase-js";

export class AgendaRepository implements IAgendaRepository {
  private readonly supabase;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async obtenerPorUsuario(userId: string): Promise<AgendaSemanal[]> {
    const { data, error } = await this.supabase
      .from("agenda_semanal")
      .select(
        `
        *,
        rutina:rutinas(
          *,
          ejercicios:rutina_ejercicios(*)
        )
      `,
      )
      .eq("usuario_id", userId)
      .order("dia_semana", { ascending: true });

    if (error) throw error;
    return (data ?? []) as AgendaSemanal[];
  }

  async obtenerPorDia(
    userId: string,
    diaSemana: number,
  ): Promise<AgendaSemanal | null> {
    const { data, error } = await this.supabase
      .from("agenda_semanal")
      .select("*")
      .eq("usuario_id", userId)
      .eq("dia_semana", diaSemana);

    if (error) throw error;
    return data && data.length > 0 ? (data[0] as AgendaSemanal) : null;
  }

  async asignar(data: {
    usuario_id: string;
    dia_semana: number;
    rutina_id: number;
  }): Promise<AgendaSemanal> {
    const { data: created, error } = await this.supabase
      .from("agenda_semanal")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as AgendaSemanal;
  }

  async actualizar(id: number, rutinaId: number): Promise<AgendaSemanal> {
    const { data, error } = await this.supabase
      .from("agenda_semanal")
      .update({ rutina_id: rutinaId, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as AgendaSemanal;
  }

  async eliminar(id: number): Promise<void> {
    const { error } = await this.supabase
      .from("agenda_semanal")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async eliminarPorRutina(rutinaId: number): Promise<void> {
    const { error } = await this.supabase
      .from("agenda_semanal")
      .delete()
      .eq("rutina_id", rutinaId);
    if (error) throw error;
  }
}
