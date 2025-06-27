const Ticket = require('../models/Ticket');
const Vehiculo = require('../models/Vehiculo');
const Plaza = require('../models/Plaza');

class TicketController {
  constructor(db) {
    this.ticketModel = new Ticket(db);
    this.vehiculoModel = new Vehiculo(db);
    this.plazaModel = new Plaza(db);
  }

  // Registrar ingreso de vehículo y ticket
  async registrarIngreso(req, res) {
    try {
      const { placa, tipoVehiculo, plaza, id_Empleado } = req.body;
      // 1. Buscar o crear vehículo
      let vehiculo = await this.vehiculoModel.findByPlaca(placa);
      let id_Placa;
      if (!vehiculo) {
        id_Placa = await this.vehiculoModel.create({ placa, tipoVehiculo });
      } else {
        id_Placa = vehiculo.id_Placa;
      }
      // 2. Buscar plaza
      const plazaObj = await this.plazaModel.findByPlaza(plaza);
      if (!plazaObj) return res.status(400).json({ error: 'Plaza no encontrada' });
      // 3. Crear ticket
      const id_Ticket = await this.ticketModel.create({ id_Plaza: plazaObj.id_Plaza, id_Empleado, id_Placa });
      // 4. Marcar plaza como ocupada
      await this.plazaModel.setEstado(plazaObj.id_Plaza, 'ocupado');
      res.status(201).json({ mensaje: 'Ingreso registrado', id_Ticket });
    } catch (error) {
      console.error('Error en registrarIngreso:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  // Marcar salida de vehículo
  async marcarSalida(req, res) {
    try {
      const { id } = req.params;
      // 1. Actualizar ticket con fecha/hora de salida
      await this.ticketModel.markExit(id);
      // 2. Obtener ticket para saber la plaza
      const tickets = await this.ticketModel.getAll();
      const ticket = tickets.find(t => t.id_Ticket == id);
      if (ticket) {
        // 3. Marcar plaza como libre
        await this.plazaModel.setEstado(ticket.id_Plaza, 'libre');
      }
      res.json({ mensaje: 'Salida registrada' });
    } catch (error) {
      console.error('Error en marcarSalida:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  // Eliminar ticket
  async eliminarTicket(req, res) {
    try {
      const { id } = req.params;
      // 1. Obtener ticket para saber la plaza
      const tickets = await this.ticketModel.getAll();
      const ticket = tickets.find(t => t.id_Ticket == id);
      if (ticket) {
        // 2. Marcar plaza como libre
        await this.plazaModel.setEstado(ticket.id_Plaza, 'libre');
      }
      // 3. Eliminar ticket
      await this.ticketModel.delete(id);
      res.json({ mensaje: 'Ticket eliminado' });
    } catch (error) {
      console.error('Error en eliminarTicket:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  // Obtener todos los tickets
  async obtenerTickets(req, res) {
    try {
      const tickets = await this.ticketModel.getAll();
      res.json({ tickets });
    } catch (error) {
      console.error('Error en obtenerTickets:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  // Obtener todos los vehículos
  async obtenerVehiculos(req, res) {
    try {
      const vehiculos = await this.vehiculoModel.getAll();
      res.json({ vehiculos });
    } catch (error) {
      console.error('Error en obtenerVehiculos:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }

  // Obtener todos los tickets con detalles de vehículo y plaza
  async obtenerTicketsConDetalles(req, res) {
    try {
      const tickets = await this.ticketModel.getAllWithDetails();
      res.json({ tickets });
    } catch (error) {
      console.error('Error en obtenerTicketsConDetalles:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
}

module.exports = TicketController; 