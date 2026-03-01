import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { sugerencias } from "@exersai/shared/db/schema";
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
      .from(sugerencias)
      .orderBy(desc(sugerencias.createdAt))
      .all();

    return new Response(JSON.stringify({ sugerencias: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor al obtener sugerencias.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }

    const db = drizzle(d1Binding);
    const body = await request.json();

    const { tipo, nombre, imageUrl, idsAsociados } = body;

    // Validate type
    if (tipo !== "ejercicio" && tipo !== "equipamiento") {
      return new Response(JSON.stringify({ error: "Tipo inválido." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!nombre) {
      return new Response(JSON.stringify({ error: "Nombre es requerido." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const inserted = await db
      .insert(sugerencias)
      .values({
        tipo,
        nombre,
        imageUrl: imageUrl || null,
        idsAsociados: idsAsociados || null,
      })
      .returning();

    return new Response(JSON.stringify({ sugerencia: inserted[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return new Response(
      JSON.stringify({
        error: "Error interno del servidor al crear sugerencia.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
