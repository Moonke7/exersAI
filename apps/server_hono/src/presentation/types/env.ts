// ============================================================
// PRESENTATION — Env Types (Cloudflare Bindings + Hono Variables)
// ============================================================

import type { RegisterUseCase } from "../../application/auth/RegisterUseCase.js";
import type { LoginUseCase } from "../../application/auth/LoginUseCase.js";
import type { ObtenerEjerciciosUseCase } from "../../application/ejercicios/ObtenerEjerciciosUseCase.js";
import type { CrearRutinaUseCase } from "../../application/rutinas/CrearRutinaUseCase.js";
import type { ObtenerBibliotecaUseCase } from "../../application/rutinas/ObtenerBibliotecaUseCase.js";
import type { GestionRutinaUseCase } from "../../application/rutinas/GestionRutinaUseCase.js";
import type { AgendaSemanalUseCase } from "../../application/agenda/AgendaSemanalUseCase.js";
import type { EspaciosUseCase } from "../../application/espacios/EspaciosUseCase.js";
import type { EquipamientoUseCase } from "../../application/equipamiento/EquipamientoUseCase.js";
import type { IEquipamientoRepository } from "../../domain/repositories/IEquipamientoRepository.js";
import type { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository.js";

// Bindings de Cloudflare (vienen del wrangler.jsonc)
export type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  DEEPSEEK_API_KEY: string;
};

// Variables de contexto Hono (inyectadas por el middleware de DI)
export type Variables = {
  // Auth
  userId: string;
  userEmail: string;
  // Use Cases
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  obtenerEjerciciosUseCase: ObtenerEjerciciosUseCase;
  crearRutinaUseCase: CrearRutinaUseCase;
  obtenerBibliotecaUseCase: ObtenerBibliotecaUseCase;
  gestionRutinaUseCase: GestionRutinaUseCase;
  agendaSemanalUseCase: AgendaSemanalUseCase;
  espaciosUseCase: EspaciosUseCase;
  equipamientoUseCase: EquipamientoUseCase;
  // Repositories directos (para casos donde el controller necesita acceso directo)
  equipamientoRepo: IEquipamientoRepository;
  usuarioRepo: IUsuarioRepository;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
