import React, { useState } from 'react';

const Report = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formato, setFormato] = useState('xsl');
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor seleccione el rango de fechas.');
      return;
    }
    setDescargando(true);
    try {
      const formatoApi = formato === 'xsl' ? 'xlsx' : 'csv';
      const url = `http://localhost:3000/api/tickets/exportar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&formato=${formatoApi}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al descargar el reporte');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = formato === 'xsl' ? 'reporte_tickets.xlsx' : 'reporte_tickets.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('No se pudo descargar el reporte.');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 bg-white rounded-xl p-8 py-16 min-h-[500px] flex flex-col items-center">
      <h2 className="text-center text-gray-700 text-lg mb-8">Seleccione el rando de fecha que desea descargar</h2>
      <div className="flex gap-4 mb-8 w-full justify-center">
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="dd/mm/aaaa"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="dd/mm/aaaa"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
        />
      </div>
      <select
        className="border border-gray-300 rounded px-3 py-2 mb-8 w-1/2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={formato}
        onChange={e => setFormato(e.target.value)}
      >
        <option value="xsl">XSL</option>
        <option value="csv">CSV</option>
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-full text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 mt-8 disabled:opacity-60"
        onClick={handleDescargar}
        disabled={descargando}
      >
        {descargando ? 'Descargando...' : 'Descargar'}
      </button>
    </div>
  );
};

export default Report;
