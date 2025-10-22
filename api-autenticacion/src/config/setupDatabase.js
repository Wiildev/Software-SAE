const mysql = require('mysql2/promise');
const { dbConfig } = require('./database');

async function setupDatabase() {
    let connection;
    
    try {
        const connectionConfig = { ...dbConfig };
        delete connectionConfig.database;
        
        connection = await mysql.createConnection(connectionConfig);
        console.log('Conectado a MySQL');

        await connection.query(`CREATE DATABASE IF NOT EXISTS sae_software`);
        console.log('Base de datos sae_software verificada/creada');

        await connection.query(`USE sae_software`);

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

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS plaza (
                id_Plaza INT AUTO_INCREMENT PRIMARY KEY,
                plaza VARCHAR(50) NOT NULL,
                estado ENUM('libre', 'ocupado') DEFAULT 'libre',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla plaza verificada/creada');

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS vehiculo (
                id_Placa INT AUTO_INCREMENT PRIMARY KEY,
                placa VARCHAR(20) UNIQUE NOT NULL,
                tipoVehiculo ENUM('CARRO', 'MOTO', 'BICICLETA') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla vehiculo verificada/creada');

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
            console.log('50 plazas de ejemplo insertadas');
        }

        console.log('✅ Base de datos configurada correctamente (sin usuarios por defecto)');

    } catch (error) {
        console.error('❌ Error configurando la base de datos:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

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