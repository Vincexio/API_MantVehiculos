module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'API de Mantenimiento de Vehículos',
    version: '1.0.0',
    description: 'API REST para gestionar usuarios, vehículos y mantenimientos con MongoDB.',
  },
  servers: [
    {
      url: process.env.SWAGGER_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
      description: 'URL base de la API (configurable vía SWAGGER_BASE_URL en producción).',
    },
  ],
  components: {
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f2' },
          nombre: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan.perez@example.com' },
        },
      },
      Vehiculo: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f3' },
          usuario_id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f2' },
          marca: { type: 'string', example: 'Toyota' },
          modelo: { type: 'string', example: 'Yaris' },
          anio: { type: 'integer', example: 2018 },
          patente: { type: 'string', example: 'ABCD12' },
          kilometraje_actual: { type: 'integer', example: 85000 },
        },
      },
      Mantenimiento: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f4' },
          vehiculo_id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f3' },
          tipo: { type: 'string', example: 'Cambio de aceite' },
          fecha: { type: 'string', format: 'date-time', example: '2026-05-18T12:00:00.000Z' },
          kilometraje: { type: 'integer', example: 82000 },
          descripcion: { type: 'string', example: 'Cambio de aceite, filtro y revisión básica' },
          vehiculo_info: {
            type: 'object',
            properties: {
              marca: { type: 'string', example: 'Toyota' },
              modelo: { type: 'string', example: 'Yaris' },
              patente: { type: 'string', example: 'ABCD12' },
            },
          },
          proximo_mantenimiento: {
            type: ['object', 'null'],
            properties: {
              kilometraje: { type: 'integer', example: 90000 },
              fecha_estimada: { type: 'string', format: 'date-time', example: '2026-10-18T12:00:00.000Z' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/usuarios': {
      get: {
        summary: 'Listar usuarios',
        responses: {
          '200': {
            description: 'Listado de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Usuario' },
                },
              },
            },
          },
          '500': { description: 'Error del servidor' },
        },
      },
      post: {
        summary: 'Crear usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string' },
                  email: { type: 'string' },
                },
                required: ['nombre', 'email'],
              },
              example: {
                nombre: 'María González',
                email: 'maria.gonzalez@example.com',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          '400': { description: 'Solicitud inválida' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/usuarios/{usuario_id}': {
      get: {
        summary: 'Obtener usuario por ID',
        parameters: [
          {
            name: 'usuario_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '650c9d76a9b2f5a4d8e1e0f2',
          },
        ],
        responses: {
          '200': {
            description: 'Usuario encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' },
              },
            },
          },
          '400': { description: 'ID inválido' },
          '404': { description: 'Usuario no encontrado' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/vehiculos': {
      post: {
        summary: 'Crear vehículo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  usuario_id: { type: 'string' },
                  marca: { type: 'string' },
                  modelo: { type: 'string' },
                  anio: { type: 'integer' },
                  patente: { type: 'string' },
                  kilometraje_actual: { type: 'integer' },
                },
                required: ['usuario_id', 'marca', 'modelo', 'anio', 'patente'],
              },
              example: {
                usuario_id: '650c9d76a9b2f5a4d8e1e0f2',
                marca: 'Toyota',
                modelo: 'Corolla',
                anio: 2020,
                patente: 'XYZ123',
                kilometraje_actual: 45000,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Vehículo creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vehiculo' },
              },
            },
          },
          '400': { description: 'Solicitud inválida' },
          '404': { description: 'Usuario no encontrado' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/vehiculos/{usuario_id}': {
      get: {
        summary: 'Listar vehículos por usuario',
        parameters: [
          {
            name: 'usuario_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '650c9d76a9b2f5a4d8e1e0f2',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de vehículos del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Vehiculo' },
                },
              },
            },
          },
          '400': { description: 'ID inválido' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/vehiculos/{vehiculo_id}/kilometraje': {
      put: {
        summary: 'Actualizar kilometraje de vehículo',
        parameters: [
          {
            name: 'vehiculo_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '650c9d76a9b2f5a4d8e1e0f3',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  kilometraje_actual: { type: 'integer' },
                },
                required: ['kilometraje_actual'],
              },
              example: {
                kilometraje_actual: 33000,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Kilometraje actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '650c9d76a9b2f5a4d8e1e0f3' },
                    kilometraje_actual: { type: 'integer', example: 33000 },
                  },
                },
              },
            },
          },
          '400': { description: 'Solicitud inválida' },
          '404': { description: 'Vehículo no encontrado' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/mantenimientos': {
      post: {
        summary: 'Registrar mantenimiento',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  vehiculo_id: { type: 'string' },
                  tipo: { type: 'string' },
                  fecha: { type: 'string', format: 'date-time' },
                  kilometraje: { type: 'integer' },
                  descripcion: { type: 'string' },
                  proximo_mantenimiento: {
                    type: 'object',
                    properties: {
                      kilometraje: { type: 'integer' },
                      fecha_estimada: { type: 'string', format: 'date-time' },
                    },
                  },
                },
                required: ['vehiculo_id', 'tipo', 'fecha', 'kilometraje'],
              },
              example: {
                vehiculo_id: '650c9d76a9b2f5a4d8e1e0f3',
                tipo: 'Cambio de aceite',
                fecha: '2026-05-18T12:00:00.000Z',
                kilometraje: 82000,
                descripcion: 'Cambio de aceite y filtro',
                proximo_mantenimiento: {
                  kilometraje: 90000,
                  fecha_estimada: '2026-10-18T12:00:00.000Z',
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Mantenimiento registrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Mantenimiento' },
              },
            },
          },
          '400': { description: 'Solicitud inválida' },
          '404': { description: 'Vehículo no encontrado' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
    '/mantenimientos/{vehiculo_id}': {
      get: {
        summary: 'Obtener historial de mantenimientos',
        parameters: [
          {
            name: 'vehiculo_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '650c9d76a9b2f5a4d8e1e0f3',
          },
        ],
        responses: {
          '200': {
            description: 'Historial de mantenimientos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Mantenimiento' },
                },
              },
            },
          },
          '400': { description: 'ID inválido' },
          '500': { description: 'Error del servidor' },
        },
      },
    },
  },
};
