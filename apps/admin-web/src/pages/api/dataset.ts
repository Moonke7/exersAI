import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { datasetEntrenamientoIa } from "@exersai/shared/db/schema";
import { desc } from "drizzle-orm";

export const GET: APIRoute = async ({ locals }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }

    const db = drizzle(d1Binding);
    const result = await db
      .select()
      .from(datasetEntrenamientoIa)
      .orderBy(desc(datasetEntrenamientoIa.createdAt))
      .all();

    return new Response(JSON.stringify({ dataset: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching dataset:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor al obtener dataset.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
