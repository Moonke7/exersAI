// ============================================================
// DOMAIN ENTITY — Usuario
// ============================================================

export interface Usuario {
  id: string;
  username: string;
  email: string;
  password: string;
  meta?: string | null; // 'hipertrofia', 'fuerza', 'resistencia'
  createdAt?: string | null;
}

export type UsuarioPublico = Omit<Usuario, "password">;
