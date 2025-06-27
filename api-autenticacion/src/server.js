const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createPool } = require('./config/database');

// Importar rutas
const rutaUsuario = require('./routes/rutausuario');
const rutaEmpleados = require('./routes/empleados.routes');
const ticketsRoutes = require('./routes/tickets.routes');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: '*', // Permite todas las origenes en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false
}));

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Pool de conexiones a la base de datos
const pool = createPool();

// Ruta POST de prueba
app.post('/api/users', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const connection = await pool.getConnection();
        
        // Insertar usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
            [nombre, email]
        );
        
        connection.release();
        
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta GET para obtener usuarios
app.get('/api/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query('SELECT * FROM usuarios');
        connection.release();
        res.json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para registrar un nuevo empleado
app.post('/api/registro', async (req, res) => {
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

        console.log('Datos recibidos:', {
            fullName,
            username,
            documentNumber,
            email,
            role,
            phoneNumber,
            password: '***'
        });

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

            // Insertar el nuevo empleado con los nombres de columna exactos
            const insertQuery = `
                INSERT INTO empleado (
                    nombreCompleto,
                    nombreUsuario,
                    numeroDocumento,
                    correoElectronico,
                    tipoUsuario,
                    telefono,
                    contrasena
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            console.log('Ejecutando query:', insertQuery);
            
            const [result] = await connection.query(
                insertQuery,
                [fullName, username, documentNumber, email, role, phoneNumber, password]
            );

            console.log('Resultado de la inserción:', result);

            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente',
                userId: result.insertId
            });
        } catch (error) {
            console.error('Error SQL:', error);
            // Verificar si es un error de tabla no existente
            if (error.code === 'ER_NO_SUCH_TABLE') {
                res.status(500).json({
                    error: 'La tabla empleado no existe en la base de datos'
                });
            } else if (error.code === 'ER_BAD_FIELD_ERROR') {
                res.status(500).json({
                    error: 'Error en la estructura de la tabla. Algún campo no coincide'
                });
            } else {
                res.status(500).json({
                    error: 'Error al registrar el usuario',
                    detalle: error.message
                });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({
            error: 'Error al registrar el usuario',
            detalle: error.message
        });
    }
});

// Ruta para login
app.post('/api/login', async (req, res) => {
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
            if (password !== user.contrasena) { // Nota: En producción deberías usar bcrypt para comparar
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

// Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [empleados] = await connection.query('SELECT id_Empleado, nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono FROM empleado');
            res.json({ empleados });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ error: 'Error al obtener la lista de empleados' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Obtener un empleado por ID
app.get('/api/empleados/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [empleados] = await connection.query(
                'SELECT id_Empleado, nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono FROM empleado WHERE id_Empleado = ?',
                [req.params.id]
            );
            
            if (empleados.length === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            
            res.json({ empleado: empleados[0] });
        } catch (error) {
            console.error('Error al obtener empleado:', error);
            res.status(500).json({ error: 'Error al obtener el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Actualizar un empleado
app.put('/api/empleados/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const { nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono } = req.body;
            
            const [result] = await connection.query(
                `UPDATE empleado SET 
                    nombreCompleto = COALESCE(?, nombreCompleto),
                    nombreUsuario = COALESCE(?, nombreUsuario),
                    numeroDocumento = COALESCE(?, numeroDocumento),
                    correoElectronico = COALESCE(?, correoElectronico),
                    tipoUsuario = COALESCE(?, tipoUsuario),
                    telefono = COALESCE(?, telefono)
                WHERE id_Empleado = ?`,
                [nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            res.json({ mensaje: 'Empleado actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            res.status(500).json({ error: 'Error al actualizar el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Eliminar un empleado
app.delete('/api/empleados/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.query(
                'DELETE FROM empleado WHERE id_Empleado = ?',
                [req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            res.json({ mensaje: 'Empleado eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            res.status(500).json({ error: 'Error al eliminar el empleado' });
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de conexión con la base de datos' });
    }
});

// Usar las rutas
app.use('/api', rutaUsuario);           // Rutas de autenticación
app.use('/api/empleados', rutaEmpleados); // Rutas de gestión de empleados
app.use('/api/tickets', ticketsRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 