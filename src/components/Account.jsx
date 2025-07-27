import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

const Account = () => {
  const [userData, setUserData] = useState({
    nombreCompleto: '',
    cargo: '',
    numeroDocumento: '',
    telefono: '',
    nombreUsuario: '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserData({
            nombreCompleto: user.nombreCompleto || '',
            cargo: user.tipoUsuario || '',
            numeroDocumento: user.numeroDocumento || '',
            telefono: user.telefono || '',
            nombreUsuario: user.nombreUsuario || '',
            contrasena: '' // No cargamos la contraseña por seguridad
          });
        } else {
          setMessage({ type: 'error', text: 'No se encontraron datos de usuario' });
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setMessage({ type: 'error', text: 'Error al cargar datos del usuario' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar actualización de datos
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No se encontraron datos de usuario');
      }

      const currentUser = JSON.parse(storedUser);
      
      // Aquí podrías hacer una llamada a la API para actualizar los datos
      // Por ahora solo actualizamos el localStorage
      const updatedUser = {
        ...currentUser,
        nombreCompleto: userData.nombreCompleto,
        tipoUsuario: userData.cargo,
        numeroDocumento: userData.numeroDocumento,
        telefono: userData.telefono,
        nombreUsuario: userData.nombreUsuario
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Datos actualizados exitosamente' });

    } catch (error) {
      console.error('Error al actualizar datos:', error);
      setMessage({ type: 'error', text: 'Error al actualizar los datos' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de cuenta
  const handleDeleteAccount = () => {
    if (window.confirm('¿Está seguro de que desea eliminar su cuenta? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1100px] mx-auto mt-8 bg-white rounded-2xl shadow p-8 px-12 py-16 min-h-[600px] border border-gray-200">
        <div className="flex justify-center items-center h-full">
          <div className="text-gray-500">Cargando datos del usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto mt-8 bg-white rounded-2xl shadow p-8 px-12 py-16 min-h-[600px] border border-gray-200">
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow">
          <FaUser className="text-gray-400" size={80} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Mi Cuenta</h2>
      </div>

      {/* Mensajes de estado */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              name="nombreCompleto"
              value={userData.nombreCompleto}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <input
              type="text"
              name="cargo"
              value={userData.cargo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de documento</label>
            <input
              type="text"
              name="numeroDocumento"
              value={userData.numeroDocumento}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={userData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario</label>
            <input
              type="text"
              name="nombreUsuario"
              value={userData.nombreUsuario}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={userData.contrasena}
              onChange={handleInputChange}
              placeholder="Ingrese nueva contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-8 mt-16">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-10 rounded-full text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-red-600 font-semibold hover:underline text-lg"
          >
            Eliminar cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default Account;
