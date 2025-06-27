import React from 'react';
import { FaUser } from 'react-icons/fa';

const Account = () => {
  return (
    <div className="w-full max-w-[1100px] mx-auto mt-8 bg-white rounded-2xl shadow p-8 px-12 py-16 min-h-[600px] border border-gray-200">
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow">
          <FaUser className="text-gray-400" size={80} />
        </div>
      </div>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Cargo"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Número de documento"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Teléfono"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-center items-center gap-8 mt-16">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-10 rounded-full text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Actualizar
          </button>
          <a href="#" className="text-red-600 font-semibold hover:underline text-lg">Eliminar cuenta</a>
        </div>
      </form>
    </div>
  );
};

export default Account;
