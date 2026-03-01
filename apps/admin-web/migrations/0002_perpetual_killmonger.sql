CREATE TABLE `entrenamiento_perfiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`nombre` text NOT NULL,
	`nivel_usuario` text NOT NULL,
	`peso` integer NOT NULL,
	`altura` integer NOT NULL,
	`edad` integer NOT NULL,
	`sexo` text NOT NULL,
	`objetivo` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);
