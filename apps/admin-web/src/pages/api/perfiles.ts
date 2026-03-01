import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { entrenamientoPerfiles, usuarios } from "@exersai/shared/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_USER_ID = "admin_test_user";

async function ensureDefaultUser(db: any) {
  const user = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, DEFAULT_USER_ID))
    .all();
  if (user.length === 0) {
    await db.insert(usuarios).values({
      id: DEFAULT_USER_ID,
      username: "admin_test",
      email: "admin@test.com",
      password: "dummy_password",
    });
  }
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }
    const db = drizzle(d1Binding);

    const perfiles = await db.select().from(entrenamientoPerfiles).all();

    const mappedPerfiles = perfiles.map((p) => ({
      id: String(p.id),
      name: p.nombre,
      weight: p.peso,
      height: p.altura,
      age: p.edad,
      gender: p.sexo,
      goal: p.objetivo,
      nivel: p.nivelUsuario,
    }));

    return new Response(JSON.stringify({ profiles: mappedPerfiles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("GET perfiles error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to get profiles",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, weight, height, age, gender, goal, nivel } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }
    const db = drizzle(d1Binding);
    await ensureDefaultUser(db);

    const [inserted] = await db
      .insert(entrenamientoPerfiles)
      .values({
        usuarioId: DEFAULT_USER_ID,
        nombre: name,
        peso: Number(weight),
        altura: Number(height),
        edad: Number(age),
        sexo: gender,
        objetivo: goal,
        nivelUsuario: nivel,
      })
      .returning();

    const newProfile = {
      id: String(inserted.id),
      name: inserted.nombre,
      weight: inserted.peso,
      height: inserted.altura,
      age: inserted.edad,
      gender: inserted.sexo,
      goal: inserted.objetivo,
      nivel: inserted.nivelUsuario,
    };

    return new Response(JSON.stringify({ profile: newProfile }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("POST perfiles error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create profile",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { id, name, weight, height, age, gender, goal, nivel } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id for update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }
    const db = drizzle(d1Binding);

    const [updated] = await db
      .update(entrenamientoPerfiles)
      .set({
        nombre: name,
        peso: Number(weight),
        altura: Number(height),
        edad: Number(age),
        sexo: gender,
        objetivo: goal,
        nivelUsuario: nivel,
      })
      .where(eq(entrenamientoPerfiles.id, Number(id)))
      .returning();

    if (!updated) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedProfile = {
      id: String(updated.id),
      name: updated.nombre,
      weight: updated.peso,
      height: updated.altura,
      age: updated.edad,
      gender: updated.sexo,
      goal: updated.objetivo,
      nivel: updated.nivelUsuario,
    };

    return new Response(JSON.stringify({ profile: updatedProfile }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("PUT perfiles error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update profile",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id for delete" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d1Binding = (locals as any).runtime?.env?.exesai_db;
    if (!d1Binding) {
      throw new Error("Missing D1 Binding (exesai_db) in Cloudflare Context");
    }
    const db = drizzle(d1Binding);

    await db
      .delete(entrenamientoPerfiles)
      .where(eq(entrenamientoPerfiles.id, Number(id)));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DELETE perfiles error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to delete profile",
        details: error.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
