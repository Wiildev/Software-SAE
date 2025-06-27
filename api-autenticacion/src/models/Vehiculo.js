class Vehiculo {
  constructor(db) {
    this.db = db;
  }

  // Crear un nuevo vehículo
  async create({ placa, tipoVehiculo }) {
    const [result] = await this.db.query(
      `INSERT INTO Vehiculo (placa, tipoVehiculo) VALUES (?, ?)`,
      [placa, tipoVehiculo]
    );
    return result.insertId;
  }

  // Buscar vehículo por placa
  async findByPlaca(placa) {
    const [rows] = await this.db.query(
      `SELECT * FROM Vehiculo WHERE placa = ?`,
      [placa]
    );
    return rows[0];
  }

  // Obtener todos los vehículos
  async getAll() {
    const [rows] = await this.db.query(
      `SELECT placa, tipoVehiculo FROM Vehiculo`
    );
    return rows;
  }
}

module.exports = Vehiculo; 