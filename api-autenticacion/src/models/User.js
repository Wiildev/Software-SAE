const bcrypt = require('bcrypt');

class User {
  constructor(db) {
    this.db = db;
  }

 

  async findByEmail(email) {
    const { results } = await this.db.query('SELECT * FROM empleado WHERE correoElectronico = ?', [email]);
    return results[0];
  }


  async findByUsername(username) {
    const { results } = await this.db.query('SELECT * FROM empleado WHERE nombreUsuario = ?', [username]);
    return results[0];
  }

  async create(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const { results } = await this.db.query(
      'INSERT INTO empleado (nombreCompleto, nombreUsuario, numeroDocumento, correoElectronico, tipoUsuario, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userData.fullName,
        userData.username,
        userData.documentNumber,
        userData.email,
        userData.role,
        userData.phoneNumber,
        hashedPassword
      ]
    );
    return results;
  }

  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 