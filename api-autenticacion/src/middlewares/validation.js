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

module.exports = {
  validateUserData
}; 