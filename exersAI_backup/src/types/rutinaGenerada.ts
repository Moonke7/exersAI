export interface RutinaGenerada {
  success: boolean;
  rutina_id?: number;
  rutina_nombre?: string;
  routine: {
    routine: {
      [key: string]: {
        exercise_id: number;
        nombre: string;
        series: number;
        repeticiones: string;
        descanso_segundos: number;
        notas: string;
      }[];
    };
  };
}
