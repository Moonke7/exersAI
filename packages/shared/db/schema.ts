import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Usuarios (Autenticación propia)
export const usuarios = sqliteTable("usuarios", {
  // Los UUIDs se deben generar en la aplicación (ej. crypto.randomUUID())
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  meta: text("meta"), // 'hipertrofia', 'fuerza', 'resistencia'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 2. Tablas de la aplicación
export const espacios = sqliteTable("espacios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  userId: text("user_id").references(() => usuarios.id),
});

export const catalogoEquipamiento = sqliteTable("catalogo_equipamiento", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  imagenUrl: text("imagen_url"),
  // Guardamos los arrays como strings JSON estructurados
  gruposMusculares: text("grupos_musculares", { mode: "json" }).$type<
    string[]
  >(),
  esPesoCorporal: integer("es_peso_corporal", { mode: "boolean" }).default(
    false,
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const inventarioUsuario = sqliteTable("inventario_usuario", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  espacioId: integer("espacio_id")
    .notNull()
    .references(() => espacios.id),
  equipoId: integer("equipo_id")
    .notNull()
    .references(() => catalogoEquipamiento.id),
  cantidad: integer("cantidad").default(1),
  pesoMaximoDisponible: text("peso_maximo_disponible"),
});

export const ejercicios = sqliteTable("ejercicios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  gruposMusculares: text("grupos_musculares", { mode: "json" }).$type<
    string[]
  >(),
  instrucciones: text("instrucciones"),
  videoUrl: text("video_url"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  equipamientoIds: text("equipamiento_ids", { mode: "json" }).$type<number[]>(),
  patron: text("patron"),
  dificultad: integer("dificultad"), // 1 a 5
  grupoPrincipal: text("grupo_principal"),
  destacado: integer("destacado", { mode: "boolean" }).default(false),
});

export const rutinas = sqliteTable("rutinas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  objetivo: text("objetivo"),
  esPublica: integer("es_publica", { mode: "boolean" }).default(false),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const rutinaEjercicios = sqliteTable("rutina_ejercicios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rutinaId: integer("rutina_id")
    .notNull()
    .references(() => rutinas.id),
  ejercicioId: integer("ejercicio_id")
    .notNull()
    .references(() => ejercicios.id),
  orden: integer("orden").notNull(),
  series: integer("series").default(3),
  repeticiones: text("repeticiones"),
  pesoSugerido: text("peso_sugerido"),
  tiempoDescansoSegundos: integer("tiempo_descanso_segundos").default(60),
  notasIa: text("notas_ia"),
});

export const agendaSemanal = sqliteTable("agenda_semanal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  diaSemana: integer("dia_semana").notNull(), // 1 a 7
  rutinaId: integer("rutina_id").references(() => rutinas.id),
  updatedAt: text("updated_at"),
});

// 3. Tablas para el entrenamiento de la IA (Fine-Tuning)

export const datasetEntrenamientoIa = sqliteTable("dataset_entrenamiento_ia", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Entradas (El contexto exacto que vio la IA en ese momento)
  systemPrompt: text("system_prompt").notNull(),
  userPrompt: text("user_prompt").notNull(),

  // Salidas
  respuestaOriginal: text("respuesta_original").notNull(), // El JSON crudo que devolvió DeepSeek
  respuestaCorregida: text("respuesta_corregida"), // El JSON perfecto tras tu revisión en la UI

  // Metadatos útiles para filtrar en tu Dashboard de revisión
  nivelUsuario: text("nivel_usuario"), // ej: 'Principiante'
  objetivo: text("objetivo"), // ej: 'Hipertrofia'

  // Flujo de trabajo
  estado: text("estado", { enum: ["pendiente", "aprobado", "rechazado"] })
    .default("pendiente")
    .notNull(),
  notasRevision: text("notas_revision"), // Por si quieres dejarte un comentario de por qué lo rechazaste

  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const entrenamientoPerfiles = sqliteTable("entrenamiento_perfiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  nombre: text("nombre").notNull(),
  nivelUsuario: text("nivel_usuario").notNull(),
  peso: integer("peso").notNull(),
  altura: integer("altura").notNull(),
  edad: integer("edad").notNull(),
  sexo: text("sexo").notNull(),
  objetivo: text("objetivo").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const sugerencias = sqliteTable("sugerencias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tipo: text("tipo").notNull(), // 'ejercicio' o 'equipamiento'
  nombre: text("nombre").notNull(),
  imageUrl: text("image_url"),
  idsAsociados: text("ids_asociados", { mode: "json" }).$type<number[]>(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
