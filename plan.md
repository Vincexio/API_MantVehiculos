# Plan de Proyecto: API de Mantenimiento de Vehículos

## 1. Objetivo del plan
Definir la hoja de ruta del proyecto para desarrollar un MVP funcional de la API REST de mantenimiento vehicular, junto con una fase de levantamiento y testing. Se consideran las variables del entorno del proyecto: `DATABASE_URL` y `COLECCION`.

## 2. Alcance del MVP de informe
El MVP debe cubrir los siguientes elementos mínimos:

- Arquitectura: API REST con Node.js/Express y MongoDB.
- Conexión a base de datos utilizando `DATABASE_URL`.
- Persistencia en la colección definida por `COLECCION`.
- Endpoints básicos:
  - `POST /usuarios` para crear usuarios.
  - `POST /vehiculos` para crear vehículos.
  - `GET /vehiculos/:usuario_id` para listar vehículos de un usuario.
  - `POST /mantenimientos` para registrar mantenimientos.
  - `GET /mantenimientos/:vehiculo_id` para consultar historial de mantenimientos.
- Modelo de datos referenciado: usuarios, vehículos y mantenimientos.
- Documentación de contrato de la API para el MVP.
- Logging básico y manejo de errores.

## 3. Fase de levantamiento
### 3.1. Recolección de requerimientos
- Analizar el `spec.md` para identificar necesidades funcionales y no funcionales.
- Confirmar actores: usuarios finales y evaluador académico.
- Validar con stakeholders el flujo de datos: usuario → vehículo → mantenimiento.

### 3.2. Definición técnica
- Usar Node.js con Express para el API.
- Usar MongoDB Atlas con `DATABASE_URL`.
- Configurar la colección principal con el nombre de `COLECCION`.
- Definir esquemas de datos y relaciones.
- Seleccionar índices esenciales:
  - `usuario_id` en vehículos.
  - `vehiculo_id` y `fecha` en mantenimientos.

### 3.3. Entregables de la fase de levantamiento
- Documento de casos de uso básicos.
- Diagrama lógico de datos.
- Contratos de endpoints del MVP.
- Configuración inicial de la conexión MongoDB.

## 4. Fase de desarrollo del MVP
### 4.1. Implementación
- Configurar proyecto Node.js.
- Agregar variables de entorno:
  - `DATABASE_URL` para conexión a MongoDB.
  - `COLECCION` para la colección principal.
- Implementar controladores y servicios en capas.
- Crear repositorio MongoDB para operación CRUD.
- Asegurar que `DATABASE_URL` y `COLECCION` estén disponibles desde la configuración.

### 4.2. Pruebas iniciales de integración
- Verificar conexión a la base de datos con `DATABASE_URL`.
- Probar inserción y búsqueda en `COLECCION`.
- Validar respuesta de todos los endpoints del MVP.

## 5. Fase de testing
### 5.1. Testing funcional
- Crear pruebas unitarias para los servicios de usuario, vehículo y mantenimiento.
- Crear pruebas de integración para los endpoints clave.
- Validar flujos:
  - Crear usuario.
  - Crear vehículo asociado.
  - Registrar mantenimiento.
  - Consultar historial de mantenimiento.

### 5.2. Testing de datos
- Confirmar que los datos se guardan en la colección indicada por `COLECCION`.
- Validar que las consultas usan índices esperados.
- Revisar que los documentos cumplan con el modelo de datos esperado.

### 5.3. Criterios de aceptación
- La API responde correctamente en los endpoints del MVP.
- La persistencia funciona con `DATABASE_URL` y `COLECCION`.
- Los tests cubren los escenarios principales.
- El sistema maneja errores y devuelve mensajes claros.

## 6. Entregables del proyecto
- MVP funcional de la API REST.
- Plan de pruebas y resultados del testing.
- Documentación del modelo y los endpoints.
- Configuración de conexión a MongoDB usando `DATABASE_URL`.
- Uso correcto de `COLECCION` en la persistencia.

## 7. Cronograma sugerido
1. Semana 1: levantamiento de requerimientos y diseño de datos.
2. Semana 2: implementación de endpoints básicos y conexión MongoDB.
3. Semana 3: pruebas funcionales e integración.
4. Semana 4: ajustes finales, documentación y validación.

## 8. Notas finales
- El proyecto se centra en un MVP con enfoque académico y bajo costo.
- Se propone un futuro producto final escalable con mejoras como notificaciones, análisis de costos y métricas.
- El uso de `DATABASE_URL` y `COLECCION` asegura que la aplicación esté preparada para desplegarse con MongoDB Atlas y la colección configurada en el entorno.
