const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = require('./app');
const { connect } = require('./db');
const config = require('./config');

async function start() {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`API de mantenimiento de vehículos iniciada en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error);
    process.exit(1);
  }
}

start();
