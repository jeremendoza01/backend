const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const users = [];

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hashea la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guarda el usuario
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verifica que el usuario exista
  const user = users.find(user => user.username === username);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  // Verifica la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

  res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

module.exports = router;
