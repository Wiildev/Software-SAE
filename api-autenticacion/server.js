const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'tu_clave_secreta_para_jwt'; // En producción, usa variables de entorno

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS para permitir peticiones desde el frontend

// Simulación de base de datos MySQL
class MySQLSimulator {
  constructor() {
    // Tablas de la base de datos
    this.tables = {
      usuarios: []
    };
    
    // Contador para IDs autoincrementales
    this.autoIncrementIds = {
      usuarios: 1
    };
    
    // Inicializar con algunos datos de ejemplo
    this.seed();
  }
  
  // Método para inicializar datos de ejemplo
  async seed() {
    // Usuario administrador de ejemplo
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    
    this.tables.usuarios.push({
      id: this.autoIncrementIds.usuarios++,
      fullName: 'Administrador',
      username: 'admin',
      documentNumber: '12345678',
      email: 'admin@example.com',
      role: 'admin',
      phoneNumber: '123456789',
      password: adminPassword,
      fecha_creacion: new Date().toISOString()
    });
  }
  
  // Métodos para simular consultas SQL
  query(sql, params = []) {
    console.log(`Ejecutando consulta: ${sql}`);
    console.log(`Parámetros: ${JSON.stringify(params)}`);
    
    // Simulación de consultas SELECT
    if (sql.toLowerCase().startsWith('select')) {
      return this.handleSelect(sql, params);
    }
    // Simulación de consultas INSERT
    else if (sql.toLowerCase().startsWith('insert')) {
      return this.handleInsert(sql, params);
    }
    
    throw new Error(`Consulta no soportada: ${sql}`);
  }
  
  // Manejo de consultas SELECT
  handleSelect(sql, params) {
    // Extraer el nombre de la tabla de la consulta
    const tableMatch = sql.match(/from\s+(\w+)/i);
    if (!tableMatch) throw new Error('Tabla no especificada en la consulta SELECT');
    
    const tableName = tableMatch[1].toLowerCase();
    if (!this.tables[tableName]) throw new Error(`Tabla '${tableName}' no existe`);
    
    // Simulación básica de WHERE
    let results = [...this.tables[tableName]];
    
    // Si hay condiciones WHERE
    const whereMatch = sql.match(/where\s+(.+?)(?:\s+order\s+by|\s+limit|$)/i);
    if (whereMatch) {
      const whereCondition = whereMatch[1];
      
      // Simulación muy básica de condiciones WHERE
      results = results.filter(row => {
        // Ejemplo: username = ?
        if (whereCondition.includes('username = ?')) {
          return row.username === params[0];
        }
        // Ejemplo: email = ?
        else if (whereCondition.includes('email = ?')) {
          return row.email === params[0];
        }
        
        return true;
      });
    }
    
    return { results };
  }
  
  // Manejo de consultas INSERT
  handleInsert(sql, params) {
    // Extraer el nombre de la tabla de la consulta
    const tableMatch = sql.match(/insert\s+into\s+(\w+)/i);
    if (!tableMatch) throw new Error('Tabla no especificada en la consulta INSERT');
    
    const tableName = tableMatch[1].toLowerCase();
    if (!this.tables[tableName]) throw new Error(`Tabla '${tableName}' no existe`);
    
    // Extraer los nombres de las columnas
    const columnsMatch = sql.match(/\(([^)]+)\)/i);
    if (!columnsMatch) throw new Error('Columnas no especificadas en la consulta INSERT');
    
    const columns = columnsMatch[1].split(',').map(col => col.trim());
    
    // Crear el nuevo registro
    const newRecord = {
      id: this.autoIncrementIds[tableName]++
    };
    
    // Asignar valores a las columnas
    columns.forEach((col, index) => {
      newRecord[col] = params[index];
    });
    
    // Añadir fecha de creación si la columna existe
    if (columns.includes('fecha_creacion')) {
      newRecord.fecha_creacion = new Date().toISOString();
    }
    
    // Añadir el registro a la tabla
    this.tables[tableName].push(newRecord);
    
    return { insertId: newRecord.id, affectedRows: 1 };
  }
}

// Crear instancia de la simulación de MySQL
const db = new MySQLSimulator();

// Ruta para registrar un nuevo usuario
app.post('/api/registro', async (req, res) => {
  try {
    const { fullName, username, documentNumber, email, role, phoneNumber, password } = req.body;
    
    // Validación básica
    if (!fullName || !username || !documentNumber || !email || !role || !phoneNumber || !password) {
      return res.status(400).json({ mensaje: 'Por favor, complete todos los campos' });
    }
    
    // Verificar si el usuario ya existe
    const { results: usuariosExistentes } = db.query(
      'SELECT * FROM usuarios WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (usuariosExistentes.length > 0) {
      return res.status(400).json({ mensaje: 'El nombre de usuario o email ya existe' });
    }
    
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);
    
    // Guardar el nuevo usuario
    const { insertId } = db.query(
      'INSERT INTO usuarios (fullName, username, documentNumber, email, role, phoneNumber, password, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fullName, username, documentNumber, email, role, phoneNumber, passwordEncriptado, new Date().toISOString()]
    );
    
    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuario_id: insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Por favor, complete todos los campos' });
    }
    
    // Buscar el usuario
    const { results: usuariosEncontrados } = db.query(
      'SELECT * FROM usuarios WHERE username = ?',
      [username]
    );
    
    if (usuariosEncontrados.length === 0) {
      return res.status(400).json({ mensaje: 'Nombre de usuario o contraseña incorrectos' });
    }
    
    const usuarioEncontrado = usuariosEncontrados[0];
    
    // Verificar la contraseña
    const passwordValido = await bcrypt.compare(password, usuarioEncontrado.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Nombre de usuario o contraseña incorrectos' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuarioEncontrado.id, 
        username: usuarioEncontrado.username,
        role: usuarioEncontrado.role 
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    res.json({
      mensaje: 'Autenticación satisfactoria',
      token,
      usuario: {
        id: usuarioEncontrado.id,
        fullName: usuarioEncontrado.fullName,
        username: usuarioEncontrado.username,
        email: usuarioEncontrado.email,
        role: usuarioEncontrado.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
});

// Middleware para verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido' });
  }
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log('Base de datos MySQL simulada inicializada');
});