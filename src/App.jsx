import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserRegistration from './components/UserRegistration';
import ResetPassword from './components/ResetPassword';
import VehicleCards from './components/panelcomponents/VehicleCards';
import Navbar from './components/panelcomponents/Navbar';
import RegistroVehicleForm from './components/panelcomponents/RegistroVehicleForm';
import TableVehicle from './components/panelcomponents/TableVehicle';
import { VehicleProvider } from './context/VehicleContext';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          } />
          <Route path="/UserRegistration" element={
            <div className="w-full max-w-md">
              <UserRegistration />
            </div>
          } />
          <Route path="/recuperar-password" element={
            <div className="w-full max-w-md">
              <ResetPassword />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
