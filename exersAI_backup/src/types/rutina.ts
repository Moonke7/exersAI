export interface Rutina {
  id: number;
  usuario_id: string;
  nombre: string;
  objetivo?: string;
  created_at: string;
  updated_at?: string;
}

export interface RutinaEjercicio {
  id: number;
  rutina_id: number;
  ejercicio_id: string;
  series: number;
  repeticiones: string;
  peso_sugerido?: number;
  tiempo_descanso_segundos?: number;
  notas_ia?: string;
  orden?: number;
  created_at: string;
  ejercicio?: {
    nombre: string;
    imagen_url?: string;
    video_url?: string;
    grupos_musculares?: string[];
  };
}

export interface AgendaSemanal {
  id: number;
  usuario_id: string;
  dia_semana: number; // 1-7 (Lunes-Domingo)
  rutina_id: number;
  created_at: string;
  updated_at?: string;
}

// Para vistas combinadas
export interface RutinaConEjercicios extends Rutina {
  ejercicios: RutinaEjercicio[];
}

export interface AgendaConRutina extends AgendaSemanal {
  rutina: RutinaConEjercicios;
}
