const mysql = require('mysql2/promise');
// Importamos la configuración INICIAL (sin DB) y el nombre de la DB desde las variables de entorno
const { initialDbConfig } = require('./database');
const dbName = process.env.MYSQLDATABASE;

async function setupDatabase() {
    let connection;

    if (!dbName) {
        console.error('❌ La variable de entorno MYSQLDATABASE no está definida. No se puede continuar.');
        throw new Error('MYSQLDATABASE no está definida.');
    }
    
    try {
        // Paso 1: Conectarse al servidor MySQL SIN especificar una base de datos
        connection = await mysql.createConnection(initialDbConfig);
        console.log('🔌 Conectado a MySQL para la configuración inicial.');

        // Paso 2: Crear la base de datos usando la variable de entorno
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Base de datos \"${dbName}\" verificada o creada.`);

        // Paso 3: Seleccionar la base de datos recién creada para las operaciones siguientes
        await connection.query(`USE \`${dbName}\``);

        // Paso 4: Crear la tabla de empleados
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS empleado (
                id_Empleado INT AUTO_INCREMENT PRIMARY KEY,
                nombreCompleto VARCHAR(255) NOT NULL,
                nombreUsuario VARCHAR(100) UNIQUE NOT NULL,
                numeroDocumento VARCHAR(50) NOT NULL,
                correoElectronico VARCHAR(255) UNIQUE NOT NULL, 
                tipoUsuario ENUM('Admin', 'Emple') NOT NULL,
                telefono VARCHAR(20),
                contrasena VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('-> Tabla \"empleado\" verificada o creada.');

        // Paso 5: Crear la tabla de plazas
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS plaza (
                id_Plaza INT AUTO_INCREMENT PRIMARY KEY,
                plaza VARCHAR(50) NOT NULL,
                estado ENUM('libre', 'ocupado') DEFAULT 'libre',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('-> Tabla \"plaza\" verificada o creada.');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vehiculo (
                id_Placa INT AUTO_INCREMENT PRIMARY KEY,
                placa VARCHAR(20) UNIQUE NOT NULL,
                tipoVehiculo ENUM('CARRO', 'MOTO', 'BICICLETA') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('-> Tabla \"vehiculo\" verificada o creada.');

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
        console.log('-> Tabla \"ticket\" verificada o creada.');

        // Paso 6: Poblar las plazas si la tabla está vacía
        const [plazaCount] = await connection.execute('SELECT COUNT(*) as count FROM plaza');
        if (plazaCount[0].count === 0) {
            console.log('Insertando plazas de ejemplo...');
            for (let i = 1; i <= 50; i++) {
                const nombrePlaza = `P${String(i).padStart(3, '0')}`;
                await connection.execute(
                    'INSERT INTO plaza (plaza, estado) VALUES (?, ?)',
                    [nombrePlaza, 'libre']
                );
            }
            console.log('-> 50 plazas de ejemplo insertadas.');
        }

        console.log('🎉 Configuración de la base de datos completada con éxito.');

    } catch (error) {
        console.error('💥 Error crítico durante la configuración de la base de datos:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexión de configuración cerrada.');
        }
    }
}

// Si el script se ejecuta directamente, lo corre.
if (require.main === module) {
    setupDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch(() => {
            process.exit(1);
        });
}

module.exports = { setupDatabase };