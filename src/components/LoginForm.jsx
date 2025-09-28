import React, { useState } from 'react';
import apiClient from '../api/apiClient'; // Importamos el cliente de API

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      setError('Por favor, complete todos los campos');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // ¡Usamos apiClient! La URL base ya está configurada.
      const response = await apiClient.post('/login', { username, password, role });

      const data = response.data; // Con axios, la respuesta está en `response.data`

      setSuccess(data.mensaje || 'Inicio de sesión exitoso');
      setError('');

      localStorage.setItem('user', JSON.stringify({ ...data.usuario, role }));

      setTimeout(() => {
        if (window.navigate) {
          window.navigate('/panel');
        } else {
          window.location.href = '/panel';
        }
      }, 2000);

    } catch (error) {
      // Axios maneja los errores de red y respuestas no exitosas (4xx, 5xx)
      setError(error.response?.data?.error || 'Error en la autenticación');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione su rol</option>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

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

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <a href="/UserRegistration" className="text-blue-500 hover:underline">Registrarse</a>
        <span className="mx-2">•</span>
        <a href="/recuperar-password" className="text-blue-500 hover:underline">Recuperar contraseña</a>
      </div>
    </div>
  );
}

export default LoginForm;
