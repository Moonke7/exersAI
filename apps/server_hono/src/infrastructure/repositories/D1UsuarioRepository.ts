// ============================================================
// INFRASTRUCTURE — D1UsuarioRepository
// ============================================================

import { eq } from "@exersai/shared/db";
import type { DrizzleDB } from "../db/drizzle.js";
import { usuarios } from "../db/schema.js";
import type { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository.js";
import type { Usuario } from "../../domain/entities/usuario.js";

export class D1UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly db: DrizzleDB) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const results = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);
    return (results[0] as Usuario) ?? null;
  }

  async buscarPorUsername(username: string): Promise<Usuario | null> {
    const results = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.username, username))
      .limit(1);
    return (results[0] as Usuario) ?? null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const results = await this.db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id))
      .limit(1);
    return (results[0] as Usuario) ?? null;
  }

  async crear(data: {
    id: string;
    username: string;
    email: string;
    password: string;
    meta?: string;
  }): Promise<Usuario> {
    const results = await this.db
      .insert(usuarios)
      .values({
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        meta: data.meta ?? null,
      })
      .returning();
    return results[0] as Usuario;
  }
}
