const express = require('express');
const { ObjectId } = require('mongodb');
const { getCollections } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

app.get('/', (req, res) => {
  return res.redirect('/api-docs');
});

app.get('/usuarios', async (req, res) => {
  try {
    const { usuarios } = getCollections();
    const users = await usuarios.find({}).toArray();
    return res.status(200).json(users);
  } catch (error) {
    console.error('GET /usuarios error', error);
    return res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
});

app.get('/usuarios/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  if (!isValidObjectId(usuario_id)) {
    return badRequest(res, 'usuario_id inválido.');
  }

  try {
    const { usuarios } = getCollections();
    const usuario = await usuarios.findOne({ _id: new ObjectId(usuario_id) });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    console.error('GET /usuarios/:usuario_id error', error);
    return res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
});

app.post('/usuarios', async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return badRequest(res, 'Los campos nombre y email son obligatorios.');
  }

  try {
    const { usuarios } = getCollections();
    const result = await usuarios.insertOne({ nombre, email, createdAt: new Date() });
    return res.status(201).json({ id: result.insertedId, nombre, email });
  } catch (error) {
    console.error('POST /usuarios error', error);
    return res.status(500).json({ error: 'Error al crear el usuario.' });
  }
});

app.post('/vehiculos', async (req, res) => {
  const { usuario_id, marca, modelo, anio, patente, kilometraje_actual } = req.body;
  if (!usuario_id || !marca || !modelo || !anio || !patente) {
    return badRequest(res, 'Los campos usuario_id, marca, modelo, anio y patente son obligatorios.');
  }

  if (!isValidObjectId(usuario_id)) {
    return badRequest(res, 'usuario_id inválido.');
  }

  try {
    const { vehiculos, usuarios } = getCollections();
    const usuario = await usuarios.findOne({ _id: new ObjectId(usuario_id) });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const vehicle = {
      usuario_id: new ObjectId(usuario_id),
      marca,
      modelo,
      anio,
      patente,
      kilometraje_actual: kilometraje_actual || 0,
      createdAt: new Date(),
    };
    const result = await vehiculos.insertOne(vehicle);
    return res.status(201).json({ id: result.insertedId, ...vehicle });
  } catch (error) {
    console.error('POST /vehiculos error', error);
    return res.status(500).json({ error: 'Error al crear el vehículo.' });
  }
});

app.get('/vehiculos/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  if (!isValidObjectId(usuario_id)) {
    return badRequest(res, 'usuario_id inválido.');
  }

  try {
    const { vehiculos } = getCollections();
    const vehicles = await vehiculos
      .find({ usuario_id: new ObjectId(usuario_id) })
      .toArray();
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('GET /vehiculos/:usuario_id error', error);
    return res.status(500).json({ error: 'Error al obtener los vehículos.' });
  }
});

app.put('/vehiculos/:vehiculo_id/kilometraje', async (req, res) => {
  const { vehiculo_id } = req.params;
  const { kilometraje_actual } = req.body;

  if (!isValidObjectId(vehiculo_id)) {
    return badRequest(res, 'vehiculo_id inválido.');
  }

  if (kilometraje_actual == null || typeof kilometraje_actual !== 'number') {
    return badRequest(res, 'kilometraje_actual debe ser un número.');
  }

  try {
    const { vehiculos } = getCollections();
    const existing = await vehiculos.findOne({ _id: new ObjectId(vehiculo_id) });
    if (!existing) {
      return res.status(404).json({ error: 'Vehículo no encontrado.' });
    }

    const updated = { ...existing, kilometraje_actual };
    if (vehiculos.updateOne) {
      await vehiculos.updateOne({ _id: new ObjectId(vehiculo_id) }, { $set: { kilometraje_actual } });
    } else {
      const index = (await vehiculos.find({ _id: new ObjectId(vehiculo_id) }).toArray()).findIndex(item => item._id.toString() === vehiculo_id);
      if (index >= 0) {
        existing.kilometraje_actual = kilometraje_actual;
      }
    }

    return res.status(200).json({ id: vehiculo_id, kilometraje_actual });
  } catch (error) {
    console.error('PUT /vehiculos/:vehiculo_id/kilometraje error', error);
    return res.status(500).json({ error: 'Error al actualizar el kilometraje.' });
  }
});

app.post('/mantenimientos', async (req, res) => {
  const { vehiculo_id, tipo, fecha, kilometraje, descripcion, proximo_mantenimiento } = req.body;
  if (!vehiculo_id || !tipo || !fecha || !kilometraje) {
    return badRequest(res, 'Los campos vehiculo_id, tipo, fecha y kilometraje son obligatorios.');
  }

  if (!isValidObjectId(vehiculo_id)) {
    return badRequest(res, 'vehiculo_id inválido.');
  }

  try {
    const { vehiculos, mantenimientos } = getCollections();
    const vehiculo = await vehiculos.findOne({ _id: new ObjectId(vehiculo_id) });
    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado.' });
    }

    const maintenance = {
      vehiculo_id: new ObjectId(vehiculo_id),
      tipo,
      fecha: new Date(fecha),
      kilometraje,
      descripcion: descripcion || '',
      vehiculo_info: {
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        patente: vehiculo.patente,
      },
      proximo_mantenimiento: proximo_mantenimiento || null,
      createdAt: new Date(),
    };
    const result = await mantenimientos.insertOne(maintenance);
    return res.status(201).json({ id: result.insertedId, ...maintenance });
  } catch (error) {
    console.error('POST /mantenimientos error', error);
    return res.status(500).json({ error: 'Error al registrar el mantenimiento.' });
  }
});

app.get('/mantenimientos/:vehiculo_id', async (req, res) => {
  const { vehiculo_id } = req.params;
  if (!isValidObjectId(vehiculo_id)) {
    return badRequest(res, 'vehiculo_id inválido.');
  }

  try {
    const { mantenimientos } = getCollections();
    const history = await mantenimientos
      .find({ vehiculo_id: new ObjectId(vehiculo_id) })
      .sort({ fecha: -1 })
      .toArray();
    return res.status(200).json(history);
  } catch (error) {
    console.error('GET /mantenimientos/:vehiculo_id error', error);
    return res.status(500).json({ error: 'Error al obtener el historial de mantenimientos.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' });
});

module.exports = app;
