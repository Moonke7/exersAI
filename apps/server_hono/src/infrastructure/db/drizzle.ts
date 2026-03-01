// ============================================================
// INFRASTRUCTURE — Drizzle D1 Factory
// ============================================================

import { drizzleD1 as drizzle } from "@exersai/shared/db";
import * as schema from "@exersai/shared/db";

export type DrizzleDB = ReturnType<typeof createDb>;

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}
