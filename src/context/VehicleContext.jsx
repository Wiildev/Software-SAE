import React, { createContext, useState, useContext } from 'react';

const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);

  // Agregar un nuevo vehículo
  const addVehicle = (vehicle) => {
    const newVehicle = {
      id: Date.now(),
      ...vehicle,
      estado: 'En parqueo'
    };
    setVehicles([...vehicles, newVehicle]);
  };

  // Marcar un vehículo como salido
  const markAsExited = (id) => {
    setVehicles(vehicles.map(vehicle => {
      if (vehicle.id === id && !vehicle.salida) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours.toString().padStart(2, '0');
        const exitTime = `${hours}:${minutes} ${ampm}`;
        return { ...vehicle, estado: `Salió`, salida: exitTime };
      }
      return vehicle;
    }));
  };

  // Eliminar un vehículo
  const removeVehicle = (id) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };

  // Imprimir ticket (simulado)
  const printTicket = (id) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      console.log('Imprimiendo ticket para:', vehicle);
      // Aquí iría la lógica real de impresión
      alert(`Imprimiendo ticket para vehículo: ${vehicle.placa}`);
    }
  };

  return (
    <VehicleContext.Provider value={{ 
      vehicles, 
      addVehicle, 
      markAsExited, 
      removeVehicle, 
      printTicket 
    }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  return useContext(VehicleContext);
}