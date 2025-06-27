const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'sae_software',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const createPool = () => {
  return mysql.createPool(dbConfig);
};

module.exports = {
  createPool,
  dbConfig
}; 