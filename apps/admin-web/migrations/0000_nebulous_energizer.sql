CREATE TABLE `agenda_semanal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`dia_semana` integer NOT NULL,
	`rutina_id` integer,
	`updated_at` text,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rutina_id`) REFERENCES `rutinas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `catalogo_equipamiento` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`imagen_url` text,
	`grupos_musculares` text,
	`es_peso_corporal` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalogo_equipamiento_nombre_unique` ON `catalogo_equipamiento` (`nombre`);--> statement-breakpoint
CREATE TABLE `ejercicios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`grupos_musculares` text,
	`instrucciones` text,
	`video_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`equipamiento_ids` text,
	`patron` text,
	`dificultad` integer,
	`grupo_principal` text,
	`destacado` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ejercicios_nombre_unique` ON `ejercicios` (`nombre`);--> statement-breakpoint
CREATE TABLE `espacios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `espacios_nombre_unique` ON `espacios` (`nombre`);--> statement-breakpoint
CREATE TABLE `inventario_usuario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`espacio_id` integer NOT NULL,
	`equipo_id` integer NOT NULL,
	`cantidad` integer DEFAULT 1,
	`peso_maximo_disponible` text,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`espacio_id`) REFERENCES `espacios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipo_id`) REFERENCES `catalogo_equipamiento`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rutina_ejercicios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rutina_id` integer NOT NULL,
	`ejercicio_id` integer NOT NULL,
	`orden` integer NOT NULL,
	`series` integer DEFAULT 3,
	`repeticiones` text,
	`peso_sugerido` text,
	`tiempo_descanso_segundos` integer DEFAULT 60,
	`notas_ia` text,
	FOREIGN KEY (`rutina_id`) REFERENCES `rutinas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rutinas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`objetivo` text,
	`es_publica` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`meta` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_username_unique` ON `usuarios` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);