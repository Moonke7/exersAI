// ============================================================
// DOMAIN SERVICE — IAIService (contrato para la IA)
// ============================================================

export interface GeneratedRoutine {
  routine: {
    exercise_id: number;
    nombre: string;
    orden?: number;
    series: number;
    repeticiones: string;
    descanso_segundos: number;
    notas?: string;
  }[];
  recomendaciones_generales: string;
  nivel_detectado?: string;
}

export interface IAIService {
  generateRoutine(
    candidatos: Record<string, any[]>,
    level: string,
    goal: string,
  ): Promise<GeneratedRoutine>;
}
