// controllers/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/Usuario.js';

export const autenticarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário inválido.' });
    }

    req.userId = user._id;
    req.userTipo = user.tipo;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

export const verificarAdmin = (req, res, next) => {
  if (req.userTipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
};
