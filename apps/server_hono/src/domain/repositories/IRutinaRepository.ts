// ============================================================
// REPOSITORY INTERFACE — IRutinaRepository
// ============================================================

import type {
  Rutina,
  RutinaConEjercicios,
  RutinaEjercicio,
} from "../entities/rutina.js";

export interface IRutinaRepository {
  crear(data: {
    usuarioId: string;
    nombre: string;
    objetivo?: string;
  }): Promise<Rutina>;

  obtenerPorId(id: number): Promise<RutinaConEjercicios | null>;

  obtenerBiblioteca(userId: string): Promise<RutinaConEjercicios[]>;

  actualizar(
    id: number,
    data: { nombre: string; objetivo?: string },
  ): Promise<Rutina>;

  eliminar(id: number): Promise<void>;

  agregarEjercicios(
    ejercicios: Omit<RutinaEjercicio, "id" | "ejercicio">[],
  ): Promise<RutinaEjercicio[]>;

  actualizarEjercicio(
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
  ): Promise<RutinaEjercicio>;

  eliminarEjercicio(rutinaId: number, ejercicioId: number): Promise<void>;
}
