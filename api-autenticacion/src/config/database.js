require('dotenv').config();
const mysql = require('mysql2/promise');

// Esta es la configuración que usa la aplicación para sus operaciones diarias.
// Utiliza TODAS las variables de entorno estándar de Railway.
const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Esta es una configuración especial SIN el nombre de la base de datos.
// Se usa ÚNICAMENTE en el script `setupDatabase.js` para poder ejecutar `CREATE DATABASE`.
const initialDbConfig = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT,
};

// El pool de conexiones que usará la aplicación en su día a día.
const createPool = () => {
  // Valida que las variables de entorno esenciales estén presentes
  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.port || !dbConfig.database) {
    console.error('Faltan variables de entorno críticas para la base de datos. Asegúrate de que MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLPORT y MYSQLDATABASE están definidas.');
    // Devolvemos un pool "vacío" para evitar un crash inmediato.
    return {
        getConnection: () => Promise.reject(new Error('Pool de base de datos no configurado debido a variables de entorno faltantes.')),
        query: () => Promise.reject(new Error('Pool de base de datos no configurado.'))
    }
  }
  return mysql.createPool(dbConfig);
};

module.exports = {
  createPool,
  dbConfig,
  initialDbConfig // Exportamos la configuración inicial para el script de setup
};
