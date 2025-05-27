import React, { useState } from 'react';
import { FaFilter, FaSearch, FaPrint, FaUndo, FaTrash } from 'react-icons/fa';
import { useVehicles } from '../../context/VehicleContext';

function TableVehicle() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { vehicles, markAsExited, removeVehicle, printTicket } = useVehicles();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filtrar los datos según el término de búsqueda
  const filteredData = vehicles.filter(vehicle => 
    vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar el color de fondo según el tipo de vehículo
  const getTipoBackgroundColor = (tipo) => {
    switch (tipo) {
      case 'CARRO':
        return 'bg-blue-100 text-blue-700';
      case 'MOTO':
        return 'bg-purple-100 text-purple-700';
      case 'BICICLETA':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Determinar el color y el icono según el estado
  const getEstadoDisplay = (estado) => {
    if (estado.includes('En parqueo')) {
      return (
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-green-600">{estado}</span>
        </div>
      );
    } else if (estado.includes('Salió')) {
      return (
        <div className="flex items-center">
          <span className="text-orange-500">✓</span>
          <span className="text-orange-600 ml-2">{estado}</span>
        </div>
      );
    }
    return <span>{estado}</span>;
  };

  // Determinar el color de fondo para la placa
  const getPlacaBackgroundColor = (placa) => {
    if (placa.startsWith('BV')) {
      return 'bg-green-100 text-green-700';
    } else if (placa.startsWith('HT') || placa.startsWith('HF')) {
      return 'bg-blue-100 text-blue-700';
    }
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
            onClick={toggleFilters}
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
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plaza
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlacaBackgroundColor(vehicle.placa)}`}>
                    {vehicle.placa}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoBackgroundColor(vehicle.tipo)}`}>
                    {vehicle.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {vehicle.ingreso}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {vehicle.plaza}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoDisplay(vehicle.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => printTicket(vehicle.id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                      title="Imprimir ticket"
                    >
                      <FaPrint />
                    </button>
                    <button 
                      onClick={() => markAsExited(vehicle.id)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                      disabled={vehicle.estado.includes('Salió')}
                      title="Marcar salida"
                      style={{ opacity: vehicle.estado.includes('Salió') ? 0.5 : 1 }}
                    >
                      <FaUndo />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Está seguro de eliminar el registro de ${vehicle.placa}?`)) {
                          removeVehicle(vehicle.id);
                        }
                      }}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                      title="Eliminar registro"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableVehicle;