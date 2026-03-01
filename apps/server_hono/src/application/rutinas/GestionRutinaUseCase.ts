// ============================================================
// USE CASE — Gestión de Rutinas (CRUD + ejercicios internos)
// ============================================================

import type { IRutinaRepository } from "../../domain/repositories/IRutinaRepository.js";
import type { Rutina, RutinaEjercicio } from "../../domain/entities/rutina.js";
import { ValidationError } from "../../domain/errors/domain-errors.js";

export class GestionRutinaUseCase {
  constructor(private readonly rutinaRepo: IRutinaRepository) {}

  async crear(data: {
    usuarioId: string;
    nombre: string;
    objetivo?: string;
  }): Promise<Rutina> {
    if (!data.usuarioId || !data.nombre) {
      throw new ValidationError("usuarioId y nombre son obligatorios");
    }
    return this.rutinaRepo.crear(data);
  }

  async actualizar(
    id: number,
    data: { nombre: string; objetivo?: string },
  ): Promise<Rutina> {
    if (!data.nombre) {
      throw new ValidationError("El nombre es obligatorio");
    }
    return this.rutinaRepo.actualizar(id, data);
  }

  async eliminar(id: number): Promise<void> {
    return this.rutinaRepo.eliminar(id);
  }

  async agregarEjercicios(
    rutinaId: number,
    ejercicios: any[],
  ): Promise<RutinaEjercicio[]> {
    if (!ejercicios || !Array.isArray(ejercicios)) {
      throw new ValidationError("Se requiere un array de ejercicios");
    }

    const items = ejercicios.map((ej, index) => ({
      rutinaId,
      ejercicioId: ej.ejercicio_id,
      series: ej.series || 3,
      repeticiones: ej.repeticiones || "10",
      tiempoDescansoSegundos: ej.descanso_segundos || 60,
      notasIa: ej.notas || null,
      orden: ej.orden !== undefined ? ej.orden : index + 1,
    }));

    return this.rutinaRepo.agregarEjercicios(items);
  }

  async actualizarEjercicio(
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
  ): Promise<RutinaEjercicio> {
    return this.rutinaRepo.actualizarEjercicio(rutinaId, ejercicioId, data);
  }

  async eliminarEjercicio(
    rutinaId: number,
    ejercicioId: number,
  ): Promise<void> {
    return this.rutinaRepo.eliminarEjercicio(rutinaId, ejercicioId);
  }
}
