// ============================================================
// DOMAIN ENTITY — Rutina, RutinaEjercicio, RutinaConEjercicios
// ============================================================

import type { Ejercicio } from "./ejercicio.js";

export interface Rutina {
  id: number;
  usuarioId: string;
  nombre: string;
  descripcion?: string | null;
  objetivo?: string | null;
  esPublica?: boolean | null;
  createdAt?: string;
}

export interface RutinaEjercicio {
  id: number;
  rutinaId: number;
  ejercicioId: number;
  orden: number;
  series?: number | null;
  repeticiones?: string | null;
  pesoSugerido?: string | null;
  tiempoDescansoSegundos?: number | null;
  notasIa?: string | null;
  ejercicio?: Ejercicio | null;
}

export type RutinaConEjercicios = Rutina & {
  ejercicios: RutinaEjercicio[];
};
