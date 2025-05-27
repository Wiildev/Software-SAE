import { useState } from 'react';
// Iconos importadis de React Icons
import { FaBars, FaTimes, FaBell, FaUser, FaChevronDown, FaClipboardList, FaChartBar, FaFileAlt, FaUserCircle, FaSignOutAlt, FaQuestionCircle, FaCog } from 'react-icons/fa';

function Navbar() {
  // Estado para controlar si el menú está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Estado para controlar si el menú de perfil está abierto o cerrado
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // Estado para controlar si el menú de notificaciones está abierto o cerrado
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  // Número de notificaciones pendientes (esto podría venir de una API en una aplicación real)
  const [notificationCount] = useState(3);
  // Ejemplo de notificaciones
  const [notifications] = useState([
    { id: 1, message: "Nueva actualización disponible", time: "Hace 5 min" },
    { id: 2, message: "Nuevo usuario registrado", time: "Hace 30 min" },
    { id: 3, message: "Reporte completado", time: "Hace 1 hora" }
  ]);

  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para alternar el estado del menú de perfil
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  // Función para alternar el estado del menú de notificaciones
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  return (
    <div className="w-full">
      {/* Barra de navegación principal - fijada en la parte superior */}
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center w-full">
        {/* Botón de menú hamburguesa */}
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Título o logo - visible en todo momento */}
        <div className="ml-8 font-bold">
          Sistema Automático de Estacionamiento
        </div>

        {/* Sección derecha: notificaciones y perfil */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={toggleNotifications} className="text-white focus:outline-none relative">
              <FaBell size={24} />
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* Menú desplegable de notificaciones */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 font-medium text-gray-700 border-b border-gray-200">
                  Notificaciones
                </div>
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                    <a href="#" className="block text-center text-sm text-blue-500 hover:text-blue-600 py-2">
                      Ver todas las notificaciones
                    </a>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No hay notificaciones nuevas
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="flex items-center bg-blue-400 rounded-full px-4 py-2 shadow-md cursor-pointer" onClick={toggleProfileMenu}>
              <div className="bg-white rounded-full p-1 mr-2">
                <FaUser className="text-blue-500" size={18} />
              </div>
              <span className="text-white font-medium">Admin</span>
              <FaChevronDown className="text-white ml-2" size={14} />
            </div>

            {/* Menú desplegable del perfil */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaUserCircle className="mr-3 text-gray-600" size={16} />
                  <span>Cuenta</span>
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaQuestionCircle className="mr-3 text-gray-600" size={16} />
                  <span>Ayuda</span>
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaCog className="mr-3 text-gray-600" size={16} />
                  <span>Configuración</span>
                </a>
                <div className="border-t border-gray-200 my-1"></div>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaSignOutAlt className="mr-3 text-gray-600" size={16} />
                  <span>Cerrar sesión</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Menú lateral desplegable */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 flex flex-col">
          {/* Encabezado del menú */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Menú</h2>
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <FaTimes size={20} />
            </button>
          </div>

          {/* Opciones principales del menú */}
          <ul className="py-2 flex-grow">
            {/* Opción Registros */}
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
              <FaClipboardList className="mr-3 text-gray-600" />
              <span>Registros</span>
            </li>

            {/* Opción Estadística */}
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
              <FaChartBar className="mr-3 text-gray-600" />
              <span>Estadística</span>
            </li>

            {/* Opción Reporte */}
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
              <FaFileAlt className="mr-3 text-gray-600" />
              <span>Reporte</span>
            </li>

            {/* Opción Cuenta */}
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700">
              <FaUserCircle className="mr-3 text-gray-600" />
              <span>Cuenta</span>
            </li>
          </ul>
          
          {/* Sección inferior con separador y cierre de sesión */}
          <div className="mt-auto">
            {/* Separador */}
            <div className="border-t border-gray-200"></div>

            {/* Opción Cerrar sesión */}
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center text-gray-700 list-none">
              <FaSignOutAlt className="mr-3 text-gray-600" />
              <span>Cerrar sesión</span>
            </li>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;