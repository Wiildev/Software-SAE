import React, { useState } from 'react';

const Report = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formato, setFormato] = useState('xlsx');
  const [descargando, setDescargando] = useState(false);

  const handleDescargar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor seleccione el rango de fechas.');
      return;
    }
    setDescargando(true);
    try {
      const response = await fetch('http://localhost:3000/api/tickets/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fechaInicio,
          fechaFin,
          formato
        })
      });
      
      if (!response.ok) throw new Error('Error al descargar el reporte');
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `reporte_tickets.${formato}`;
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
    <div className="w-full max-w-[1100px] mx-auto mt-8 bg-white rounded-2xl shadow p-8 px-12 py-16 min-h-[600px] border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Generar Reporte</h2>
        <p className="text-gray-600">Descarga reportes de tickets en formato CSV o Excel</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato de archivo
          </label>
          <select
            value={formato}
            onChange={(e) => setFormato(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="xlsx">Excel (XLSX)</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <button
          onClick={handleDescargar}
          disabled={descargando || !fechaInicio || !fechaFin}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
        >
          {descargando ? 'Descargando...' : 'Descargar Reporte'}
        </button>
      </div>
    </div>
  );
};

export default Report;
