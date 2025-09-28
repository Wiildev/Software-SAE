import axios from 'axios';

// Crear una instancia de Axios con configuración por defecto
const apiClient = axios.create({
  // Lee la URL base de la API desde las variables de entorno de Vite.
  // Si la variable no está definida, se usa un valor por defecto (la URL local).
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
