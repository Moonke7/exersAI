import type {
  Rutina,
  RutinaConEjercicios,
  RutinaEjercicio,
} from "../domain/types.js";
import type { IRutinaRepository } from "../domain/repositories.js";
import { SupabaseClient } from "@supabase/supabase-js";

export class RutinaRepository implements IRutinaRepository {
  private readonly supabase;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async crear(data: {
    usuario_id: string;
    nombre: string;
    objetivo?: string;
  }): Promise<Rutina> {
    const { data: rutina, error } = await this.supabase
      .from("rutinas")
      .insert({
        usuario_id: data.usuario_id,
        nombre: data.nombre,
        objetivo: data.objetivo || null,
      })
      .select()
      .single();

    if (error) throw error;
    return rutina as Rutina;
  }

  async obtenerPorId(id: number): Promise<RutinaConEjercicios | null> {
    const { data, error } = await this.supabase
      .from("rutinas")
      .select(
        `
        *,
        ejercicios:rutina_ejercicios(
          *,
          ejercicio:ejercicios(*)
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data as RutinaConEjercicios;
  }

  async obtenerBiblioteca(userId: string): Promise<RutinaConEjercicios[]> {
    const { data, error } = await this.supabase
      .from("rutinas")
      .select(
        `
        *,
        ejercicios:rutina_ejercicios(
          *,
          ejercicio:ejercicios(*)
        )
      `,
      )
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as RutinaConEjercicios[];
  }

  async actualizar(
    id: number,
    data: { nombre: string; objetivo?: string },
  ): Promise<Rutina> {
    const { data: updated, error } = await this.supabase
      .from("rutinas")
      .update({
        nombre: data.nombre,
        objetivo: data.objetivo || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated as Rutina;
  }

  async eliminar(id: number): Promise<void> {
    // 1. Eliminar ejercicios de la rutina
    const { error: ejerciciosError } = await this.supabase
      .from("rutina_ejercicios")
      .delete()
      .eq("rutina_id", id);
    if (ejerciciosError) throw ejerciciosError;

    // 2. Eliminar de la agenda
    const { error: agendaError } = await this.supabase
      .from("agenda_semanal")
      .delete()
      .eq("rutina_id", id);
    if (agendaError) throw agendaError;

    // 3. Eliminar la rutina
    const { error } = await this.supabase.from("rutinas").delete().eq("id", id);
    if (error) throw error;
  }

  async agregarEjercicios(
    ejercicios: Omit<RutinaEjercicio, "id" | "ejercicio">[],
  ): Promise<RutinaEjercicio[]> {
    const { data, error } = await this.supabase
      .from("rutina_ejercicios")
      .insert(ejercicios)
      .select();

    if (error) throw error;
    return (data ?? []) as RutinaEjercicio[];
  }

  async actualizarEjercicio(
    rutinaId: number,
    ejercicioId: number,
    data: Partial<
      Pick<
        RutinaEjercicio,
        | "series"
        | "repeticiones"
        | "tiempo_descanso_segundos"
        | "notas_ia"
        | "orden"
      >
    >,
  ): Promise<RutinaEjercicio> {
    const { data: updated, error } = await this.supabase
      .from("rutina_ejercicios")
      .update(data)
      .eq("rutina_id", rutinaId)
      .eq("id", ejercicioId)
      .select()
      .single();

    if (error) throw error;
    return updated as RutinaEjercicio;
  }

  async eliminarEjercicio(
    rutinaId: number,
    ejercicioId: number,
  ): Promise<void> {
    const { error } = await this.supabase
      .from("rutina_ejercicios")
      .delete()
      .eq("rutina_id", rutinaId)
      .eq("id", ejercicioId);

    if (error) throw error;
  }
}
