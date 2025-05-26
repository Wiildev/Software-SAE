import { useState } from 'react';

function UserRegistration() {
  // Estados para los campos del formulario
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
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
    
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Datos de registro:', { 
      fullName, 
      username, 
      documentNumber, 
      email, 
      role, 
      phoneNumber, 
      password,
      acceptPolicy 
    });
    
    // Limpiar el formulario después del envío exitoso
    setError('');
    // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
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
      
      {/* Campos del formulario de registro */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
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
          />
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Numero de documento"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <select
            className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled selected>-Seleccione un rol-</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </div>
        
        <div className="mb-4">
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Numero de teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
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
          />
        </div>
        
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="acceptPolicy"
            className="mr-2"
            checked={acceptPolicy}
            onChange={(e) => setAcceptPolicy(e.target.checked)}
            required
          />

          {/* Check de aceptacon de politicas */}
          <label htmlFor="acceptPolicy" className="text-sm text-gray-600">
            Aceptar las políticas de privacidad
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Registrase
        </button>
      </form>
      
      {/* Link de enlace a la página de inicio de sesion */}
      <div className="mt-4 text-center">
        <a href="#" className="text-blue-500 hover:underline text-sm">
          ¿Ya tienes una cuenta? Inicia sesión
        </a>
      </div>
    </div>
  );
}

export default UserRegistration;