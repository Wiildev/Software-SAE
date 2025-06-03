const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Array para almacenar usuarios (en una implementación real, esto estaría en una base de datos)
const users = [];

app.use(cors());
app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  // Verificar si el usuario ya existe
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Guardar el nuevo usuario
  users.push({ username, password });
  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta para iniciar sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Buscar el usuario
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ message: 'Inicio de sesión exitoso' });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
