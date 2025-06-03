const bcrypt = require('bcrypt');

class MySQLSimulator {
  constructor() {
    this.tables = {
      usuarios: []
    };
    this.autoIncrementIds = {
      usuarios: 1
    };
    this.seed();
  }

  async seed() {
    try {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      
      this.tables.usuarios.push({
        id: this.autoIncrementIds.usuarios++,
        fullName: 'Administrador',
        username: 'admin',
        documentNumber: '12345678',
        email: 'admin@example.com',
        role: 'admin',
        phoneNumber: '123456789',
        password: adminPassword,
        fecha_creacion: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error en seed:', error);
    }
  }

  async query(sql, params = []) {
    try {
      console.log(`Query: ${sql}`, `Params: ${JSON.stringify(params)}`);
      
      if (sql.toLowerCase().startsWith('select')) {
        return this.handleSelect(sql, params);
      }
      if (sql.toLowerCase().startsWith('insert')) {
        return this.handleInsert(sql, params);
      }
      throw new Error(`Tipo de consulta no soportada: ${sql}`);
    } catch (error) {
      console.error('Error en query:', error);
      throw error;
    }
  }

  handleSelect(sql, params) {
    const tableMatch = sql.match(/from\s+(\w+)/i);
    if (!tableMatch) throw new Error('Tabla no especificada');
    
    const tableName = tableMatch[1].toLowerCase();
    if (!this.tables[tableName]) throw new Error(`Tabla '${tableName}' no existe`);
    
    let results = [...this.tables[tableName]];
    
    const whereMatch = sql.match(/where\s+(.+?)(?:\s+order\s+by|\s+limit|$)/i);
    if (whereMatch) {
      const conditions = whereMatch[1].toLowerCase();
      results = results.filter(row => {
        if (conditions.includes('username = ?')) {
          return row.username.toLowerCase() === params[0].toLowerCase();
        }
        if (conditions.includes('email = ?')) {
          return row.email.toLowerCase() === params[0].toLowerCase();
        }
        if (conditions.includes('username = ? or email = ?')) {
          return row.username.toLowerCase() === params[0].toLowerCase() || 
                 row.email.toLowerCase() === params[1].toLowerCase();
        }
        return true;
      });
    }
    
    return { results };
  }

  handleInsert(sql, params) {
    const tableMatch = sql.match(/insert\s+into\s+(\w+)/i);
    if (!tableMatch) throw new Error('Tabla no especificada');
    
    const tableName = tableMatch[1].toLowerCase();
    if (!this.tables[tableName]) throw new Error(`Tabla '${tableName}' no existe`);
    
    const columnsMatch = sql.match(/\(([^)]+)\)/i);
    if (!columnsMatch) throw new Error('Columnas no especificadas');
    
    const columns = columnsMatch[1].split(',').map(col => col.trim());
    
    const newRecord = {
      id: this.autoIncrementIds[tableName]++,
      fecha_creacion: new Date().toISOString()
    };
    
    columns.forEach((col, index) => {
      if (params[index] !== undefined) {
        newRecord[col] = params[index];
      }
    });
    
    this.tables[tableName].push(newRecord);
    return { insertId: newRecord.id, affectedRows: 1 };
  }
}

module.exports = new MySQLSimulator(); 