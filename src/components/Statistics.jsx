import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaCar, FaMotorcycle, FaBiking } from 'react-icons/fa';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Componente de Gauge de Ocupación
function OccupancyGauge({ percentage }) {
  const gaugeData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        borderWidth: 0,
        cutout: '70%',
        rotation: -90,
        circumference: 180,
      },
    ],
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Ocupación Actual</h3>
      <div className="relative h-48">
        <Doughnut data={gaugeData} options={gaugeOptions} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-sm text-gray-500">Ocupado</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Gráfico de Historial
function HistoryChart({ labels, data }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Vehículos por Mes',
        data: data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial Mensual de Vehículos',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

// Componente de Ranking de Vehículos
function VehicleRanking({ labels, data }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Cantidad de Vehículos',
        data: data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ranking por Tipo de Vehículo',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

// Componente de Ocupación por Horas
function HourlyOccupancy({ labels, data }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Vehículos por Hora',
        data: data,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ocupación por Horas',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

// Componente de Tarjeta de Promedio
function AverageCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Componente Principal de Estadísticas
function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usar datos reales de la base de datos
        const response = await fetch('http://localhost:3000/api/estadisticas');
        
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);

        // Procesar datos para los gráficos
        const processedStats = {
          occupancyPercentage: data.occupancyPercentage || 0,
          history: {
            labels: data.historyData?.map(item => item.month) || [],
            values: data.historyData?.map(item => item.count) || [],
          },
          ranking: {
            labels: data.rankingData?.map(item => item.tipoVehiculo) || [],
            values: data.rankingData?.map(item => item.count) || [],
          },
          hourly: {
            labels: data.hourlyData?.map(item => `${String(item.hour).padStart(2, '0')}:00`) || [],
            values: data.hourlyData?.map(item => item.count) || [],
          },
          averages: data.averages || { cars: 0, motorcycles: 0, bicycles: 0 },
        };

        setStats(processedStats);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError(error.message);
        
        // Datos de respaldo en caso de error
        setStats({
          occupancyPercentage: 65,
          history: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            values: [120, 150, 180, 200, 170, 190],
          },
          ranking: {
            labels: ['CARRO', 'MOTO', 'BICICLETA'],
            values: [450, 320, 180],
          },
          hourly: {
            labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            values: [15, 25, 30, 28, 35, 32, 30, 28, 26, 22, 18],
          },
          averages: {
            cars: 45,
            motorcycles: 32,
            bicycles: 18,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Estadísticas</h1>
        <p className="text-gray-600">Monitoreo en tiempo real del sistema de parqueadero</p>
        {error && (
          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="text-sm">⚠️ Usando datos de respaldo. Error: {error}</p>
          </div>
        )}
      </div>
      
      {/* Primera fila - Ocupación y Historial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OccupancyGauge percentage={stats.occupancyPercentage} />
        <HistoryChart labels={stats.history.labels} data={stats.history.values} />
      </div>

      {/* Segunda fila - Ranking, Ocupación por horas y Tarjetas de resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VehicleRanking labels={stats.ranking.labels} data={stats.ranking.values} />
        <HourlyOccupancy labels={stats.hourly.labels} data={stats.hourly.values} />
        
        {/* Tarjetas de resumen */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vehículos Actuales</h3>
          <AverageCard
            title="Carros"
            value={stats.averages.cars}
            icon={<FaCar className="text-xl" />}
            color="blue"
          />
          <AverageCard
            title="Motos"
            value={stats.averages.motorcycles}
            icon={<FaMotorcycle className="text-xl" />}
            color="purple"
          />
          <AverageCard
            title="Bicicletas"
            value={stats.averages.bicycles}
            icon={<FaBiking className="text-xl" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

export default Statistics;