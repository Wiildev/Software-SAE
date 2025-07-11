const TICKET_SELECT_FIELDS = `id_Ticket, id_Plaza, id_Empleado, id_Placa, fechaIngreso, horaIngreso, fechaSalida, horaSalida, TIMESTAMPDIFF(MINUTE, CONCAT(fechaIngreso, ' ', horaIngreso), CONCAT(fechaSalida, ' ', horaSalida)) AS duracion`;

class Ticket {
  constructor(db) {
    this.db = db;
  }

  // Crear un nuevo ticket (registro de ingreso)
  async create({ id_Plaza, id_Empleado, id_Placa }) {
    // Guardar fecha y hora actuales automáticamente
    const [result] = await this.db.query(
      `INSERT INTO Ticket (id_Plaza, id_Empleado, id_Placa, fechaIngreso, horaIngreso) VALUES (?, ?, ?, CURDATE(), CURTIME())`,
      [id_Plaza, id_Empleado, id_Placa]
    );
    return result.insertId;
  }

  // Marcar salida (actualizar fecha/hora de salida)
  async markExit(id_Ticket) {
    await this.db.query(
      `UPDATE Ticket SET fechaSalida = CURDATE(), horaSalida = CURTIME() WHERE id_Ticket = ?`,
      [id_Ticket]
    );
  }

  // Eliminar ticket
  async delete(id_Ticket) {
    await this.db.query(
      `DELETE FROM Ticket WHERE id_Ticket = ?`,
      [id_Ticket]
    );
  }

  // Obtener todos los tickets (puedes filtrar por fecha si lo deseas)
  async getAll() {
    const [rows] = await this.db.query(
      `SELECT ${TICKET_SELECT_FIELDS} FROM Ticket`
    );
    return rows;
  }

  // Obtener todos los tickets con detalles de vehículo y plaza
  async getAllWithDetails() {
    const [rows] = await this.db.query(`
      SELECT 
        t.id_Ticket,
        v.placa,
        v.tipoVehiculo,
        t.horaIngreso,
        p.plaza,
        p.estado,
        t.horaSalida,
        TIMESTAMPDIFF(MINUTE, CONCAT(t.fechaIngreso, ' ', t.horaIngreso), CONCAT(t.fechaSalida, ' ', t.horaSalida)) AS duracion
      FROM Ticket t
      JOIN Vehiculo v ON t.id_Placa = v.id_Placa
      JOIN Plaza p ON t.id_Plaza = p.id_Plaza
    `);
    return rows;
  }
}

module.exports = Ticket; 