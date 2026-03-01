CREATE TABLE `dataset_entrenamiento_ia` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`system_prompt` text NOT NULL,
	`user_prompt` text NOT NULL,
	`respuesta_original` text NOT NULL,
	`respuesta_corregida` text,
	`nivel_usuario` text,
	`objetivo` text,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`notas_revision` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
