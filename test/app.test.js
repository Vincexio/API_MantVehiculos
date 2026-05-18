const request = require('supertest');
const app = require('../src/app');
const { connect, getCollections } = require('../src/db');

beforeAll(async () => {
  await connect();
});

describe('API de Mantenimiento de Vehículos', () => {
  let usuarioId;
  let vehiculoId;

  it('crea un usuario correctamente', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ nombre: 'Ana Ruiz', email: 'ana.ruiz@example.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Ana Ruiz');
    usuarioId = response.body.id;
  });

  it('obtiene el usuario creado por su id', async () => {
    const response = await request(app).get(`/usuarios/${usuarioId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email', 'ana.ruiz@example.com');
    expect(response.body).toHaveProperty('_id');
  });

  it('crea un vehículo asociado al usuario', async () => {
    const response = await request(app)
      .post('/vehiculos')
      .send({
        usuario_id: usuarioId,
        marca: 'Hyundai',
        modelo: 'Tucson',
        anio: 2021,
        patente: 'DEF456',
        kilometraje_actual: 32000,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.marca).toBe('Hyundai');
    vehiculoId = response.body.id;
  });

  it('actualiza el kilometraje del vehículo', async () => {
    const response = await request(app)
      .put(`/vehiculos/${vehiculoId}/kilometraje`)
      .send({ kilometraje_actual: 33000 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', vehiculoId);
    expect(response.body).toHaveProperty('kilometraje_actual', 33000);
  });

  it('lista los vehículos del usuario', async () => {
    const response = await request(app).get(`/vehiculos/${usuarioId}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('marca', 'Hyundai');
  });

  it('registra un mantenimiento y lo consulta', async () => {
    const maintenanceResponse = await request(app)
      .post('/mantenimientos')
      .send({
        vehiculo_id: vehiculoId,
        tipo: 'Cambio de frenos',
        fecha: new Date().toISOString(),
        kilometraje: 32500,
        descripcion: 'Cambio de pastillas de freno',
        proximo_mantenimiento: {
          kilometraje: 40000,
          fecha_estimada: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });

    expect(maintenanceResponse.statusCode).toBe(201);
    expect(maintenanceResponse.body).toHaveProperty('id');

    const historialResponse = await request(app).get(`/mantenimientos/${vehiculoId}`);
    expect(historialResponse.statusCode).toBe(200);
    expect(Array.isArray(historialResponse.body)).toBe(true);
    expect(historialResponse.body[0]).toHaveProperty('tipo', 'Cambio de frenos');
  });
});
