const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/MySQLSimulator');
const { validateUserData, verificarToken, SECRET_KEY } = require('../middlewares/auth');

// Ruta para registro de usuarios
router.post('/registro', validateUserData, async (req, res) => {
  try {
    const { fullName, username, documentNumber, email, role, phoneNumber, password } = req.body;
    
    const { results: existingUsers } = await db.query(
      'SELECT * FROM usuarios WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        mensaje: 'El nombre de usuario o email ya está registrado' 
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const { insertId } = await db.query(
      'INSERT INTO usuarios (fullName, username, documentNumber, email, role, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullName, username, documentNumber, email, role, phoneNumber, hashedPassword]
    );
    
    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuario_id: insertId
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      mensaje: 'Error en el servidor',
      error: error.message 
    });
  }
});

// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username?.trim() || !password?.trim() || !role?.trim()) {
      return res.status(400).json({ mensaje: 'Usuario, contraseña y rol son requeridos' });
    }
    
    const { results: users } = await db.query(
      'SELECT * FROM usuarios WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    
    const user = users[0];

    // Verificar que el rol coincida
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(401).json({ mensaje: 'Rol no autorizado' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      mensaje: 'Error en el servidor',
      error: error.message 
    });
  }
});

// Ruta protegida de ejemplo
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ 
    mensaje: 'Acceso autorizado',
    usuario: req.usuario 
  });
});

module.exports = router; 