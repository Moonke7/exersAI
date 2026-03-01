// ============================================================
// ENTRY POINT — Hono Server con Clean Architecture
// ============================================================
// Este archivo es el único que conoce TODAS las capas.
// Aquí se hace el Dependency Injection (DI) por request.

import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "./presentation/types/env.js";
import { DomainError } from "./domain/errors/domain-errors.js";

// Infrastructure
import { createDb } from "./infrastructure/db/drizzle.js";
import { D1UsuarioRepository } from "./infrastructure/repositories/D1UsuarioRepository.js";
import { D1EjercicioRepository } from "./infrastructure/repositories/D1EjercicioRepository.js";
import { D1RutinaRepository } from "./infrastructure/repositories/D1RutinaRepository.js";
import { D1EspacioRepository } from "./infrastructure/repositories/D1EspacioRepository.js";
import { D1EquipamientoRepository } from "./infrastructure/repositories/D1EquipamientoRepository.js";
import { D1AgendaRepository } from "./infrastructure/repositories/D1AgendaRepository.js";
import { DeepSeekAIService } from "./infrastructure/services/DeepSeekAIService.js";

// Application (Use Cases)
import { RegisterUseCase } from "./application/auth/RegisterUseCase.js";
import { LoginUseCase } from "./application/auth/LoginUseCase.js";
import { ObtenerEjerciciosUseCase } from "./application/ejercicios/ObtenerEjerciciosUseCase.js";
import { CrearRutinaUseCase } from "./application/rutinas/CrearRutinaUseCase.js";
import { ObtenerBibliotecaUseCase } from "./application/rutinas/ObtenerBibliotecaUseCase.js";
import { GestionRutinaUseCase } from "./application/rutinas/GestionRutinaUseCase.js";
import { AgendaSemanalUseCase } from "./application/agenda/AgendaSemanalUseCase.js";
import { EspaciosUseCase } from "./application/espacios/EspaciosUseCase.js";
import { EquipamientoUseCase } from "./application/equipamiento/EquipamientoUseCase.js";

// Presentation (Routes)
import authRoutes from "./presentation/routes/auth.routes.js";
import ejerciciosRoutes from "./presentation/routes/ejercicios.routes.js";
import rutinasRoutes from "./presentation/routes/rutinas.routes.js";
import espaciosRoutes from "./presentation/routes/espacios.routes.js";
import equipamientoRoutes from "./presentation/routes/equipamiento.routes.js";

// ============================================================
// App
// ============================================================

const app = new Hono<AppEnv>();

// --- Global Middleware ---
app.use("*", cors());

// --- Dependency Injection Middleware ---
// En Cloudflare Workers el binding D1 solo existe dentro del request context,
// por lo que la inyección se hace POR REQUEST, no como singleton global.
app.use("/api/*", async (c, next) => {
  const db = createDb(c.env.DB);

  // Repositories
  const usuarioRepo = new D1UsuarioRepository(db);
  const ejercicioRepo = new D1EjercicioRepository(db);
  const rutinaRepo = new D1RutinaRepository(db);
  const espacioRepo = new D1EspacioRepository(db);
  const equipamientoRepo = new D1EquipamientoRepository(db);
  const agendaRepo = new D1AgendaRepository(db);

  // External Services
  const aiService = new DeepSeekAIService(c.env.DEEPSEEK_API_KEY);

  // Use Cases
  c.set("registerUseCase", new RegisterUseCase(usuarioRepo, c.env.JWT_SECRET));
  c.set("loginUseCase", new LoginUseCase(usuarioRepo, c.env.JWT_SECRET));
  c.set(
    "obtenerEjerciciosUseCase",
    new ObtenerEjerciciosUseCase(ejercicioRepo),
  );
  c.set(
    "crearRutinaUseCase",
    new CrearRutinaUseCase(
      rutinaRepo,
      ejercicioRepo,
      equipamientoRepo,
      aiService,
    ),
  );
  c.set("obtenerBibliotecaUseCase", new ObtenerBibliotecaUseCase(rutinaRepo));
  c.set("gestionRutinaUseCase", new GestionRutinaUseCase(rutinaRepo));
  c.set("agendaSemanalUseCase", new AgendaSemanalUseCase(agendaRepo));
  c.set("espaciosUseCase", new EspaciosUseCase(espacioRepo));
  c.set("equipamientoUseCase", new EquipamientoUseCase(equipamientoRepo));

  // Repos directos (para /auth/me y /ejercicios/catalogo-equipamiento)
  c.set("equipamientoRepo", equipamientoRepo);
  c.set("usuarioRepo", usuarioRepo);

  await next();
});

// --- Routes ---
app.route("/api/auth", authRoutes);
app.route("/api/ejercicios", ejerciciosRoutes);
app.route("/api/rutinas", rutinasRoutes);
app.route("/api/espacios", espaciosRoutes);
app.route("/api/equipamiento", equipamientoRoutes);

// --- Health Check ---
app.get("/health", (c) => {
  return c.json({ status: "ok", message: "Server is running" });
});

// --- 404 Handler ---
app.notFound((c) => {
  return c.json({ error: "Route not found" }, 404);
});

// --- Global Error Handler ---
app.onError((err, c) => {
  console.error(err);

  if (err instanceof DomainError) {
    return c.json({ error: err.message }, err.statusCode as any);
  }

  return c.json({ error: "Internal server error" }, 500);
});

export default app;
