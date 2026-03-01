// ============================================================
// INFRASTRUCTURE — JWT Sign / Verify (usando hono/jwt)
// ============================================================

import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

const DEFAULT_TTL_DAYS = 30;

export interface JwtPayload extends JWTPayload {
  sub: string; // userId
  email: string;
  iat: number;
  exp: number;
}

/**
 * Genera un JWT firmado con el secret proporcionado.
 */
export async function signToken(
  payload: { sub: string; email: string },
  secret: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + DEFAULT_TTL_DAYS * 24 * 60 * 60,
  };
  return sign(fullPayload, secret);
}

/**
 * Verifica y decodifica un JWT. Lanza error si es inválido o expirado.
 */
export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtPayload> {
  const decoded = await verify(token, secret, "HS256");
  return decoded as JwtPayload;
}
