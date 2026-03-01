// ============================================================
// Re-export de utilidades de drizzle-orm para consumo centralizado
// ============================================================

// Operadores y funciones de query
export {
  eq,
  and,
  or,
  not,
  asc,
  desc,
  sql,
  inArray,
  like,
  gte,
  lte,
  gt,
  lt,
  between,
  isNull,
  isNotNull,
  count,
  sum,
  avg,
  min,
  max,
} from "drizzle-orm";

// Driver D1 (Cloudflare)
export { drizzle as drizzleD1 } from "drizzle-orm/d1";
