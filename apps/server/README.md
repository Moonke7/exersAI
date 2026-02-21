# ExersAI Server

Servidor Express para la aplicación ExersAI.

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Configura las variables de entorno en el archivo `.env`.

## Scripts

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila el código TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción

## Estructura del Proyecto

```
server/
├── src/
│   ├── index.ts              # Punto de entrada del servidor
│   └── routes/               # Carpeta de rutas
│       └── exercises/        # Rutas de ejercicios
│           └── routes.ts     # Endpoints de ejercicios
├── dist/                     # Código compilado (generado)
├── .env                      # Variables de entorno (no versionado)
├── .env.example             # Ejemplo de variables de entorno
├── package.json             # Dependencias y scripts
└── tsconfig.json            # Configuración de TypeScript
```

## API Endpoints

### Exercises

- `GET /api/exercises/all-equipment` - Obtiene todo el equipamiento del catálogo
- `POST /api/exercises/crear-rutina` - **NUEVO**: Crea una rutina personalizada con IA
  - Body: `{ goal: string, muscles: string[], level: string }`
  - Usa Gemini AI para seleccionar ejercicios óptimos por grupo muscular
- `GET /api/exercises` - Obtiene todos los ejercicios (con filtros opcionales)
  - Query params: `?muscle=pecho&difficulty=intermediate`
- `GET /api/exercises/:id` - Obtiene un ejercicio específico

### Health Check

- `GET /health` - Verifica el estado del servidor

## Integración con IA

El endpoint `/crear-rutina` utiliza **Gemini 2.0 Flash** para:

1. Analizar ejercicios candidatos de la base de datos
2. Seleccionar los 4 mejores ejercicios por grupo muscular
3. Personalizar series, repeticiones y descansos según nivel y objetivo
4. Generar recomendaciones específicas

Ver `USAGE_EXAMPLE.md` para ejemplos de uso detallados.
