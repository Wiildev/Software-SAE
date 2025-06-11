import { useState } from 'react';

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
      console.log('Intentando conectar a:', 'http://localhost:3000/api/registro');
      console.log('Datos a enviar:', userData);

      // Realizar la petición al servidor
      const response = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        mode: 'cors',
        credentials: 'omit'
      });

      // Imprimir la respuesta completa para depuración
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

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
      console.error('Error completo:', error);
      setError(error.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor del formulario de registro
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de usuario</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
          {success}
        </div>
      )}

      {/* Campos del formulario de registro */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

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
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Número de documento"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <option value="">Seleccione un rol</option>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Número de teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={acceptPolicy}
            onChange={(e) => setAcceptPolicy(e.target.checked)}
            disabled={loading}
          />
          <label className="text-sm text-gray-600">
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
