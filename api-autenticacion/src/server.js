const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./config/setupDatabase');

// Importar rutas
const rutaUsuario = require('./routes/rutausuario');
const rutaEmpleados = require('./routes/empleados.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const ticketController = require('./routes/ticketController'); // Importar el nuevo controlador

const app = express();

// Función principal para iniciar el servidor
async function startServer() {
    try {
        // 1. Configurar la base de datos ANTES de que el servidor empiece a escuchar
        console.log('Iniciando configuración de la base de datos...');
        await setupDatabase();
        console.log('✅ Base de datos configurada y lista.');

        // 2. Configurar Middleware
        app.use(cors({ origin: '*' }));
        app.use(express.json());

        // Middleware para logging de peticiones
        app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });

        // 3. Configurar Rutas de la API
        app.use('/api', rutaUsuario); // Maneja /api/login y /api/registro
        app.use('/api/empleados', rutaEmpleados); // Maneja /api/empleados/*
        app.use('/api/tickets', ticketsRoutes); // Maneja /api/tickets/*
        app.use('/api/ticket', ticketController); // Maneja /api/ticket/ingreso

        // Endpoint de prueba para verificar que el servidor está vivo
        app.get('/api/health', (req, res) => {
            res.json({ status: 'ok', message: 'Servidor funcionando correctamente.' });
        });

        // 4. Iniciar el servidor
        // Solo inicia el servidor si el script se ejecuta directamente
        if (require.main === module) {
            const PORT = process.env.PORT || 3001;
            app.listen(PORT, () => {
                console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
            });
        }

    } catch (error) {
        console.error('💥 Error fatal al iniciar el servidor:', error);
        process.exit(1); // Salir si la base de datos no se puede configurar
    }
}

// Exportar la app para Vercel (que gestiona el ciclo de vida del servidor)
module.exports = app;

// Iniciar todo el proceso
startServer();
