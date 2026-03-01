// ============================================================
// REPOSITORY INTERFACE — IUsuarioRepository
// ============================================================

import type { Usuario } from "../entities/usuario.js";

export interface IUsuarioRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorUsername(username: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
  crear(data: {
    id: string;
    username: string;
    email: string;
    password: string;
    meta?: string;
  }): Promise<Usuario>;
}
