// ============================================================
// REPOSITORY INTERFACES — Contratos que los repositorios deben implementar
// ============================================================

import type {
  Rutina,
  RutinaConEjercicios,
  RutinaEjercicio,
  AgendaSemanal,
  Ejercicio,
  InventarioUsuario,
  CatalogoEquipamiento,
  Espacio,
} from "./types.js";

// ---------- Rutinas ----------

export interface IRutinaRepository {
  crear(data: {
    usuario_id: string;
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
        | "tiempo_descanso_segundos"
        | "notas_ia"
        | "orden"
      >
    >,
  ): Promise<RutinaEjercicio>;

  eliminarEjercicio(rutinaId: number, ejercicioId: number): Promise<void>;
}

// ---------- Agenda Semanal ----------

export interface IAgendaRepository {
  obtenerPorUsuario(userId: string): Promise<AgendaSemanal[]>;

  obtenerPorDia(
    userId: string,
    diaSemana: number,
  ): Promise<AgendaSemanal | null>;

  asignar(data: {
    usuario_id: string;
    dia_semana: number;
    rutina_id: number;
  }): Promise<AgendaSemanal>;

  actualizar(id: number, rutinaId: number): Promise<AgendaSemanal>;

  eliminar(id: number): Promise<void>;

  eliminarPorRutina(rutinaId: number): Promise<void>;
}

// ---------- Ejercicios ----------

export interface IEjercicioRepository {
  obtenerTodos(filtros?: {
    muscle?: string;
    difficulty?: string;
  }): Promise<Ejercicio[]>;

  obtenerPorId(id: number): Promise<Ejercicio | null>;

  obtenerPorMusculo(musculo: string): Promise<Ejercicio[]>;
}

// ---------- Equipamiento ----------

export interface IEquipamientoRepository {
  obtenerCatalogo(): Promise<CatalogoEquipamiento[]>;

  obtenerInventarioDeEspacio(
    userId: string,
    espacioId: number,
  ): Promise<InventarioUsuario[]>;

  crear(data: {
    equipo_id: number;
    cantidad: number;
    espacio_id: number;
    usuario_id: string;
  }): Promise<InventarioUsuario>;

  actualizar(
    id: number,
    userId: string,
    data: { equipo_id?: number; cantidad?: number },
  ): Promise<InventarioUsuario>;

  eliminar(id: number, userId: string): Promise<void>;
}

// ---------- Espacios ----------

export interface IEspacioRepository {
  obtenerPorUsuario(userId: string): Promise<Espacio[]>;

  crear(data: { nombre: string; user_id: string }): Promise<Espacio>;
}
