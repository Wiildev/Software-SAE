// Script para probar el endpoint de estadísticas
const testEndpoint = async () => {
  console.log('Probando endpoint de estadísticas...');
  
  try {
    const response = await fetch('http://localhost:3000/api/estadisticas');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('El servidor no está ejecutándose en http://localhost:3000');
    }
  }
};

// Ejecutar la prueba
testEndpoint();