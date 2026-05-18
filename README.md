# API de Mantenimiento de Vehículos

API REST para registrar usuarios, vehículos y mantenimientos usando MongoDB.

## Variables de entorno
- `DATABASE_URL`: URL de conexión a MongoDB.
- `COLECCION`: prefijo de las colecciones usadas en la base de datos.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

## Documentación Swagger

- Accede a: `http://localhost:3000/api-docs`

## Endpoints

- `GET /`
- `GET /api-docs`
- `GET /usuarios`
- `GET /usuarios/:usuario_id`
- `POST /usuarios`
- `POST /vehiculos`
- `GET /vehiculos/:usuario_id`
- `PUT /vehiculos/:vehiculo_id/kilometraje`
- `POST /mantenimientos`
- `GET /mantenimientos/:vehiculo_id`

## Colecciones usadas
- `${COLECCION}_usuarios`
- `${COLECCION}_vehiculos`
- `${COLECCION}_mantenimientos`

## Pruebas

```bash
npm test
```
