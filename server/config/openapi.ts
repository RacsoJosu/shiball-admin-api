import './zod-extend';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { registerAuthDocs } from '../api/auth/auth.openapi';

export const registry = new OpenAPIRegistry();

// Esquemas de seguridad
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Token JWT en encabezado: Authorization: Bearer <token>',
});

registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'AUTH_TOKEN',
  description: 'Cookie de sesión httpOnly AUTH_TOKEN',
});

// Esquema común para respuestas de error
export const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    error: z
      .string()
      .optional()
      .openapi({ example: 'Mensaje descriptivo del error' }),
    message: z
      .string()
      .optional()
      .openapi({ example: 'Error en la operación' }),
    title: z.string().optional().openapi({ example: 'Error' }),
    details: z
      .any()
      .optional()
      .openapi({ example: 'Detalles adicionales sobre el error' }),
    statusCode: z.number().optional().openapi({ example: 400 }),
    success: z.boolean().optional().openapi({ example: false }),
  })
);

let isModulesRegistered = false;
function registerAllModules() {
  if (isModulesRegistered) return;
  // Registrar documentación de módulos
  registerAuthDocs(registry);
  isModulesRegistered = true;
}

export function getOpenApiDocument() {
  registerAllModules();

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      version: '1.0.0',
      title: 'Shiball Admin API',
      description: `Documentación interactiva de **Shiball Admin API** con **Scalar** y **OpenAPI 3.0** autogenerado desde esquemas de **Zod**.

---

### 📘 Guía: Cómo documentar un módulo o endpoint en este repositorio

Para documentar nuevos endpoints reutilizando tus esquemas y tipos, sigue estos 3 pasos:

#### 1. Enriquecer los esquemas Zod (\`*.schemas.ts\`)
Importa \`../../config/zod-extend\` y usa \`.openapi({ example: '...', description: '...' })\`:
\`\`\`typescript
import '../../config/zod-extend';
import { z } from 'zod';

export const createItemSchema = z
  .object({
    name: z.string().min(2).openapi({ example: 'Cancha Sintética', description: 'Nombre del elemento' }),
    price: z.number().positive().openapi({ example: 45.0, description: 'Precio por hora' }),
  })
  .openapi('CreateItemInput');
\`\`\`

#### 2. Crear el archivo OpenAPI del módulo (\`*.openapi.ts\`)
Crea por ejemplo \`server/api/properties/properties.openapi.ts\` con una función \`registerPropertiesDocs\`:
\`\`\`typescript
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createItemSchema } from './properties.schemas';
import { ErrorResponseSchema } from '../../config/openapi';

export function registerPropertiesDocs(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: 'post',
    path: '/api/properties',
    tags: ['Properties'],
    summary: 'Crear una nueva propiedad',
    description: 'Registra una nueva propiedad en el catálogo.',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    request: {
      body: {
        description: 'Datos de la nueva propiedad',
        content: { 'application/json': { schema: createItemSchema } },
      },
    },
    responses: {
      201: {
        description: 'Propiedad creada con éxito',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string().openapi({ example: 'Propiedad creada' }),
              data: createItemSchema,
            }),
          },
        },
      },
      400: {
        description: 'Error de validación',
        content: { 'application/json': { schema: ErrorResponseSchema } },
      },
    },
  });
}
\`\`\`

#### 3. Registrar el módulo en \`server/config/openapi.ts\`
Importa tu función y agrégala dentro de \`registerAllModules()\`:
\`\`\`typescript
import { registerPropertiesDocs } from '../api/properties/properties.openapi';

function registerAllModules() {
  if (isModulesRegistered) return;
  registerAuthDocs(registry);
  registerPropertiesDocs(registry); // 👈 Agregar aquí
  isModulesRegistered = true;
}
\`\`\``,
    },

    servers: [
      {
        url: '/',
        description: 'Servidor actual',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación, registro y control de sesión',
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios y perfiles',
      },
      {
        name: 'Properties',
        description: 'Gestión de propiedades',
      },
      {
        name: 'Dashboard',
        description: 'Estadísticas y reportes del dashboard',
      },
      {
        name: 'Roles',
        description: 'Administración de roles y permisos',
      },
    ],
  });
}
