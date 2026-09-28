import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import '../../config/zod-extend';
import { loginUserSchema, registerUserSchema } from './auth.schemas';
import { ErrorResponseSchema } from '../../config/openapi';

export function registerAuthDocs(registry: OpenAPIRegistry) {
  // Schemas de Respuesta para Auth
  const RegisterResponseSchema = registry.register(
    'RegisterResponse',
    z.object({
      message: z.string().openapi({ example: 'Usuario creado' }),
      title: z.string().openapi({ example: 'Usuario registrado' }),
      data: z.object({
        idUser: z.string().openapi({ example: 'cm81bcdef000008l4gh1a721q' }),
        email: z.string().openapi({ example: 'usuario@shiball.com' }),
      }),
    })
  );

  const LoginResponseSchema = registry.register(
    'LoginResponse',
    z.object({
      message: z.string().openapi({ example: 'Login correcto' }),
      title: z
        .string()
        .openapi({ example: 'Usuario ha iniciado sesión correctamente.' }),
      data: z.string().openapi({
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtODFiY2RlZi...fQ',
        description:
          'Token JWT de autenticación (también es retornado y almacenado en la cookie HTTP-only AUTH_TOKEN)',
      }),
    })
  );

  const LogoutResponseSchema = registry.register(
    'LogoutResponse',
    z.object({
      message: z
        .string()
        .openapi({ example: 'Se ha cerrado sesión correctamente.' }),
      title: z.string().openapi({ example: 'Logout correcto' }),
    })
  );

  const AuthUserInfoResponseSchema = registry.register(
    'AuthUserInfoResponse',
    z.object({
      message: z.string().openapi({ example: 'Login correcto' }),
      title: z
        .string()
        .openapi({ example: 'Usuario ha iniciado sesión correctamente.' }),
      data: z.object({
        id: z.string().openapi({ example: 'cm81bcdef000008l4gh1a721q' }),
        email: z.string().openapi({ example: 'usuario@shiball.com' }),
        name: z.string().openapi({ example: 'Oscar Vallecillos' }),
        birthDate: z.string().openapi({ example: '1995-10-25' }),
        createdAt: z.string().openapi({ example: '2026-03-01T15:20:00.000Z' }),
      }),
    })
  );

  // 1. Registro de usuario (POST /api/auth/signup)
  registry.registerPath({
    method: 'post',
    path: '/api/auth/signup',
    tags: ['Auth'],
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea un nuevo usuario en la base de datos, genera sus credenciales y retorna el JWT tanto en cookie HTTP-only como en el body.',
    request: {
      body: {
        description: 'Datos necesarios para crear la cuenta de usuario',
        content: {
          'application/json': {
            schema: registerUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Usuario registrado exitosamente',
        content: {
          'application/json': {
            schema: RegisterResponseSchema,
          },
        },
      },
      400: {
        description: 'Datos de validación erróneos o el usuario ya existe',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // 2. Inicio de sesión (POST /api/auth/login)
  registry.registerPath({
    method: 'post',
    path: '/api/auth/login',
    tags: ['Auth'],
    summary: 'Iniciar sesión de usuario',
    description:
      'Autentica las credenciales del usuario (email y contraseña). Si son válidas, establece la cookie `AUTH_TOKEN` y devuelve el JWT.',
    request: {
      body: {
        description: 'Credenciales de acceso',
        content: {
          'application/json': {
            schema: loginUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sesión iniciada correctamente',
        content: {
          'application/json': {
            schema: LoginResponseSchema,
          },
        },
      },
      400: {
        description: 'Error de validación o contraseña incorrecta',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // 3. Cerrar sesión (POST /api/auth/logout)
  registry.registerPath({
    method: 'post',
    path: '/api/auth/logout',
    tags: ['Auth'],
    summary: 'Cerrar sesión del usuario',
    description:
      'Invalida la sesión del cliente eliminando la cookie HTTP-only `AUTH_TOKEN`.',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Sesión cerrada correctamente',
        content: {
          'application/json': {
            schema: LogoutResponseSchema,
          },
        },
      },
    },
  });

  // 4. Perfil del usuario autenticado (GET /api/auth/me)
  registry.registerPath({
    method: 'get',
    path: '/api/auth/me',
    tags: ['Auth'],
    summary: 'Obtener información del usuario autenticado',
    description:
      'Devuelve el perfil del usuario autenticado a partir del token JWT enviado en la cookie `AUTH_TOKEN` o encabezado `Authorization: Bearer`.',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Datos del usuario autenticado obtenidos correctamente',
        content: {
          'application/json': {
            schema: AuthUserInfoResponseSchema,
          },
        },
      },
      400: {
        description: 'Usuario no encontrado o token inválido',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // 5. Test de autenticación (GET /api/auth/test)
  registry.registerPath({
    method: 'get',
    path: '/api/auth/test',
    tags: ['Auth'],
    summary: 'Endpoint de prueba con guard de autenticación',
    description:
      'Ruta para verificar que el middleware `authGuard` está funcionando correctamente.',
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    responses: {
      200: {
        description: 'Token válido y usuario verificado',
        content: {
          'application/json': {
            schema: z.object({
              user: z
                .any()
                .openapi({ description: 'Payload del usuario decodificado' }),
            }),
          },
        },
      },
    },
  });
}
