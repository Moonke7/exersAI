export interface Ejercicio {
  id: number;
  nombre: string;
  orden: number;
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
  nombre: string;
  orden: number;
  grupo_principal: string;
  grupos_musculares: string[];
  dificultad?: string;
  destacado: boolean;
  equipamiento_ids: string[];
}
