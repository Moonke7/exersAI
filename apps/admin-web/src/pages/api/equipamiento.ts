import type { APIRoute } from "astro";
import { createSupabaseClient } from "@exersai/shared/db/supabase";
import { env } from "cloudflare:workers";

export const GET: APIRoute = async () => {
  try {
    const supabaseUrl = await env.SUPABASE_URL.get();
    const supabaseKey = await env.SUPABASE_KEY.get();

    console.log(supabaseUrl);
    console.log(supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase env vars" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const supabase = createSupabaseClient({ supabaseUrl, supabaseKey });

    const { data: equipamiento, error } = await supabase
      .from("catalogo_equipamiento")
      .select("id, nombre, imagen_url, grupos_musculares, es_peso_corporal")
      .order("nombre");

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch equipment",
          details: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ equipamiento }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Unexpected error fetching equipment:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
