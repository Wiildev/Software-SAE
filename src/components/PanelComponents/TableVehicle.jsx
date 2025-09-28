import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; // Ajustada la ruta de importación
import { FaFilter, FaSearch, FaPrint, FaUndo, FaTrash } from 'react-icons/fa';

function TableVehicle({ reload, onReload }) {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Cargar los tickets con detalles al montar el componente o cuando reload cambie
  const fetchTicketsWithDetails = async () => {
    try {
      const response = await apiClient.get('/tickets/detalles');
      setVehicles(response.data.tickets || []);
      if (onReload) onReload();
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTicketsWithDetails();
  }, [reload]);

  // Función para imprimir el ticket (sin cambios, ya que no hace llamada a la API)
  const printTicket = (vehicle) => {
    const ticketContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket de Estacionamiento</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
          .ticket { width: 300px; border: 2px solid #000; padding: 20px; text-align: center; background: white; }
          .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .welcome { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; text-align: left; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #1f2937; }
          .placa { font-size: 20px; font-weight: bold; color: #059669; margin: 10px 0; padding: 8px; border: 2px solid #059669; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 10px; }
          @media print { body { margin: 0; } .ticket { border: none; } }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="welcome">Bienvenido al Centro Comercial</div>
            <div style="font-size: 14px; color: #6b7280;">Ticket de Estacionamiento</div>
          </div>
          <div class="placa">${vehicle.placa}</div>
          <div class="info-row"><span class="label">Tipo de Vehículo:</span><span class="value">${vehicle.tipoVehiculo}</span></div>
          <div class="info-row"><span class="label">Plaza Asignada:</span><span class="value">${vehicle.plaza}</span></div>
          <div class="info-row"><span class="label">Fecha de Ingreso:</span><span class="value">${new Date(vehicle.fechaIngreso).toLocaleDateString('es-ES')}</span></div>
          <div class="info-row"><span class="label">Hora de Ingreso:</span><span class="value">${vehicle.horaIngreso}</span></div>
          <div class="footer"><div>Conserve este ticket</div><div>Gracias por su visita</div></div>
        </div>
      </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketContent);
    printWindow.document.close();
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };

  // Eliminar ticket
  const removeVehicle = async (id_Ticket) => {
    if (!window.confirm('¿Está seguro de eliminar el registro?')) return;
    try {
      await apiClient.delete(`/tickets/${id_Ticket}`);
      setVehicles(vehicles.filter(v => v.id_Ticket !== id_Ticket));
      if (onReload) onReload();
    } catch (error) {
      alert('Error al eliminar el registro.');
      console.error(error);
    }
  };

  // Marcar salida
  const markAsExited = async (id_Ticket) => {
    try {
      await apiClient.put(`/tickets/${id_Ticket}/salida`);
      fetchTicketsWithDetails(); // Recargar la lista
      if (onReload) onReload();
    } catch (error) {
      alert('Error al marcar la salida.');
      console.error(error);
    }
  };

  // Filtrar los datos según el término de búsqueda
  const filteredData = vehicles.filter(vehicle => 
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoBackgroundColor = (tipo) => {
    switch (tipo) {
      case 'CARRO': return 'bg-blue-100 text-blue-700';
      case 'MOTO': return 'bg-purple-100 text-purple-700';
      case 'BICICLETA': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoDisplay = (ticket) => {
    if (!ticket.fechaSalida) {
      return (
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-green-600">En parqueo</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="text-orange-500">✓</span>
          <span className="text-orange-600 ml-2">Salió</span>
        </div>
      );
    }
  };

  const getPlacaBackgroundColor = (placa) => {
    if (placa.startsWith('BV')) return 'bg-green-100 text-green-700';
    if (placa.startsWith('HT') || placa.startsWith('HF')) return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-240px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            Registros del día
            <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
              {filteredData.length} registros
            </span>
          </h2>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
          >
            <FaFilter className="mr-2" />
            Mostrar filtros
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por placa"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingreso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plaza</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No hay vehículos registrados</td>
              </tr>
            ) : (
              filteredData.map((vehicle, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlacaBackgroundColor(vehicle.placa)}`}>{vehicle.placa}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoBackgroundColor(vehicle.tipoVehiculo)}`}>{vehicle.tipoVehiculo}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">{vehicle.horaIngreso}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{vehicle.plaza}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">{getEstadoDisplay(vehicle)}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{vehicle.horaSalida || ''}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button onClick={() => printTicket(vehicle)} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition" title="Imprimir ticket"><FaPrint /></button>
                      <button onClick={() => markAsExited(vehicle.id_Ticket)} className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition" disabled={!!vehicle.fechaSalida} title="Marcar salida" style={{ opacity: vehicle.fechaSalida ? 0.5 : 1 }}><FaUndo /></button>
                      <button onClick={() => removeVehicle(vehicle.id_Ticket)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition" title="Eliminar registro"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableVehicle;
