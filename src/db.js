const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');

const client = new MongoClient(config.databaseUrl);

let db;
let collections;
let usingFallback = false;

function createMemoryCollection() {
  const data = [];
  return {
    async insertOne(doc) {
      const stored = { ...doc, _id: new ObjectId() };
      data.push(stored);
      return { insertedId: stored._id };
    },
    async findOne(query) {
      const key = Object.keys(query)[0];
      return data.find(item => {
        const value = query[key];
        const itemValue = item[key];
        if (itemValue != null && value != null && typeof itemValue.toString === 'function' && typeof value.toString === 'function') {
          return itemValue.toString() === value.toString();
        }
        return item[key] === value;
      }) || null;
    },
    find(query = {}) {
      const results = data.filter(item => {
        return Object.entries(query).every(([key, value]) => {
          const itemValue = item[key];
          if (itemValue != null && value != null && typeof itemValue.toString === 'function' && typeof value.toString === 'function') {
            return itemValue.toString() === value.toString();
          }
          return item[key] === value;
        });
      });
      return {
        sort(sortObj) {
          const [sortKey, sortOrder] = Object.entries(sortObj)[0];
          const sorted = [...results].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === -1 ? 1 : -1;
            if (a[sortKey] > b[sortKey]) return sortOrder === -1 ? -1 : 1;
            return 0;
          });
          return {
            toArray: async () => sorted,
          };
        },
        toArray: async () => results,
      };
    },
    async updateOne(filter, update) {
      const existing = await this.findOne(filter);
      if (!existing) {
        return { matchedCount: 0, modifiedCount: 0 };
      }
      if (update.$set) {
        Object.assign(existing, update.$set);
      }
      return { matchedCount: 1, modifiedCount: 1 };
    },
    async createIndex() {
      return null;
    },
  };
}

async function connect() {
  if (!db) {
    try {
      await client.connect();
      db = client.db();
      const prefix = config.collectionPrefix;
      collections = {
        usuarios: db.collection(`${prefix}_usuarios`),
        vehiculos: db.collection(`${prefix}_vehiculos`),
        mantenimientos: db.collection(`${prefix}_mantenimientos`),
      };

      await Promise.all([
        collections.vehiculos.createIndex({ usuario_id: 1 }),
        collections.mantenimientos.createIndex({ vehiculo_id: 1, fecha: -1 }),
      ]);
      usingFallback = false;
      console.log('MongoDB conectado correctamente.');
    } catch (error) {
      console.warn('No se pudo conectar a MongoDB, usando almacenamiento en memoria temporal.', error.message);
      usingFallback = true;
      collections = {
        usuarios: createMemoryCollection(),
        vehiculos: createMemoryCollection(),
        mantenimientos: createMemoryCollection(),
      };
      db = null;
    }
  }
  return { db, collections, usingFallback };
}

function getCollections() {
  if (!collections) {
    throw new Error('MongoDB client is not connected yet. Call connect() first.');
  }
  return collections;
}

module.exports = {
  connect,
  getCollections,
  ObjectId,
};
