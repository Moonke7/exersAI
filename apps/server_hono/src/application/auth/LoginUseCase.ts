// ============================================================
// USE CASE — Login
// ============================================================

import type { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository.js";
import type { UsuarioPublico } from "../../domain/entities/usuario.js";
import {
  ValidationError,
  AuthenticationError,
} from "../../domain/errors/domain-errors.js";
import { verifyPassword } from "../../infrastructure/auth/password.js";
import { signToken } from "../../infrastructure/auth/jwt.js";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  user: UsuarioPublico;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly jwtSecret: string,
  ) {}

  async ejecutar(input: LoginInput): Promise<LoginResult> {
    if (!input.email || !input.password) {
      throw new ValidationError("Email y password son obligatorios");
    }

    // Buscar usuario
    const usuario = await this.usuarioRepo.buscarPorEmail(input.email);
    if (!usuario) {
      throw new AuthenticationError("Credenciales inválidas");
    }

    // Verificar password
    const isValid = await verifyPassword(input.password, usuario.password);
    if (!isValid) {
      throw new AuthenticationError("Credenciales inválidas");
    }

    // Generar token
    const token = await signToken(
      { sub: usuario.id, email: usuario.email },
      this.jwtSecret,
    );

    const { password: _, ...publicUser } = usuario;
    return { user: publicUser, token };
  }
}
