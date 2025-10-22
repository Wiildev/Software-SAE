const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createPool } = require('../config/database');
const pool = createPool();

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const connection = await pool.getConnection();

        try {
            const [users] = await connection.query(
                'SELECT * FROM empleado WHERE nombreUsuario = ?',
                [username]
            );

            if (users.length === 0) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const user = users[0];

            const isPasswordValid = await bcrypt.compare(password, user.contrasena);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }
            
            if(user.tipoUsuario !== role){
                return res.status(401).json({ error: 'Rol incorrecto para este usuario' });
            }

            const { contrasena, ...userWithoutPassword } = user;
            
            res.json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: userWithoutPassword
            });

        } catch (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para registro
router.post('/registro', async (req, res) => {
    try {
        const {
            fullName,
            username,
            documentNumber,
            email,
            phoneNumber,
            password
        } = req.body;

        if (!fullName || !username || !documentNumber || !email || !phoneNumber || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const connection = await pool.getConnection();
        
        try {
            const [existingUsers] = await connection.query(
                'SELECT * FROM empleado WHERE correoElectronico = ? OR nombreUsuario = ?',
                [email, username]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ error: 'El email o nombre de usuario ya está registrado' });
            }

            const [userCountResult] = await connection.query('SELECT COUNT(*) as count FROM empleado');
            const userCount = userCountResult[0].count;
            
            const role = userCount === 0 ? 'Admin' : 'Emple';

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.query(
                `INSERT INTO empleado (
                    nombreCompleto,
                    nombreUsuario,
                    numeroDocumento,
                    correoElectronico,
                    tipoUsuario,
                    telefono,
                    contrasena
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [fullName, username, documentNumber, email, role, phoneNumber, hashedPassword]
            );

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                userId: result.insertId,
                role: role
            });

        } catch (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error al registrar el usuario' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;