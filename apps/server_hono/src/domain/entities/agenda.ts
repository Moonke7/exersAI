// ============================================================
// DOMAIN ENTITY — Agenda Semanal
// ============================================================

import type { RutinaConEjercicios } from "./rutina.js";

export interface AgendaSemanal {
  id: number;
  usuarioId: string;
  diaSemana: number; // 1=Lunes ... 7=Domingo
  rutinaId?: number | null;
  updatedAt?: string | null;
  rutina?: RutinaConEjercicios | null;
}
