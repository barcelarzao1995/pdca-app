// routes/usuarioRoutes.js
import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';
import { autenticarToken, verificarAdmin } from '../controllers/auth.js';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Rota para registrar usuário (apenas admin)
router.post('/registrar', autenticarToken, verificarAdmin, registrarUsuario);

// Rota para buscar usuário por matrícula (sem necessidade de autenticação, ou você pode proteger com autenticarToken se quiser)
router.get('/buscar/:matricula', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ matricula: req.params.matricula }).select('nome tipo matricula');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
  }
});

export default router;
