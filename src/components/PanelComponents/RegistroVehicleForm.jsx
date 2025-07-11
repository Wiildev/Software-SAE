import React, { useState, useEffect } from 'react';
import { FaCar, FaMotorcycle, FaBiking } from 'react-icons/fa';

function RegistroVehicleForm({ onRegister }) {
  const [placa, setPlaca] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [plaza, setPlaza] = useState('');

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const isAm = hours < 12;
      setAmPm(isAm ? 'AM' : 'PM');
      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = hours.toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Obtener el id_Empleado del usuario logueado desde localStorage
  const getEmpleadoId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.id_Empleado ? user.id_Empleado : null;
    } catch {
      return null;
    }
  };

  // Enviar los datos al backend para registrar el ingreso
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
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa,
        tipoVehiculo: tipoVehiculo.toUpperCase(),
        plaza,
        id_Empleado
      })
    });
    if (response.ok) {
      setPlaca('');
      setTipoVehiculo('');
      setPlaza('');
      if (onRegister) onRegister(); // Notificar al padre para recargar la tabla
    } else {
      const data = await response.json();
      alert('Error: ' + (data.error || 'No se pudo registrar'));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto h-[calc(100vh-240px)] flex flex-col justify-between">
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
                type="button"
                onClick={() => handleTipoVehiculoChange('carro')}
                className={`flex items-center justify-center p-4 border rounded-md ${tipoVehiculo === 'carro' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-500'}`}
              >
                <FaCar size={28} />
              </button>
              <button
                type="button"
                onClick={() => handleTipoVehiculoChange('moto')}
                className={`flex items-center justify-center p-4 border rounded-md ${tipoVehiculo === 'moto' ? 'border-purple-500 text-purple-500 bg-purple-50' : 'border-gray-300 text-gray-500'}`}
              >
                <FaMotorcycle size={28} />
              </button>
              <button
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
      <div className="text-center mt-2">
        <div className="flex items-center justify-center bg-gray-200  py-2 px-4 rounded-lg shadow-sm">
          <div className="text-4xl font-mono text-black">{currentTime}</div>
          <div className="ml-2 bg-blue-500 text-white text-sm font-bold px-2.5 py-1 rounded">
            {amPm}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroVehicleForm;