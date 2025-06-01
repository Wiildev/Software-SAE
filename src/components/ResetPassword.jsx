import { useState } from 'react';

function ResetPassword() {
  // Estado para el email   
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

    // Esta función se ejecuta cuando se envía el formulario.
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de email
    if (!email || !email.includes('@')) {
      setError('Por favor, introduce un correo electrónico válido');
      return;
    }
    
    // Aquí va la lógica para enviar la solicitud de restablecimiento
    console.log('Solicitud de restablecimiento para:', email);
    
    setIsSubmitted(true);
    setError('');
  };

  return (
    // Contenedor del formulatio de restablecimiento de contraseña
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Restablecer contraseña</h2>
      
      {!isSubmitted ? (
        <>
          <p className="text-left text-justify mb-6">
            Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* input donde se ingresa el correo eléctronico */}
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Botón de enviar el correo almacenado en el input */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Enviar
            </button>
          </form>
        </>
      ) : (

        // Mensaje de confirmación
        <div className="text-center">
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
            <p>Se han enviado las instrucciones a tu correo electrónico.</p>
          </div>
          <p>
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          </p>
        </div>  
      )}

     {/* Link de enlace a la página de inicio de sesion */}
      <div className="mt-6 text-center">
        <a href="/Login" className="text-blue-500 hover:underline">
          Volver al inicio de sesión
        </a>
      </div>
    </div>
  );
}

export default ResetPassword;