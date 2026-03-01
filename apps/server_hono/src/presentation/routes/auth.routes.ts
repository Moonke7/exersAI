// ============================================================
// ROUTES — Auth (register, login, me)
// ============================================================

import { Hono } from "hono";
import type { AppEnv } from "../types/env.js";
import { authMiddleware } from "../middleware/auth.js";

const auth = new Hono<AppEnv>();

/**
 * POST /api/auth/register
 */
auth.post("/register", async (c) => {
  try {
    const { email, password, username, meta } = await c.req.json();
    const registerUseCase = c.get("registerUseCase");
    const result = await registerUseCase.ejecutar({
      email,
      password,
      username,
      meta,
    });
    return c.json(
      {
        message: "User created successfully",
        user: result.user,
        token: result.token,
      },
      201,
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json({ error: error.message }, status);
  }
});

/**
 * POST /api/auth/login
 */
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const loginUseCase = c.get("loginUseCase");
    const result = await loginUseCase.ejecutar({ email, password });
    return c.json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return c.json({ error: error.message }, status);
  }
});

/**
 * GET /api/auth/me — requiere token
 */
auth.get("/me", authMiddleware, async (c) => {
  try {
    const userId = c.get("userId");
    const usuarioRepo = c.get("usuarioRepo");
    const usuario = await usuarioRepo.buscarPorId(userId);
    if (!usuario) {
      return c.json({ error: "User not found" }, 404);
    }
    const { password: _, ...publicUser } = usuario;
    return c.json({ user: publicUser });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default auth;
