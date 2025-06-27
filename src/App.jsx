import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserRegistration from './components/UserRegistration';
import ResetPassword from './components/ResetPassword';
import VehicleCards from './components/panelcomponents/VehicleCards';
import Navbar from './components/panelcomponents/Navbar';
import RegistroVehicleForm from './components/panelcomponents/RegistroVehicleForm';
import TableVehicle from './components/panelcomponents/TableVehicle';
import { VehicleProvider } from './context/VehicleContext';
import Account from './components/Account';
import Report from './components/Report';

function App() {
  return (
    <VehicleProvider>
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
                      <VehicleCards />
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-1/3">
                        <RegistroVehicleForm />
                      </div>
                      <div className="w-full md:w-2/3">
                        <TableVehicle />
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
          </Routes>
        </div>
      </Router>
    </VehicleProvider>
  );
}

export default App;
