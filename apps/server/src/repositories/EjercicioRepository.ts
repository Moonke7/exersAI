import { supabase } from "../db/supabase.js";
import type { Ejercicio } from "../domain/types.js";
import type { IEjercicioRepository } from "../domain/repositories.js";

export class EjercicioRepository implements IEjercicioRepository {
  async obtenerTodos(filtros?: {
    muscle?: string;
    difficulty?: string;
  }): Promise<Ejercicio[]> {
    let query = supabase.from("ejercicios").select("*");

    if (filtros?.muscle) {
      query = query.contains("grupos_musculares", [filtros.muscle]);
    }
    if (filtros?.difficulty) {
      query = query.eq("difficulty", filtros.difficulty);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Ejercicio[];
  }

  async obtenerPorId(id: number): Promise<Ejercicio | null> {
    const { data, error } = await supabase
      .from("ejercicios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Ejercicio;
  }

  async obtenerPorMusculo(musculo: string): Promise<Ejercicio[]> {
    const { data, error } = await supabase
      .from("ejercicios")
      .select("*")
      .contains("grupos_musculares", [musculo]);

    if (error) throw error;
    return (data ?? []) as Ejercicio[];
  }
}
