CREATE TABLE `sugerencias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text NOT NULL,
	`nombre` text NOT NULL,
	`image_url` text,
	`ids_asociados` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
