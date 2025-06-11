const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/MySQLSimulator');
const { validateUserData, verificarToken, SECRET_KEY } = require('../middlewares/auth');
const AuthController = require('../controllers/authController');

// La instancia de db se pasará desde server.js
let authController;

// Inicializar el controlador con la instancia de db
router.use((req, res, next) => {
  if (!authController) {
    authController = new AuthController(req.app.locals.db);
  }
  next();
});

// Ruta para registro de usuarios
router.post('/register', validateUserData, (req, res) => authController.register(req, res));

// Ruta para inicio de sesión
router.post('/login', (req, res) => authController.login(req, res));

// Ruta protegida de ejemplo
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ 
    mensaje: 'Acceso autorizado',
    usuario: req.usuario 
  });
});

module.exports = router; 