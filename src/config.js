const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const { DATABASE_URL, COLECCION, PORT } = process.env;

if (!DATABASE_URL) {
  throw new Error('Missing required environment variable DATABASE_URL');
}

if (!COLECCION) {
  throw new Error('Missing required environment variable COLECCION');
}

module.exports = {
  databaseUrl: DATABASE_URL,
  collectionPrefix: COLECCION,
  port: PORT ? Number(PORT) : 3000,
};
