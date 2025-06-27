import React from 'react';

const Report = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-16 bg-white rounded-xl p-8 py-16 min-h-[500px] flex flex-col items-center">
      <h2 className="text-center text-gray-700 text-lg mb-8">Seleccione el rando de fecha que desea descargar</h2>
      <div className="flex gap-4 mb-8 w-full justify-center">
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="dd/mm/aaaa"
        />
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="dd/mm/aaaa"
        />
      </div>
      <select className="border border-gray-300 rounded px-3 py-2 mb-8 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="pdf">PDF</option>
        <option value="xsl">XSL</option>
        <option value="csv">CSV</option>
      </select>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-full text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-8">
        Descargar
      </button>
    </div>
  );
};

export default Report;
