// ============================================================
// DOMAIN ENTITY — Ejercicio
// ============================================================

export interface Ejercicio {
  id: number;
  nombre: string;
  gruposMusculares?: string[] | null;
  instrucciones?: string | null;
  videoUrl?: string | null;
  createdAt?: string | null;
  equipamientoIds?: number[] | null;
  patron?: string | null;
  dificultad?: number | null; // 1 a 5
  grupoPrincipal?: string | null;
  destacado?: boolean | null;
}
