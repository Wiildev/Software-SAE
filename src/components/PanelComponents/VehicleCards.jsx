import React, { useEffect, useState } from 'react';
// import { useVehicles } from '../../context/VehicleContext'; // Ya no se usa

function Card({ title, count, color, icon, borderColor }) {
  // Mapeo de colores para los diferentes tipos de tarjetas
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-600',
    orange: 'bg-orange-500',
    green: 'bg-green-500'
  };

  // Obtener la clase de color correspondiente o usar azul por defecto
  const bgColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border-l-9" style={{ borderLeftColor: borderColor }}>
      <div className={`${bgColorClass} p-5 flex items-center justify-center ml-2`}>
        {icon}
      </div>
      <div className="p-4 flex flex-col">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
}

// Componente que muestra todas las tarjetas de vehículos
function VehicleCards({ reload }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/tickets/detalles')
      .then(res => res.json())
      .then(data => setVehicles(data.tickets || []));
  }, [reload]);

  // Contar vehículos actualmente en el estacionamiento (estado = 'ocupado')
  const activeVehicles = vehicles.filter(v => v.estado === 'ocupado');

  // Contar por tipo de vehículo
  const carCount = activeVehicles.filter(v => v.tipoVehiculo === 'CARRO').length;
  const motoCount = activeVehicles.filter(v => v.tipoVehiculo === 'MOTO').length;
  const bikeCount = activeVehicles.filter(v => v.tipoVehiculo === 'BICICLETA').length;
  const totalCount = carCount + motoCount + bikeCount;

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          title="Carros" 
          count={carCount} 
          color="blue" 
          borderColor="#0284c7"
          icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>} 
        />
        
        <Card 
          title="Moto" 
          count={motoCount} 
          color="purple" 
          borderColor="#9333ea"
          icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H7.82zM19 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
          </svg>} 
        />
        
        <Card 
          title="Bicicleta" 
          count={bikeCount} 
          color="orange" 
          borderColor="#f97316"
          icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
          </svg>} 
        />
        
        <Card 
          title="Total vehículos" 
          count={totalCount} 
          color="green" 
          borderColor="#22c55e"
          icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>} 
        />
      </div>
    </div>
  );
}

export default VehicleCards;