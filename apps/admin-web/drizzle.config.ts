import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "../../packages/shared/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
});
