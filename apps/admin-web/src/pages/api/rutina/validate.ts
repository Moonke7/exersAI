import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { datasetEntrenamientoIa } from "@exersai/shared/db/schema";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const {
      systemPrompt,
      userPrompt,
      respuestaOriginal,
      respuestaCorregida,
      nivelUsuario,
      objetivo,
      estado,
    } = body;

    if (
      !systemPrompt ||
      !userPrompt ||
      !respuestaOriginal ||
      !respuestaCorregida
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields for validation dataset",
        }),
        { status: 400 },
      );
    }

    console.log("Validando dataset:", body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;

    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }

    const db = drizzle(d1Binding);

    const [insertedRecord] = await db
      .insert(datasetEntrenamientoIa)
      .values({
        systemPrompt,
        userPrompt,
        respuestaOriginal:
          typeof respuestaOriginal === "string"
            ? respuestaOriginal
            : JSON.stringify(respuestaOriginal),
        respuestaCorregida:
          typeof respuestaCorregida === "string"
            ? respuestaCorregida
            : JSON.stringify(respuestaCorregida),
        nivelUsuario,
        objetivo,
        estado,
      })
      .returning();

    return new Response(
      JSON.stringify({ success: true, data: insertedRecord }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Validation saving error:", error);
    return new Response(
      JSON.stringify({
        error: "Save process failed",
        details: error.message || "Unknown error",
      }),
      { status: 500 },
    );
  }
};
