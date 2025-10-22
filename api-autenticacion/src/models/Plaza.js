class Plaza {
  constructor(db) {
    this.db = db;
  }

  // Buscar plaza por nombre/código
  async findByPlaza(plaza) {
    const [rows] = await this.db.query(
      `SELECT * FROM plaza WHERE plaza = ?`,
      [plaza]
    );
    return rows[0];
  }

  // Cambiar estado de la plaza
  async setEstado(id_Plaza, estado) {
    await this.db.query(
      `UPDATE plaza SET estado = ? WHERE id_Plaza = ?`,
      [estado, id_Plaza]
    );
  }
}

module.exports = Plaza;