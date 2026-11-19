# ExersAI — servidor y herramientas de administración

ExersAI busca ayudar a las personas a seguir un entrenamiento que se ajuste a sus objetivos y a los recursos que tienen disponibles. Este repositorio contiene componentes del **lado servidor** del proyecto y herramientas web internas; **no contiene la aplicación móvil**.

La app para usuarios está desarrollada con **React Native** y vive en un repositorio separado. Este proyecto proporciona servicios y herramientas que forman parte del ecosistema ExersAI; no incluye el código de esa app.

## Problema y objetivo

Las recomendaciones de entrenamiento no siempre consideran las diferencias entre personas, sus objetivos y el equipamiento al que tienen acceso. Eso puede dificultar encontrar ejercicios que sean prácticos para cada situación.

El objetivo de ExersAI es facilitar la gestión de ejercicios y la generación de rutinas personalizadas, tomando en cuenta factores como el objetivo de entrenamiento, el nivel y el equipamiento disponible. Este repositorio desarrolla parte de la infraestructura de servicios y permite administrar y probar datos relacionados con el producto móvil.

## Estado del proyecto

El repositorio está en desarrollo. El código incluye una API para operaciones de usuarios, ejercicios, rutinas, espacios y equipamiento, así como un panel web de administración para gestionar y revisar datos relacionados con ejercicios y rutinas.

### Incluido en este repositorio

- API Hono preparada para ejecutarse en Cloudflare Workers.
- Acceso a datos mediante Cloudflare D1 y Drizzle ORM.
- Autenticación y operaciones de gestión de rutinas, agenda semanal, espacios y equipamiento.
- Generación de rutinas asistida por IA mediante DeepSeek.
- Panel web de administración hecho con Astro y React para trabajar con catálogos, perfiles de entrenamiento, sugerencias y pruebas de generación.
- Una implementación adicional de servidor Express con Supabase en `apps/server`.

El comando raíz `npm run dev:server` inicia `apps/server_hono`; esa es la ruta de desarrollo configurada como servidor principal desde el `package.json` raíz. La implementación Express también está en el repositorio, por lo que conviene tener presente que existen dos backends con tecnologías y configuraciones diferentes.

### Fuera del alcance de este repositorio

- La aplicación móvil React Native, que se mantiene en otro repositorio.
- Funcionalidades que no están implementadas aquí, como seguimiento de entrenamientos en vivo, nutrición o análisis de postura con cámara.
- La operación o el despliegue de producción: la presencia de código de despliegue no implica que el servicio esté publicado o listo para producción.

No hay una suite de pruebas automatizadas configurada en el script raíz de `npm test` actualmente.

## Componentes y tecnologías

| Componente | Ubicación | Tecnologías principales |
| --- | --- | --- |
| API principal | `apps/server_hono` | Hono, TypeScript, Cloudflare Workers, D1, Drizzle ORM |
| Panel de administración | `apps/admin-web` | Astro, React, TypeScript, Cloudflare |
| Backend alternativo/adicional | `apps/server` | Express, TypeScript, Supabase |
| Código y servicios compartidos | `packages/shared` | Esquemas de base de datos y servicios compartidos |

## Requisitos

- Node.js y npm.
- Para ejecutar la API localmente, Wrangler y la configuración de Cloudflare definida en `apps/server_hono/wrangler.jsonc`.
- Para generar rutinas con IA, acceso y configuración de la credencial de DeepSeek usada por el Worker.

## Desarrollo local

Instala las dependencias desde la raíz del repositorio:

```bash
npm install
```

Inicia la API Hono:

```bash
npm run dev:server
```

Inicia el panel de administración en modo desarrollo:

```bash
npm run dev --workspace=admin-web
```

Astro sirve el panel normalmente en `http://localhost:4321`.

Para aplicar las migraciones de D1 localmente:

```bash
npm run db:migrate:local
```

Los comandos disponibles y los bindings de Cloudflare se definen en `package.json` y `apps/server_hono/wrangler.jsonc`. La generación de rutinas requiere que la credencial de DeepSeek esté disponible para el entorno de ejecución.

> **Nota sobre la instalación:** el `package.json` raíz todavía declara los workspaces `apps/exersai` y `apps/train-web`, que no están presentes en este repositorio. Si una instalación limpia falla por esas rutas, habrá que ajustar la lista de workspaces a los paquetes disponibles aquí.

## Estructura del repositorio

```text
apps/
├── admin-web/   # Panel web de administración y pruebas
├── server/      # Backend Express con Supabase
└── server_hono/ # API Hono para Cloudflare Workers
packages/
└── shared/      # Esquemas, tipos y servicios compartidos
```

## Próximos pasos técnicos

- Mantener documentada la integración entre la API de este repositorio y la app móvil del repositorio separado.
- Definir cuál backend será la implementación mantenida a largo plazo y documentar su configuración de manera completa.
- Añadir pruebas automatizadas para las funcionalidades principales.
