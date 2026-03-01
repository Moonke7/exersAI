// ============================================================
// DOMAIN ENTITY — Equipamiento (Catálogo + Inventario)
// ============================================================

export interface CatalogoEquipamiento {
  id: number;
  nombre: string;
  imagenUrl?: string | null;
  gruposMusculares?: string[] | null;
  esPesoCorporal?: boolean | null;
  createdAt?: string | null;
}

export interface InventarioUsuario {
  id: number;
  usuarioId: string;
  espacioId: number;
  equipoId: number;
  cantidad?: number | null;
  pesoMaximoDisponible?: string | null;
  equipo?: CatalogoEquipamiento | null;
}
