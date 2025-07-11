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

// Endpoint unificado para todas las estadísticas del panel
app.get('/api/estadisticas', async (req, res) => {
    console.log('Entrando a /api/estadisticas');
    let connection;

    try {
        connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida');

        // Verificar si las tablas existen
        const [tables] = await connection.query(`
            SELECT TABLE_NAME
            FROM information_schema.tables
            WHERE table_schema = 'sae_software'
            AND TABLE_NAME IN ('plaza', 'ticket', 'empleado', 'vehiculo')
        `);

        console.log('Tablas encontradas:', tables.map(t => t.TABLE_NAME));

        // 1. Ocupación del estacionamiento (Plazas) - con validación
        let occupancyPercentage = 0;
        try {
            const [occupancyResult] = await connection.query(`
                SELECT
                    (SELECT COUNT(*) FROM plaza WHERE estado = 'Ocupado') as occupied,
                    (SELECT COUNT(*) FROM plaza) as total
            `);

            if (occupancyResult && occupancyResult.length > 0) {
                const { occupied, total } = occupancyResult[0];
                occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
                console.log(`Ocupación: ${occupied}/${total} = ${occupancyPercentage}%`);
            }
        } catch (error) {
            console.log('Error en consulta de ocupación, usando valor por defecto:', error.message);
        }

        // 2. Historial de uso mensual (últimos 6 meses) - usando fechaIngreso
        let monthlyHistoryResult = [];
        try {
            const [historyQuery] = await connection.query(`
                SELECT
                    DATE_FORMAT(fechaIngreso, '%b') as month,
                    COUNT(*) as count
                FROM ticket
                WHERE fechaIngreso >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(fechaIngreso, '%Y-%m')
                ORDER BY MIN(fechaIngreso)
            `);
            monthlyHistoryResult = historyQuery || [];
            console.log('Historial mensual:', monthlyHistoryResult.length, 'registros');
        } catch (error) {
            console.log('Error en consulta de historial, usando datos vacíos:', error.message);
            monthlyHistoryResult = [
                { month: 'Ene', count: 0 },
                { month: 'Feb', count: 0 },
                { month: 'Mar', count: 0 },
                { month: 'Abr', count: 0 },
                { month: 'May', count: 0 },
                { month: 'Jun', count: 0 }
            ];
        }

        // 3. Ranking de vehículos por tipo - usando JOIN con tabla vehiculo
        let rankingResult = [];
        try {
            const [rankingQuery] = await connection.query(`
                SELECT
                    v.tipoVehiculo,
                    COUNT(t.id_Ticket) as count
                FROM vehiculo v
                LEFT JOIN ticket t ON v.id_Placa = t.id_placa
                GROUP BY v.tipoVehiculo
                ORDER BY count DESC
            `);
            rankingResult = rankingQuery || [];
            console.log('Ranking de vehículos:', rankingResult.length, 'tipos');
        } catch (error) {
            console.log('Error en consulta de ranking, usando datos por defecto:', error.message);
            rankingResult = [
                { tipoVehiculo: 'CARRO', count: 0 },
                { tipoVehiculo: 'MOTO', count: 0 },
                { tipoVehiculo: 'BICICLETA', count: 0 }
            ];
        }

        // 4. Ocupación por hora (para el día actual) - usando horaIngreso
        let hourlyResult = [];
        try {
            const [hourlyQuery] = await connection.query(`
                SELECT
                    HOUR(horaIngreso) as hour,
                    COUNT(*) as count
                FROM ticket
                WHERE fechaIngreso = CURDATE()
                GROUP BY HOUR(horaIngreso)
                ORDER BY hour
            `);
            hourlyResult = hourlyQuery || [];
            console.log('Ocupación por horas:', hourlyResult.length, 'horas con datos');
        } catch (error) {
            console.log('Error en consulta por horas, usando datos por defecto:', error.message);
            hourlyResult = [
                { hour: 8, count: 0 },
                { hour: 9, count: 0 },
                { hour: 10, count: 0 },
                { hour: 11, count: 0 },
                { hour: 12, count: 0 },
                { hour: 13, count: 0 },
                { hour: 14, count: 0 },
                { hour: 15, count: 0 },
                { hour: 16, count: 0 },
                { hour: 17, count: 0 },
                { hour: 18, count: 0 }
            ];
        }

        // 5. Vehículos actualmente en el parqueadero por tipo - tickets sin salida
        let currentVehiclesByType = [];
        try {
            const [currentQuery] = await connection.query(`
                SELECT
                    v.tipoVehiculo,
                    COUNT(t.id_Ticket) as count
                FROM ticket t
                INNER JOIN vehiculo v ON t.id_placa = v.id_Placa
                WHERE t.fechaSalida IS NULL AND t.horaSalida IS NULL
                GROUP BY v.tipoVehiculo
            `);
            currentVehiclesByType = currentQuery || [];
            console.log('Vehículos actuales:', currentVehiclesByType.length, 'tipos activos');
        } catch (error) {
            console.log('Error en consulta de vehículos actuales, usando datos por defecto:', error.message);
            currentVehiclesByType = [];
        }

        // Formatear datos para el frontend
        const averages = {
            cars: currentVehiclesByType.find(v => v.tipoVehiculo === 'CARRO')?.count || 0,
            motorcycles: currentVehiclesByType.find(v => v.tipoVehiculo === 'MOTO')?.count || 0,
            bicycles: currentVehiclesByType.find(v => v.tipoVehiculo === 'BICICLETA')?.count || 0,
        };

        const stats = {
            occupancyPercentage,
            historyData: monthlyHistoryResult,
            rankingData: rankingResult,
            hourlyData: hourlyResult,
            averages,
        };

        console.log('Estadísticas generadas exitosamente:', {
            occupancyPercentage,
            historyCount: monthlyHistoryResult.length,
            rankingCount: rankingResult.length,
            hourlyCount: hourlyResult.length,
            averages
        });

        res.json(stats);

    } catch (error) {
        console.error('Error general al obtener estadísticas:', error);
        console.error('Tipo de error:', error.constructor.name);
        console.error('Mensaje:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }

        // Respuesta de error más detallada
        res.status(500).json({
            message: 'Error interno del servidor al obtener estadísticas',
            error: error.message,
            details: 'Revisa la consola del servidor para más información'
        });
    } finally {
        if (connection) {
            connection.release();
            console.log('Conexión liberada');
        }
    }
});

// Endpoint de prueba con datos mock para estadísticas
app.get('/api/estadisticas-mock', (req, res) => {
    console.log('Enviando datos mock de estadísticas');

    const mockStats = {
        occupancyPercentage: 75,
        historyData: [
            { month: 'Ene', count: 120 },
            { month: 'Feb', count: 150 },
            { month: 'Mar', count: 180 },
            { month: 'Abr', count: 200 },
            { month: 'May', count: 170 },
            { month: 'Jun', count: 190 }
        ],
        rankingData: [
            { tipoVehiculo: 'CARRO', count: 450 },
            { tipoVehiculo: 'MOTO', count: 320 },
            { tipoVehiculo: 'BICICLETA', count: 180 }
        ],
        hourlyData: [
            { hour: 8, count: 15 },
            { hour: 9, count: 25 },
            { hour: 10, count: 30 },
            { hour: 11, count: 28 },
            { hour: 12, count: 35 },
            { hour: 13, count: 32 },
            { hour: 14, count: 30 },
            { hour: 15, count: 28 },
            { hour: 16, count: 26 },
            { hour: 17, count: 22 },
            { hour: 18, count: 18 }
        ],
        averages: {
            cars: 45,
            motorcycles: 32,
            bicycles: 18
        }
    };

    res.json(mockStats);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
 