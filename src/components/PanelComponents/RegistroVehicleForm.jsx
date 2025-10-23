import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { FaCar, FaMotorcycle, FaBiking } from 'react-icons/fa';

function RegistroVehicleForm({ onRegister }) {
  const [placa, setPlaca] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [plaza, setPlaza] = useState('');

  // Se elimina el estado y el efecto para el reloj en tiempo real para evitar confusión con la hora del servidor.

  const handlePlacaChange = (e) => {
    setPlaca(e.target.value.toUpperCase());
  };

  const handleTipoVehiculoChange = (tipo) => {
    setTipoVehiculo(tipo);
    // Asignar una plaza aleatoria según el tipo de vehículo
    const areas = tipo === 'carro' ? ['A', 'B'] : ['C'];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const number = Math.floor(Math.random() * 20) + 1;
    setPlaza(`${area} ${number}`);
  };

  const getEmpleadoId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.id_Empleado ? user.id_Empleado : null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placa || !tipoVehiculo) {
      alert('Por favor, complete todos los campos');
      return;
    }
    const id_Empleado = getEmpleadoId();
    if (!id_Empleado) {
      alert('No se pudo obtener el empleado logueado.');
      return;
    }

    try {
      await apiClient.post('/tickets', {
        placa,
        tipoVehiculo: tipoVehiculo.toUpperCase(),
        plaza,
        id_Empleado
      });

      setPlaca('');
      setTipoVehiculo('');
      setPlaza('');
      // FIX: Se elimina la llamada a onRegister() para prevenir la doble recarga de datos.
      // El componente TableVehicle ya se encarga de llamar a onReload, que actualiza la lista.
      if (onRegister) onRegister();

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'No se pudo registrar el vehículo';
      alert('Error: ' + errorMessage);
    }
  };

  return (
    // Se ajusta la altura para que sea flexible si el contenido cambia
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto flex flex-col justify-between">
      <h2 className="text-xl font-bold text-center mb-6">INGRESO DE VEHÍCULOS</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow justify-between">
        <div className="space-y-8">
          <div>
            <label className="block text-gray-600 mb-3 text-left font-medium">Número de placa</label>
            <input
              type="text"
              placeholder="Ej: ABC123"
              value={placa}
              onChange={handlePlacaChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-3 text-center font-medium">Tipo de vehículo</label>
            <div className="flex justify-center gap-2">
              <button
                data-testid="carro-button"
                type="button"
                onClick={() => handleTipoVehiculoChange('carro')}
                className={`flex items-center justify-center p-4 border rounded-md ${tipoVehiculo === 'carro' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-500'}`}
              >
                <FaCar size={28} />
              </button>
              <button
                data-testid="moto-button"
                type="button"
                onClick={() => handleTipoVehiculoChange('moto')}
                className={`flex items-center justify-center p-4 border rounded-md ${tipoVehiculo === 'moto' ? 'border-purple-500 text-purple-500 bg-purple-50' : 'border-gray-300 text-gray-500'}`}
              >
                <FaMotorcycle size={28} />
              </button>
              <button
                data-testid="bicicleta-button"
                type="button"
                onClick={() => handleTipoVehiculoChange('bicicleta')}
                className={`flex items-center justify-center p-4 border rounded-md ${tipoVehiculo === 'bicicleta' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-500'}`}
              >
                <FaBiking size={28} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-8">
          <button
            type="submit"
            className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition duration-300 flex items-center justify-center text-lg"
          >
            <span>+ Agregar</span>
          </button>
        </div>
      </form>
      {/* Se elimina el contenedor del reloj */}
    </div>
  );
}

export default RegistroVehicleForm;
