const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  constructor(db) {
    this.userModel = new User(db);
    this.SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_para_jwt';
  }

  async register(req, res) {
    try {
      const { fullName, username, documentNumber, email, role, phoneNumber, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await this.userModel.findByEmail(email) || 
                          await this.userModel.findByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ 
          mensaje: 'El usuario ya existe con ese email o nombre de usuario' 
        });
      }

      // Crear nuevo usuario
      const result = await this.userModel.create({
        fullName,
        username,
        documentNumber,
        email,
        role,
        phoneNumber,
        password
      });

      res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente',
        userId: result.insertId
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Buscar usuario
      const user = await this.userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Validar contraseña
      const isValidPassword = await this.userModel.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          role: user.role 
        },
        this.SECRET_KEY,
        { expiresIn: '24h' }
      );

      res.json({
        mensaje: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  }
}

module.exports = AuthController; 