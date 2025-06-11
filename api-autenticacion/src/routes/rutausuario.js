const express = require('express');
const router = express.Router();
const { createPool } = require('../config/database');
const pool = createPool();

// Ruta para login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validar que todos los campos estén presentes
        if (!username || !password || !role) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        const connection = await pool.getConnection();

        try {
            // Buscar el usuario por nombre de usuario y rol
            const [users] = await connection.query(
                'SELECT * FROM empleado WHERE nombreUsuario = ? AND tipoUsuario = ?',
                [username, role]
            );

            // Si no se encuentra el usuario
            if (users.length === 0) {
                return res.status(401).json({
                    error: 'Usuario, rol o contraseña incorrectos'
                });
            }

            const user = users[0];

            // Verificar la contraseña
            if (password !== user.contrasena) {
                return res.status(401).json({
                    error: 'Usuario, rol o contraseña incorrectos'
                });
            }

            // Si todo es correcto, devolver los datos del usuario (excepto la contraseña)
            const { contrasena, ...userWithoutPassword } = user;
            
            res.json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: userWithoutPassword
            });

        } catch (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({
                error: 'Error al procesar la solicitud'
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({
            error: 'Error en el servidor'
        });
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
            role,
            phoneNumber,
            password
        } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!fullName || !username || !documentNumber || !email || !role || !phoneNumber || !password) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        const connection = await pool.getConnection();
        
        try {
            // Verificar si el usuario ya existe
            const [existingUsers] = await connection.query(
                'SELECT * FROM empleado WHERE correoElectronico = ? OR nombreUsuario = ?',
                [email, username]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    error: 'El email o nombre de usuario ya está registrado'
                });
            }

            // Insertar el nuevo empleado
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
                [fullName, username, documentNumber, email, role, phoneNumber, password]
            );

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                userId: result.insertId
            });

        } catch (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({
                error: 'Error al registrar el usuario'
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({
            error: 'Error en el servidor'
        });
    }
});

module.exports = router; 