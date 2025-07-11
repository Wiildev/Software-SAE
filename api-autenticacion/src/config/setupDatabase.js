const mysql = require('mysql2/promise');
const { dbConfig } = require('./database');

async function setupDatabase() {
    let connection;
    
    try {
        // Conectar sin especificar base de datos
        const connectionConfig = { ...dbConfig };
        delete connectionConfig.database;
        
        connection = await mysql.createConnection(connectionConfig);
        console.log('Conectado a MySQL');

        // Crear base de datos si no existe
        await connection.execute(`CREATE DATABASE IF NOT EXISTS sae_software`);
        console.log('Base de datos sae_software verificada/creada');

        // Usar la base de datos
        await connection.execute(`USE sae_software`);

        // Crear tabla empleado si no existe (debe ir primero por las FK)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS empleado (
                id_Empleado INT AUTO_INCREMENT PRIMARY KEY,
                nombreCompleto VARCHAR(255) NOT NULL,
                nombreUsuario VARCHAR(100) UNIQUE NOT NULL,
                numeroDocumento VARCHAR(50) NOT NULL,
                correoElectronico VARCHAR(255) NOT NULL,
                tipoUsuario ENUM('Admin', 'Emple') NOT NULL,
                telefono VARCHAR(20),
                contrasena VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla empleado verificada/creada');

        // Crear tabla plaza si no existe (estructura corregida)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS plaza (
                id_Plaza INT AUTO_INCREMENT PRIMARY KEY,
                plaza VARCHAR(50) NOT NULL,
                estado ENUM('libre', 'ocupado') DEFAULT 'libre',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla plaza verificada/creada');

        // Crear tabla vehiculo si no existe
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vehiculo (
                id_Placa INT AUTO_INCREMENT PRIMARY KEY,
                placa VARCHAR(20) UNIQUE NOT NULL,
                tipoVehiculo ENUM('CARRO', 'MOTO', 'BICICLETA') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla vehiculo verificada/creada');

        // Crear tabla ticket si no existe (con la estructura correcta)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ticket (
                id_Ticket INT AUTO_INCREMENT PRIMARY KEY,
                id_Plaza INT NOT NULL,
                id_Empleado INT NOT NULL,
                id_placa INT NOT NULL,
                fechaIngreso DATE NOT NULL,
                horaIngreso TIME NOT NULL,
                fechaSalida DATE NULL,
                horaSalida TIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_Plaza) REFERENCES plaza(id_Plaza),
                FOREIGN KEY (id_Empleado) REFERENCES empleado(id_Empleado),
                FOREIGN KEY (id_placa) REFERENCES vehiculo(id_Placa)
            )
        `);
        console.log('Tabla ticket verificada/creada');

        // Insertar empleado de ejemplo si no existe
        const [empleadoCount] = await connection.execute('SELECT COUNT(*) as count FROM empleado');
        if (empleadoCount[0].count === 0) {
            console.log('Insertando empleado de ejemplo...');
            await connection.execute(`
                INSERT INTO empleado (nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono, contrasena) 
                VALUES ('Admin Sistema', 'admin', '12345678', 'admin@sae.com', 'Admin', '3001234567', '$2b$10$hash_ejemplo')
            `);
            console.log('Empleado admin creado');
        }

        // Insertar algunas plazas de ejemplo si la tabla está vacía
        const [plazaCount] = await connection.execute('SELECT COUNT(*) as count FROM plaza');
        if (plazaCount[0].count === 0) {
            console.log('Insertando plazas de ejemplo...');
            for (let i = 1; i <= 50; i++) {
                const estado = Math.random() > 0.7 ? 'ocupado' : 'libre';
                const nombrePlaza = `P${String(i).padStart(3, '0')}`; // P001, P002, etc.
                await connection.execute(
                    'INSERT INTO plaza (plaza, estado) VALUES (?, ?)',
                    [nombrePlaza, estado]
                );
            }
            console.log('50 plazas de ejemplo insertadas');
        }

        // Insertar algunos vehículos de ejemplo si la tabla está vacía
        const [vehiculoCount] = await connection.execute('SELECT COUNT(*) as count FROM vehiculo');
        if (vehiculoCount[0].count === 0) {
            console.log('Insertando vehículos de ejemplo...');
            const vehicleTypes = ['CARRO', 'MOTO', 'BICICLETA'];
            const placas = [
                // Carros
                'ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234', 'YZA567', 'BCD890',
                'EFG123', 'HIJ456', 'KLM789', 'NOP012', 'QRS345', 'TUV678', 'WXY901', 'ZAB234', 'CDE567', 'FGH890',
                // Motos
                'M001AB', 'M002CD', 'M003EF', 'M004GH', 'M005IJ', 'M006KL', 'M007MN', 'M008OP', 'M009QR', 'M010ST',
                'M011UV', 'M012WX', 'M013YZ', 'M014AB', 'M015CD', 'M016EF', 'M017GH', 'M018IJ', 'M019KL', 'M020MN',
                // Bicicletas
                'B001', 'B002', 'B003', 'B004', 'B005', 'B006', 'B007', 'B008', 'B009', 'B010'
            ];
            
            let vehicleIndex = 0;
            for (const tipo of vehicleTypes) {
                const count = tipo === 'CARRO' ? 20 : tipo === 'MOTO' ? 20 : 10;
                for (let i = 0; i < count; i++) {
                    await connection.execute(
                        'INSERT INTO vehiculo (placa, tipoVehiculo) VALUES (?, ?)',
                        [placas[vehicleIndex], tipo]
                    );
                    vehicleIndex++;
                }
            }
            console.log('50 vehículos de ejemplo insertados');
        }

        // Insertar algunos tickets de ejemplo si la tabla está vacía
        const [ticketCount] = await connection.execute('SELECT COUNT(*) as count FROM ticket');
        if (ticketCount[0].count === 0) {
            console.log('Insertando tickets de ejemplo...');
            
            // Obtener IDs disponibles
            const [empleados] = await connection.execute('SELECT id_Empleado FROM empleado LIMIT 1');
            const [plazas] = await connection.execute('SELECT id_Plaza FROM plaza LIMIT 50');
            const [vehiculos] = await connection.execute('SELECT id_Placa FROM vehiculo');
            
            const empleadoId = empleados[0].id_Empleado;
            
            for (let i = 0; i < 100; i++) {
                const vehiculo = vehiculos[Math.floor(Math.random() * vehiculos.length)];
                const plaza = plazas[Math.floor(Math.random() * plazas.length)];
                
                // Generar fecha aleatoria en los últimos 6 meses
                const fechaIngreso = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
                const horaIngreso = `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`;
                
                // 70% de los tickets tienen salida
                const tieneSalida = Math.random() > 0.3;
                let fechaSalida = null;
                let horaSalida = null;
                
                if (tieneSalida) {
                    fechaSalida = new Date(fechaIngreso.getTime() + Math.random() * 8 * 60 * 60 * 1000); // Hasta 8 horas después
                    horaSalida = `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`;
                }
                
                await connection.execute(`
                    INSERT INTO ticket (id_Plaza, id_Empleado, id_placa, fechaIngreso, horaIngreso, fechaSalida, horaSalida) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    plaza.id_Plaza,
                    empleadoId,
                    vehiculo.id_Placa,
                    fechaIngreso.toISOString().split('T')[0], // YYYY-MM-DD
                    horaIngreso,
                    fechaSalida ? fechaSalida.toISOString().split('T')[0] : null,
                    horaSalida
                ]);
            }
            console.log('100 tickets de ejemplo insertados');
        }

        console.log('✅ Base de datos configurada correctamente');
        
        // Mostrar estadísticas
        const [plazas] = await connection.execute('SELECT COUNT(*) as total, SUM(estado = "ocupado") as ocupadas FROM plaza');
        const [tickets] = await connection.execute('SELECT COUNT(*) as total FROM ticket');
        const [vehiculos] = await connection.execute('SELECT COUNT(*) as total FROM vehiculo');
        const [empleados] = await connection.execute('SELECT COUNT(*) as total FROM empleado');

    } catch (error) {
        console.error('❌ Error configurando la base de datos:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('🎉 Configuración completada');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error en la configuración:', error);
            process.exit(1);
        });
}

module.exports = { setupDatabase };