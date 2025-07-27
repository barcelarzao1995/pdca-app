import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';
import { autenticarToken, verificarAdmin } from '../controllers/auth.js';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// 🔐 Rota para registrar um novo usuário (somente admin pode usar)
router.post('/registrar', autenticarToken, verificarAdmin, registrarUsuario);

// 🔒 Buscar usuário por matrícula (protegida por token JWT)
router.get('/buscar/:matricula', autenticarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ matricula: req.params.matricula })
      .select('nome tipo matricula');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      message: 'Erro ao buscar usuário.',
      error: error.message,
    });
  }
});

export default router;
