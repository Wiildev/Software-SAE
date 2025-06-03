const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_para_jwt';

const validateUserData = (req, res, next) => {
  const { fullName, username, documentNumber, email, role, phoneNumber, password } = req.body;
  
  if (!fullName?.trim() || !username?.trim() || !documentNumber?.trim() || 
      !email?.trim() || !role?.trim() || !phoneNumber?.trim() || !password?.trim()) {
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ mensaje: 'Email inválido' });
  }
  
  next();
};

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = {
  validateUserData,
  verificarToken,
  SECRET_KEY
}; 