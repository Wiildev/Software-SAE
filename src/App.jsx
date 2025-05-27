import LoginForm from './components/LoginForm'
import VehicleCards from './components/panelcomponents/VehicleCards'
import Navbar from './components/panelcomponents/Navbar'
import ResetPassword from './components/ResetPassword'
import UserRegistration from './components/UserRegistration'
import RegistroVehicleForm from './components/panelcomponents/RegistroVehicleForm'
import TableVehicle from './components/panelcomponents/TableVehicle'
import { VehicleProvider } from './context/VehicleContext'

function App() {
  return (
    <VehicleProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Ver los coponentes */}
        <Navbar />
        <div className="container mx-auto p-4">
          <VehicleCards />
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <RegistroVehicleForm />
            </div>
            <div className="w-full md:w-3/4">
              <TableVehicle />
            </div>
          </div>
        </div>
      </div>
    </VehicleProvider>
  )
}

export default App


