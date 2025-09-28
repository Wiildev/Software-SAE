import React, { useState } from 'react';
import apiClient from '../api/apiClient'; // Importamos el cliente de API

function UserRegistration() {
  // Estados para los campos del formulario
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('empleado'); // Valor por defecto
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!fullName || !username || !documentNumber || !email || !role || !phoneNumber || !password || !confirmPassword) {
      setError('Por favor, complete todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!acceptPolicy) {
      setError('Debe aceptar las políticas de privacidad');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    const userData = {
      fullName,
      username,
      documentNumber,
      email,
      role,
      phoneNumber,
      password
    };

    try {
      // Realizar la petición al servidor con nuestro apiClient
      const response = await apiClient.post('/registro', userData);

      const data = response.data; // En axios, los datos están en response.data

      // Mostrar mensaje de éxito
      setSuccess(data.mensaje || 'Usuario registrado exitosamente');
      
      // Limpiar el formulario
      setFullName('');
      setUsername('');
      setDocumentNumber('');
      setEmail('');
      setRole('empleado');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');
      setAcceptPolicy(false);
      
    } catch (error) {
      // Axios maneja los errores de forma más consistente
      setError(error.response?.data?.error || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor del formulario de registro
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de usuario</h2>

      {error && (
        <div 
          className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      {success && (
        <div 
          className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-center"
          role="status"
          aria-live="polite"
        >
          {success}
        </div>
      )}

      {/* Campos del formulario de registro */}
      <form onSubmit={handleSubmit} role="form">
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. juanperez"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento
          </label>
          <input
            id="documentNumber"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 123456789"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. juan@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            id="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione un rol</option>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número de teléfono
          </label>
          <input
            id="phoneNumber"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirme su contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            id="acceptPolicy"
            type="checkbox"
            className="mr-2"
            checked={acceptPolicy}
            onChange={(e) => setAcceptPolicy(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="acceptPolicy" className="text-sm text-gray-600">
            Acepto las políticas de privacidad y términos de servicio
          </label>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

      </form>
      <div className="mt-4 text-center">
        <a href="/login" className="text-blue-500 hover:underline">
          ¿Ya tienes una cuenta? Inicia sesión
        </a>
      </div>
      
    </div>
  );
}

export default UserRegistration;
