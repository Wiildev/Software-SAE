import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserRegistration from './components/UserRegistration';
import ResetPassword from './components/ResetPassword';
import VehicleCards from './components/PanelComponents/VehicleCards';
import Navbar from './components/PanelComponents/Navbar';
import RegistroVehicleForm from './components/PanelComponents/RegistroVehicleForm';
import TableVehicle from './components/PanelComponents/TableVehicle';
import Account from './components/Account';
import Report from './components/Report';
import Statistics from './components/Statistics';
import React, { useState, useCallback, useEffect } from 'react';
import apiClient from './api/apiClient'; // Importa apiClient

function App() {
  const [reload, setReload] = useState(false);
  const handleReload = useCallback(() => setReload(r => !r), []);

  // Estado centralizado para la lista de vehículos
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  // useEffect para obtener los datos de los vehículos cuando 'reload' cambie
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setError(null);
        const response = await apiClient.get('/tickets/detalles');
        setVehicles(response.data.tickets || []);
      } catch (err) {
        setError('Error al cargar los datos de vehículos');
        console.error(err);
        setVehicles([]); // Asegurar que vehicles es un array vacío en caso de error
      }
    };

    fetchVehicles();
  }, [reload]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <LoginForm />
              </div>
            </div>
          } />
          <Route path="/UserRegistration" element={
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <UserRegistration />
              </div>
            </div>
          } />
          <Route path="/recuperar-password" element={
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <ResetPassword />
              </div>
            </div>
          } />
          <Route path="/panel" element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                  <div className="w-full">
                    {/* Pasa la lista de vehículos directamente */}
                    <VehicleCards vehicles={vehicles} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                      <RegistroVehicleForm onRegister={handleReload} />
                    </div>
                    <div className="w-full md:w-2/3">
                      {/* Pasa la lista de vehículos y el manejador de recarga */}
                      <TableVehicle 
                        vehicles={vehicles} 
                        onReload={handleReload}
                        error={error} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/cuenta" element={
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <Navbar />
              <div className="flex-1 flex items-center justify-center">
                <Account />
              </div>
            </div>
          } />
          <Route path="/reporte" element={
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <Navbar />
              <div className="flex-1 flex items-center justify-center">
                <Report />
              </div>
            </div>
          } />
          <Route path="/estadisticas" element={
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <Navbar />
              <div className="flex-1">
                <Statistics />
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
