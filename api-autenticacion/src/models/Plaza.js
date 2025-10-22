class Plaza {
  constructor(db) {
    this.db = db;
  }

  // CORREGIDO: Buscar la primera plaza libre disponible
  async findFreePlaza() {
    const [rows] = await this.db.query(
      `SELECT * FROM plaza WHERE estado = 'libre' ORDER BY id_Plaza ASC LIMIT 1`
    );
    return rows[0];
  }

  // Buscar plaza por nombre/código (mantenido por si se usa en otro lado)
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