// ============================================================
// DOMAIN TYPES — Tipos centrales del dominio, sin dependencias externas
// ============================================================

// ---------- Ejercicios ----------

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string;
  grupos_musculares: string[];
  grupo_principal: string;
  patron?: string;
  dificultad?: string;
  destacado?: boolean;
  equipamiento_ids: string[];
  imagen_url?: string;
  video_url?: string;
  created_at?: string;
}

export interface EjercicioMinimal {
  id: number;
  name: string;
  muscle: string;
  difficulty?: string;
  is_highlighted: boolean;
  equipment: string[];
}

// ---------- Rutinas ----------

export interface Rutina {
  id: number;
  usuario_id: string;
  nombre: string;
  objetivo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RutinaEjercicio {
  id: number;
  rutina_id: number;
  ejercicio_id: string;
  series: number;
  repeticiones: string;
  tiempo_descanso_segundos: number;
  notas_ia?: string;
  orden: number;
  ejercicio?: Ejercicio;
}

export type RutinaConEjercicios = Rutina & {
  ejercicios: RutinaEjercicio[];
};

// ---------- Agenda Semanal ----------

export interface AgendaSemanal {
  id: number;
  usuario_id: string;
  dia_semana: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado
  rutina_id: number;
  updated_at?: string;
  rutina?: RutinaConEjercicios;
}

// ---------- Espacios ----------

export interface Espacio {
  id: number;
  user_id: string;
  nombre: string;
  created_at?: string;
}

// ---------- Equipamiento ----------

export interface CatalogoEquipamiento {
  id: number;
  nombre: string;
  imagen_url?: string;
}

export interface InventarioUsuario {
  id: number;
  usuario_id: string;
  espacio_id: number;
  equipo_id: number;
  cantidad: number;
  equipos?: CatalogoEquipamiento;
}

// ---------- AI / Generación de Rutinas ----------

export interface AIExercise {
  exercise_id: number;
  nombre: string;
  series: number;
  repeticiones: string;
  descanso_segundos: number;
  notas?: string;
}

export interface AIRoutineGroup {
  group_name: string;
  exercises: AIExercise[];
}

export interface GeneratedRoutine {
  routine: AIRoutineGroup[];
  recomendaciones_generales: string;
  nivel_detectado?: string;
}

// ---------- Parámetros de Use Cases ----------

export interface CrearRutinaParams {
  userId: string;
  espacioId: number;
  goal: string;
  muscles: string[];
  level: string;
  routineName?: string;
}

export interface CrearRutinaResult {
  rutina_id: number;
  rutina_nombre: string;
  routine: GeneratedRoutine;
  candidatos_count: number;
  ejercicios_guardados: number;
}
