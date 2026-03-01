// ============================================================
// USE CASE — Register (crear cuenta)
// ============================================================

import type { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository.js";
import type { UsuarioPublico } from "../../domain/entities/usuario.js";
import {
  ValidationError,
  ConflictError,
} from "../../domain/errors/domain-errors.js";
import { hashPassword } from "../../infrastructure/auth/password.js";
import { signToken } from "../../infrastructure/auth/jwt.js";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  meta?: string;
}

interface RegisterResult {
  user: UsuarioPublico;
  token: string;
}

export class RegisterUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly jwtSecret: string,
  ) {}

  async ejecutar(input: RegisterInput): Promise<RegisterResult> {
    // Validaciones
    if (!input.email || !input.password || !input.username) {
      throw new ValidationError("Email, password y username son obligatorios");
    }
    if (input.password.length < 6) {
      throw new ValidationError(
        "La contraseña debe tener al menos 6 caracteres",
      );
    }

    // Verificar duplicados
    const existingEmail = await this.usuarioRepo.buscarPorEmail(input.email);
    if (existingEmail) {
      throw new ConflictError("Ya existe un usuario con ese email");
    }

    const existingUsername = await this.usuarioRepo.buscarPorUsername(
      input.username,
    );
    if (existingUsername) {
      throw new ConflictError("Ya existe un usuario con ese username");
    }

    // Hashear password
    const hashedPassword = await hashPassword(input.password);

    // Crear usuario
    const id = crypto.randomUUID();
    const usuario = await this.usuarioRepo.crear({
      id,
      username: input.username,
      email: input.email,
      password: hashedPassword,
      meta: input.meta,
    });

    // Generar token
    const token = await signToken(
      { sub: usuario.id, email: usuario.email },
      this.jwtSecret,
    );

    // Retornar sin password
    const { password: _, ...publicUser } = usuario;
    return { user: publicUser, token };
  }
}
