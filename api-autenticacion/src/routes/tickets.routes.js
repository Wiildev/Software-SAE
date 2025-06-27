const express = require('express');
const router = express.Router();
const { createPool } = require('../config/database');
const TicketController = require('../controllers/ticketController');

const pool = createPool();
const ticketController = new TicketController(pool);

// Registrar ingreso de vehículo y ticket
router.post('/', (req, res) => ticketController.registrarIngreso(req, res));

// Marcar salida de vehículo
router.put('/:id/salida', (req, res) => ticketController.marcarSalida(req, res));

// Eliminar ticket
router.delete('/:id', (req, res) => ticketController.eliminarTicket(req, res));

// Obtener todos los tickets
router.get('/', (req, res) => ticketController.obtenerTickets(req, res));

// Obtener todos los vehículos
router.get('/vehiculos', (req, res) => ticketController.obtenerVehiculos(req, res));

// Obtener todos los tickets con detalles de vehículo y plaza
router.get('/detalles', (req, res) => ticketController.obtenerTicketsConDetalles(req, res));

module.exports = router; 