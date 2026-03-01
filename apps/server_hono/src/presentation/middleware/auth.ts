// ============================================================
// PRESENTATION — Auth Middleware (valida JWT, setea userId en context)
// ============================================================

import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../types/env.js";
import { verifyToken } from "../../infrastructure/auth/jwt.js";

/**
 * Middleware que requiere autenticación.
 * Extrae el Bearer token, lo verifica, y setea userId/userEmail en el contexto.
 */
export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No authorization token provided" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    c.set("userId", payload.sub);
    c.set("userEmail", payload.email);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});
